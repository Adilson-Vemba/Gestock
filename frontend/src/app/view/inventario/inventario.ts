import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../components/navbar/navbar';
import { Menu } from '../../components/menu/menu';

@Component({
  selector: 'app-inventario',
  imports: [CommonModule, Navbar, Menu],
  templateUrl: './inventario.html',
  styleUrl: './inventario.scss'
})
export class Inventario {

 products = [
  { name: 'Camisa Social Masculina', price: 15000, quantity: 12 },
  { name: 'Calça Jeans Feminina', price: 22000, quantity: 3 },
  { name: 'Vestido Casual', price: 28000, quantity: 8 },
  { name: 'T-shirt Básica', price: 7000, quantity: 25 },
  { name: 'Casaco de Inverno', price: 35000, quantity: 2 }
];

}