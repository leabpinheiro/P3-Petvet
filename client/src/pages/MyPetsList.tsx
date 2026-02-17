import { useEffect, useState } from "react";
import type { Pet } from "../types/Pet";
import "../assets/styles/reset.css";
import "../assets/styles/variables.css";
import { Link } from "react-router";
import cat from "../../public/images/chat_3.png";
import dog from "../../public/images/chien_5.png";
import rabbit from "../../public/images/lapin-de-paques.png";
import styles from "../assets/styles/myPetsList.module.css";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import { useAuth } from "../context/AuthContext";

function MyPetsList() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatGender = (gender: string) => (gender === "m" ? "♂" : "♀");
  const auth = useAuth();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/owners/me/pets`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((petsData: Pet[]) => {
        setPets(petsData);
        setIsLoading(false);
      })
      .catch(() => {
        setError("Impossible de charger les animaux");
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <p>Chargement de vos animaux...</p>;
  if (error) return <p>{error}</p>;
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
          <div className={styles.allPage}>
            <div className={styles.titleContainer}>
              <h2 className={styles.title}>Ma Tribu :</h2>
              <Link to="/my-pets/pets/new">
                <button type="button" className={styles.addAnimal}>
                  Ajouter un animal
                </button>
              </Link>
            </div>
            {pets.length === 0 && (
              <p className={styles.errorMessage}>
                Vous n'avez aucun animal à afficher. Pensez à ajouter un animal
                à votre tribu.
              </p>
            )}
            <section className={styles.petCards}>
              <div className={styles.petCardsContainer}>
                {pets.map((pet) => (
                  <article className={styles.petCard} key={pet.id}>
                    <p className={styles.gender}>{formatGender(pet.gender)}</p>
                    <div className={styles.petInfoContainer}>
                      <div className={styles.divImage}>
                        <img
                          src={
                            pet.specie === "chat"
                              ? cat
                              : pet.specie === "chien"
                                ? dog
                                : rabbit
                          }
                          alt={pet.name}
                          className={styles.imagePetList}
                        />
                      </div>
                      <div className={styles.petInfo}>
                        <h3>{pet.name}</h3>
                        <p className={styles.specie}>
                          {pet.specie} - {pet.breed}
                        </p>
                      </div>
                    </div>
                    <div className={styles.button}>
                      <Link
                        to={`/pet-profile/${pet.id}`}
                        className={styles.linkButton}
                      >
                        <button type="button" className={styles.profilAccess}>
                          Fiche de santé
                        </button>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}

export default MyPetsList;
