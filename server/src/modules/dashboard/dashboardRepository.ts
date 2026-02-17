import databaseClient from "../../../database/client";

class dashboardRepository {
  async getPetsByOwner(ownerId: number) {
    const [pets] = await databaseClient.query(
      `SELECT pet.id, pet.name, pet.photo, pet.specie, pet.breed, pet.gender
            FROM pet
            JOIN pet_user ON pet.id = pet_user.pet_id
            JOIN user ON user.id = pet_user.user_id
            WHERE user.id = ?
            AND user.role = 'owner'`,
      [ownerId],
    );

    return pets;
  }

  async getActivitiesByOwner(ownerId: number) {
    const [activities] = await databaseClient.query(
      `SELECT consultation.id, consultation.title, consultation.created_at AS date, 'consultation' AS type, pet.name AS petName
            FROM consultation
            JOIN pet ON pet.id = consultation.pet_id
            JOIN pet_user ON pet_user.pet_id = pet.id
            JOIN user ON user.id = pet_user.user_id
            WHERE user.id = ?
            AND user.role = 'owner'
            
            UNION ALL
            
            SELECT reminder.id, reminder.title, reminder.programmed_at AS date, 'reminder' AS type, pet.name AS petName
            FROM reminder
            JOIN pet ON pet.id = reminder.pet_id
            JOIN pet_user ON pet_user.pet_id = pet.id
            JOIN user ON user.id = pet_user.user_id
            WHERE user.id = ?
            AND user.role = 'owner'
            
            ORDER BY date DESC
            LIMIT 10`,
      [ownerId, ownerId],
    );
    return activities;
  }

  async getDashboardOwner(ownerId: number) {
    const pets = await this.getPetsByOwner(ownerId);
    const activities = await this.getActivitiesByOwner(ownerId);

    return { pets, activities };
  }

  async getDashboardVet(vetId: number) {
    const [patients] = await databaseClient.query(
      `SELECT pet.id, pet.name, pet.photo, pet.specie, pet.breed, pet.gender, owner.firstname AS ownerFirstname, owner.lastname AS ownerLastname
        FROM pet
        JOIN pet_user petuser_vet ON pet.id = petuser_vet.pet_id
        JOIN user vet ON vet.id = petuser_vet.user_id AND vet.role = 'veterinary'
        JOIN pet_user petuser_owner ON pet.id = petuser_owner.pet_id
        JOIN user owner ON owner.id = petuser_owner.user_id AND owner.role = 'owner'
        WHERE vet.id = ?`,
      [vetId],
    );

    return { patients };
  }
}

export default new dashboardRepository();
