import { useState, type FormEvent } from "react";
import { type Category, type Task, type FieldErrors, createTask, ApiError } from "../services/apiClient";

interface Props {
  categories: Category[];
  onTaskCreated: (task: Task) => void;
  onError: (message: string | null) => void;
}

// Formulaire contrôlé pour créer une nouvelle tâche avec sa catégorie
function TaskForm({ categories, onTaskCreated, onError }: Props) {
  const [newTask, setNewTask] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | "">(() =>
    categories.length > 0 ? categories[0].id : ""
  );
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeCategory = categories.some((category) => category.id === selectedCategory)
    ? selectedCategory
    : (categories[0]?.id ?? "");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});
    const description = newTask.trim();
    if (!description || activeCategory === "" || isSubmitting) return;

    onError(null);
    setIsSubmitting(true);
    try {
      const created = await createTask(description, activeCategory);
      onTaskCreated(created);
      setNewTask("");
    } catch (err) {
      // Affichage des erreurs de validation renvoyées par le backend
      if (err instanceof ApiError) {
        setFieldErrors(err.fieldErrors);
      } else {
        onError("Erreur lors de la création de la tâche");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="new-task" className="sr-only">
          Nouvelle tâche
        </label>
        <input
          id="new-task"
          type="text"
          placeholder="Nouvelle tâche"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          disabled={isSubmitting}
          aria-invalid={Boolean(fieldErrors.description)}
          aria-describedby={fieldErrors.description ? "task-description-error" : undefined}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-blue-500"
        />
        <label htmlFor="task-category" className="sr-only">
          Catégorie
        </label>
        <select
          id="task-category"
          value={activeCategory}
          onChange={(e) => setSelectedCategory(Number(e.target.value))}
          disabled={isSubmitting || categories.length === 0}
          aria-invalid={Boolean(fieldErrors.category_id)}
          aria-describedby={fieldErrors.category_id ? "task-category-error" : undefined}
          className="px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {categories.length === 0 && <option value="">Aucune catégorie</option>}
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={isSubmitting || !newTask.trim() || activeCategory === ""}
          className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Ajout..." : "Ajouter"}
        </button>
      </div>
      {fieldErrors.description && (
        <p id="task-description-error" className="text-red-500 text-sm mt-1" role="alert">
          Description : {fieldErrors.description.join(", ")}
        </p>
      )}
      {fieldErrors.category_id && (
        <p id="task-category-error" className="text-red-500 text-sm mt-1" role="alert">
          Catégorie : {fieldErrors.category_id.join(", ")}
        </p>
      )}
    </form>
  );
}

export default TaskForm;
