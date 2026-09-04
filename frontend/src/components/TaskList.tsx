import { useState } from "react";
import { type Category, type Task, updateTask, deleteTask as apiDeleteTask, deleteCategory as apiDeleteCategory } from "../services/apiClient";

interface Props {
  categories: Category[];
  tasks: Task[];
  onTaskUpdated: (task: Task) => void;
  onTaskDeleted: (id: number) => void;
  onCategoryDeleted: (id: number) => void;
  onError: (message: string) => void;
}

// Affiche la liste des tâches avec filtrage par catégorie et actions (toggle/suppression)
function TaskList({ categories, tasks, onTaskUpdated, onTaskDeleted, onCategoryDeleted, onError }: Props) {
  const [categoryFilter, setCategoryFilter] = useState<number | "">("");

  // Filtrage local des tâches selon la catégorie sélectionnée
  const filteredTasks = tasks.filter(
    (t) => categoryFilter === "" || t.category.id === categoryFilter
  );

  // Bascule l'état terminé/non terminé via PATCH sur l'API
  const toggleDone = async (task: Task) => {
    try {
      const updated = await updateTask(task.id, { is_completed: !task.is_completed });
      onTaskUpdated(updated);
    } catch {
      onError("Erreur lors de la mise à jour");
    }
  };

  const handleDeleteCategory = async () => {
    if (categoryFilter === "") return;
    try {
      await apiDeleteCategory(categoryFilter);
      onCategoryDeleted(categoryFilter);
      setCategoryFilter("");
    } catch {
      onError("Erreur lors de la suppression de la catégorie");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await apiDeleteTask(id);
      onTaskDeleted(id);
    } catch {
      onError("Erreur lors de la suppression");
    }
  };

  return (
    <>
      <div className="mb-4 flex gap-2">
        <select
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
            onClick={handleDeleteCategory}
            className="px-3 py-2 bg-red-600 text-white rounded-md cursor-pointer hover:bg-red-700 transition-colors text-sm"
          >
            Supprimer catégorie
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
                className="flex items-center justify-between px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <label className={`flex items-center gap-2 cursor-pointer ${t.is_completed ? "line-through text-gray-400" : ""}`}>
                  <input
                    type="checkbox"
                    checked={t.is_completed}
                    onChange={() => toggleDone(t)}
                    className="w-4 h-4"
                  />
                  {t.description} - {t.category.name}
                </label>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="px-3 py-1.5 bg-red-600 text-white rounded-md cursor-pointer hover:bg-red-700 transition-colors text-sm"
                >
                  Supprimer
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
