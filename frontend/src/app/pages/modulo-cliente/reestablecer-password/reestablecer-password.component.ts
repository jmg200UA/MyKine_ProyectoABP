import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario.service';
import { ClienteService } from '../../../services/cliente.service';

import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reestablecer-password',
  templateUrl: './reestablecer-password.component.html',
  styleUrls: ['./reestablecer-password.component.css']
})
export class ReestablecerPasswordComponent implements OnInit {

  private formSubmited = false;
  private uid: string = '';
  //public enablepass: boolean = true;
  public showOKP: boolean = false;

  public datosForm = this.fb.group({
     nombre_apellidos: ['', Validators.required ],
     password: ['', Validators.required ],
     password2: ['', Validators.required ],
  });

  // public nuevoPassword = this.fb.group({
  //   password: ['', Validators.required],
  // });

  constructor(private fb: FormBuilder,
              private clienteService: ClienteService,
              private usuarioService: UsuarioService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    // document.getElementById("chatbot").hidden = false;
    this.uid = this.route.snapshot.params['uid'];
  }




  // enviar(): void {
  //   this.formSubmited = true;
  //   if (this.datosForm.invalid) { return; }
  //   // DIFERENCIAR ENTRE RECIEN REGISTRADO Y RECUPERAR CONTRASEÑA
  //   if (this/*.esnuevo()*/) {
  //     this.clienteService.nuevoCliente( this.datosForm.value )
  //       .subscribe( res => {
  //         this.datosForm.markAsPristine();

  //         Swal.fire({
  //           icon: 'success',
  //           title: 'Cliente creado',
  //           showConfirmButton: false,
  //           timer: 2000
  //         })
  //         this.router.navigateByUrl('/fisio/clientes');

  //       }, (err) => {
  //         const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
  //         Swal.fire({icon: 'error', title: 'Oops...', text: errtext,});
  //         return;
  //       });
  //   } else {
  //     // actualizar el usuario
  //     this.clienteService.actualizarCliente( this.uid, this.datosForm.value )
  //       .subscribe( res => {
  //         this.datosForm.markAsPristine();

  //         Swal.fire({
  //           icon: 'success',
  //           title: 'Cliente actualizado',
  //           showConfirmButton: false,
  //           timer: 2000
  //         })
  //         this.router.navigateByUrl('/fisio/clientes');

  //       }, (err) => {
  //         const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
  //         Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
  //         return;
  //       });
  //   }

  // }

   enviar(){
     const data = {
      nombre_apellidos : this.datosForm.get('nombre_apellidos').value,
       nuevopassword: this.datosForm.get('password').value,
       nuevopassword2: this.datosForm.get('password2').value
     };
     this.clienteService.establecerPassword( this.uid, data)
       .subscribe(res => {
        this.datosForm.markAsPristine();

        Swal.fire({
        icon: 'success',
        title: 'Cliente actualizado',
        showConfirmButton: false,
        timer: 2000
        })
        this.router.navigateByUrl('/casa'); //para redireccionar al landing por defecto
         this.showOKP = true;
    }, (err)=>{
         const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
         Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
         return;
       });
   }

  campoNoValido( campo: string) {
    return this.datosForm.get(campo).invalid && this.formSubmited;
  }

}
