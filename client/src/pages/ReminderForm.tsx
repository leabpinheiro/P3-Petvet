import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import "../assets/styles/reset.css";
import "../assets/styles/variables.css";
import styles from "../assets/styles/reminderForm.module.css";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import { useAuth } from "../context/AuthContext";
import type { CreateReminder, Frequency } from "../types/Reminder";

function ReminderForm() {
  const [title, setTitle] = useState("");
  const [programmedAt, setProgrammedAt] = useState("");
  const [content, setContent] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState<Frequency | "">("");
  const [frequencyCount, setFrequencyCount] = useState<number | "">("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSubmited, setIsSubmited] = useState(false);

  const navigate = useNavigate();

  const { id } = useParams();

  const petId = Number(id);
  const auth = useAuth();
  const createReminder = async (reminder: CreateReminder) => {
    setIsSubmited(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/pets/${petId}/reminders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(reminder),
        },
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la création du rappel");
      }

      navigate(`/pet-profile/${petId}`, {
        state: { successMessage: "Rappel créé avec succès !" },
      });
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Erreur lors de la création du rappel",
      );
    } finally {
      setIsSubmited(false);
    }
  };
  const logoSrc = auth?.isVet
    ? "/images/blue/logo.png"
    : "/images/green/logo.png";
  return (
    <>
      <div className={styles.sizePage}>
        <header className={styles.petVet}>
          <img src={logoSrc} alt="logo" className={styles.logo} />
          <h1>Pet&Vet</h1>
        </header>
        <main className={styles.mainPage}>
          <NavBar />
          <section className={styles.allPage}>
            <h1 className={styles.reminderFormTitle}>Ajouter un rappel</h1>
            <article className={styles.formContainer}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  createReminder({
                    title,
                    programmedAt,
                    content,
                    dosage: dosage || null,
                    frequency: frequency || null,
                    frequencyCount: frequencyCount || null,
                    petId,
                  });
                }}
              >
                <p className={styles.error}>{errorMessage}</p>
                <div className={styles.titleDate}>
                  <label className={styles.reminderLabel}>
                    Titre <span className={styles.obligatory}>*</span>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className={`${styles.title} ${styles.reminderInput}`}
                    />
                  </label>
                  <label className={styles.reminderLabel}>
                    Date programmée <span className={styles.obligatory}>*</span>
                    <input
                      type="datetime-local"
                      value={programmedAt}
                      onChange={(e) => setProgrammedAt(e.target.value)}
                      required
                      className={`${styles.date} ${styles.reminderInput}`}
                    />
                  </label>
                </div>
                <div className={styles.contentContainer}>
                  <label className={styles.reminderLabel}>
                    Description <span className={styles.obligatory}>*</span>
                    <input
                      type="text"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      required
                      className={`${styles.content} ${styles.reminderInput}`}
                    />
                  </label>
                  <label className={styles.reminderLabel}>
                    Dosage
                    <input
                      type="text"
                      value={dosage}
                      onChange={(e) => setDosage(e.target.value)}
                      className={`${styles.content} ${styles.reminderInput}`}
                    />
                  </label>
                </div>
                <div className={styles.frequencyContainer}>
                  <div className={styles.frequency}>
                    <label className={styles.reminderLabel}>
                      Fréquence
                      <input
                        type="number"
                        min={1}
                        value={frequencyCount}
                        placeholder="Nb de x"
                        onChange={(e) =>
                          setFrequencyCount(Number(e.target.value))
                        }
                        className={styles.frequencyCount}
                      />
                    </label>
                  </div>
                  <div className={styles.frequencyValue}>
                    <p>fois par</p>
                    <select
                      className={styles.reminderSelect}
                      value={frequency}
                      onChange={(e) =>
                        setFrequency(e.target.value as Frequency)
                      }
                    >
                      <option value="" disabled>
                        Sélectionner
                      </option>
                      <option value="jour">jour</option>
                      <option value="semaine">semaine</option>
                      <option value="mois">mois</option>
                      <option value="an">an</option>
                    </select>
                  </div>
                </div>
                <div
                  className={`${styles.buttonContainer} ${auth?.isVet ? styles.vet : ""}`}
                >
                  <p className={styles.obligatory}>* Champs obligatoires</p>
                  <button type="submit" disabled={isSubmited}>
                    {isSubmited ? "Création..." : "Créer un rappel"}
                  </button>
                </div>
              </form>
            </article>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}

export default ReminderForm;
