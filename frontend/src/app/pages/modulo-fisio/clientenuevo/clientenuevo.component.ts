import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario.service';
import { ClienteService } from '../../../services/cliente.service';

import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientenuevo',
  templateUrl: './clientenuevo.component.html',
  styleUrls: ['./clientenuevo.component.css']
})
export class ClientenuevoComponent implements OnInit {

  private formSubmited = false;
  private uid: string = '';
  //public enablepass: boolean = true;
  public showOKP: boolean = false;

  public datosForm = this.fb.group({
    uid: [{value: 'nuevo', disabled: true}, Validators.required],
    email: [ '', [Validators.required, Validators.email] ],
  });


  constructor( private fb: FormBuilder,
               private clienteService: ClienteService,
               private usuarioService: UsuarioService,
               private route: ActivatedRoute,
               private router: Router) { }

  ngOnInit(): void {

  }

  cargaDatosForm( res: any): void {
    this.datosForm.get('uid').setValue(res['clientes'].uid);
    this.datosForm.get('email').setValue(res['clientes'].cliente.email);
    this.datosForm.get('email').disable();
    this.datosForm.markAsPristine();
  }

  cancelar(): void {
      this.router.navigateByUrl('/fisio/clientes');
  }


  enviar(): void {
    this.formSubmited = true;
    if (this.datosForm.invalid) { return; }
      this.clienteService.nuevoCliente( this.datosForm.value )
        .subscribe( res => {
          this.datosForm.markAsPristine();

          Swal.fire({
            icon: 'success',
            title: 'Cliente creado',
            showConfirmButton: false,
            timer: 2000
          })
          this.router.navigateByUrl('/fisio/clientes');

        }, (err) => {
          const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
          Swal.fire({icon: 'error', title: 'Oops...', text: errtext,});
          return;
        });
  }

  campoNoValido( campo: string) {
    return this.datosForm.get(campo).invalid && this.formSubmited;
  }

}
