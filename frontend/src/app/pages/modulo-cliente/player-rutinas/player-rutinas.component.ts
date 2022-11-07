import { Input, Component, OnInit, OnDestroy } from '@angular/core';
import { RutinaService } from '../../../services/rutinas.service';
import { Ejercicio } from '../../../models/ejercicio.models';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { Rutina } from 'src/app/models/rutina.models';
import { FormBuilder } from '@angular/forms';
import { ClienteService } from '../../../services/cliente.service';
import { UsuarioService } from '../../../services/usuario.service';

declare var main;
declare var animaHombre;
declare var cambiarEntidad;
declare var paremos;

interface RecommendedVoices {
	[key: string]: boolean;
}

declare function iniciarCustom();

@Component({
  selector: 'app-player-rutinas',
  templateUrl: './player-rutinas.component.html',
  styleUrls: ['./player-rutinas.component.css',]
})
export class PlayerRutinasComponent implements OnInit {
  @Input() modeloSeleccionado: string[] = [];
  @Input() posicionActual: number;


  public uid: string = '';
  public nombrerut: string = '';
  public descrut: string = '';
  public loading = true;
  public ejercicioarray: {ejercicio:string, repeticiones:number}[]= []; // array que utilizamos como auxiliar para extraer las repeticiones
  public ejercicios: Ejercicio[]=[]; // array del que sacamos los atributos de los ejercicios
  public ejercicionombre: string[]=[]; //array nombre ejercicios
  public ejerciciosubtipo: string[]=[]; // array de subtipo ejercicios
  public ejerciciodescripcion: string[]=[]; // arrray de descripcion ejercicios
  public ejercicioimagen: string[]=[]; // array de imagenes ejercicios
  public ejerciciorepeticiones: number[]=[]; //array de repeticiones ejercicios

  public sayCommand: string;
	public recommendedVoices: RecommendedVoices;
	public rates: number[];
	public selectedRate: number;
	public selectedVoice: SpeechSynthesisVoice | null;
	public text: string;
	public voices: SpeechSynthesisVoice[];

  public modelo: string[] = [];

  //variables para el reloj del tiempo de la rutina

  public counter: number;
  public timerRef;
  public running: boolean = false;
  minutes: any = '00';
  seconds: any = '00';
  milliseconds: any = '00';

  //variable para saber el num de ejercicios
  numejercicios:number;

  //variable fin ultimo ejercicio
  fin:boolean;

  //variable para saber en que ejercicio estamos
  public posactual:number=0;

  //variable para saber si el el habla está activa
  public habla: boolean= false; // booleano para descripciones ejercicios
  public habla2: boolean= false; // booleano para descripción rutina

  //variable para saber si el player está en play o en pause
  public play: boolean=true;

  //para poder mandar el tiempo que se ha tardado en hacer una rutina, para actualizar los datos de esta
  public data = this.fb.group({
    tiempo: [0],
  });

  public datavaloracion = this.fb.group({
    valoracion: [0],
    idfisio: [''],
    idcliente: ['']
  });

  public clienteperfil; //para guardar los datos del cliente cargado
  public idcliente; // para guardar el ID del cliente
  public valoracion; // para guardar la valoracion del cliente a su fisio
  public idfisio; // id del fisio de la rutina


  constructor(private fb: FormBuilder,
              private rutinaService: RutinaService,
              private route: ActivatedRoute,
              private clienteService: ClienteService,
              private usuarioService: UsuarioService,
              private router: Router) { }

  ngOnInit(): void {
    new main();

    iniciarCustom();
    // document.getElementById("chatbot").hidden = false;
    this.uid = this.route.snapshot.params['uid'];
    this.cargarRutina();
    this.cargarRutina2();
    this.cargarDatosCliente();
    // this.obtenerFisioCliente();


    //llamada funcion reloj tiempo
    this.running=true; //ponemos a true por defecto el contador para que empiece a contar al entrar a la rutina
    this.startTimer();



    // Inicializamos las variables para la voz
    this.voices = [];
		this.rates = [ .25, .5, .75, 1, 1.25, 1.5, 1.75, 2 ];
		this.selectedVoice = null;
		this.selectedRate = 1;
		this.text = "Textito de prueba";
		this.sayCommand = "";


    this.voices = speechSynthesis.getVoices();
		this.selectedVoice = ( this.voices[ 0 ] || null );
		this.updateSayCommand();

		// Si no hay voces cogemos la primera por defecto
		if ( ! this.voices.length ) {
			speechSynthesis.addEventListener(
				"voiceschanged",
				() => {
					this.voices = speechSynthesis.getVoices();
					this.selectedVoice = ( this.voices[ 0 ] || null );
					this.updateSayCommand();
				}
			);
		}
  }

