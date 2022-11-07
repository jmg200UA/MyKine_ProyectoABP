import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { ClienteService } from '../../../services/cliente.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-perfilcliente',
  templateUrl: './perfilcliente.component.html',
  styleUrls: ['./perfilcliente.component.css']
})
export class PerfilclienteComponent implements OnInit {

  public imagenUrl = '';
  public foto: File = null;
  public subs$: Subscription = new Subscription();
  public sendpass = false;
  public showOKP = false;
  public showOKD = false;
  public fileText = 'Seleccione archivo';

  public clienteperfil; // donde guardaremos la info del cliente para mostrarla

  public datosForm = this.fb.group({
    email: [ {value: '', disabled: true}],
    nombre_apellidos: [{value: '', disabled: true} ],
    imagen: ['']
  });

  public datosPassword = this.fb.group({
    password: ['', Validators.required],
    nuevopassword: ['', Validators.required],
    nuevopassword2: ['', Validators.required],
  })

  constructor(private usuarioService: UsuarioService,
    private clienteService: ClienteService,
    private fb: FormBuilder,
    private router: Router) { }

  ngOnInit(): void {
    this.cargarDatosCliente(); // cargamos los datos del cliente
    //this.cargarCliente(); // cargamos los datos en el fb para mostrarlos
  }

  // Actualizar password cliente ✓
  cambiarPassword(): void {
    this.sendpass = true;
    this.showOKP = false;
    if (this.datosPassword.invalid || this.passwordNoIgual()) { return; }
    this.clienteService.cambiarPassword( this.clienteperfil.uid, this.datosPassword.value ) // cambiar a funcion para el cliente
      .subscribe( res => {
        this.showOKP = true;
        this.datosPassword.markAsPristine();
      }, (err) => {
          const errtext = err.error.msg || 'No se pudo cambiar la contraseña';
          Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
          return;
        });

  }

  // Actualizar datos del cliente ✓
  enviar(): void {
    if (this.datosForm.invalid) { return; }

    // Actualizamos los datos del formulario y si va bien actualizamos foto
    this.clienteService.actualizarCliente( this.clienteperfil.uid, this.datosForm.value )
    .subscribe( res => {
      //this.clienteService.establecerdatos( res['cliente'].nombre_apellidos, res['cliente'].email ); no nos hace falta porque nosotros no tomamos los datos desde ahí

      // Si la actualización de datos ha ido bien, entonces actualizamso foto si hay
      if (this.foto ) {
        this.clienteService.subirFoto( this.clienteperfil.uid, this.foto)
        .subscribe( res => {
          // Cambiamos la foto del navbar, para eso establecemos la imagen (el nombre de archivo) en le servicio
          this.clienteService.establecerimagen(res['nombreArchivo']);
          // cambiamos el DOM el objeto que contiene la foto
          document.getElementById('fotoperfilnavbar').setAttribute('src', this.clienteperfil.imagen);
        }, (err) => {
          const errtext = err.error.msg || 'No se pudo cargar la imagen';
          Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
          return;
        });
      }
      this.fileText = 'Seleccione archivo';
      this.datosForm.markAsPristine(); // marcamos reiniciado de cambios
      this.showOKD = true;
    }, (err) => {
      const errtext = err.error.msg || 'No se pudo guardar los datos';
      Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
    });
  }

  // Precargar la imagen en la vista
  cambioImagen( evento ): void {
    if (evento.target.files && evento.target.files[0]) {
      // Comprobamos si es una imagen jpg, jpet, png
      const extensiones = ['jpeg','jpg','png'];
      const nombre: string = evento.target.files[0].name;
      const nombrecortado: string[] = nombre.split('.');
      const extension = nombrecortado[nombrecortado.length - 1];
      if (!extensiones.includes(extension)) {
        // Si no teniamos ningúna foto ya seleccionada antes, dejamos el campo pristine
        if (this.foto === null) {
          this.datosForm.get('imagen').markAsPristine();
        }
        Swal.fire({icon: 'error', title: 'Oops...', text: 'El archivo debe ser una imagen jpeg, jpg o png'});
        return;
      }

      let reader = new FileReader();
      // cargamos el archivo en la variable foto que servirá para enviarla al servidor
      this.foto = evento.target.files[0];
      // leemos el archivo desde el dispositivo
      reader.readAsDataURL(evento.target.files[0]);
      // y cargamos el archivo en la imagenUrl que es lo que se inserta en el src de la imagen
      reader.onload = (event) => {
        this.imagenUrl = event.target.result.toString();
        this.fileText = nombre;
      };
    } else {

    }
  }

  //funcion para cargar los datos del cliente actual
  cargarDatosCliente():void{
    //llamada al backend para cargar los datos del cliente logueado, gracias a su token
    this.clienteService.cargarClientes(0,'')
      .subscribe( res => {
        this.clienteperfil= res['page']['clientes'];
        this.datosForm.get('nombre_apellidos').setValue(this.clienteperfil.nombre_apellidos);
    this.datosForm.get('email').setValue(this.clienteperfil.email);
    this.datosForm.get('imagen').setValue('');
    this.imagenUrl = this.clienteService.crearImagenUrl(this.clienteperfil.imagen);
    this.foto = null;
    this.fileText = 'Seleccione archivo';
    this.datosForm.markAsPristine();
      }, (err) => {
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
      });
  }


  cancelarPassword() {
    this.sendpass = false;
    this.showOKP = false;
    this.datosPassword.reset();
  }

  campoNoValido( campo: string): boolean {
    return this.datosForm.get(campo).invalid;
  }

  campopNoValido( campo: string): boolean {
    return this.datosPassword.get(campo).invalid && this.sendpass;
  }
  // Comprobar que los campos son iguales
  passwordNoIgual(): boolean {
    return !(this.datosPassword.get('nuevopassword').value === this.datosPassword.get('nuevopassword2').value) && this.sendpass;
  }

}
