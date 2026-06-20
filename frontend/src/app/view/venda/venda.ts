import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { Menu } from '../../components/menu/menu';
import { OrderService } from '../../services/order';
import { ProductService } from '../../services/product';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';

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
  
  get totalRevenue(): number {
    return this.sales.reduce((acc, sale) => acc + (sale.total || 0), 0);
  }

  get todayRevenue(): number {
    const today = new Date().setHours(0, 0, 0, 0);
    return this.sales
      .filter(sale => new Date(sale.createdAt).setHours(0, 0, 0, 0) === today)
      .reduce((acc, sale) => acc + (sale.total || 0), 0);
  }

  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private notify: NotificationService
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
        this.sales = (data.orders || []).map((sale: any) => {
          const total = sale.products.reduce((acc: number, item: any) => {
            const price = item.product?.price || 0;
            return acc + (price * item.quantity);
          }, 0);
          return { ...sale, total };
        });
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
        this.notify.success('Venda realizada com sucesso!');
        this.fecharModal();
        this.carregarVendas();
      },
      error: (err) => {
        this.notify.error('Erro ao realizar venda: ' + (err.error?.error || 'Erro desconhecido'));
        console.error(err);
      }
    });
  }

  filtrar() {
    this.notify.success('Filtro de vendas clicado');
  }

  verDetalhes(sale: any) {
    this.selectedSale = sale;
    this.showDetailsModal = true;
  }

  verFatura(sale: any) {
    this.notify.success(`Gerando fatura para a venda ${sale.id || sale._id}`);
  }

  aprovarPagamento(id: string) {
    this.orderService.approveOrder(id).subscribe({
      next: (res) => {
        this.notify.success('Pagamento aprovado com sucesso!');
        if (this.selectedSale) {
          this.selectedSale.approvalStatus = 'Aprovado';
          this.selectedSale.paymentStatus = res.order?.paymentStatus || 'Pago';
        }
        this.carregarVendas();
      },
      error: (err) => {
        this.notify.error('Erro ao aprovar: ' + (err.error?.error || 'Desconhecido'));
      }
    });
  }

}
