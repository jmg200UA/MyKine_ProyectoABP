import { Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private map?: mapboxgl.Map;
  private markers: mapboxgl.Marker[] = [];

  get isMapReady(){
    return !!this.map;
  }

  constructor() { }

  setMap( map: mapboxgl.Map ) {
    this.map = map;
  }

  setMarkers( markers: mapboxgl.Marker[]){

    this.borrarMarcadores();

    this.markers = markers;

    this.markers.forEach( m =>{
      m.addTo( this.map )
    });

  }

  flyTo( coords: mapboxgl.LngLatLike ) {
    if ( !this.isMapReady ) throw Error('El mapa no esta inicializado');

    this.map?.flyTo({
      zoom: 14,
      center: coords
    });
  }

  borrarMarcadores(){
    this.markers.forEach( m =>{
      m.remove();
    })
    // this.markers.splice(0);
  }


}
