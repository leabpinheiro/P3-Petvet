import type { Result, Rows } from "../../../database/client";
import databaseClient from "../../../database/client";

class PetUsersRepository {
  async insertPetUser(petId: number, userId: number): Promise<number> {
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO pet_user (pet_id, user_id) VALUES (?, ?)",
      [petId, userId],
    );
    return result.insertId;
  }

  async exists(petId: number, userId: number): Promise<boolean> {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT 1 FROM pet_user WHERE pet_id = ? AND user_id = ?",
      [petId, userId],
    );
    return rows.length > 0;
  }
}

export default new PetUsersRepository();
