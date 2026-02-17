import "../assets/styles/reset.css";
import "../assets/styles/homePageAnimation.css";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import styles from "../assets/styles/homePage.module.css";
import Footer from "../components/Footer";

function HomePage() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          } else {
            entry.target.classList.remove("active");
          }
        }
      },
      {
        threshold: 0.2,
      },
    );
    const elements = document.querySelectorAll(".reveal, .reveal-img");
    for (const el of elements) {
      observer.observe(el);
    }

    const scrollToUpButton = () => {
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", scrollToUpButton);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", scrollToUpButton);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <header className={styles.headerHome}>
        <nav>
          <div className={styles.logoContainer}>
            <img
              src="/images/green/logo.png"
              alt="PetVet Logo vert"
              className={`${styles.logo} ${styles.logo1} reveal from-right`}
              width="120px"
            />
            <img
              src="/images/blue/logo.png"
              alt="PetVet Logo bleu"
              className={`${styles.logo} ${styles.logo2} reveal from-left`}
              width="120px"
            />
          </div>

          <h1 className="reveal">Pet&Vet</h1>
        </nav>
        <div className={styles.headerContent}>
          <h2 className="reveal">Bienvenue sur Pet&Vet !</h2>
          <h3 className="reveal">
            Votre carnet de santé numérique pour animaux de compagnie
          </h3>
          <ul>
            <li>
              <Link to="/login" className={styles.navLink}>
                <button
                  type="button"
                  className={`${styles.buttonHomePage} reveal from-left`}
                >
                  <img src="/images/paw.png" alt="Pattoune Icon" width="15" />
                  Me connecter
                </button>
              </Link>
            </li>
            <li>
              <Link to="/register" className={styles.navLink}>
                <button
                  type="button"
                  className={`${styles.buttonHomePage} reveal from-left`}
                >
                  <img src="/images/paw.png" alt="Pattoune Icon" width="15" />
                  M'inscrire
                </button>
              </Link>
            </li>
            <li>
              <button
                type="button"
                className={`${styles.buttonHomePage} reveal from-left`}
              >
                <img src="/images/paw.png" alt="Pattoune Icon" width="15" />
                Contacts utiles
              </button>
            </li>
          </ul>
        </div>
        <a href="#intro" className={styles.scrollDown}>
          <span className={styles.arrow}>↓</span>
        </a>
      </header>
      <main>
        <section id="intro" className={styles.intro}>
          <h1>
            Pet&Vet : avec vous pour vous accompagner dans le suivi de vos
            animaux
          </h1>
          <div className={styles.introSection}>
            <div className={styles.introText}>
              <h2>Le carnet de santé numérique Pour tous les animaux</h2>
              <p>
                Le premier carnet de santé numérique pour tous les animaux de
                compagnie, entièrement gratuit et disponible sur smartphone.
              </p>
              <span className="reveal from-bottom">
                ATTENTION : l'utilisation de ce site ne remplace pas l'avis d'un
                vétérinaire.
              </span>
            </div>

            <img
              src="/images/dog-cat.jpg"
              alt="Chien et chat assis"
              className="reveal from-right"
            />
          </div>
        </section>
        <section className={styles.individuals}>
          <h1>Particuliers et passionnés</h1>
          <h2>Tout le suivi de vos animaux dans une seule application!</h2>
          <div className={styles.individualsTextAndImage}>
            <div className={styles.individualsText}>
              <p>
                Peu importe l'espèce de vos compagnons, Pet&Vet simplifie leur
                suivi de santé grâce à un carnet numérique interactif et
                gratuit.
              </p>
              <p>
                Créez des profils personnalisés pour chacun d'entre eux,
                programmez vos alertes pour ne plus oublier aucun rendez-vous et
                partagez instantanément leurs données médicales avec votre
                vétérinaire.
              </p>
              <p>
                Profitez d'un espace personnel sécurisé et accessible à tout
                moment pour veiller sereinement sur tous vos animaux.
              </p>
            </div>
            <img
              src="/images/cat-hand.jpg"
              alt="Chat qui tape dans la main"
              className="reveal from-left"
            />
          </div>
        </section>

        <section className={styles.professionals}>
          <h1>L’allié numérique des experts de la santé animale</h1>
          <div className={styles.professionalsTextAndImage}>
            <div className={styles.professionalsText}>
              <p>
                Vétérinaires et ASV, optimisez l'observance de vos soins grâce à
                Pet&Vet, l'outil numérique gratuit qui connecte votre expertise
                au quotidien des propriétaires.
              </p>
              <p>
                Plus qu’un carnet de santé, l’application vous permet d'ajouter
                et de consulter l'historique des visites, tout en gardant un œil
                sur le suivi de chaque animal.
              </p>
              <p>
                En coordonnant les traitements et les rappels directement avec
                vos clients, vous modernisez votre pratique et garantissez une
                meilleure réussite thérapeutique.
              </p>
            </div>
            <img
              src="/images/rabbit.jpg"
              alt="Lapin"
              className="reveal from-right"
            />
          </div>
        </section>

        <section className={styles.associations}>
          <h1>Associations,</h1>
          <h2>
            L’outil gratuit pour optimiser la gestion de votre association
          </h2>
          <div className={styles.associationsTextAndImage}>
            <div className={styles.associationsText}>
              <p>
                Gagnez en efficacité grâce à notre plateforme web dédiée qui
                centralise tous les carnets de santé numériques de vos animaux
                en attente d'adoption.
              </p>
            </div>
            <img
              src="/images/dog-window.jpg"
              alt="Chien regardant par la fenêtre"
              className="reveal from-bottom"
            />
          </div>
        </section>
        <section className={styles.buttonsBottom}>
          <div className={styles.buttonContactsUtile}>
            <button
              type="button"
              className={`${styles.buttonHomePage} reveal from-right`}
            >
              <img src="/images/paw.png" alt="Pattoune Icon" width="20" />
              Contacts utiles
            </button>
          </div>
          <div className={styles.buttonRegisterLogin}>
            <Link to="/login" className={styles.navLink}>
              <button
                type="button"
                className={`${styles.buttonHomePage} reveal from-right`}
              >
                <img src="/images/paw.png" alt="Pattoune Icon" width="20" />
                Me connecter
              </button>
            </Link>
            <Link to="/register" className={styles.navLink}>
              <button
                type="button"
                className={`${styles.buttonHomePage} reveal from-right`}
              >
                <img src="/images/paw.png" alt="Pattoune Icon" width="20" />
                M'inscrire
              </button>
            </Link>
          </div>
        </section>
        <button
          type="button"
          className={`${styles.backToTop} ${showButton ? styles.show : ""}`}
          onClick={scrollToTop}
          title="Retour en haut"
        >
          ↑
        </button>
        <Footer />
      </main>
    </>
  );
}

export default HomePage;
