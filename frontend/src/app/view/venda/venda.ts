import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { Menu } from '../../components/menu/menu';
import { OrderService } from '../../services/order';
import { ProductService } from '../../services/product';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-venda',
  standalone: true,
  imports: [CommonModule, Navbar, Menu, FormsModule, ReactiveFormsModule],
  templateUrl: './venda.html',
  styleUrl: './venda.scss'
})
export class Venda implements OnInit {

  sales: any[] = [];
  products: any[] = [];
  showModal = false;
  showDetailsModal = false;
  selectedSale: any = null;
  vendaForm: FormGroup;

  constructor(
    private orderService: OrderService,
    private productService: ProductService
  ) {
    this.vendaForm = new FormGroup({
      productCode: new FormControl('', [Validators.required]),
      quantity: new FormControl(1, [Validators.required, Validators.min(1)])
    });
  }

  ngOnInit() {
    this.carregarVendas();
    this.carregarProdutos();
  }

  carregarProdutos() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data || [];
      },
      error: (err) => console.error('Erro ao carregar produtos:', err)
    });
  }

  carregarVendas() {
    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.sales = data.orders || [];
      },
      error: (err) => {
        console.error('Erro ao carregar vendas:', err);
      }
    });
  }

  novaVenda() {
    this.showModal = true;
  }

  fecharModal() {
    this.showModal = false;
    this.vendaForm.reset({ quantity: 1 });
  }

  fecharDetalhesModal() {
    this.showDetailsModal = false;
    this.selectedSale = null;
  }

  confirmarVenda() {
    if (this.vendaForm.invalid) return;

    const { productCode, quantity } = this.vendaForm.value;
    const orderData = {
      products: [
        { code: productCode, quantity: quantity }
      ]
    };

    this.orderService.createOrder(orderData).subscribe({
      next: () => {
        alert('Venda realizada com sucesso!');
        this.fecharModal();
        this.carregarVendas();
      },
      error: (err) => {
        alert('Erro ao realizar venda: ' + (err.error?.error || 'Erro desconhecido'));
        console.error(err);
      }
    });
  }

  filtrar() {
    alert('Filtro de vendas clicado');
  }

  verDetalhes(sale: any) {
    this.selectedSale = sale;
    this.showDetailsModal = true;
  }

  verFatura(sale: any) {
    alert(`Gerando fatura para a venda ${sale.id || sale._id}`);
  }

}
