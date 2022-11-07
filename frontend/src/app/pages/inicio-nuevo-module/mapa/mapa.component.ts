import { Component, AfterViewInit, ViewChild, ElementRef, Input, OnChanges } from '@angular/core';
import { MapService } from 'src/app/services/map.service';
import mapboxgl from 'mapbox-gl';
import { Usuario } from '../../../models/usuario.model';
import { parse } from 'path';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements AfterViewInit, OnChanges {

  //Recoger el div del mapa para poder retocarlo
  @ViewChild('mapa') divMapa: ElementRef;
  @Input() listaUsuarios: Usuario[];

  @Input() ciudad: string;

  //Atributos
  public marcadores: mapboxgl.Marker[10] = [];
  public zoomLevel: number = 13;
  public center: [number, number] = [-0.4889875822379246, 38.34315558848338];

  public color: string = '';
  public map: mapboxgl.Map;
  public esplited = ['-0.4889875822379246', '38.34315558848338'];

  constructor( private mapService: MapService ) { }

  ngAfterViewInit(): void {

    if(this.ciudad){
      let aux = this.ciudad.split(",");
      let nuevoCentro: [number, number] = [parseFloat(aux[0]), parseFloat(aux[1])];
      this.center = nuevoCentro;
    }

    this.map = new mapboxgl.Map({
      container: this.divMapa.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: this.center, // starting position [lng, lat]
      zoom: this.zoomLevel, // starting zoom
      attributionControl: false
    });

    this.map.on('zoom', (ev) => {
      this.zoomLevel = this.map.getZoom();
      this.zoomLevel
    });

    this.map.on('zoomend', (ev) => {

      //Limitar zoom máximo
      if (this.map.getZoom() > 18 ) {
        this.map.zoomTo( 18 );
      }

    });

    // Movimiento del mapa
    this.map.on('move', (event) => {
      const target = event.target;
      const { lng, lat } = target.getCenter();
      this.center = [lng, lat];
    });

    this.mapService.setMap( this.map );

  }

  ngOnChanges(): void {
    this.agregarMarcadores();
  }

  agregarMarcadores(){

    this.marcadores.forEach( m =>{
      m.remove();
    })

    this.marcadores.splice(0);

    this.listaUsuarios.forEach( u => {
      switch (u.especialidad) {
        case 'general':
          this.color= '#a51b40';
          break;

          case 'pediatria':
          this.color= '#cc8427';
          break;

          case 'neurologia':
          this.color= '#a626a8';
          break;

          case 'deportiva':
          this.color= '#017518';
          break;

          case 'geriatria':
          this.color= '#F1c510';
          break;
      }

      //Separar coordenadas
      // if (u.sitio_Fisio.localizacion_sitio) {
        this.esplited = u.sitio_Fisio.localizacion_sitio.split(",");
      // }

      let segundonumero: number = +this.esplited[1];

      //Separar por coordenadas españa para que funcionen los antiguos
      // forma google maps
      if(segundonumero < 5){

        const popup = new mapboxgl.Popup()
          .setHTML(`
          <style>
            .comentarioMapa{
              padding: 10px 5px;
            }
          </style>
          <div class="comentarioMapa">
            <h6><b>${u.nombre_apellidos}</b></h6>
            <span>${u.especialidad}</span>
          </div>
          `);

        const nuevoMarcador = new mapboxgl.Marker({
            color: this.color
        })
          .setLngLat( [this.esplited[1], this.esplited[0]] )
          .setPopup( popup )

        this.marcadores.push(nuevoMarcador);

        //Forma mapbox
      }else{

        const popup = new mapboxgl.Popup()
          .setHTML(`
          <style>
            .comentarioMapa{
              padding: 10px 5px;
            }
          </style>
          <div class="comentarioMapa">
            <h6><b>${u.nombre_apellidos}</b></h6>
            <span>${u.especialidad}</span>
          </div>
          `);
        const nuevoMarcador = new mapboxgl.Marker({
          color: this.color
        })
          .setLngLat( [this.esplited[0], this.esplited[1]] )
          .setPopup( popup )
        this.marcadores.push(nuevoMarcador);

      }

    })

    this.mapService.setMarkers(this.marcadores);

  }
  zoomIn(){
    this.map.zoomIn();
  }

  zoomOut(){
    this.map.zoomOut();
  }

  zoomCambio( valor: string ) {
    this.map.zoomTo( Number(valor) );
  }

}
