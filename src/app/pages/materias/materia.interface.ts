export interface Nivel {
  id: number;
  nombre: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tipo {
  id: number;
  nombre: string;
  createdAt: string;
  updatedAt: string;
}

export interface Materia {
  id: number;
  sigla: string;
  nombre: string;
  creditos: number;
  nivelId: number;
  tipoId: number;
  createdAt: string | null;
  updatedAt: string | null;
  nivel: Nivel;
  tipo: Tipo;
  selected?: boolean;
}

// --- NUEVA INTERFAZ ---
// Esto es lo que la API envía dentro del arreglo "materias_disponibles"
export interface ApiMateria {
  id: number;
  sigla: string;
  nombre: string;
  creditos: number;
  nivel: string; // La API envía un string
  tipo: string;  // La API envía un string
}

// --- NUEVA INTERFAZ ---
// Esto modela la respuesta COMPLETA de la API
export interface MateriasDisponiblesResponse {
  estudiante_id: number;
  nivel_actual: number;
  plan_estudio: string;
  materias_disponibles: ApiMateria[]; // Contiene el arreglo de materias simples
}