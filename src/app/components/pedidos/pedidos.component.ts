import { Component, inject, OnInit, Signal } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { Pedidos } from '../../interfaces/pedidos.interface';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServidorService } from '../../services/servidor.service';
import { take } from 'rxjs';
import Swal from 'sweetalert2';
import { Medicamentos } from '../../interfaces/medicamentos.interface';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css'
})
export default class PedidosComponent implements OnInit {
  private storage = inject(StorageService);
  pedidos!:Signal<Pedidos[]>;
  medicamentos!:Signal<Medicamentos[]>;
  private formBuilder = inject(FormBuilder);
  private servidor = inject(ServidorService);
  formPedidos = this.formBuilder.nonNullable.group({
    solicitante:['',Validators.required],
    medicamento_id:['',[Validators.required, Validators.pattern('^[0-9]*$'),Validators.min(1)]],
    cantidad:['',[Validators.required, Validators.pattern('^[0-9]*$'),Validators.min(1)]]
  });

  ngOnInit(): void {
    this.pedidos = this.storage.pedidosSignal;
    this.medicamentos = this.storage.medicamentosSignal;
    const medicamento_id = this.storage.medicamentosSignal()[0];

    !!medicamento_id && this.formPedidos.get('medicamento_id')?.setValue('1');
  }

  savePedido() {
    if(this.formPedidos.valid){
      const formValue = this.formPedidos.getRawValue();
      const pedido : Pedidos = {
        solicitante: formValue.solicitante,
        medicamento_id: +formValue.medicamento_id,
        cantidad: +formValue.cantidad,
      };
      this.servidor.createPedido(pedido).pipe(take(1)).subscribe({
        next:(res:any)=>{
          console.log(res.pedido);
          const medicamento = this.medicamentos().find((e)=> e.id == res.pedido.medicamento_id)?.nombre;
          res.pedido.medicamento ={
            nombre:medicamento,
            id:res.pedido.medicamento_id
          }
          this.pedidos().push(res.pedido);
          Swal.fire({
            icon: 'success',
            text: res.message
          });
          this.formPedidos.reset();
          this.formPedidos.get('medicamento_id')?.setValue('1');
        },
        error:(err)=>{
          Swal.fire({
            icon: 'error',
            text: err.error.detail
          });
          console.log(err);
        }
      });
    }
    else{
      Swal.fire({
        title: 'Tiene Campos vacios o invalidos',
        icon: 'error'
      })
    }
  }
  updatePedido(data:Pedidos){
    this.servidor.updatePedido(data).pipe(take(1)).subscribe({
      next:(res:any)=>{
        Swal.fire({
          icon: 'success',
          text: res.message
        });
        const estado = this.pedidos().find(e =>e.id === data.id);
        !!estado?.estado && (estado['estado'] = 'Recibido');
        const dataMedicamento = this.medicamentos().find(e=> e.id == data.medicamento?.id);
        !!dataMedicamento && (dataMedicamento.existencia+=data.cantidad);
        console.log();
      },
      error:(err)=>{
        Swal.fire({
          icon: 'error',
          text: err.error.error
        });
        console.log(err);
      }
    });
  };
}
