import { useState, type FormEvent } from "react";
import { type Category, type FieldErrors, createCategory, ApiError } from "../services/apiClient";

interface Props {
  onCategoryCreated: (category: Category) => void;
  onError: (message: string | null) => void;
}

// Formulaire contrôlé pour créer une nouvelle catégorie
function CategoryForm({ onCategoryCreated, onError }: Props) {
  const [newCategory, setNewCategory] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});
    const name = newCategory.trim();
    if (!name || isSubmitting) return;

    onError(null);
    setIsSubmitting(true);
    try {
      const created = await createCategory(name);
      onCategoryCreated(created);
      setNewCategory("");
    } catch (err) {
      if (err instanceof ApiError) {
        setFieldErrors(err.fieldErrors);
      } else {
        onError("Erreur lors de la création de la catégorie");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="new-category" className="sr-only">
          Nouvelle catégorie
        </label>
        <input
          id="new-category"
          type="text"
          placeholder="Nouvelle catégorie"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          disabled={isSubmitting}
          aria-invalid={Boolean(fieldErrors.name)}
          aria-describedby={fieldErrors.name ? "category-name-error" : undefined}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={isSubmitting || !newCategory.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Ajout..." : "Ajouter catégorie"}
        </button>
      </div>
      {fieldErrors.name && (
        <p id="category-name-error" className="text-red-500 text-sm mt-1" role="alert">
          {fieldErrors.name.join(", ")}
        </p>
      )}
    </form>
  );
}

export default CategoryForm;
