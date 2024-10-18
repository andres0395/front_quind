import { Medicamentos } from "./medicamentos.interface";

export interface Formulas {
  id?: number;
    nombre: string;
    medicamentos: Medicamentos[];
    estado: string;
}
