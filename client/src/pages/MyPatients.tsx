import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import cat from "../../public/images/chat_3.png";
import dog from "../../public/images/chien_5.png";
import rabbit from "../../public/images/lapin-de-paques.png";
import styles from "../assets/styles/myPatients.module.css";
import { useAuth } from "../context/AuthContext";
import "../assets/styles/reactSelect.css";
import Select from "react-select";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";

export interface ApiResponse {
  petId: number;
  petName: string;
  ownerFirstName: string;
  ownerLastName: string;
}

export interface PetOwner {
  petId: number;
  petName: string;
  petGender: string;
  petPhoto: string | null;
  petSpecie: string;
  ownerName: string;
}

export interface PetOption {
  value: number;
  label: string;
  pet: ApiResponse;
}

export default function PetSearch() {
  const auth = useAuth();
  const [pets, setPets] = useState<ApiResponse[]>([]);
  const [veterinaryPets, setVeterinaryPets] = useState<PetOwner[]>([]);
  const [selectedPet, setSelectedPet] = useState<ApiResponse | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<PetOwner | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null,
  );
  const navigate = useNavigate();

  const fetchVeterinaryPets = useCallback(async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/veterinaries/me/patients`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = await response.json();
      console.log(data);
      if (Array.isArray(data)) {
        setVeterinaryPets(data);
      } else if (Array.isArray(data.pets)) {
        setVeterinaryPets(data.pets);
      } else {
        setVeterinaryPets([]);
      }
    } catch (error) {
      console.error("Erreur fetch veterinary pets:", error);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/patients-list`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        const data = await res.json();
        setPets(data.pets ?? []);

        await fetchVeterinaryPets();
      } catch (error) {
        console.error("Erreur fetch pets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [fetchVeterinaryPets]);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  const petOptions: PetOption[] = useMemo(
    () =>
      pets.map((p) => ({
        value: p.petId,
        label: `${p.petName} (${p.ownerFirstName} ${p.ownerLastName})`,
        pet: p,
      })),
    [pets],
  );

  const veterinaryOptions = useMemo(
    () =>
      veterinaryPets.map((pet) => ({
        value: pet.petName,
        label: `${pet.petName} (${pet.ownerName})`,
        pet: pet,
      })),
    [veterinaryPets],
  );

  const addNewPet = async () => {
    if (!selectedPet || !auth?.isVet) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/add/patient`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            pet_id: selectedPet.petId,
            user_id: auth?.user?.id,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? data.message ?? "Erreur inconnue");
      }

      setMessage("Animal associé au vétérinaire !");
      setMessageType("success");
      setSelectedPet(null);
      await fetchVeterinaryPets();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("Impossible d’associer l’animal");
      }
      setMessageType("error");
    }
  };

  if (isLoading) return <p>Chargement...</p>;

  return (
    <>
      <div className={styles.sizePage}>
        <header className={styles.petVet}>
          <img src="/images/blue/logo.png" alt="logo" className={styles.logo} />
          <h1>Pet&Vet</h1>
        </header>
        <main className={styles.mainPage}>
          <NavBar />
          <div className={styles.sectionsContainer}>
            <section className={styles.newPatient}>
              <h2 className={styles.titleNewPatient}>Nouveau Patient</h2>
              <div className={styles.selectedPatient}>
                <Select<PetOption>
                  options={petOptions}
                  placeholder="Rechercher un animal..."
                  isSearchable
                  classNamePrefix="rs"
                  className={styles.inputPatient}
                  onChange={(opt) => setSelectedPet(opt?.pet ?? null)}
                />
              </div>
              <button
                type="button"
                className={styles.addPatientButton}
                onClick={addNewPet}
                disabled={!selectedPet}
              >
                <img src="/images/white-cross.png" alt="plus" />
                Ajouter l'animal
              </button>
            </section>
            {message && (
              <p
                className={
                  messageType === "success"
                    ? styles.addPatientSucces
                    : styles.addPatientError
                }
              >
                {message}
              </p>
            )}
            <section className={styles.veterinaryPatients}>
              <article className={styles.patientsSearchBar}>
                <h2 className={styles.titlePatient}>Mes Patients</h2>
                <div className={styles.selectedPatient}>
                  <Select
                    options={veterinaryOptions}
                    placeholder="Rechercher un patient..."
                    isSearchable
                    classNamePrefix="rs"
                    className={styles.patientInput}
                    onChange={(opt) => setSelectedFilter(opt?.pet ?? null)}
                    isClearable
                  />
                </div>
              </article>

              {veterinaryPets.length === 0 ? (
                <p>Aucun animal pour ce vétérinaire.</p>
              ) : (
                <article className={styles.patientsList}>
                  {(selectedFilter ? [selectedFilter] : veterinaryPets).map(
                    (pet) => (
                      <div key={pet.petId} className={styles.patientCard}>
                        <div className={styles.patientGenderWrapper}>
                          <p>{pet.petGender === "m" ? "♂" : "♀"}</p>
                        </div>
                        <div className={styles.divImage}>
                          <img
                            src={
                              pet.petSpecie === "chat"
                                ? cat
                                : pet.petSpecie === "chien"
                                  ? dog
                                  : rabbit
                            }
                            alt={pet.petName}
                            className={`${styles.imagePetList}`}
                          />
                        </div>
                        <div className={styles.patientInfo}>
                          <h3 className={styles.patientName}>{pet.petName}</h3>
                          <p className={styles.ownerName}>{pet.ownerName}</p>

                          <button
                            type="button"
                            className={styles.healthRecordButton}
                            onClick={() =>
                              navigate(`/pet-profile/${pet.petId}`)
                            }
                          >
                            Fiche de santé
                          </button>
                        </div>
                      </div>
                    ),
                  )}
                </article>
              )}
            </section>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
