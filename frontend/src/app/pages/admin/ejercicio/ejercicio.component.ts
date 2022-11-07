import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EjercicioService } from '../../../services/ejercicio.service';
import { UsuarioService } from '../../../services/usuario.service';
import { Cliente } from '../../../models/cliente.model';
import { Ejercicio } from '../../../models/ejercicio.models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ejercicio',
  templateUrl: './ejercicio.component.html',
  styleUrls: ['./ejercicio.component.css']
})
export class EjercicioComponent implements OnInit {

  public valor = 'nuevo';
  private formSubmited = false;
  private uid: string = '';
  public enablepass: boolean = true;
  public showOKP: boolean = false;
  public tipo : string = '';
  public loading = true;


  public Tipos = ['Cabeza','Brazo','Torso','Pierna'];
  public ListaCabeza = ['Cuello','Cervicales'];
  public ListaTorso = ['Hombro', 'Pecho', 'Abdomen', 'Lumbares', 'Dorsales', 'Pelvis', 'Gluteos'];
  public ListaBrazo = ['Triceps', 'Biceps','Codo', 'Antebrazo','Muñeca', 'Mano'];
  public ListaPierna = ['Isquiotibiales', 'Cuadriceps' ,'Rodilla','Soleo','Gemelos','Tobillo','Pie'];


  public datosForm = this.fb.group({
    uid: [{value: 'nuevo', disabled: true}],
    nombre: [''],
    descripcion: [''],
    //imagen: [''],
    tipo: [''],
    subtipo: [''],
  });

  constructor(private fb: FormBuilder,
              private ejercicioService: EjercicioService,
              private route: ActivatedRoute,
              private router: Router,
              private ususuarioService: UsuarioService) { }

  ngOnInit(): void {
// recogemos el parametro
    this.uid = this.route.snapshot.params['uid'];
    this.datosForm.get('uid').setValue(this.uid);
    if (this.uid !== 'nuevo') {
      this.valor = 'viejo';
      this.ejercicioService.obtenerEjercicio(this.uid)
        .subscribe( res => {
          if (!res['ejercicios']) {
            this.router.navigateByUrl('/admin/ejercicios');
            return;
          };

          this.cargaDatosForm(res);

        }, (err) => {
        });
    }
  }

  //METODO PARA REDIRECCIONAR SI ES UN NUEVO INFORME
  nuevo(): void {
    this.formSubmited = false;
    this.datosForm.reset();
    this.showOKP = false;
    this.datosForm.get('uid').setValue('nuevo');
    // this.enablepass = true;
    this.router.navigateByUrl('/admin/ejercicios/ejercicio/nuevo');
  }

  esnuevo(): boolean {
    if (this.datosForm.get('uid').value==='nuevo') return true;
    return false;
  }

  cargaDatosForm( res: any): void {
    this.datosForm.get('uid').setValue(res['ejercicios'].uid);
    this.datosForm.get('nombre').setValue(res['ejercicios'].nombre);
    this.datosForm.get('descripcion').setValue(res['ejercicios'].descripcion);
    //this.datosForm.get('imagen').setValue(res['ejercicios'].imagen);
    this.datosForm.get('tipo').setValue(res['ejercicios'].tipo[0]);
    this.datosForm.get('subtipo').setValue(res['ejercicios'].subtipo[0]);

    this.datosForm.markAsPristine();
  }

  cancelar(): void {
    // Si estamos creando uno nuevo, vamos a la lista
    if (this.datosForm.get('uid').value === 'nuevo') {
      this.router.navigateByUrl('/admin/ejercicios');
      return;
    } else {
      this.ejercicioService.obtenerEjercicio(this.datosForm.get('uid').value)
      .subscribe( res => {
        // Si al tratar de cargar de nuevo los datos no hay, vamos a lista
        if (!res['ejercicios']) {
          this.router.navigateByUrl('/admin/ejercicios');
          return;
        };
        // Restablecemos los datos del formulario en el formulario
        this.cargaDatosForm(res);
      }, (err) => {
        this.router.navigateByUrl('/admin/ejercicios');
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
      });
    }
  }

  enviar(): void {
    this.formSubmited = true;
    if (this.datosForm.invalid) { return; }
    if (this.datosForm.get('uid').value === 'nuevo') {

    this.ejercicioService.nuevoEjercicio( this.datosForm.value ).subscribe( res => {
       this.datosForm.markAsPristine();

       Swal.fire({
         icon: 'success',
         title: 'Ejercicio creado',
         showConfirmButton: false,
         timer: 2000
       })
       this.router.navigateByUrl('/admin/ejercicios');

     }, (err) => {
       const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
       Swal.fire({icon: 'error', title: 'Oops...', text: errtext,});
       return;
     });
    } else {
      // actualizar el usuario
      this.ejercicioService.actualizarEjercicio( this.datosForm.get('uid').value, this.datosForm.value )
        .subscribe( res => {
          this.datosForm.markAsPristine();

          Swal.fire({
            icon: 'success',
            title: 'Ejercicio actualizado correctamente',
            showConfirmButton: false,
            timer: 2000
          })
          this.router.navigateByUrl('/admin/ejercicios');

        }, (err) => {
          const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
          Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
          return;
        });
    }
  }

  campoNoValido( campo: string) {
    return this.datosForm.get(campo).invalid && this.formSubmited;
  }

  salida(event){
    this.tipo=event.split(": ",2)[1];
  }
}
