import { useEffect, useState } from "react";
import styles from "../assets/styles/dashboard.module.css";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import OwnerDashboard from "../components/OwnerDashboard";
import VetDashboard from "../components/VetDashboard";
import { useAuth } from "../context/AuthContext";
import type { Activity } from "../types/Activity";
import type { Patient, Pet } from "../types/Pet";

type OwnerDashboardData = {
  pets: Pet[];
  activities: Activity[];
};

type VetDashboardData = {
  patients: Patient[];
};

function Dashboard() {
  const auth = useAuth();
  const [dashboardInfos, setDashboardInfos] = useState<
    OwnerDashboardData | VetDashboardData | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchByRole = auth?.isVet
      ? "/veterinaries/me/dashboard"
      : "/owners/me/dashboard";

    fetch(`${import.meta.env.VITE_API_URL}${fetchByRole}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((dashboardData) => {
        setDashboardInfos(dashboardData);
        setIsLoading(false);
      })
      .catch(() => {
        setError("Impossible de charger votre tableau de bord.");
        setIsLoading(false);
      });
  }, [auth]);

  const logoSrc = auth?.isVet
    ? "/images/blue/logo.png"
    : "/images/green/logo.png";

  if (isLoading) return <p>Chargement du tableau de bord...</p>;
  if (!auth?.user) return <p>Chargement de l'utilisateur...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <div className={styles.sizePage}>
        <header className={styles.petVet}>
          <img src={logoSrc} alt="Logo" className={styles.logo} />
          <h1>Pet&Vet</h1>
        </header>
        <main className={styles.mainPage}>
          <NavBar />
          <div className={styles.components}>
            <h1 className={styles.userName}>
              Bonjour{" "}
              {auth?.isVet ? `Dr ${auth.user.lastname}` : auth.user.firstname} !
            </h1>
            {auth?.isOwner && (
              <OwnerDashboard
                dashboard={dashboardInfos as OwnerDashboardData}
              />
            )}
            {auth?.isVet && (
              <VetDashboard dashboard={dashboardInfos as VetDashboardData} />
            )}
          </div>
        </main>
      </div>
      <footer>
        <Footer />
      </footer>
    </>
  );
}

export default Dashboard;
