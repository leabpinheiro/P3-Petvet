import { useEffect, useState } from "react";
import { Link } from "react-router";
import cat from "../../public/images/chat_3.png";
import dog from "../../public/images/chien_5.png";
import rabbit from "../../public/images/lapin-de-paques.png";
import styles from "../assets/styles/vetDashboard.module.css";
import type { Patient } from "../types/Pet";

interface VetDashboard {
  dashboard: {
    patients: Patient[];
  };
}

type Todo = {
  id: number;
  content: string;
  done: boolean;
};

function VetDashboard({ dashboard }: VetDashboard) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("vetTodos");

    if (stored) {
      setTodos(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("vetTodos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!newTodo.trim()) return;

    setTodos([...todos, { id: Date.now(), content: newTodo, done: false }]);

    setNewTodo("");
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const todoDone = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo,
      ),
    );
  };

  return (
    <>
      <div className={styles.allSections}>
        <section className={styles.petSection}>
          <h2 className={styles.myPatients}>Mes patients</h2>
          <div className={styles.patientsCards}>
            {dashboard.patients.length === 0 && (
              <p className={styles.noData}>
                Vous n'avez aucun patient suivi, veuillez en ajouter.
              </p>
            )}
            {dashboard.patients.slice(0, 4).map((patient) => (
              <article key={patient.id} className={styles.patientInfos}>
                <p className={styles.gender}>
                  {patient.gender === "m" ? "♂" : "♀"}
                </p>
                <div className={styles.patientInfo}>
                  <div className={styles.divImage}>
                    <img
                      src={
                        patient.specie === "chat"
                          ? cat
                          : patient.specie === "chien"
                            ? dog
                            : rabbit
                      }
                      alt={patient.name}
                      className={styles.patientImage}
                    />
                  </div>
                  <div className={styles.patientText}>
                    <h3>{patient.name}</h3>
                    <p>{patient.specie}</p>
                  </div>
                </div>
                <p className={styles.owner}>
                  Propriétaire :{" "}
                  <span>
                    {patient.ownerLastname} {patient.ownerFirstname}
                  </span>
                </p>
              </article>
            ))}
          </div>
          <div className={styles.viewMoreContainer}>
            <Link to={"/my-patients"}>
              <button type="button" className={styles.viewMore}>
                Voir plus
              </button>
            </Link>
          </div>
        </section>
        <section className={styles.todoSection}>
          <h2 className={styles.todoToday}>A faire aujourd'hui</h2>
          <div className={styles.todoCards}>
            {todos.length === 0 && (
              <p className={styles.noData}>Aucune tâche à faire.</p>
            )}
            {todos.length > 0 && (
              <ul className={styles.todoList}>
                {todos.map((todo) => (
                  <li
                    key={todo.id}
                    className={`${styles.todoCard} ${todo.done ? styles.done : styles.notDone}`}
                  >
                    <input
                      type="checkbox"
                      checked={todo.done}
                      onChange={() => todoDone(todo.id)}
                      className={styles.checkBox}
                    />
                    <p className={todo.done ? styles.todoDone : ""}>
                      {todo.content}
                    </p>
                    <button
                      type="button"
                      onClick={() => deleteTodo(todo.id)}
                      className={styles.closingBtn}
                    >
                      <img
                        src="/images/blue/white-cross.png"
                        alt="Suppression de la tâche"
                        className={styles.crossImg}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className={styles.addTodos}>
            <input
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Ajouter une tâche"
              className={styles.addTodoText}
            />
            <button
              type="button"
              onClick={addTodo}
              className={styles.addTodoBtn}
            >
              Ajouter
            </button>
          </div>
        </section>
      </div>
    </>
  );
}

export default VetDashboard;
