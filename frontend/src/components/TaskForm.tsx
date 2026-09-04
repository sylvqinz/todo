import { useState, useEffect, type FormEvent } from "react";
import { type Category, type Task, createTask, ApiError } from "../services/apiClient";

type FieldErrors = Record<string, string[]>;

interface Props {
  categories: Category[];
  onTaskCreated: (task: Task) => void;
  onError: (message: string) => void;
}

// Formulaire contrôlé pour créer une nouvelle tâche avec sa catégorie
function TaskForm({ categories, onTaskCreated, onError }: Props) {
  const [newTask, setNewTask] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | "">(() =>
    categories.length > 0 ? categories[0].id : ""
  );
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  // Synchronise la sélection par défaut quand les catégories sont chargées
  useEffect(() => {
    if (selectedCategory === "" && categories.length > 0) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories, selectedCategory]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});
    if (!newTask.trim() || selectedCategory === "") return;

    try {
      const created = await createTask(newTask, selectedCategory);
      onTaskCreated(created);
      setNewTask("");
    } catch (err) {
      // Affichage des erreurs de validation renvoyées par le backend
      if (err instanceof ApiError) {
        setFieldErrors(err.fieldErrors);
      } else {
        onError("Erreur lors de la création de la tâche");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Nouvelle tâche"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-blue-500"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(Number(e.target.value))}
          className="px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-blue-500"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition-colors"
        >
          Ajouter
        </button>
      </div>
      {fieldErrors.description && (
        <p className="text-red-500 text-sm mt-1">
          Description : {fieldErrors.description.join(", ")}
        </p>
      )}
      {fieldErrors.category_id && (
        <p className="text-red-500 text-sm mt-1">
          Catégorie : {fieldErrors.category_id.join(", ")}
        </p>
      )}
    </form>
  );
}

export default TaskForm;
