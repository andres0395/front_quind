import { Component, inject, OnInit, Signal } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServidorService } from '../../services/servidor.service';
import { take } from 'rxjs';
import Swal from 'sweetalert2';
import { Medicamentos } from '../../interfaces/medicamentos.interface';
import { Formulas } from '../../interfaces/formulas.interface';
@Component({
  selector: 'app-formulas',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './formulas.component.html',
  styleUrl: './formulas.component.css'
})
export default class FormulasComponent implements OnInit {
  private storage = inject(StorageService);
  formulas!:Signal<Formulas[]>;
  medicamentos!:Signal<Medicamentos[]>;
  private formBuilder = inject(FormBuilder);
  private servidor = inject(ServidorService);
  formFormula = this.formBuilder.nonNullable.group({
    solicitante:['',Validators.required],
    medicamento_id:['',[Validators.required, Validators.pattern('^[0-9]*$'),Validators.min(1)]],
    cantidad:['',[Validators.required, Validators.pattern('^[0-9]*$'),Validators.min(1)]]
  });

  ngOnInit(): void {
    this.formulas = this.storage.formulasSignal;
    this.medicamentos = this.storage.medicamentosSignal;
    const medicamento_id = this.storage.medicamentosSignal()[0];
    !!medicamento_id && this.formFormula.get('medicamento_id')?.setValue('1');
    console.log(this.formulas());
  }

  saveFormula() {
    if(this.formFormula.valid){
      const formValue = this.formFormula.getRawValue();
      const formula : Formulas = {
        nombre: formValue.solicitante,
        medicamento_id: +formValue.medicamento_id,
        cantidad: +formValue.cantidad,
      };
      this.servidor.createFormula(formula).pipe(take(1)).subscribe({
        next:(res:any)=>{
          const medicamento = this.medicamentos().find((e)=> e.id == res.formula.medicamento_id)?.nombre;
          res.formula.medicamento ={
            nombre:medicamento,
            id:res.formula.medicamento_id
          }
          console.log(res.formula);
          this.formulas().push(res.formula);
          Swal.fire({
            icon: 'success',
            text: res.message
          });
          this.formFormula.reset();
          this.formFormula.get('medicamento_id')?.setValue('1');
          const dataMedicamento = this.medicamentos().find(e=> e.id == res.formula.medicamento_id);
          !!dataMedicamento && (dataMedicamento.existencia-=res.formula.cantidad);
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
  updateFormula(data:Formulas, event:any){
    console.log(data);
    console.log(event.value);
    const obj = {
      estado:event.value
    }
    this.servidor.updateFormula(obj,data.id).pipe(take(1)).subscribe({
      next:(res:any)=>{
        Swal.fire({
          icon: 'success',
          text: res.message
        });
        const estado = this.formulas().find(e =>e.id === data.id);
        !!estado?.estado && (estado['estado'] = event.value);
      },
      error:(err)=>{
        Swal.fire({
          icon: 'error',
          text: err.error.detail[0].msg
        });
        console.log(err);
      }
    });
  };
}
