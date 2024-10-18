import { inject, Injectable, Signal } from '@angular/core';
import { ServidorService } from './servidor.service';
import { Medicamentos } from '../interfaces/medicamentos.interface';
import { Formulas } from '../interfaces/formulas.interface';
import { Pedidos } from '../interfaces/pedidos.interface';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private servidor = inject(ServidorService);
  medicamentosSignal!:Signal<Medicamentos[]>
  formulasSignal!:Signal<Formulas[] >
  pedidosSignal!:Signal<Pedidos[] >

  setInformationData(){
    this.medicamentosSignal = this.servidor.getMedicamentos();
    this.formulasSignal = this.servidor.getFormulas();
    this.pedidosSignal = this.servidor.getPedidos();
  }
}
