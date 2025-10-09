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
