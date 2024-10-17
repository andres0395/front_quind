import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Injector, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop'
import { firstValueFrom } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ServidorService {

  private readonly url = 'http://127.0.0.1:8000/';
  private http = inject(HttpClient);
  private injector = inject(Injector);
  getMedicamentos():Signal<Medicamentos[] | [] | object> {
    return toSignal(this.http.get(this.url+'/medicamentos/'),{initialValue:[],injector:this.injector});
  }
  getPedidos():Signal<Pedidos[] | [] | object> {
    return toSignal(
      this.http.get(this.url+'/pedidos/'),
      {initialValue:[],injector:this.injector}
    );
  }
  getFormulas():Signal<Formulas[] | [] | object> {
    return toSignal(
      this.http.get(this.url+'/formulas/'),
      {initialValue:[],injector:this.injector}
    );
  }
  createMedicamento(data:Medicamentos){
    return firstValueFrom(
      this.http.post(this.url+'/medicamentos/',data)
    )
  }
  createFormula(data:Formulas){
    return firstValueFrom(
      this.http.post(this.url+'/formulas/',data)
    )
  }
  createPedido(data:Pedidos){
    return firstValueFrom(
      this.http.post(this.url+'/pedidos/',data)
    )
  }
  updatePedido(data:Pedidos,id:number){
    return firstValueFrom(
      this.http.put(this.url+`/pedidos/${id}/recibido`,data)
    )
  }
  updateFormula(data:Formulas,id:number){
    return firstValueFrom(
      this.http.put(this.url+`/formulas/${id}/estado`,data)
    )
  }
}
