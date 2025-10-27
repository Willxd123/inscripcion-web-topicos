export interface Historico {
  id: number;
  nota: string | number; // La API puede enviar string, lo tratamos como número
  creditos: number;
  estudiante_id: number;
  grupo_id: number;

  // --- DATOS ENRIQUECIDOS POR EL BACKEND ---
  grupoSigla: string;     // Ej: "SA"
  materiaNombre: string;  // Ej: "FISICA 1"
  materiaSigla: string;   // Ej: "FIS100"
  gestionNombre: string;  // Ej: "1-2025"
}
