import { Link } from "react-router";
import cat from "../../public/images/chat_3.png";
import dog from "../../public/images/chien_5.png";
import rabbit from "../../public/images/lapin-de-paques.png";
import styles from "../assets/styles/ownerDashboard.module.css";
import type { Activity } from "../types/Activity";
import type { Pet } from "../types/Pet";

interface OwnerDashboard {
  dashboard: {
    pets: Pet[];
    activities: Activity[];
  };
}

function OwnerDashboard({ dashboard }: OwnerDashboard) {
  return (
    <>
      <div className={styles.allSections}>
        <section className={styles.petSection}>
          <h2 className={styles.myPets}>Mes compagnons</h2>
          <div className={styles.petsCards}>
            {dashboard.pets.length === 0 && (
              <p>Vous n'avez aucun animal, veuillez en ajouter.</p>
            )}
            {dashboard.pets.slice(0, 4).map((pet) => (
              <article key={pet.id} className={styles.petInfos}>
                <p className={styles.gender}>
                  {pet.gender === "m" ? "♂" : "♀"}
                </p>
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
                      className={styles.petImage}
                    />
                  </div>
                  <div className={styles.petText}>
                    <h3>{pet.name}</h3>
                    <p>{pet.specie}</p>
                    <p className={styles.breed}>{pet.breed}</p>
                  </div>
                </div>
                <div className={styles.buttonContainer}>
                  <Link
                    to={`/pet-profile/${pet.id}`}
                    className={styles.linkButton}
                  >
                    <button type="button" className={styles.petButton}>
                      Fiche de santé
                    </button>
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <div className={styles.viewMoreContainer}>
            <Link to={"/my-pets"}>
              <button type="button" className={styles.viewMore}>
                Voir plus
              </button>
            </Link>
          </div>
        </section>
        <section className={styles.actSection}>
          <h2 className={styles.petsActivities}>Activités et événements</h2>
          <div className={styles.actCards}>
            {dashboard.activities.length === 0 && (
              <p>Aucun événement récent.</p>
            )}
            {dashboard.activities.map((activity: Activity) => (
              <article key={activity.id} className={styles.actCard}>
                <img
                  src={
                    activity.type === "consultation"
                      ? "/images/green/stetoscope.png"
                      : "images/green/calendar.png"
                  }
                  alt={activity.type}
                  className={styles.actLogo}
                />
                <div className={styles.actText}>
                  <h3>{activity.title}</h3>
                  <p>{activity.petName}</p>
                </div>
                <p className={styles.date}>
                  {new Date(activity.date).toLocaleDateString()}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.emergencySection}>
          <h2>Le saviez-vous ?</h2>
          <div className={styles.knowledge}>
            <article>
              <div className={styles.infoTitle}>
                <img src="/images/green/emergency.png" alt="Urgence logo" />
                <h3>Médicaments dangereux</h3>
              </div>
              <p>
                L'aspirine et le paracétamol sont toxiques pour les animaux. Il
                est rudement conseillé de ne jamais faire d'auto-médication.
                Consultez votre vétérinaire avant de donner tout traitement à
                votre animal.
              </p>
            </article>
            <article>
              <div className={styles.infoTitle}>
                <img src="/images/green/emergency.png" alt="Urgence logo" />
                <h3>Signes d'urgence</h3>
              </div>
              <p>
                Contactez immédiatement un vétérinaire si votre animal : ne
                mange plus depuis 24h, à des selles noires, ne peux plus
                uriner... Si votre lapin mange moins que d'habitude ou refuse
                catégoriquement de manger, il s'agit d'une urgence.
              </p>
            </article>
          </div>
        </section>
      </div>
      <section>
        <h2 className={styles.disclaimer}>
          ATTENTION ! L'utilisation de ce site ne remplace pas l'avis d'un
          vétérinaire !
        </h2>
      </section>
    </>
  );
}

export default OwnerDashboard;
