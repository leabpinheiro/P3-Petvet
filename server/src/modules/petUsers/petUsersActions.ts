import type { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import petUsersRepository from "./petUsersRepository";

interface PetUser {
  pet_id: number;
  user_id: number;
}

const add: RequestHandler = async (req, res, next) => {
  try {
    const { pet_id, user_id } = req.body as PetUser;

    if (!pet_id || !user_id) {
      res.status(StatusCodes.BAD_REQUEST).json({
        error: "pet_id et user_id sont requis",
      });
      return;
    }

    const exists = await petUsersRepository.exists(pet_id, user_id);
    if (exists) {
      res.status(StatusCodes.CONFLICT).json({
        message: "Cette relation existe déjà",
      });
      return;
    }

    const newPetUserId = await petUsersRepository.insertPetUser(
      pet_id,
      user_id,
    );

    res.status(StatusCodes.CREATED).json({
      id: newPetUserId,
      pet_id,
      user_id,
    });
  } catch (err) {
    console.error("Erreur dans petUser add:", err);
    next(err);
  }
};

export default { add };
