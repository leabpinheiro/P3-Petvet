import { useRef, useState } from "react";
import type { FormEventHandler } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import styles from "../assets/styles/login.module.css";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

function Login() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");
  const auth = useAuth();

  const login: FormEventHandler = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          email: (emailRef.current as HTMLInputElement).value,
          password: (passwordRef.current as HTMLInputElement).value,
        }),
      });

      if (response.status === 200) {
        const userData = await response.json();
        localStorage.setItem("token", userData.token); /*a checker*/
        auth?.setUser(userData.user);
        navigate("/dashboard");
      }
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "Mail ou mot de passe incorrect",
      );
    }
  };

  return (
    <>
      <div className={styles.loginPage}>
        <nav className={styles.navLogin}>
          <div className={styles.navHead}>
            <div className={styles.logoContainer}>
              <img
                className={styles.logo1}
                src="/images/green/logo.png"
                alt="Green Logo PetVet"
              />
              <img
                className={styles.logo2}
                src="/images/blue/logo.png"
                alt="Blue logo PetVet"
              />
            </div>

            <h1 className={styles.petVet}>Pet&Vet</h1>
          </div>
          <button
            type="button"
            className={styles.buttonHomeLoginPage}
            onClick={() => navigate("/")}
          >
            <img src="/images/paw.png" alt="paw" className={styles.pawLogin} />
            Accueil
          </button>
        </nav>
        <div className={styles.mainContainer}>
          <section className={styles.loginSectionForm}>
            <article className={styles.formContainer}>
              <h1>Connexion</h1>
              <h2>à mon espace</h2>
              <p className={styles.errorMessage}>{error}</p>
              <form onSubmit={login} className={styles.loginForm}>
                <div>
                  <label htmlFor="email">
                    <p>
                      Email <span>*</span>
                    </p>
                    <input type="email" id="email" ref={emailRef} />
                  </label>
                </div>
                <div>
                  <label htmlFor="password">
                    <p>
                      Mot de passe <span>*</span>
                    </p>
                    <input type="password" id="password" ref={passwordRef} />
                  </label>
                </div>
                <button type="submit" className={styles.buttonSubmit}>
                  Connexion
                </button>
              </form>
            </article>
            <article className={styles.loginSection}>
              <div className={styles.imgContainer}>
                <img src="/images/green/calendar.png" alt="Green Calendar" />
                <img src="/images/blue/stetoscope.png" alt="Blue Stetoscope" />
              </div>
              <div className={styles.loginSectionText}>
                <h2>Première fois chez Pet&Vet ?</h2>
                <p>
                  Créez votre espace{" "}
                  <span className={styles.owner}>propriétaire</span> ou{" "}
                  <span className={styles.vet}>vétérinaire</span> en cliquant
                  ici :
                </p>
              </div>
              <Link to={"/register"}>
                <button type="button" className={styles.registerButton}>
                  Inscription
                </button>
              </Link>
            </article>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Login;
