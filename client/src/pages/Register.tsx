import { useRef, useState } from "react";
import type { ChangeEventHandler, FormEventHandler } from "react";
import { useNavigate } from "react-router";
import styles from "../assets/styles/register.module.css";
import Footer from "../components/Footer";

type ApiError = {
  field: string | undefined;
  message: string | undefined;
};

function Register() {
  const emailRef = useRef<HTMLInputElement>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [orderNb, setOrderNb] = useState<number | null>(null);
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [errors, setErrors] = useState<ApiError[]>([]);
  const [isVet, setIsVet] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);

  const navigate = useNavigate();

  const currentOrderNb: ChangeEventHandler<HTMLInputElement> = (event) => {
    const temporaryValue = event.target.value;
    setOrderNb(temporaryValue === "" ? null : Number(temporaryValue));
  };

  const sendRegister: FormEventHandler = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          orderNb,
          email: (emailRef.current as HTMLInputElement).value,
          password,
        }),
      });

      const data = await response.json();
      setErrors(data.errors);

      if (response.status === 201) {
        navigate("/login");
      } else {
        console.info(response);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className={styles.registerPage}>
        <nav className={styles.navRegister}>
          <div className={styles.navHead}>
            <img
              src={isVet ? "/images/blue/logo.png" : "/images/green/logo.png"}
              alt="logo-petvet"
              className={styles.logoRegister}
            />

            <h1>Pet&Vet</h1>
          </div>{" "}
          <button
            type="button"
            className={styles.buttonHomeRegisterPage}
            onClick={() => navigate("/")}
          >
            <img
              src="/images/paw.png"
              alt="paw"
              className={styles.pawRegister}
            />
            Accueil
          </button>
        </nav>

        <div className={styles.toggleWrapperRegister}>
          <input
            type="checkbox"
            id="mode-switch-register"
            checked={isVet}
            onChange={() => setIsVet(!isVet)}
          />
          <label
            htmlFor="mode-switch-register"
            className={styles.toggleLabelRegister}
          >
            <span
              className={`${styles.labelText} ${!isVet ? styles.active : ""}`}
            >
              Propriétaire
            </span>
            <span
              className={`${styles.labelText} ${isVet ? styles.active : ""}`}
            >
              Vétérinaire
            </span>
            <div className={styles.switchSlider} />
          </label>
        </div>

        <div className={styles.formSectionRegister}>
          <form className={styles.formRegister} onSubmit={sendRegister}>
            <label htmlFor="firstname">
              {"Prénom : "}
              <input
                type="text"
                id="firstname"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Prénom"
              />
            </label>
            <label htmlFor="lastname">
              {"Nom : "}
              <input
                type="text"
                id="lastname"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Nom"
              />
            </label>
            {isVet && (
              <label htmlFor="orderNb">
                {"Numéro d'ordre: "}
                <input
                  type="number"
                  id="orderNb"
                  min={1000}
                  max={99999}
                  required
                  value={orderNb ?? ""}
                  onChange={currentOrderNb}
                  placeholder="Numéro d'ordre"
                />
              </label>
            )}
            <label htmlFor="email">
              {"Email : "}
              <input
                type="email"
                ref={emailRef}
                id="email"
                required
                placeholder="Adresse mail"
              />
            </label>
            <label htmlFor="password">
              {"Mot de passe : "}
              <div className={styles.passwordInputContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mot de passe"
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                  style={{ outline: "none" }}
                >
                  {showPassword ? (
                    <img
                      src="/images/eye-hide.png"
                      alt="Masquer"
                      className={styles.eyeVisibility}
                    />
                  ) : (
                    <img
                      src="/images/eye-show.png"
                      alt="Afficher"
                      className={styles.eyeVisibility}
                    />
                  )}
                </button>
              </div>
            </label>
            <label htmlFor="confirmedPassword">
              <div className={styles.confirmPasswordLabel}>
                <span>Confirmez le mot de passe :</span>
                {password && (
                  <img
                    src={
                      password === confirmedPassword
                        ? "/images/matching-password.png"
                        : "/images/no-matching-password.png"
                    }
                    alt={
                      password === confirmedPassword
                        ? "Mots de passe identiques"
                        : "Mots de passe différents"
                    }
                  />
                )}
              </div>
              <div className={styles.passwordInputContainer}>
                <input
                  type={showConfirmedPassword ? "text" : "password"}
                  id="confirmedPassword"
                  required
                  value={confirmedPassword}
                  onChange={(e) => setConfirmedPassword(e.target.value)}
                  placeholder="Confirmez le mot de passe"
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowConfirmedPassword(!showConfirmedPassword);
                  }}
                  style={{ outline: "none" }}
                >
                  {showConfirmedPassword ? (
                    <img
                      src="/images/eye-hide.png"
                      alt="Masquer"
                      className={styles.eyeVisibility}
                    />
                  ) : (
                    <img
                      src="/images/eye-show.png"
                      alt="Afficher"
                      className={styles.eyeVisibility}
                    />
                  )}
                </button>
              </div>
            </label>
            {errors.map((error) => {
              return (
                <p key={error.field} className={styles.registerError}>
                  {error.message}
                </p>
              );
            })}
            <button
              type="submit"
              className={`${styles.buttonSubmit} ${isVet ? styles.btnBlue : styles.btnGreen}`}
            >
              Enregistrer
            </button>
          </form>
          <section className={styles.sectionRegister}>
            {isVet ? (
              <>
                <h2>Inscription Veterinaire </h2>
                <img
                  src="/images/blue/stetoscope.png"
                  alt="stetoscope"
                  className={styles.imageSectionRegister}
                />
                <div className={styles.sectionRegisterText}>
                  <p>Bienvenue sur Pet&Vet !</p>
                  <p>
                    En tant que vétérinaire, tu auras la possibilité de suivre
                    tes patients, rédiger des consultations et suivre leurs
                    activités
                  </p>
                </div>
              </>
            ) : (
              <>
                <h2>Inscription Propriétaire </h2>
                <img
                  src="/images/green/calendar.png"
                  alt="calendar"
                  className={styles.imageSectionRegister}
                />
                <div className={styles.sectionRegisterText}>
                  <p>Bienvenue sur Pet&Vet !</p>
                  <p>
                    En tant que propiétaire, tu auras la possibilité de suivre
                    tous tes animaux, te créer des rappels, et acccéder aux
                    consultations de leurs vétérinaires !
                  </p>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Register;
