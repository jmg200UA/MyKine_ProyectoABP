import { Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { PlacesApiClient } from '../pages/inicio-nuevo-module/api/placesApiClient';
import { PlacesResponse } from '../interfaces/places';
import { MapService } from 'src/app/services/map.service';
@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  public isLoadingPlaces: boolean = false;
  public places: mapboxgl.Feature[] = [];
  public useLocation?: [number, number] = [-0.4889875822379246, 38.34315558848338];

  constructor( private placesApi: PlacesApiClient,
                private mapService: MapService ) { }

  getPlacesByQuery( query: string = '' ) {

    if ( query.length === 0 ) {
      this.isLoadingPlaces = false;
      this.places = [];
      return;
    }

    if ( !this.useLocation ) throw Error('No hay userLocation');

    this.isLoadingPlaces = true;

    this.placesApi.get<PlacesResponse>(`/${ query }.json`, {
      params: {
        proximity: this.useLocation.join(','),
        limit: 3
      }
    })
      .subscribe( resp => {
        this.isLoadingPlaces = false;
        this.places = resp.features;

        // this.mapService.createMarkersFromPlaces( this.places, this.useLocation! );
      });

  }

  setPlaces(){
    this.places.splice(0);
  }
}
