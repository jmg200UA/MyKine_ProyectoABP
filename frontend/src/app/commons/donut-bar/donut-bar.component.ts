import { Component, Input, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label, MultiDataSet } from 'ng2-charts';

@Component({
  selector: 'app-donut-bar',
  templateUrl: './donut-bar.component.html',
  styles: []
})
export class DonutBarComponent implements OnInit {

  //Atributos
  public barChartType = 'doughnut';
  public barChartLegend = true;


  //Inputs
  @Input() donutData: MultiDataSet = [
    // [350, 450, 100, 150]
  ];
  @Input() donutLabels: Label[] = [
    // 'Download Sales', 'In-Store Sales', 'Mail-Order Sales', 'Other'
  ];
  @Input() colors: Color[] = [];


  constructor() {}

  ngOnInit(): void {
  }

}
