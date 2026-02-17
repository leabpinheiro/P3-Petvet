import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "../assets/styles/reset.css";
import "../assets/styles/variables.css";
import styles from "../assets/styles/consultationForm.module.css";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import { useAuth } from "../context/AuthContext";
import type { Category, CreateConsultation } from "../types/Consultation";
import type { Pet } from "../types/Pet";

function consultationForm() {
  const auth = useAuth();
  const [title, setTitle] = useState("");
  const [createdAt, setcreatedAt] = useState("");
  const [report, setReport] = useState("");
  const [dosage, setDosage] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [treatment, setTreatment] = useState<string | "">("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPet, setSelectedPet] = useState<number | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/veterinaries/me/patients-name`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPets(data);
        } else if (data?.id && data?.name) {
          setPets([data]);
        } else {
          console.error("Format inattendu:", data);
          setPets([]);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const createConsultation = async (consultation: CreateConsultation) => {
    if (!selectedPet) {
      setErrorMessage("Veuillez sélectionner un pet");
      return;
    }
    if (!category) {
      setErrorMessage("Veuillez sélectionner une categorie");
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/veterinaries/me/consultations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(consultation),
        },
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la création de la consultation");
      }

      setTimeout(() => {
        navigate(`/pet-profile/${selectedPet}`, {
          state: { successMessage: "Consultation créée avec succès !" },
        });
      });
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Erreur lors de la création de la consultation",
      );
    } finally {
      setIsSubmitting(false);
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
            <h1 className={styles.consultationFormTitle}>
              Ajouter une consultation
            </h1>
            <article className={styles.consultationFormContainer}>
              <form
                className={styles.consultationForm}
                onSubmit={(e) => {
                  e.preventDefault();
                  createConsultation({
                    title,
                    createdAt,
                    report,
                    dosage: dosage || null,
                    category: category || null,
                    treatment: treatment || null,
                    petId: selectedPet ?? 0,
                  });
                }}
              >
                <p className={styles.consultationError}>{errorMessage}</p>
                <div className={styles.consultationCategoryValue}>
                  <select
                    className={styles.consultationSelect}
                    value={category}
                    aria-placeholder="category"
                    onChange={(e) => setCategory(e.target.value as Category)}
                  >
                    <option value="" disabled hidden>
                      Catégorie
                    </option>
                    <option value="vaccination">vaccination</option>
                    <option value="urgence">urgence</option>
                    <option value="suivi">suivi</option>
                    <option value="operation">opération</option>
                    <option value="medicale">médicale</option>
                  </select>
                </div>
                <div className={styles.consultationDate}>
                  <label>
                    <p>
                      Date programmée{" "}
                      <span className={styles.consultationObligatory}> *</span>
                    </p>
                    <input
                      type="datetime-local"
                      value={createdAt}
                      onChange={(e) => setcreatedAt(e.target.value)}
                      required
                      className={styles.date}
                    />
                  </label>
                </div>
                <div className={styles.consultationPetName}>
                  <select
                    className={styles.consultationSelect}
                    value={selectedPet ?? ""}
                    onChange={(e) => setSelectedPet(Number(e.target.value))}
                  >
                    <option value="" disabled hidden>
                      Sélection de l'animal
                    </option>
                    {pets.map((pet) => (
                      <option key={pet.id} value={pet.id}>
                        {pet.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.consultationTitle}>
                  <label>
                    <p>
                      Titre
                      <span className={styles.consultationObligatory}> *</span>
                    </p>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className={styles.consultationTitleInput}
                    />
                  </label>
                </div>
                <div className={styles.consultationContent}>
                  <label>
                    <p>
                      Détails de la consultation{" "}
                      <span className={styles.consultationObligatory}> *</span>
                    </p>
                    <textarea
                      value={report}
                      onChange={(e) => setReport(e.target.value)}
                      required
                      className={styles.textareaField}
                    />
                  </label>
                </div>
                <div className={styles.consultationTreatment}>
                  <label>
                    <p>Traitement(s)</p>
                    <input
                      type="text"
                      value={treatment}
                      onChange={(e) => setTreatment(String(e.target.value))}
                      className={styles.consultationTreatmentInput}
                    />
                  </label>
                </div>
                <div className={styles.consultationDosage}>
                  <label>
                    <p>Posologie</p>
                    <input
                      type="text"
                      value={dosage}
                      onChange={(e) => setDosage(e.target.value)}
                      className={styles.consultationDosageInput}
                    />
                  </label>
                </div>
                <div className={styles.consultationButtonContainer}>
                  <p className={styles.consultationObligatory}>
                    * Champs obligatoires
                  </p>
                  <button
                    type="submit"
                    className={styles.sendButton}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Création..." : "Créer une consultation"}
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

export default consultationForm;
