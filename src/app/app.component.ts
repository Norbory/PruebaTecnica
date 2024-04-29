import { Component } from '@angular/core';
import { FooterComponent } from './components/footer/footer.component';
import { Entity } from './core/models/entity.interface';
import { NgFor, NgIf } from '@angular/common';
import * as data from './data/entities.json';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FooterComponent, NgFor, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor() { }
  title = 'Proveedores';
  listEntity: Entity[] = [];
  selectedEmpresa = {} as Entity;
  selectedIndex: number = 0;
  visible: boolean = false;

  empresas = (data as any).default;

  openModal(empresa: Entity, index: number) {
    this.visible  = true;
    this.selectedEmpresa = empresa;
    this.selectedIndex = index;
  }
  cerrarModal() {
    this.visible = false;
  }
}
