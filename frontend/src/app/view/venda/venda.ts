import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { Menu } from '../../components/menu/menu';

@Component({
  selector: 'app-venda',
  imports: [CommonModule, Navbar, Menu],
  templateUrl: './venda.html',
  styleUrl: './venda.scss'
})
export class Venda {

  sales = [
    { id: '001', date: '10/12/2025', customer: 'Cliente Balcão', total: 45000, status: 'Paga' },
    { id: '002', date: '11/12/2025', customer: 'Maria Silva', total: 78000, status: 'Paga' },
    { id: '003', date: '12/12/2025', customer: 'João Pedro', total: 32000, status: 'Pendente' },
    { id: '004', date: '13/12/2025', customer: 'Ana Costa', total: 91000, status: 'Paga' }
  ];

}
