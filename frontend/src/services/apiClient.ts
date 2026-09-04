// URL de base de l'API Django, définie dans le fichier .env
const API_BASE = import.meta.env.VITE_API_BASE_URL;

// Classe d'erreur personnalisée pour capturer les erreurs de validation renvoyées par DRF
export class ApiError extends Error {
  status: number;
  fieldErrors: Record<string, string[]>;

  constructor(status: number, fieldErrors: Record<string, string[]>) {
    const messages = Object.entries(fieldErrors)
      .map(([field, errs]) => `${field}: ${errs.join(", ")}`)
      .join(" | ");
    super(messages || `Erreur ${status}`);
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

// Fonction générique pour effectuer les requêtes HTTP vers l'API
async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  // En cas d'erreur, on parse le corps JSON (erreurs de validation DRF)
  if (!res.ok) {
    let body: Record<string, string[]> = {};
    try {
      body = await res.json();
    } catch {
      /* réponse sans JSON */
    }
    throw new ApiError(res.status, body);
  }

  // 204 = suppression réussie, pas de contenu à retourner
  if (res.status === 204) return undefined as T;
  return res.json();
}

// --- Catégories ---

export interface Category {
  id: number;
  name: string;
}

export function getCategories() {
  return request<Category[]>("/categories/");
}

export function createCategory(name: string) {
  return request<Category>("/categories/", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export function deleteCategory(id: number) {
  return request<void>(`/categories/${id}/`, { method: "DELETE" });
}

// --- Tâches ---

export interface Task {
  id: number;
  description: string;
  is_completed: boolean;
  created_at: string;
  category: Category;
  category_id: number;
}

export function getTasks() {
  return request<Task[]>("/tasks/");
}

export function createTask(description: string, category_id: number) {
  return request<Task>("/tasks/", {
    method: "POST",
    body: JSON.stringify({ description, category_id }),
  });
}

// PATCH pour mettre à jour partiellement une tâche (ex: is_completed)
export function updateTask(id: number, data: Partial<Pick<Task, "is_completed" | "description">>) {
  return request<Task>(`/tasks/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteTask(id: number) {
  return request<void>(`/tasks/${id}/`, { method: "DELETE" });
}
