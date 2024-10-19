import { Medicamentos } from "./medicamentos.interface";

export interface Formulas {
  id?: number
  nombre: string
  medicamento_id: number
  cantidad: number
  estado?:string
  medicamento?:{
    id:number
    nombre:string
  }
}
