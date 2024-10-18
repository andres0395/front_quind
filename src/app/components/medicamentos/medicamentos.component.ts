import { Component, inject, OnInit, Signal } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { Medicamentos } from '../../interfaces/medicamentos.interface';
import {ReactiveFormsModule,FormBuilder,Validators} from '@angular/forms';
import Swal from 'sweetalert2';
import { ServidorService } from '../../services/servidor.service';
import { take } from 'rxjs';
@Component({
  selector: 'app-medicamentos',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './medicamentos.component.html',
  styleUrl: './medicamentos.component.css'
})
export default class MedicamentosComponent implements OnInit  {

  private storage = inject(StorageService);
  medicamentos!:Signal<Medicamentos[]>;
  private formBuilder = inject(FormBuilder);
  private servidor = inject(ServidorService);
  formMedicamentos = this.formBuilder.nonNullable.group({
    nombre:['',Validators.required],
    gramaje:['',Validators.required],
    existencia:['',[Validators.required, Validators.pattern('^[0-9]*$'),Validators.min(1)]]
  });

  ngOnInit(): void {
    this.medicamentos = this.storage.medicamentosSignal;
  }

  saveMedicamento() {
    if(this.formMedicamentos.valid){
      const formValue = this.formMedicamentos.getRawValue();
      const medicamento: Medicamentos = {
        nombre: formValue.nombre,
        gramaje: formValue.gramaje,
        existencia: +formValue.existencia,
      };
      this.servidor.createMedicamento(medicamento).pipe(take(1)).subscribe({
        next:(res:any)=>{
          this.medicamentos().push(res.medicamento);
          Swal.fire({
            icon: 'success',
            text: res.message
          });
          this.formMedicamentos.reset();
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
}
