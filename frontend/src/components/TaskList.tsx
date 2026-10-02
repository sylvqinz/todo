import { useState } from "react";
import { type Category, type Task, updateTask, deleteTask as apiDeleteTask, deleteCategory as apiDeleteCategory } from "../services/apiClient";

interface Props {
  categories: Category[];
  tasks: Task[];
  onTaskUpdated: (task: Task) => void;
  onTaskDeleted: (id: number) => void;
  onCategoryDeleted: (id: number) => void;
  onError: (message: string | null) => void;
}

// Affiche la liste des tâches avec filtrage par catégorie et actions (toggle/suppression)
function TaskList({ categories, tasks, onTaskUpdated, onTaskDeleted, onCategoryDeleted, onError }: Props) {
  const [categoryFilter, setCategoryFilter] = useState<number | "">("");
  const [pendingTaskId, setPendingTaskId] = useState<number | null>(null);
  const [isDeletingCategory, setIsDeletingCategory] = useState(false);

  // Filtrage local des tâches selon la catégorie sélectionnée
  const filteredTasks = tasks.filter(
    (t) => categoryFilter === "" || t.category.id === categoryFilter
  );

  // Bascule l'état terminé/non terminé via PATCH sur l'API
  const toggleDone = async (task: Task) => {
    if (pendingTaskId === task.id) return;
    onError(null);
    setPendingTaskId(task.id);
    try {
      const updated = await updateTask(task.id, { is_completed: !task.is_completed });
      onTaskUpdated(updated);
    } catch {
      onError("Erreur lors de la mise à jour");
    } finally {
      setPendingTaskId(null);
    }
  };

  const handleDeleteCategory = async () => {
    if (categoryFilter === "" || isDeletingCategory) return;
    const category = categories.find((item) => item.id === categoryFilter);
    const confirmed = window.confirm(
      `Supprimer la catégorie "${category?.name ?? "sélectionnée"}" et toutes ses tâches ?`,
    );
    if (!confirmed) return;

    onError(null);
    setIsDeletingCategory(true);
    try {
      await apiDeleteCategory(categoryFilter);
      onCategoryDeleted(categoryFilter);
      setCategoryFilter("");
    } catch {
      onError("Erreur lors de la suppression de la catégorie");
    } finally {
      setIsDeletingCategory(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (pendingTaskId === id) return;
    onError(null);
    setPendingTaskId(id);
    try {
      await apiDeleteTask(id);
      onTaskDeleted(id);
    } catch {
      onError("Erreur lors de la suppression");
    } finally {
      setPendingTaskId(null);
    }
  };

  return (
    <>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <label htmlFor="category-filter" className="sr-only">
          Filtrer par catégorie
        </label>
        <select
          id="category-filter"
          value={categoryFilter}
          onChange={(e) =>
            setCategoryFilter(e.target.value === "" ? "" : Number(e.target.value))
          }
          className="px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-blue-500"
        >
          <option value="">Toutes les catégories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {categoryFilter !== "" && (
          <button
            type="button"
            onClick={handleDeleteCategory}
            disabled={isDeletingCategory}
            className="px-3 py-2 bg-red-600 text-white rounded-md cursor-pointer hover:bg-red-700 transition-colors text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeletingCategory ? "Suppression..." : "Supprimer catégorie"}
          </button>
        )}
      </div>

      <div>
        {filteredTasks.length === 0 ? (
          <p className="text-center text-gray-500 italic">Aucune tâche à afficher</p>
        ) : (
          <ul className="list-none p-0 mt-5 space-y-2">
            {filteredTasks.map((t) => (
              <li
                key={t.id}
                className="flex flex-col items-stretch gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors sm:flex-row sm:items-center sm:justify-between"
              >
                <label className={`flex min-w-0 flex-1 items-center gap-2 cursor-pointer ${t.is_completed ? "line-through text-gray-400" : ""}`}>
                  <input
                    type="checkbox"
                    checked={t.is_completed}
                    onChange={() => toggleDone(t)}
                    disabled={pendingTaskId === t.id}
                    className="w-4 h-4"
                  />
                  <span className="min-w-0 break-words">
                    {t.description} - {t.category.name}
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => handleDelete(t.id)}
                  disabled={pendingTaskId === t.id}
                  className="px-3 py-1.5 bg-red-600 text-white rounded-md cursor-pointer hover:bg-red-700 transition-colors text-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {pendingTaskId === t.id ? "Patientez..." : "Supprimer"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default TaskList;
