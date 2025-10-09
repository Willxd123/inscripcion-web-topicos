export interface Docente {
  id: number;
  registro: string;
  nombre: string;
  email: string | null;
  telefono: string | null;
}

export interface Horario {
  id: number;
  dia: string;
  horaInicio: string;
  horaFin: string;
  grupoId: number;
  aulaId: number;
  moduloId: number;
}

export interface Grupo {
  id: number;
  sigla: string;
  cupo: number;
  materiaId: number;
  docenteId: number;
  gestionId: number;
  createdAt?: string;
  updatedAt?: string;
  docente?: Docente;
  horarios?: Horario[];
}

export interface GrupoSeleccionado {
  materiaId: number;
  materiaNombre: string;
  materiaSigla: string;
  grupoId: number;
  grupoSigla: string;
  docenteId: number;
}
