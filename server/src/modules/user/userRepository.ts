import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  orderNb: number | null;
  password: string;
  hashed_password: string;
  role: "owner" | "veterinary";
}

class userRepository {
  async getByEmail(email: string) {
    console.log("🔴 getByEmail appelé avec :", email);

    const result = await Promise.race([
      databaseClient.query<Rows>("SELECT * FROM user WHERE user.email = ?", [
        email,
      ]),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("⏰ DB timeout 8s")), 8000),
      ),
    ]);

    console.log("🟢 getByEmail résultat reçu");
    const [row] = result as Rows[];
    return row[0];
  }

  async insert(user: Partial<User>) {
    let role = "";
    if (!user.orderNb) {
      role = "owner";
    } else {
      role = "veterinary";
    }

    const [result] = await databaseClient.query<Result>(
      `INSERT INTO user 
      (firstname, lastname, email, order_nb, hashed_password, role) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        user.firstName,
        user.lastName,
        user.email,
        user.orderNb,
        user.hashed_password,
        role,
      ],
    );

    return result.insertId;
  }
}

export default new userRepository();
