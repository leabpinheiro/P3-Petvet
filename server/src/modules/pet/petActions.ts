import type { NextFunction, Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import consultationRepository from "../consultation/consultationRepository";
import reminderRepository from "../reminder/reminderRepository";
import petRepository from "./petRepository";
import type { PetRow } from "./petRepository";

const browseByPet: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const petId = Number.parseInt(req.params.id);

    if (Number.isNaN(petId)) {
      res.status(400).json({ error: "ID de l'animal invalide." });
      return;
    }

    const pet = await petRepository.getByPet(petId);
    const reminders = await reminderRepository.getByPet(petId);
    const consultations = await consultationRepository.getByPet(petId);

    if (!pet) {
      res.status(400).json({ error: "Pas de compagnons sur cette page !" });
    }
    res.status(200).json({ pet, consultations, reminders });
  } catch (error) {
    next(error);
  }
};

const browseByVeterinary = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ownerId = req.auth?.userId;
    if (!ownerId) {
      res.sendStatus(401);
      return;
    }

    const pets = await petRepository.getByVeterinary(Number(ownerId));

    if (!pets) {
      res.status(400).json({
        error: "Pas d'animaux disponibles. Veuillez ajouter un animal.",
      });
    }
    res.status(200).json(pets);
  } catch (error) {
    next();
  }
};

const readByVeterinary = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const veterinaryId = req.auth?.userId;

    const pets = await petRepository.getWithVeterinary(Number(veterinaryId));

    if (!pets) {
      res.status(400).json({
        error: "Pas d'animaux disponibles. Veuillez ajouter un animal.",
      });
    }
    res.status(200).json(pets);
  } catch (error) {
    next();
  }
};

const browseByOwner = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ownerId = req.auth?.userId;
    if (!ownerId) {
      res.sendStatus(401);
      return;
    }

    const pets = await petRepository.getByOwner(Number(ownerId));

    if (!pets) {
      res.status(400).json({
        error: "Pas d'animaux disponibles. Veuillez ajouter un animal.",
      });
    }
    res.status(200).json(pets);
  } catch (error) {
    next();
  }
};

const browseAllPets = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const pets = await petRepository.getAllPets();

    if (pets.length === 0) {
      res.status(404).json({
        error: "Pas d'animaux disponibles. Veuillez ajouter un animal.",
      });
      return;
    }

    res.status(200).json({ pets });
  } catch (error) {
    next(error);
  }
};

const add: RequestHandler = async (req, res, next) => {
  try {
    const ownerId = req.auth?.userId;

    if (!ownerId) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "Utilisateur non connecté" });
      return;
    }

    const newPetId = await petRepository.insert(req.body, Number(ownerId));

    res.status(StatusCodes.CREATED).json({ newPetId });
  } catch (err) {
    next(err);
  }
};

const petSchema = Joi.object({
  name: Joi.string().max(30).required(),
  tattoo_nb: Joi.string().max(10).allow(null, "").optional(),
  chip_nb: Joi.number()
    .integer()
    .min(1)
    .max(999999999999999)
    .allow(null, "")
    .optional(),
  born_at: Joi.date().required(),
  gender: Joi.string().valid("m", "f").required(),
  specie: Joi.string().valid("chien", "chat", "lapin").required(),
  breed: Joi.string().max(100).required(),
  is_neutered: Joi.boolean().default(false),
  weight: Joi.number().positive().max(999).allow(null).optional(),
});

const validateNewPet = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);
  const { error } = petSchema.validate(req.body, { abortEarly: false });

  if (error == null) {
    next();
  } else {
    console.log("JOI ERROR :", error.details);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ validationErrors: error.details });
  }
};

export default {
  browseByPet,
  browseByOwner,
  add,
  browseAllPets,
  browseByVeterinary,
  readByVeterinary,
  validateNewPet,
};
