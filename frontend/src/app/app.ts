import { Component, signal } from '@angular/core';
import { Navbar } from './components/navbar/navbar';
import { Menu } from './components/menu/menu';
import { Chart } from 'chart.js/auto';
import { RouterOutlet } from '@angular/router';





@Component({
  selector: 'app-root',
  imports: [Navbar, Menu, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  
}