  ngOnChanges(): void {
    new cambiarEntidad(this.modeloSeleccionado[this.posicionActual]);
  }

  ngOnDestroy(){
    //limpiamos el intervalo de tiempo del cronometro
    clearInterval(this.timerRef);
  }

  startTimer() {
    if (this.running) {
      const startTime = Date.now() - (this.counter || 0);
      this.timerRef = setInterval(() => {
        this.counter = Date.now() - startTime;
        this.milliseconds = Math.floor(Math.floor(this.counter % 1000) / 10).toFixed(0);
        this.minutes = Math.floor(this.counter / 60000);
        this.seconds = Math.floor(Math.floor(this.counter % 60000) / 1000).toFixed(0);
        if (Number(this.minutes) < 10) {
          this.minutes = '0' + this.minutes;
        } else {
          this.minutes = '' + this.minutes;
        }
        if (Number(this.milliseconds) < 10) {
          this.milliseconds = '0' + this.milliseconds;
        } else {
          this.milliseconds = '' + this.milliseconds;
        }
        if (Number(this.seconds) < 10) {
          this.seconds = '0' + this.seconds;
        } else {
          this.seconds = '' + this.seconds;
        }
      });
    } else {
      clearInterval(this.timerRef);
    }
  }

  //funcion para cargar los datos del cliente actual, de aqui pillaremos su ID
  cargarDatosCliente():void{
    //llamada al backend para cargar los datos del cliente logueado, gracias a su token
    this.clienteService.cargarClientes(0,'') // mandamos los parametros desde y paginacion vacios porque solo queremos el cliente
      .subscribe( res => {
        this.idcliente= res['page']['clientes'].uid;
        this.cargarFisioRutina();
      }, (err) => {
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
      });
  }

  //funcion para cargar fisio por la rutina
  cargarFisioRutina():void{
    this.rutinaService.obtenerFisioRutina(this.uid)
      .subscribe( res => {
        this.valoracion= res['valoracion'];
        this.idfisio=res['fisio'].uid;
      }, (err) => {
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
      });
  }

  obtenerFisioCliente(){ // para cargar los datos del cliente en la lista del fisio
    //cargar cliente
    this.usuarioService.cargarCliente(this.idcliente)
    .subscribe( res => {
    }, (err) => {
      Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
      this.loading = false;
    });
  }

  cargarRutina(){ // PARA OBTENER LOS EJERCICIOS DE LA RUTINA
      this.loading = true;
      this.rutinaService.obtenerEjerciciosRutina(this.uid)
        .subscribe( res => {
          if (res['ejerciciosRutina'].length === 0) {
           this.loading = false;
          }
          this.ejercicios = res['ejerciciosRutina'];

          this.ejercicios.forEach( ej => {
            this.modelo.push( ej.subtipo[0] )
          } );

          for(var i=0; i<this.ejercicios.length;i++){
            this.ejercicionombre.push(this.ejercicios[i].nombre);
            this.ejerciciosubtipo.push(this.ejercicios[i].subtipo[0]);
            this.ejerciciodescripcion.push(this.ejercicios[i].descripcion);
          }
          this.numejercicios=this.ejercicios.length-1;

        }, (err) => {
          Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
          this.loading = false;
        });


  }

