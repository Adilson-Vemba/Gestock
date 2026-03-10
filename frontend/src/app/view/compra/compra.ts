import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../components/navbar/navbar';
import { Menu } from '../../components/menu/menu';

@Component({
  selector: 'app-compra',
  imports: [CommonModule, Navbar, Menu],
  templateUrl: './compra.html',
  styleUrl: './compra.scss'
})
export class Compra {

  purchases = [
    {
      id: 'C-001',
      date: '05/12/2025',
      supplier: 'Fornecedor Alpha',
      product: 'Camisa Social Masculina',
      quantity: 30,
      total: 450000,
      status: 'Recebido'
    },
    {
      id: 'C-002',
      date: '08/12/2025',
      supplier: 'Fornecedor Beta',
      product: 'T-shirt Básica',
      quantity: 50,
      total: 350000,
      status: 'Pendente'
    },
    {
      id: 'C-003',
      date: '12/12/2025',
      supplier: 'Fornecedor ModaLux',
      product: 'Calça Jeans Feminina',
      quantity: 20,
      total: 280000,
      status: 'Recebido'
    }
  ];

}