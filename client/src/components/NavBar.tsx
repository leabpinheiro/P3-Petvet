import { useState } from "react";
import { useNavigate } from "react-router";
import styles from "../assets/styles/navBar.module.css";
import { useAuth } from "../context/AuthContext";

function NavBar() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [menuBurger, setMenuBurger] = useState(false);

  const vetNavButtons = [
    { label: "Tableau de bord", href: "/dashboard" },
    { label: "Mes animaux suivis", href: "/my-patients" },
    { label: "Rappels", href: "/reminders" },
    { label: "Consultation", href: "/consultation/add" },
  ];

  const ownerNavButtons = [
    { label: "Tableau de bord", href: "/dashboard" },
    { label: "Mes animaux", href: "/my-pets" },
    { label: "Rappels", href: "/reminders" },
    { label: "Documents", href: "#" },
    { label: "Urgences", href: "#" },
    { label: "Le saviez-vous ?", href: "#" },
    { label: "Contacts utiles", href: "#" },
  ];

  const navButtons = auth?.isVet ? vetNavButtons : ownerNavButtons;

  return (
    <nav className={styles.navBar}>
      <button
        type="button"
        className={`${styles.burgerButton} ${!menuBurger ? styles.open : ""}`}
        onClick={() => setMenuBurger(!menuBurger)}
      >
        ☰
      </button>

      <div className={`${styles.navButtons} ${!menuBurger ? styles.none : ""}`}>
        {navButtons.map((button) => (
          <button
            key={button.label}
            type="button"
            onClick={() => {
              if (button.href !== "#") navigate(button.href);
            }}
            className={`${styles.navButtonContent} ${styles.navLink} ${
              auth?.isVet ? styles.vet : ""
            }`}
            disabled={button.href === "#"}
          >
            <img src="/images/paw.png" alt="paw" className={styles.paw} />
            <span>{button.label}</span>
          </button>
        ))}
      </div>

      <div
        className={`${styles.deconnexionContainer} ${!menuBurger ? styles.none : ""}`}
      >
        <button
          type="button"
          onClick={() => navigate("/login")}
          className={`${styles.navButtonContent} ${auth?.isVet ? styles.vet : ""}`}
        >
          <img src="/images/paw.png" alt="paw" className={styles.paw} />
          <span>Déconnexion</span>
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