  cargarRutina2(){ // PARA OBTENER LA RUTINA
    this.loading = true;
    this.rutinaService.obtenerRutina(this.uid)
    .subscribe( res => {
      if (res['rutinas'].ejercicios.length === 0) {
       this.loading = false;
      }
      this.ejercicioarray = res['rutinas'].ejercicios;
      this.nombrerut = res['rutinas'].nombre;
      this.descrut= res['rutinas'].descripcion;
      for(var i=0; i<this.ejercicioarray.length;i++){
        this.ejerciciorepeticiones.push(this.ejercicioarray[i].repeticiones);
      }


    }, (err) => {
      Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
      this.loading = false;
    });
  }

  crearImagenUrl() {
    let ret= "../../../../assets/images/ImagesEjercicio/"+this.ejerciciosubtipo[this.posactual]+"3.png";
    return ret;
  }

  check(num:number){  // comprobamos si es el primer elemento para poner el checked a true
    if(num==0) return true;
    else return false;

  }

  // Para cambiar de mallas al pulsar
  aux(){
    this.posicionactual(0);
  }

  aux1(){
    this.posicionactual(1);
  }

  auxAnimacion(){
    let segs: number = +this.seconds;

    if(segs%2==0){ // si el numero es par cambiamos para la animacion
    }
  }

  posicionactual(num:number){ //vamos iterando delante o atras segun se le de a next o prev
                              //para saber en que posicion de los ejercicios totales nos encontramos
    if(num==0){
      if(this.posactual==0){
        this.posactual=this.ejerciciodescripcion.length-1;
      }
      else this.posactual=this.posactual-1;
    }
    else{
      if(this.posactual==this.ejerciciodescripcion.length-1){
        this.posactual=0;
      }
      else{
        this.posactual=this.posactual+1;
      }
    }
  }

  prev(num:number){ //comprobamos cual es el elemento anterior para el valor del label

    //para comprobar si se esta hablando o no y actualizar el booleano
    if(this.habla==true){ //comprobar si el booleano para descs ejercicios esta a true
      if (!speechSynthesis.speaking) this.habla=false;
    }
    if(this.habla2==true){ //comprobar si el booleano para desc rutina esta a true
      if (!speechSynthesis.speaking) this.habla2=false;
    }

    let dev="slide-";
    let numdev="";
    let num2;
    if(num==0){
      num2= this.ejerciciosubtipo.length -1;
      numdev=num2.toString();
    }
    else{
      num2=num-1;
      numdev=num2.toString();
    }
    dev=dev+numdev;
    return dev;

  }

  next(num:number){ //comprobamos cual es el elemento siguiente para el valor del label
    let dev="slide-";
    let numdev="";
    let num2;
    if(num==this.ejerciciosubtipo.length-1){
      numdev="0";
      this.fin=true;
    }
    else{
      num2=num+1;
      numdev=num2.toString();
    }
    dev=dev+numdev;
    return dev;
  }

  //VOZ

  // Este metodo es para probar la voz seleccionada, no nos hace falta en principio
	public demoSelectedVoice() : void {
    // Si no hubiera voz seleccionada, tenemos la primera por defecto
		if ( ! this.selectedVoice ) {
			console.warn( "Se esperaba una voz, pero no se seleccionó ninguna" );
			return;
		}
    // Texto hablado demostración al elegir una voz
		var demoText = "Prueba de voz a elegir";
    //Al darle al Play se para si esta sonando y se empieza a decir el texto
		this.stop(0);
    //llamamos al sintetizador para que convierta el texto a voz
		this.synthesizeSpeechFromText( this.selectedVoice, this.selectedRate, demoText );

	}

  // METODO PARA DARLE AL PLAY DE LA VOZ
	public speak(desc: string, num:number) : void {
    // Si no hay Voz seleccionada y texto para decir no se hace nada
		if ( ! this.selectedVoice || ! this.text ) return;
    // asignar nuevo texto
    this.text = desc;
    //Al darle al Play se para si esta sonando y se empieza a decir el texto
		this.stop(0);
    //llamamos al sintetizador para que convierta el texto a voz
		this.synthesizeSpeechFromText( this.selectedVoice, this.selectedRate, this.text );

    if(num==1) this.habla=true; //play descs ejercicios
    if(num==2) this.habla2=true; //parar desc rutina

	}


