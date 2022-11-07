import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario} from '../../../models/usuario.model';
import Swal from 'sweetalert2';
import { Cliente } from 'src/app/models/cliente.model';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-planmensual',
  templateUrl: './planmensual.component.html',
  styleUrls: ['./planmensual.component.css']
})
export class PlanmensualComponent implements OnInit {

  public datosForm = this.fb.group({
    planMensual: [''],
    tarjeta: [''],
    date: [''],
    cvv:  ['']
  });
  usuario: any; //de momento

  public activo = '';
  public plan = '';

  public listaClientes: Cliente[] = [];
  public listaClientesActivos: Cliente[] = [];
  public listaClientesNoActivos: Cliente[] = [];
  public clientes = 0;

  public listaClientesId: {_id:any}[]= [];
  public listaClientesIdActivos: {_id:any}[]= [];
  public listaClientesIdNoActivos: {_id:any}[]= [];

  private formSubmited = false;

  constructor(private fb: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private ususuarioService: UsuarioService,
              private clienteService: ClienteService ) { }

  ngOnInit(): void {
    this.cargarUsuario2();
    this.cargarClientes();
  }

  cargarUsuario(){
    this.usuario=this.ususuarioService.cargarUsuario(this.ususuarioService.uid);
  }
  cargarClientes(){

    //this.loading = true;

      this.ususuarioService.cargarListaClientes()
          .subscribe( res => {

            this.cargarUsuario();


          this.listaClientes = res['clientes'];


          for(let i=0; i<this.listaClientes.length; i++){
            this.listaClientesId.push({_id:res['clientes'][i]._id});

          }

          for(var i=0;i<this.listaClientes.length;i++){
            if(this.listaClientes[i].activo){
              this.listaClientesActivos.push(this.listaClientes[i]);
            }
          }



          for(let i=0; i<this.listaClientes.length; i++){
            if(res['clientes'][i].activo){
              this.listaClientesIdActivos.push({_id:res['clientes'][i]._id});
            }
          }



          for(var i=0;i<this.listaClientes.length;i++){
            if(!(this.listaClientes[i].activo)){
              this.listaClientesNoActivos.push(this.listaClientes[i]);
            }
          }


          for(let i=0; i<this.listaClientes.length; i++){
            if(!(res['clientes'][i].activo)){
              this.listaClientesIdNoActivos.push({_id:res['clientes'][i]._id});
            }
          }

            }, (err) => {
            Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});

          });
}

  cargarUsuario2(){
    this.ususuarioService.cargarUsuario(this.ususuarioService.uid)
    .subscribe( res => {
    this.activo = res['usuarios'].planMensual;
    this.confirmar(this.activo);

    }, (err) => {
      const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
      Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
      return;
    });
  }

  confirmar(plan){
    this.plan=plan;
  }

  cambiarPlan(plan:string){


    this.cambioactivo(this.activo,plan);

    this.datosForm.get('planMensual').setValue(plan);
    this.ususuarioService.cambiarPlanMensual(  '123' /*un valor para que no de error el put*/,this.datosForm.value)
        .subscribe( res => {
          this.datosForm.markAsPristine();

          Swal.fire({
            icon: 'success',
            title: 'Plan mensual actualizado correctamente',
            showConfirmButton: false,
            timer: 2000
          })
          this.router.navigateByUrl('/fisio/dashboard');

        }, (err) => {
          const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
          Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
          return;
        });
  }

  cambioactivo(planv,plann){


    //Cambio pabajo de clientes

    if((planv=="Estandar" && plann=="Gratis") || (planv=="Premium" && plann=="Gratis")){
      for(var i=this.listaClientesIdActivos.length-1;i>0;i--){
        this.clienteService.cambiarActivoLista(this.listaClientesIdActivos[i]._id).subscribe( res => {
        }, (err) => {
          const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
          Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
          return;
        });
      }
    }

    else if((planv=="Premium" && plann=="Estandar")){
      for(var i=this.listaClientesIdActivos.length-1;i>49;i--){
      this.clienteService.cambiarActivoLista(this.listaClientesIdActivos[i]._id).subscribe( res => {
        }, (err) => {
          const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
          Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
          return;
        });
      }
    }

    //Cambio parriba de clientes

    else if((planv=="Gratis" && plann=="Estandar")){
      if(this.listaClientes.length<=50){
        for(var i=0;i<this.listaClientesIdNoActivos.length;i++){
          this.clienteService.cambiarActivoLista(this.listaClientesIdNoActivos[i]._id).subscribe( res => {
          }, (err) => {
            const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
            Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
            return;
          });
        }
      }
    }

    else if((planv=="Gratis" && plann=="Premium")){
      for(var i=0;i<this.listaClientesIdNoActivos.length;i++){
        this.clienteService.cambiarActivoLista(this.listaClientesIdNoActivos[i]._id).subscribe( res => {
        }, (err) => {
          const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
          Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
          return;
        });
      }
    }

    else if((planv=="Estandar" && plann=="Premium")){
      if(this.listaClientes.length>50){
        for(var i=0;i<this.listaClientesIdNoActivos.length;i++){
          this.clienteService.cambiarActivoLista(this.listaClientesIdNoActivos[i]._id).subscribe( res => {
          }, (err) => {
            const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
            Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
            return;
          });
        }
      }
    }
  }

  campoNoValido( campo: string) {
    return this.datosForm.get(campo).invalid && this.formSubmited;
  }

  enviar(){

  }

}
