import { Component, OnInit } from '@angular/core';
import { Ejercicio } from '../../../models/ejercicio.models';
import { EjercicioService } from '../../../services/ejercicio.service';
import { UsuarioService } from '../../../services/usuario.service';
import { environment } from '../../../../environments/environment.prod';
import Swal from 'sweetalert2';
import 'animate.css';
import { ActivatedRoute, Router } from '@angular/router';
import { RutinaService } from '../../../services/rutinas.service';
import { FormBuilder } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';



@Component({
  selector: 'app-rutina',
  templateUrl: './rutina.component.html',
  styleUrls: ['./rutina.component.css']
})
export class RutinaComponent implements OnInit {

  public valor = 'nuevo';
  public loading = true;
  public categoria ='Cabeza';
  public ejer ='';
  private uid: string = '';
  public aux: Ejercicio;
  public aux2: String;
  private formSubmited = false;
  public showOKP: boolean = false;

  public totalEjercicios = 0;
  public posicionactual = 0;
  public registrosporpagina = environment.registros_por_pagina;

  //private ultimaBusqueda = '';
  public listaEjercicios: string[] = [];
  public listaEjerciciosExacto: string[] = [];

  public listaUsuarios: Usuario[] = [];
  public ejerpillado: Ejercicio[] = [];
  public ejerpilladostring: string[] = [];
  public ejercicioarray: {ejercicio:string, repeticiones:number}[]= [];
  public repeticionesarray: string[]=[];


  public datosForm = this.fb.group({
    uid: [{value: 'nuevo', disabled: true}],
    nombre: [''],
    descripcion: [''],
    //imagen: [''],
    ejercicios: [''],
    //repeticiones : ['1']
    //fisio_asignado: [''],
  });

