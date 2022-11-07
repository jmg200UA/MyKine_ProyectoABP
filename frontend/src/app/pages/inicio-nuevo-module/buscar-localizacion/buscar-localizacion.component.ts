import { Component } from '@angular/core';
import { PlacesService } from 'src/app/services/places.service';
import { MapService } from 'src/app/services/map.service';
import mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-buscar-localizacion',
  templateUrl: './buscar-localizacion.component.html',
  styleUrls: ['./buscar-localizacion.component.css']
})
export class BuscarLocalizacionComponent {

  private debounceTimer?: NodeJS.Timeout;
  public selectedId: string = '';

  get isLoadingPlaces(): boolean {
    return this.placesService.isLoadingPlaces;
  }

  get places(): mapboxgl.Feature[] {
    return this.placesService.places;
  }

  constructor( private placesService: PlacesService,
              private mapService: MapService, ) { }


  onQueryChanged( query: string = '' ) {

    if ( this.debounceTimer ) clearTimeout( this.debounceTimer );

    this.debounceTimer = setTimeout(() => {
      this.placesService.getPlacesByQuery( query );
    }, 350 );

  }

  //RESULTADOS
  flyTo( place: mapboxgl.Feature ) {
    this.selectedId = place.id;

    const [ lng, lat ] = place.center;
    this.mapService.flyTo([ lng, lat ]);

    this.placesService.setPlaces();
  }


}
