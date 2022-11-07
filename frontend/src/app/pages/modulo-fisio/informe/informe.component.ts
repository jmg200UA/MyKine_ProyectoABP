import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InformeService } from '../../../services/informe.service';
import { UsuarioService } from '../../../services/usuario.service';
import { Cliente } from '../../../models/cliente.model';
import { Informe } from '../../../models/informe.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-informe',
  templateUrl: './informe.component.html',
  styleUrls: ['./informe.component.css']
})
export class InformeComponent implements OnInit {

  private formSubmited = false;
  private uid: string = '';
  public enablepass: boolean = true;
  public showOKP: boolean = false;

  public valor = 'nuevo';
  public listaClientes: Cliente[] = [];
  public listaInformes: Informe[] = [];

  public loading = true;

  public datosForm = this.fb.group({
    uid: [{value: 'nuevo', disabled: true}],
    titulo: [''],
    cliente_asociado: [''],
    contenido: [''],
  });

  constructor(private fb: FormBuilder,
              private informeService: InformeService,
              private route: ActivatedRoute,
              private router: Router,
              private ususuarioService: UsuarioService) { }



  ngOnInit(): void {

    this.cargarListaClientes();

    // recogemos el parametro
    this.uid = this.route.snapshot.params['uid'];
    this.datosForm.get('uid').setValue(this.uid);
    if (this.uid !== 'nuevo') {
      this.valor='viejo';
      this.informeService.obtenerInforme(this.uid)
        .subscribe( res => {
          if (!res['informes']) {
            this.router.navigateByUrl('/fisio/informes');
            return;
          };
          this.cargaDatosForm(res);
        }, (err) => {
          // this.router.navigateByUrl('/fisio/informes');
          // Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
          // return;
        });
    }

  }

  //Aqui va la funcion cargarListaClientes del fisio
  cargarListaClientes(){
    this.ususuarioService.cargarListaClientes()
      .subscribe( res => {

        this.listaClientes = res['clientes'];
      }, (err) => {
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
        this.loading = false;
      });
  }

  //METODO PARA REDIRECCIONAR SI ES UN NUEVO INFORME
  nuevo(): void {
    this.formSubmited = false;
    this.datosForm.reset();
    this.showOKP = false;
    this.datosForm.get('uid').setValue('nuevo');
    // this.enablepass = true;
    this.router.navigateByUrl('/fisio/informes/informe/nuevo');
  }

  esnuevo(): boolean {
    if (this.datosForm.get('uid').value==='nuevo') return true;
    return false;
  }

  cargaDatosForm( res: any): void {
    this.datosForm.get('uid').setValue(res['informes'].uid);
    this.datosForm.get('titulo').setValue(res['informes'].titulo);
    this.datosForm.get('cliente_asociado').setValue(res['informes'].cliente_asociado);
    this.datosForm.get('contenido').setValue(res['informes'].contenido);
    this.datosForm.markAsPristine();
  }

  cancelar(): void {
    // Si estamos creando uno nuevo, vamos a la lista
    if (this.datosForm.get('uid').value === 'nuevo') {
      this.router.navigateByUrl('/fisio/informes');
      return;
    } else {
      this.informeService.obtenerInforme(this.datosForm.get('uid').value)
      .subscribe( res => {
        // Si al tratar de cargar de nuevo los datos no hay, vamos a lista
        if (!res['informes']) {
          this.router.navigateByUrl('/fisio/informes');
          return;
        };
        // Restablecemos los datos del formulario en el formulario
        this.cargaDatosForm(res);
      }, (err) => {
        this.router.navigateByUrl('/fisio/informes');
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
      });
    }
  }

  enviar(): void {
    this.formSubmited = true;
    if (this.datosForm.invalid) { return; }
    if (this.datosForm.get('uid').value === 'nuevo') {
    this.informeService.nuevoInforme( this.datosForm.value ).subscribe( res => {
       this.datosForm.markAsPristine();

       Swal.fire({
         icon: 'success',
         title: 'Informe creado',
         showConfirmButton: false,
         timer: 2000
       })
       this.router.navigateByUrl('/fisio/informes');

     }, (err) => {
       const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
       Swal.fire({icon: 'error', title: 'Oops...', text: errtext,});
       return;
     });
    } else {
      // actualizar el usuario
      this.informeService.actualizarInforme( this.datosForm.get('uid').value, this.datosForm.value )
        .subscribe( res => {
          this.datosForm.markAsPristine();

          Swal.fire({
            icon: 'success',
            title: 'Informe actualizado correctamente',
            showConfirmButton: false,
            timer: 2000
          })
          this.router.navigateByUrl('/fisio/informes');

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

}
