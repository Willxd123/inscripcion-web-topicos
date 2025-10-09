export interface EstadoInscripcion {
  estado: 'procesando' | 'procesado' | 'error';
  datos?: any;
  error?: string;
}

// Interfaces para el módulo de inscripción

export interface InscripcionRequest {
  estudiante_id: number;
  gestion_id: number;
  fecha: string; // Formato: "YYYY-MM-DD"
  grupos: number[]; // Array de IDs de grupos
}

export interface InscripcionResponse {
  message: string;
  url: string;
  transaction_id: string;
  status: 'procesando';
}

// Respuesta cuando está procesando
export interface EstadoProcesamdo {
  message: string;
  url: string;
  transaction_id: string;
  status: 'procesando';
}

// Respuesta cuando está procesado o con error
export interface EstadoRespuesta {
  Solicitud: {
    estado: 'procesando' | 'procesado' | 'error';
    datos?: InscripcionDetalle;
    error?: string;
  };
}

export interface InscripcionDetalle {
  id: number;
  fecha: string;
  estudiante_id: number;
  gestion_id: number;
  created_at: string;
  updated_at: string;
  detalle: DetalleInscripcion[];
}

export interface DetalleInscripcion {
  id: number;
  inscripcion_id: number;
  grupo_id: number;
  created_at: string;
  updated_at: string;
}

export interface GrupoSeleccionado {
  materiaId: number;
  materiaNombre: string;
  materiaSigla: string;
  grupoId: number;
  grupoSigla: string;
  docenteId: number;
}