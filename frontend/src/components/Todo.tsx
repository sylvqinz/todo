import { useState, useEffect } from "react";
import { type Category, type Task, getCategories, getTasks } from "../services/apiClient";
import CategoryForm from "./CategoryForm";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";

// Composant principal qui orchestre l'état global de l'application
function Todo() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Chargement initial des catégories et tâches depuis l'API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Requêtes en parallèle pour optimiser le temps de chargement
        const [catData, taskData] = await Promise.all([
          getCategories(),
          getTasks(),
        ]);
        setCategories(catData);
        setTasks(taskData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <section className="w-full max-w-2xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Ma To-Do List par catégories
      </h1>

      {loading && <p className="text-center text-gray-500 italic">Chargement...</p>}
      {error && <p className="text-center text-red-500 font-medium">{error}</p>}

      <CategoryForm
        onCategoryCreated={(cat) => setCategories((prev) => [...prev, cat])}
        onError={setError}
      />

      <TaskForm
        categories={categories}
        onTaskCreated={(task) => setTasks((prev) => [...prev, task])}
        onError={setError}
      />

      <TaskList
        categories={categories}
        tasks={tasks}
        onTaskUpdated={(updated) =>
          setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
        }
        onTaskDeleted={(id) => setTasks((prev) => prev.filter((t) => t.id !== id))}
        onCategoryDeleted={(id) => {
          setCategories((prev) => prev.filter((c) => c.id !== id));
          setTasks((prev) => prev.filter((t) => t.category.id !== id));
        }}
        onError={setError}
      />
    </section>
  );
}

export default Todo;
