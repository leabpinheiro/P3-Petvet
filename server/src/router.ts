import express from "express";
import authActions from "./modules/auth/authActions";
import consultationActions from "./modules/consultation/consultationActions";
import dashboardActions from "./modules/dashboard/dashboardActions";
import petActions from "./modules/pet/petActions";
import petUsersActions from "./modules/petUsers/petUsersActions";
import reminderActions from "./modules/reminder/reminderActions";
import userActions from "./modules/user/userActions";

const router = express.Router();

router.post(
  "/api/users",
  userActions.validateNewUser,
  authActions.hashPassword,
  userActions.add,
);

router.post(
  "/api/pets",
  authActions.checkLogin,
  authActions.checkRole("owner"),
  petActions.validateNewPet,
  petActions.add,
);

router.post("/api/login", authActions.login);

router.get(
  "/api/owners/me/dashboard",
  authActions.checkLogin,
  authActions.checkRole("owner"),
  dashboardActions.browseOwnerDashboard,
);

router.get(
  "/api/veterinaries/me/dashboard",
  authActions.checkLogin,
  authActions.checkRole("veterinary"),
  dashboardActions.browseVetDashboard,
);

router.get(
  "/api/pets/:id",
  authActions.checkLogin,
  authActions.checkRole("veterinary", "owner"),
  petActions.browseByPet,
);

router.post(
  "/api/pets/:id/reminders",
  authActions.checkLogin,
  authActions.checkRole("veterinary", "owner"),
  reminderActions.validateReminder,
  reminderActions.add,
);

router.post(
  "/api/add/patient",
  authActions.checkLogin,
  authActions.checkRole("veterinary"),
  petUsersActions.add,
);

router.get(
  "/api/patients-list",
  authActions.checkLogin,
  authActions.checkRole("veterinary"),
  petActions.browseAllPets,
);

router.get(
  "/api/owners/me/pets",
  authActions.checkLogin,
  authActions.checkRole("owner"),
  petActions.browseByOwner,
);

router.get(
  "/api/owners/me/reminders",
  authActions.checkLogin,
  authActions.checkRole("owner", "veterinary"),
  reminderActions.browseByOwner,
);

router.get(
  "/api/consultations/pets/:id",
  authActions.checkLogin,
  authActions.checkRole("veterinary", "owner"),
  consultationActions.readByConsultation,
);

router.get(
  "/api/veterinaries/me/patients",
  authActions.checkLogin,
  authActions.checkRole("veterinary"),
  petActions.browseByVeterinary,
);

router.get(
  "/api/veterinaries/me/patients-name",
  authActions.checkLogin,
  authActions.checkRole("veterinary"),
  petActions.readByVeterinary,
);

router.post(
  "/api/veterinaries/me/consultations",
  authActions.checkLogin,
  authActions.checkRole("veterinary"),
  consultationActions.validateConsultation,
  consultationActions.add,
);

export default router;
