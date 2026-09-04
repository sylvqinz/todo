import { useState, type FormEvent } from "react";
import { type Category, createCategory, ApiError } from "../services/apiClient";

type FieldErrors = Record<string, string[]>;

interface Props {
  onCategoryCreated: (category: Category) => void;
  onError: (message: string) => void;
}

// Formulaire contrôlé pour créer une nouvelle catégorie
function CategoryForm({ onCategoryCreated, onError }: Props) {
  const [newCategory, setNewCategory] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});
    if (!newCategory.trim()) return;

    try {
      const created = await createCategory(newCategory);
      onCategoryCreated(created);
      setNewCategory("");
    } catch (err) {
      if (err instanceof ApiError) {
        setFieldErrors(err.fieldErrors);
      } else {
        onError("Erreur lors de la création de la catégorie");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Nouvelle catégorie"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition-colors"
        >
          Ajouter catégorie
        </button>
      </div>
      {fieldErrors.name && (
        <p className="text-red-500 text-sm mt-1">
          {fieldErrors.name.join(", ")}
        </p>
      )}
    </form>
  );
}

export default CategoryForm;