  constructor(private fb: FormBuilder,
    private rutinaService: RutinaService,
    private route: ActivatedRoute,
    private router: Router,
    private EjercicioService: EjercicioService,
    private UsuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.cargarEjercicios();
    this.cambio('Cabeza');
    this.uid = this.route.snapshot.params['uid'];
    this.datosForm.get('uid').setValue(this.uid);
    if (this.uid !== 'nuevo') {
      this.valor = 'viejo';
      this.rutinaService.obtenerRutina(this.uid)
        .subscribe( res => {
          if (!res['rutinas']) {
            this.router.navigateByUrl('/fisio/rutinas');
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

  cargarEjercicios(){
    this.loading = true;
    this.EjercicioService.cargarEjerciciosNoPag()
      .subscribe( res => {
          this.listaEjercicios = res['ejercicios'];
          this.loading = false;
          this.cambio('Cabeza');
      }, (err) => {
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
        this.loading = false;
      });
  }

  cambio(parte){
    this.categoria=parte;

    this.listaEjerciciosExacto = [];

    for(var i in this.listaEjercicios){

      if(JSON.stringify(this.listaEjercicios[i]).split('"tipo":["')[1].split('"],"subtipo"')[0]==this.categoria || JSON.stringify(this.listaEjercicios[i]).split('"subtipo":["')[1].split('"],"nombre"')[0]==this.categoria){
        this.listaEjerciciosExacto.push(this.listaEjercicios[i]);
      }
    }

  }


  nuevo(): void {
    this.formSubmited = false;
    this.datosForm.reset();
    this.showOKP = false;
    this.datosForm.get('uid').setValue('nuevo');
    // this.enablepass = true;
    this.router.navigateByUrl('/fisio/rutinas/rutina/nuevo');
  }

  esnuevo(): boolean {
    if (this.datosForm.get('uid').value==='nuevo') return true;
    return false;
  }

  cargaDatosForm( res: any): void {
    this.datosForm.get('uid').setValue(res['rutinas'].uid);
    this.datosForm.get('nombre').setValue(res['rutinas'].nombre);
    this.datosForm.get('descripcion').setValue(res['rutinas'].descripcion);
    this.datosForm.get('ejercicios').setValue(res['rutinas'].ejercicios);


    for(var i=0;i<res['rutinas'].ejercicios.length;i++){
      this.ejerpillado.push(res['rutinas'].ejercicios[i].ejercicio);
      this.ejerpilladostring.push(res['rutinas'].ejercicios[i].ejercicio._id);

      this.repeticionesarray.push(res['rutinas'].ejercicios[i].repeticiones);

    }
    //this.datosForm.get('repeticiones').setValue(res['rutinas'].ejercicio.repeticiones);
    //this.datosForm.get('fisio_asignado').setValue(res['rutinas'].fisio_asignado);
    this.datosForm.markAsPristine();
  }

  cancelar(): void {
    // Si estamos creando uno nuevo, vamos a la lista
    if (this.datosForm.get('uid').value === 'nuevo') {
      this.router.navigateByUrl('/fisio/rutinas');
      return;
    } else {
      this.rutinaService.obtenerRutina(this.datosForm.get('uid').value)
      .subscribe( res => {
        // Si al tratar de cargar de nuevo los datos no hay, vamos a lista
        if (!res['rutinas']) {
          this.router.navigateByUrl('/fisio/rutinas');
          return;
        };
        // Restablecemos los datos del formulario en el formulario
        this.cargaDatosForm(res);
      }, (err) => {
        this.router.navigateByUrl('/fisio/rutinas');
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
      });
    }
  }

  rutimg(ejercicio){
    Swal.fire({
      imageUrl: this.crearImagenUrl(ejercicio.subtipo),
      title: ejercicio.nombre,
      text: ejercicio.descripcion,
      showConfirmButton: true
    })
  }

  enviar(): void {
    var valido= true;



    if(this.ejerpilladostring.length>10){
      Swal.fire({
        icon: 'error',
        title: 'La rutina debe tener 10 ejercicios como máximo',
        showConfirmButton: true
      })
    }


    else if(this.datosForm.get('nombre').value == '' || this.datosForm.get('descripcion').value == ''){
      Swal.fire({
        icon: 'error',
        title: 'La rutina debe tener nombre y descripción',
        showConfirmButton: true
      })
    }



    else{
      this.formSubmited = true;
      if (this.datosForm.invalid) { return; }


      //Meter repeticiones

        for(var j=0;j<this.ejerpilladostring.length;j++){
          this.repeticionesarray[j]= (<HTMLInputElement>document.getElementById("repeticionesinput"+j)).value;
        }

        for(var i=0;i<this.repeticionesarray.length;i++){

          if(parseInt(this.repeticionesarray[i])<1 || parseInt(this.repeticionesarray[i])>10){
            valido=false;
          }
        }

        //Ver si las repeticiones son correctas

        if(valido==false){
          Swal.fire({
            icon: 'error',
            title: 'Las repeticiones de los ejercicios son incorrectos, sólo válidos entre 1 y 10',
            showConfirmButton: true
          })
        }


        else{


          //Meter ejercicios

          for(var i=0;i<this.ejerpilladostring.length;i++){
            this.ejercicioarray.push({ejercicio: this.ejerpilladostring[i], repeticiones:parseInt(this.repeticionesarray[i])});
          }

          this.datosForm.get('ejercicios').setValue(this.ejercicioarray);

          //NUEVO
          if (this.datosForm.get('uid').value === 'nuevo') {
            this.rutinaService.nuevaRutina( this.datosForm.value ).subscribe( res => {
              this.datosForm.markAsPristine();

              Swal.fire({
                icon: 'success',
                title: 'Rutina creada',
                showConfirmButton: false,
                timer: 2000
              })
              this.router.navigateByUrl('/fisio/rutinas');


          }, (err) => {
            const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
            Swal.fire({icon: 'error', title: 'Oops...', text: errtext,});
            return;
          });
        }



        //ACTUALIZAR

        else {

          this.rutinaService.actualizarRutina( this.datosForm.get('uid').value, this.datosForm.value )
            .subscribe( res => {
              this.datosForm.markAsPristine();

              Swal.fire({
                icon: 'success',
                title: 'Rutina actualizado correctamente',
                showConfirmButton: false,
                timer: 2000
              })
              this.router.navigateByUrl('/fisio/rutinas');

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


  anadirEjercicio(eje){
    var jso;
    var bool=true;
    for(var i=0;i<this.ejerpilladostring.length;i++){
      if(this.ejerpilladostring[i]==eje.uid){
        bool=false;
      }
    }
    if(bool){
      this.ejerpillado.push(eje);
      //mongoose.Types.ObjectID.fromString(eje.uid);
      this.ejerpilladostring.push(eje.uid);
      this.repeticionesarray.push("1");
    }
    this.datosForm.get('ejercicios').setValue(this.ejerpilladostring);
    jso = Object.values(this.datosForm.get('ejercicios').value);
  }

  quitarEjercicio(eje){

    var jso;
    for(var i=0;i<this.ejerpillado.length;i++){
      if(this.ejerpillado[i]==eje){
        this.ejerpillado.splice(i,1);
      }
    }
    for(var i=0;i<this.ejerpilladostring.length;i++){

      if(this.ejerpilladostring[i]==eje.uid || this.ejerpilladostring[i]==eje._id){
        this.ejerpilladostring.splice(i,1);
        this.repeticionesarray.splice(i,1);
      }
    }
    this.datosForm.get('ejercicios').setValue(this.ejerpilladostring);
    jso = Object.values(this.datosForm.get('ejercicios').value);
  }

  arriba(eje,inde){
    var pasa=false;
    var pasa2=false;
    var pasa3=false;

    for(var i=0;i<this.ejerpillado.length;i++){
      if(this.ejerpillado[i]==eje && this.ejerpillado[i-1]!=null && pasa!=true){
        this.aux=this.ejerpillado[i-1];
        this.ejerpillado[i-1]=eje;
        this.ejerpillado[i] =this.aux;
        pasa=true;
      }
    }

    for(var i=0;i<this.repeticionesarray.length;i++){
      if(i==inde && this.repeticionesarray[i-1]!=null && pasa3!=true){
        this.aux2=this.repeticionesarray[i-1];
        this.repeticionesarray[i-1]=this.repeticionesarray[i];
        this.repeticionesarray[i] =this.aux2.toString();
        pasa3=true;
      }
    }

    for(var i=0;i<this.ejerpilladostring.length;i++){
      if(this.ejerpilladostring[i]==eje.uid && this.ejerpilladostring[i-1]!=null && pasa2!=true){
        this.aux2=this.ejerpilladostring[i-1];
        this.ejerpilladostring[i-1]=eje.uid;
        this.ejerpilladostring[i] = this.aux2.toString();
        pasa2=true;

      }
      if(this.ejerpilladostring[i]==eje._id && this.ejerpilladostring[i-1]!=null && pasa2!=true){
        this.aux2=this.ejerpilladostring[i-1];
        this.ejerpilladostring[i-1]=eje._id;
        this.ejerpilladostring[i] = this.aux2.toString();
        pasa2=true;

      }
    }
  }

  abajo(eje,inde){
    var pasa=false;
    var pasa2=false;
    var pasa3=false;

    for(var i=0;i<this.ejerpillado.length;i++){
      if(this.ejerpillado[i]==eje && this.ejerpillado[i+1]!=null && pasa!=true){
        this.aux=this.ejerpillado[i+1];
        this.ejerpillado[i+1]=eje;
        this.ejerpillado[i] =this.aux;
        pasa=true;
      }
    }

    for(var i=0;i<this.repeticionesarray.length;i++){
      if(i==inde && this.repeticionesarray[i+1]!=null && pasa3!=true){
        this.aux2=this.repeticionesarray[i+1];
        this.repeticionesarray[i+1]=this.repeticionesarray[i];
        this.repeticionesarray[i] =this.aux2.toString();
        pasa3=true;
      }
    }


    for(var i=0;i<this.ejerpilladostring.length;i++){
      if(this.ejerpilladostring[i]==eje.uid && this.ejerpilladostring[i+1]!=null && pasa2!=true){
        this.aux2=this.ejerpilladostring[i+1];
        this.ejerpilladostring[i+1]=eje.uid;
        this.ejerpilladostring[i] = this.aux2.toString();
        pasa2=true;
      }
      if(this.ejerpilladostring[i]==eje._id && this.ejerpilladostring[i+1]!=null && pasa2!=true){
        this.aux2=this.ejerpilladostring[i+1];
        this.ejerpilladostring[i+1]=eje._id;
        this.ejerpilladostring[i] = this.aux2.toString();
        pasa2=true;
      }
    }
  }

  crearImagenUrl(imagen: string) {
    let ret= "../../../../assets/images/ImagesEjercicio/"+imagen+".png";
    return ret;
  }
}



