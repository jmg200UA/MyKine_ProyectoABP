import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  private formSubmited = false;
  private uid: string = '';
  public enablepass: boolean = true;
  public showOKP: boolean = false;

  public datosForm = this.fb.group({
    email: [ '', [Validators.required, Validators.email] ],
    nombre_apellidos: ['', Validators.required ],
    // apellidos: ['', Validators.required ],
    password: ['', Validators.required ],
    confirmpassword: [''],
  });

  constructor(private fb: FormBuilder,
               private usuarioService: UsuarioService,
               private route: ActivatedRoute,
               private router: Router) { }

  ngOnInit(): void {
  }


  enviar(): void {
    this.formSubmited = true;
    if (this.datosForm.invalid) { return; }

    if(this.datosForm.get('password').value != this.datosForm.get('confirmpassword').value){
      const errtext = 'Las contraseñas no coinciden';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext,});
        return;
    }else{
      this.usuarioService.nuevoUsuarioFisio( this.datosForm.value )
      .subscribe( res => {
        // this.datosForm.get('uid').setValue(res['usuario'].uid);
        //this.datosForm.get('password').disable();
        //this.enablepass = false;
        this.datosForm.markAsPristine();

        Swal.fire({
          // position: 'top-end',
          icon: 'success',
          title: 'Usuario creado correctamente',
          showConfirmButton: false,
          timer: 2000
        })

        this.router.navigateByUrl('/login');
      }, (err) => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext,});
        return;
      });
    }


  }

  campoNoValido( campo: string) {
    return this.datosForm.get(campo).invalid && this.formSubmited;
  }

}
