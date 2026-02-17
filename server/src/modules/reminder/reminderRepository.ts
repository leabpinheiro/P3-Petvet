import type { RowDataPacket } from "mysql2";
import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

export type Frequency = "jour" | "semaine" | "mois" | "an";

export interface Reminder {
  title: string;
  programmedAt: string;
  content: string;
  dosage: string | null;
  frequency: Frequency | null;
  frequencyCount: number | null;
  userId: number;
  petId: number;
  petName: string;
}

type OwnerRow = RowDataPacket & { id: number };

class reminderRepository {
  async getByPet(petId: number) {
    const [petReminders] = await databaseClient.query(
      `SELECT reminder.*, pet.name AS petName 
      FROM reminder JOIN pet ON reminder.pet_id = pet.id 
      WHERE reminder.pet_id = ? 
      ORDER BY reminder.programmed_at ASC`,
      [petId],
    );

    return petReminders as Reminder[];
  }

  async getByOwner(ownerId: number): Promise<Rows> {
    const [reminders] = await databaseClient.query<Rows>(
      `SELECT reminder.*, pet.name AS petName, pet.specie
       FROM reminder
       JOIN pet ON pet.id = reminder.pet_id
       JOIN pet_user ON pet_user.pet_id = pet.id
       WHERE pet_user.user_id = ?`,
      [ownerId],
    );
    return reminders;
  }

  async insert(reminder: Omit<Reminder, "id">) {
    const [rows] = await databaseClient.query<OwnerRow[]>(
      `SELECT user.id
      FROM pet_user
      JOIN user ON user.id = pet_user.user_id
      WHERE pet_user.pet_id = ?
      AND user.role = 'owner'
      LIMIT 1`,
      [reminder.petId],
    );

    const ownerId = rows[0].id;

    const [result] = await databaseClient.query<Result>(
      `INSERT INTO reminder 
      (title, programmed_at, content, dosage, frequency, frequency_count, user_id, pet_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        reminder.title,
        reminder.programmedAt,
        reminder.content,
        reminder.dosage,
        reminder.frequency,
        reminder.frequencyCount,
        ownerId,
        reminder.petId,
      ],
    );

    return result.insertId;
  }
}

export default new reminderRepository();
