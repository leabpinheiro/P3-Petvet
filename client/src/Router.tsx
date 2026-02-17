import { createBrowserRouter } from "react-router";
import App from "./App";
import ProtectedRoute from "./ProtectedRoute";
import ConsultationForm from "./pages/ConsultationForm";
import Dashboard from "./pages/Dashboard";
import HealthRecord from "./pages/HealthRecord";
import Login from "./pages/Login";
import MyPatients from "./pages/MyPatients";
import MyPetsList from "./pages/MyPetsList";
import PetForm from "./pages/PetForm";
import Register from "./pages/Register";
import ReminderForm from "./pages/ReminderForm";
import Reminders from "./pages/Reminders";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["owner", "veterinary"]}>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/my-pets",
    element: (
      <ProtectedRoute allowedRoles={["owner"]}>
        <MyPetsList />
      </ProtectedRoute>
    ),
  },
  {
    path: "/my-pets/pets/new",
    element: (
      <ProtectedRoute allowedRoles={["owner"]}>
        <PetForm />
      </ProtectedRoute>
    ),
  },
  {
    path: "/reminders",
    element: (
      <ProtectedRoute allowedRoles={["owner", "veterinary"]}>
        <Reminders />
      </ProtectedRoute>
    ),
  },
  {
    path: "/pet-profile/:id",
    element: (
      <ProtectedRoute allowedRoles={["owner", "veterinary"]}>
        <HealthRecord />
      </ProtectedRoute>
    ),
  },
  {
    path: "/pet-profile/:id/reminders/new",
    element: (
      <ProtectedRoute allowedRoles={["owner", "veterinary"]}>
        <ReminderForm />
      </ProtectedRoute>
    ),
  },
  {
    path: "/consultation/add",
    element: (
      <ProtectedRoute allowedRoles={["veterinary"]}>
        <ConsultationForm />
      </ProtectedRoute>
    ),
  },
  {
    path: "/my-patients",
    element: (
      <ProtectedRoute allowedRoles={["veterinary"]}>
        <MyPatients />
      </ProtectedRoute>
    ),
  },
]);

export default router;
