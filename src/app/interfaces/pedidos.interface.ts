export interface Pedidos {
  id?: number
  solicitante: string
  medicamento_id: number
  cantidad: number
  estado?:string
  medicamento?:{
    id:number
    nombre:string
  }
}
