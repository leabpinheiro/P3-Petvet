import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import RemindersByPet from "../components/RemindersByPet";
import "../assets/styles/reset.css";
import "../assets/styles/variables.css";
import cat from "../../public/images/chat_3.png";
import dog from "../../public/images/chien_5.png";
import rabbit from "../../public/images/lapin-de-paques.png";
import styles from "../assets/styles/healthRecord.module.css";
import Consultations from "../components/Consultations";
import Footer from "../components/Footer";
import MedicalHistory from "../components/MedicalHistory";
import NavBar from "../components/NavBar";
import { useAuth } from "../context/AuthContext";
import type { Consultation } from "../types/Consultation";
import type { Pet } from "../types/Pet";

function HealthRecord() {
  const auth = useAuth();
  const [petInfo, setPetInfo] = useState<Pet | undefined>();
  const [error, setError] = useState<string>();
  const [reminders, setReminders] = useState([]);
  const { id } = useParams();
  const [openResume, setOpenResume] = useState(true);
  const [openHealthOrConsult, setOpenHealthOrConsult] = useState(false);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [openMedicalHistory, setOpenMedicalHistory] = useState(false);
  const location = useLocation();
  const [temporaryMessage, setTemporaryMessage] = useState<string | null>(
    location.state?.successMessage ?? null,
  );

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/pets/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((petData) => {
        if (petData.error) {
          setError(petData.error);
        } else {
          setPetInfo(petData.pet);
          setConsultations(petData.consultations ?? []);
          setReminders(petData.reminders);
        }
      });
  }, [id]);

  const fewActivities = consultations.slice(0, 5) ?? [];

  useEffect(() => {
    if (temporaryMessage) {
      setTimeout(() => {
        setTemporaryMessage(null);
      }, 3000);
    }
  }, [temporaryMessage]);
  const logoSrc = auth?.isVet
    ? "/images/blue/logo.png"
    : "/images/green/logo.png";

  if (!petInfo) return <p>{error}</p>;

  const birthDate = new Date(petInfo.born_at);
  const now = new Date();
  const diffTime = now.getTime() - birthDate.getTime();
  const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.44));

  const years = Math.floor(diffMonths / 12);
  const months = diffMonths % 12;

  const petAge =
    years >= 1 ? `${years} an${years > 1 ? "s" : ""}` : `${months} mois`;

  console.log(petInfo);
  return (
    <>
      <div className={styles.sizePages}>
        <header className={styles.petVet}>
          <img src={logoSrc} alt="logo" className={styles.logo} />
          <h1>Pet&Vet</h1>
        </header>
        <main className={styles.mainPage}>
          <NavBar />
          <div className={styles.allPage}>
            <div className={styles.healthRecordPage}>
              <section className={styles.petCard}>
                <div className={styles.petFirstInfo}>
                  <div
                    className={`${styles.divImage} ${auth?.isVet ? styles.vet : ""}`}
                  >
                    <img
                      src={
                        petInfo.specie === "chat"
                          ? cat
                          : petInfo.specie === "chien"
                            ? dog
                            : rabbit
                      }
                      alt={petInfo.specie}
                      width="150px"
                      height="150px"
                      className={styles.imagePet}
                    />
                  </div>
                  <div className={styles.petNameInfo}>
                    <div>
                      <h2>{petInfo.name}</h2>
                      <p>
                        {`${petInfo.breed} - ${
                          petInfo.gender === "m"
                            ? petInfo.is_neutered
                              ? "Mâle stérilisé"
                              : "Mâle"
                            : petInfo.is_neutered
                              ? "Femelle stérilisée"
                              : "Femelle"
                        }`}
                      </p>
                    </div>
                    <div className={styles.petTitle}>
                      <p className={styles.age}>{petAge}</p>
                      <p className={styles.weight}>{petInfo.weight} kg</p>
                      <p>
                        {`Né${petInfo.gender === "f" ? "e" : ""} le `}
                        {new Date(petInfo.born_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className={styles.petSecondInfo}>
                  <div>
                    <h3>Espèce</h3>
                    <p>{petInfo.specie}</p>
                  </div>
                  <div>
                    <h3>Race</h3>
                    <p>{petInfo.breed}</p>
                  </div>
                  <div>
                    <h3>Puce électronique</h3>
                    <p>{petInfo.chip_nb}</p>
                  </div>
                  <p>
                    {petInfo.vetInfo == null
                      ? "Pas de vétérinaire"
                      : `Suivi : Dr. ${petInfo.vetInfo.vetName}`}
                  </p>
                </div>
              </section>
              {temporaryMessage && (
                <p className={styles.success}>{temporaryMessage}</p>
              )}
            </div>
            <div>
              <section>
                <div
                  className={`${styles.buttonsContainer} ${auth?.isVet ? styles.vet : ""}`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setOpenResume(true);
                      setOpenHealthOrConsult(false);
                      setOpenMedicalHistory(false);
                    }}
                    className={
                      openResume
                        ? auth?.isVet
                          ? `${styles.selectedSection} ${styles.vet}`
                          : styles.selectedSection
                        : ""
                    }
                  >
                    Résumé
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOpenResume(false);
                      setOpenHealthOrConsult(true);
                      setOpenMedicalHistory(false);
                    }}
                    className={
                      openHealthOrConsult
                        ? auth?.isVet
                          ? `${styles.selectedSection} ${styles.vet}`
                          : styles.selectedSection
                        : ""
                    }
                  >
                    {auth?.isVet ? "Consultation" : "Santé"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOpenResume(false);
                      setOpenHealthOrConsult(false);
                      setOpenMedicalHistory(true);
                    }}
                    className={
                      openMedicalHistory
                        ? auth?.isVet
                          ? `${styles.selectedSection} ${styles.vet}`
                          : styles.selectedSection
                        : ""
                    }
                  >
                    Historique
                  </button>
                </div>
                <div
                  className={
                    !openMedicalHistory && !openHealthOrConsult && openResume
                      ? styles.resume
                      : styles.none
                  }
                >
                  {" "}
                  <article
                    className={`${styles.shortMedicalHistory} ${auth?.isVet ? styles.vet : ""}`}
                  >
                    <div>
                      <h2>Activités récentes</h2>
                      <h3>Les dernières activités de {petInfo.name}</h3>
                    </div>
                    <MedicalHistory
                      consultations={fewActivities}
                      length="short"
                    />
                  </article>
                  <article className={styles.petReminder}>
                    <RemindersByPet reminders={reminders} pet={petInfo} />
                  </article>
                </div>
                <div
                  className={
                    !openMedicalHistory && openHealthOrConsult && !openResume
                      ? styles.health
                      : styles.none
                  }
                >
                  {auth?.isVet ? (
                    <Consultations
                      consultations={consultations}
                      pet={petInfo}
                    />
                  ) : (
                    <p className={styles.message}>Fonctionnalité à venir !</p>
                  )}
                </div>
                <div
                  className={
                    openMedicalHistory && !openHealthOrConsult && !openResume
                      ? styles.medicalHistory
                      : styles.none
                  }
                >
                  <MedicalHistory consultations={consultations} length="full" />
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
      <footer>
        <Footer />
      </footer>
    </>
  );
}

export default HealthRecord;
