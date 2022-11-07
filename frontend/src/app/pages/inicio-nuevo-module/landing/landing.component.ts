import { Component, OnInit,ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario.model';
import { PlacesService } from 'src/app/services/places.service';
import { Feature } from 'src/app/interfaces/places';
import { FisioComponent } from '../fisio/fisio.component';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  @ViewChild(FisioComponent) hijo: FisioComponent;

  //Atributos
  public listaPremiums: Usuario[] = [];
  public listaPremiumsRecomendados: Usuario[] = [];
  public listaPediatria: Usuario[] = [];
  public listaNeurologia: Usuario[] = [];
  public especialidadSeleccionada = '';

  public busquedaForm = this.fb.group({
    localizacion: [localStorage.getItem('email') || ''],
    especialidad: ['', Validators.required ],
  });

  get isLoadingPlaces(): boolean {
    return this.placesService.isLoadingPlaces;
  }

  get places(): Feature[] {
    return this.placesService.places;
  }

  private debounceTimer?: NodeJS.Timeout;

  public ngSelect;
  public nombrePlace: string = '';
  public localizacionEnviar: string = '';

  constructor(private ususuarioService: UsuarioService,
              private fb: FormBuilder,
              private router: Router,
              private cd: ChangeDetectorRef,
              private placesService: PlacesService,) { }

  ngOnInit(): void {
    this.cargarPremiums();
    // document.getElementById("chatbot").hidden = true;

  }

  cargarPremiums(){
    this.ususuarioService.cargarUsuariosPremium()
    .subscribe (res => {
      this.listaPremiums = res['usuarios'];

      // Bucle para distinguir segun especialidad
      var contPed = 4;
      var contNeu = 4;
      var contPrem = 3;
      for (var i = 0; i < this.listaPremiums.length; i++) {

        //Premiums
        if(this.listaPremiums[i].planMensual == "Premium" && contPrem >0){
          this.listaPremiumsRecomendados.push(this.listaPremiums[i]);
          contPrem--;
        }

        //Pediatria
        if(this.listaPremiums[i].especialidad == "pediatria" && contPed >0){
          this.listaPediatria.push(this.listaPremiums[i]);
          contPed--;
        }
        //Neurologia
        if(this.listaPremiums[i].especialidad == "neurologia" && contNeu >0){
          this.listaNeurologia.push(this.listaPremiums[i]);
          contNeu--;
        }

      }
    })
  }

  crearImagenUrl(imagen: string) {
    return this.ususuarioService.crearImagenUrlBest(imagen);
  }

  busqueda(){

    this.cd.detectChanges();

    // this.router.navigate(['/landing/busqueda',this.localizacionEnviar]);

    this.router.navigate(['/landing/busqueda',this.localizacionEnviar,this.especialidadSeleccionada]);
    // this.router.navigate(['/landing/busqueda']);
  }

  busquedaCiudades( loc: string ){

    this.cd.detectChanges();

    this.router.navigate(['/landing/busqueda',loc]);

  }

  // BUSQUEDA CIUDADES
  onQueryChanged( query: string = '' ) {

    if ( this.debounceTimer ) clearTimeout( this.debounceTimer );

    this.debounceTimer = setTimeout(() => {
      this.placesService.getPlacesByQuery( query );
    }, 350 );

  }

  esteLugar( place: Feature ) {
    this.nombrePlace = place.place_name_es;
    // this.nombrePlace = place.center;
    this.localizacionEnviar = `${place.center[0]},${place.center[1]}`;
    // this.selectedId = place.id;

    // const [ lng, lat ] = place.center;
    // this.mapService.flyTo([ lng, lat ]);

    //Pone busqueda a 0
    this.placesService.setPlaces();

  }

  select(){
      let inputValue = (document.getElementById('cars') as HTMLInputElement).value;
      this.especialidadSeleccionada = inputValue.toLocaleLowerCase();
  }

  fisio(id: string){
    if(id){
      // this.hijo.cargandoFisio(id);
      this.router.navigate(['/landing/fisio',id]);
    }
  }

}
