import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Injector, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop'
import { firstValueFrom } from 'rxjs';
import { Medicamentos } from '../interfaces/medicamentos.interface';
import { Pedidos } from '../interfaces/pedidos.interface';
import { Formulas } from '../interfaces/formulas.interface';
@Injectable({
  providedIn: 'root'
})
export class ServidorService {

  private readonly url = 'http://127.0.0.1:8000/';
  private http = inject(HttpClient);
  private injector = inject(Injector);

  getMedicamentos():Signal<Medicamentos[]> {
    return toSignal(
      this.http.get<Medicamentos[]>(this.url+'medicamentos/'),
      {initialValue:[],injector:this.injector}
    );
  }

  getPedidos():Signal<Pedidos[]> {
    return toSignal(
      this.http.get<Pedidos[]>(this.url+'pedidos/'),
      {initialValue:[],injector:this.injector}
    );
  }

  getFormulas():Signal<Formulas[]> {
    return toSignal(
      this.http.get<Formulas[]>(this.url+'formulas/'),
      {initialValue:[],injector:this.injector}
    );
  }

  createMedicamento(data:Medicamentos){
    return this.http.post(this.url+'medicamentos/',data);
  }

  createFormula(data:Formulas){
    return this.http.post(this.url+'formulas/',data);
  }

  createPedido(data:Pedidos){
    return this.http.post(this.url+'pedidos/',data);
  }

  updatePedido(data:Pedidos,id:number){
    return this.http.put(this.url+`pedidos/${id}/recibido`,data);
  }

  updateFormula(data:Formulas,id:number){
    return this.http.put(this.url+`formulas/${id}/estado`,data);
  }
}