	// METODO PARA PARAR LA VOZ
	public stop(num:number) : void {
    // Si esta en Play y le damos a Stop se para
		if ( speechSynthesis.speaking )	speechSynthesis.cancel();
    if(num==1) this.habla=false; //parar descs ejercicios
    if(num==2) this.habla2=false; //parar desc rutina

	}


	// METODO PARA UPDATEAR LA VOZ
	public updateSayCommand() : void {
  // Si no hay Voz seleccionada y texto para decir no se hace nada
		if ( ! this.selectedVoice || ! this.text )	return;

		// Rate es el numero de palabras por minuto para decir el texto
		var sanitizedRate = Math.floor( 200 * this.selectedRate );
		var sanitizedText = this.text
			.replace( /[\r\n]/g, " " )
			.replace( /(["'\\\\/])/g, "\\$1" )
		;

		this.sayCommand = `say --voice ${ this.selectedVoice.name } --rate ${ sanitizedRate } --output-file=demo.aiff "${ sanitizedText }"`;

	}

	// Metodo privado
	// SIntetizador de voz a raiz del texto
	private synthesizeSpeechFromText(
		voice: SpeechSynthesisVoice,
		rate: number,
		text: string
		) : void {

		var utterance = new SpeechSynthesisUtterance( text );
		utterance.voice = this.selectedVoice;
		utterance.rate = rate;

		speechSynthesis.speak( utterance );
	}


  //funcion para guardar datos y finalizar rutina

  finalizarrutina(){
    let segs=0;
    var min: number = +this.minutes;
    var sgs: number = +this.seconds;
    segs= min*60;
    segs=segs+sgs;

    this.data.get('tiempo').setValue(segs)

    Swal.fire({
      title: 'Finalizar rutina',
      text: `¿Seguro que deseas finalizar la rutina?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí'
    }).then((result) => {
          if (result.value) {
            this.rutinaService.finRutina(this.uid,this.data.value)
              .subscribe( resp => {
                Swal.fire({icon: 'success', title: 'Rutina finalizada'});
                if(this.valoracion==0){
                  this.valorarFisio();
                }
                else this.router.navigateByUrl('/cliente/dashboard');
              }
              ,(err) =>{
                Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
                console.warn('error:', err);
              })
          }
      });
  }

  valorarFisio(){ //texto que llamaria a la funcion de valorar fisio

    const items = [];

    for(var i=1;i<11;i++){
      items[i] = { id: i, name: i}
    }

    const inputOptions = new Map;
    items.forEach(item => inputOptions.set(item.id,item.name));

    Swal.fire({ // sacar select con opcion para valorar del 1 al 10
      title: 'Valorar Fisio',
      text: `¿Podrías valorar del 1 al 10 la labor de tu fisio?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      input: 'select',
      inputOptions,
    }).then((result) => {
          if (result.value) {
            this.datavaloracion.get('valoracion').setValue(result.value); // cambiamos el valor de la valoracion al obtenido en la select
            this.funcionValorarFisio();
          }
      });
  }

  funcionValorarFisio(){
    // hacer el set para el valor seleccionado de valoracion
    this.datavaloracion.get('idfisio').setValue(this.idfisio);
    this.datavaloracion.get('idcliente').setValue(this.idcliente);
    this.usuarioService.actualizarValoracionFisio(this.datavaloracion.value)
    .subscribe( res => {
      Swal.fire({icon: 'success', title: 'Gracias por valorar a tu fisio'});
      this.router.navigateByUrl('/cliente/dashboard');
    }, (err) => {
      Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
      this.loading = false;
    });

  }

  volver(){

    Swal.fire({
      title: 'Abandonar rutina',
      text: `¿Seguro que deseas abandonar la rutina?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí'
    }).then((result) => {
          if (result.value) {
            this.router.navigateByUrl('/cliente/dashboard');
          }
      });
  }

  cambioPlayPause(num){
    if(num==0){
      this.play=false;
      this.running=false;
      //this.startTimer();

      new animaHombre(this.modelo[this.posactual]);
    }
    else{
      this.play=true;
      this.running=true;
      //this.startTimer();
      new paremos();

    }
  }

}
