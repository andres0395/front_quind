import { Component, effect, inject, Injector, OnInit, Signal } from '@angular/core';
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
  filterMedicamentos:Medicamentos[] = [];
  private formBuilder = inject(FormBuilder);
  private servidor = inject(ServidorService);
  private injector = inject(Injector);
  formMedicamentos = this.formBuilder.nonNullable.group({
    nombre:['',Validators.required],
    gramaje:['',Validators.required],
    existencia:['',[Validators.required, Validators.pattern('^[0-9]*$'),Validators.min(1)]]
  });

  ngOnInit(): void {
    this.medicamentos = this.storage.medicamentosSignal;
    effect(()=>{
      if(this.medicamentos().length){
        this.filterMedicamentos = this.medicamentos();
        console.log(this.medicamentos());
      }
    },{injector:this.injector});
  }

  filterDataMedicamentos(val:any) {
    if(val.value=='Nombre'){
      this.filterMedicamentos.sort((a, b) => a.nombre.toUpperCase().localeCompare(b.nombre.toUpperCase()));
    }
    else if(val.value=='mas'){
      this.filterMedicamentos.sort((a,b)=>b.existencia - a.existencia);
    }
    else if(val.value=='menos'){
      this.filterMedicamentos.sort((a,b)=>a.existencia - b.existencia);
    }
  }

  searchDataMedicamentos(val:any){
    this.filterMedicamentos = this.medicamentos().filter(e=>e.nombre.toUpperCase().includes(val.value.toUpperCase()));
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
