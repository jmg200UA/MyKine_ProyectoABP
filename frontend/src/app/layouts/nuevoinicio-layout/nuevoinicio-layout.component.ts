import { Component, OnInit } from '@angular/core';

declare function iniciarCustom();

@Component({
  selector: 'app-nuevoinicio-layout',
  templateUrl: './nuevoinicio-layout.component.html',
  styleUrls: ['./nuevoinicio-layout.component.css']
})
export class NuevoinicioLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    iniciarCustom();
  }

}
