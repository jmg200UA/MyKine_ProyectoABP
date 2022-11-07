import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { ClienteService } from '../../services/cliente.service';

import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.css']
})
export class RecoveryComponent implements OnInit {

  private formSubmited = false;
  private uid: string = '';
  //public enablepass: boolean = true;
  public showOKP: boolean = false;

  public datosForm = this.fb.group({
     password: ['', Validators.required ],
     password2: ['', Validators.required ],
  });

  constructor(private fb: FormBuilder,
    private clienteService: ClienteService,
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router) { }

ngOnInit(): void {
//document.getElementById("chatbot").hidden = false;
this.uid = this.route.snapshot.params['uid'];
}


enviar(){
  const data = {
    nuevopassword: this.datosForm.get('password').value,
    nuevopassword2: this.datosForm.get('password').value
  };
  this.clienteService.reestablecerPassword( this.uid, data)
    .subscribe(res => {
     this.datosForm.markAsPristine();

     Swal.fire({
     icon: 'success',
     title: 'Nueva contraseña guardada',
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
