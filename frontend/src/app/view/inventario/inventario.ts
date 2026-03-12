import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../components/navbar/navbar';
import { Menu } from '../../components/menu/menu';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, Navbar, Menu],
  templateUrl: './inventario.html',
  styleUrl: './inventario.scss'
})
export class Inventario implements OnInit {

  products: any[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.carregarProdutos();
  }

  carregarProdutos() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (err) => {
        console.error('Erro ao carregar produtos:', err);
      }
    });
  }

  novoProduto() {
    const name = prompt('Nome do produto:');
    const price = prompt('Preço:');
    if (name && price) {
      this.productService.createProduct({ name, price: Number(price) }).subscribe(() => {
        this.carregarProdutos();
      });
    }
  }

  editarProduto(product: any) {
    const name = prompt('Novo nome:', product.name);
    const price = prompt('Novo preço:', product.price);
    if (name && price) {
      this.productService.updateProduct(product.code || product._id, { name, price: Number(price) }).subscribe(() => {
        this.carregarProdutos();
      });
    }
  }

  estoqueEntrada(product: any) {
    const quantity = prompt(`Quantidade para adicionar ao estoque de ${product.name}:`);
    if (quantity && !isNaN(Number(quantity))) {
      const newQuantity = (product.quantity || 0) + Number(quantity);
      this.productService.updateProduct(product.code || product._id, { quantity: newQuantity }).subscribe(() => {
        this.carregarProdutos();
      });
    }
  }

}