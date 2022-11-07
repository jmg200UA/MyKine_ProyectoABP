import { Component, OnInit, Input, OnChanges } from '@angular/core';

declare var main;
declare var animaHombre;
declare var cambiarEntidad;


@Component({
  selector: 'app-modelo',
  templateUrl: './modelo.component.html',
  styleUrls: ['./modelo.component.css',]
})
export class ModeloComponent implements OnInit, OnChanges {

  @Input() modeloSeleccionado: string[] = [];
  @Input() posicionActual: number;

  animaHombre(){
    new animaHombre(this.modeloSeleccionado[this.posicionActual]);
  }

  ngOnInit(): void {
    // document.getElementById("chatbot").hidden = false;
    new main();
  }

  ngOnChanges(): void {
    new cambiarEntidad(this.modeloSeleccionado[this.posicionActual]);
  }

}
