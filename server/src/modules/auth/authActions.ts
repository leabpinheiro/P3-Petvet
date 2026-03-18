import argon2 from "argon2";
import type { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import userRepository from "../user/userRepository";

interface Payload {
  sub: string;
  role: "owner" | "veterinary";
}

const checkRole = (...allowedRoles: string[]): RequestHandler => {
  return (req, res, next) => {
    if (!req.auth || !allowedRoles.includes(req.auth.role)) {
      res.sendStatus(403);
      return;
    }
    next();
  };
};

const checkLogin: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.sendStatus(401);
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.APP_SECRET as string,
    ) as Payload;

    req.auth = {
      userId: Number(decoded.sub),
      role: decoded.role,
    };

    next();
  } catch (err) {
    res.sendStatus(401);
  }
};

const login: RequestHandler = async (req, res, next) => {
  try {
    console.log("🔴 login handler appelé", req.body);
    const user = await userRepository.getByEmail(req.body.email);
    console.log("🟡 user trouvé :", user ? "oui" : "non");

    if (user == null) {
      res.sendStatus(StatusCodes.UNPROCESSABLE_ENTITY);
      return;
    }

    console.log("🟡 début argon2.verify");
    const verified = await argon2.verify(
      user.hashed_password,
      req.body.password,
    );
    console.log("🟢 argon2 terminé :", verified);

    if (verified) {
      const { hashed_password, ...userWithoutHashedPassword } = user;

      const payload: Payload = {
        sub: user.id.toString(),
        role: user.role,
      };

      const token = jwt.sign(payload, process.env.APP_SECRET as string, {
        expiresIn: "1h",
      });

      res.json({ token, user: userWithoutHashedPassword });
    } else {
      res.sendStatus(401);
    }
  } catch (err) {
    next(err);
  }
};

const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 19 * 2 ** 10,
  timeCost: 2,
  parallelism: 1,
};

const hashPassword: RequestHandler = async (req, res, next) => {
  try {
    const { password } = req.body;
    const hashedPassword = await argon2.hash(password, hashingOptions);

    req.body.hashed_password = hashedPassword;
    req.body.password = undefined;

    next();
  } catch (err) {
    next(err);
  }
};

export default { login, hashPassword, checkRole, checkLogin };
