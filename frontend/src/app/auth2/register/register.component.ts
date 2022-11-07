import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PlacesService } from 'src/app/services/places.service';
import {Feature} from 'mapbox-gl';
import { Properties } from '../../interfaces/places';

@Component({
  selector: 'app-register2',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @ViewChild('txtBuscarLoc') txtBuscarLoc!: ElementRef<HTMLInputElement>;

  get isLoadingPlaces(): boolean {
    return this.placesService.isLoadingPlaces;
  }

  get places(): Feature[] {
    return this.placesService.places;
  }


  private debounceTimer?: NodeJS.Timeout;
  private formSubmited = false;

  public ngSelect;
  public nombrePlace: string = '';
  public localizacionEnviar: string = '';

  public datosForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    nombre_apellidos: ['', Validators.required],
    password: ['', Validators.required],
    passwordrepeat: [''],
    localizacion: [''],
    especialidad: [''],
  });

  constructor(private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router,
    private placesService: PlacesService,
    ) { }

  ngOnInit(): void {
  }

  enviar(){
    this.formSubmited = true;
    if (this.datosForm.invalid) { return; }

    // this.datosForm.

    if(this.datosForm.get('password').value != this.datosForm.get('passwordrepeat').value){
      const errtext = 'Las contraseñas no coinciden';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext,});
        return;
    }else{

      this.datosForm.controls['localizacion'].setValue(this.localizacionEnviar);
      this.usuarioService.nuevoUsuarioFisio( this.datosForm.value )
      .subscribe( res => {
        this.datosForm.markAsPristine();

        Swal.fire({
          icon: 'success',
          title: 'Te has registrado correctamente',
          showConfirmButton: false,
          timer: 2000
        })

        this.router.navigateByUrl('/landing');
      }, (err) => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext,});
        return;
      });
    }
  }

  onQueryChanged( query: string = '' ) {

    if ( this.debounceTimer ) clearTimeout( this.debounceTimer );

    this.debounceTimer = setTimeout(() => {
      this.placesService.getPlacesByQuery( query );
    }, 350 );

  }

  esteLugar( place: Feature ) {
    this.nombrePlace = place.place_name_es;
    this.localizacionEnviar = `${place.center[0]},${place.center[1]}`;

    //Pone busqueda a 0
    this.placesService.setPlaces();

  }

  campoNoValido( campo: string) {
    return this.datosForm.get(campo).invalid && this.formSubmited;
  }

}
