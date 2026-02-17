export interface Reminder {
  id: number;
  title: string;
  programmed_at: string;
  content: string;
  dosage: number;
  specie: string;
  frequency: string;
  frequency_count: string;
  pet_id: number;
  user_id: number;
  petName: string;
}

export type Frequency = "jour" | "semaine" | "mois" | "an";

export interface CreateReminder {
  title: string;
  programmedAt: string;
  content: string;
  dosage: string | null;
  frequency: Frequency | null;
  frequencyCount: number | null;
  petId: number;
}
