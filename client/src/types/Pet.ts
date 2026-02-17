import type { Reminder } from "./Reminder";

export interface Pet {
  id: number;
  name: string;
  tattooNb: number | null;
  chipNb: number | null;
  chip_nb: number | null;
  born_at: string;
  gender: string;
  specie: Specie;
  breed: string;
  is_neutered: boolean;
  weight: number | null;
  vetInfo: {
    vetName: string | null;
    vetId: number | null;
  };
  reminders: Reminder[];
}

export interface Patient {
  id: number;
  name: string;
  photo: string;
  specie: string;
  breed: string;
  gender: "m" | "f";
  ownerFirstname: string;
  ownerLastname: string;
}
export interface CreatePet {
  id?: number;
  name: string;
  tattoo_nb: string | null;
  chip_nb: number | null;
  born_at: string;
  gender: "m" | "f";
  specie: Specie;
  breed?: string;
  is_neutered: boolean;
  weight?: number | null;
}
export type Gender = "m" | "f";
export type Specie = "chien" | "chat" | "lapin";
