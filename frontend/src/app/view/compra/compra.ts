import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../components/navbar/navbar';
import { Menu } from '../../components/menu/menu';
import { SupplierService } from '../../services/supplier';
import { ProductService } from '../../services/product';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-compra',
  standalone: true,
  imports: [CommonModule, Navbar, Menu, FormsModule, ReactiveFormsModule],
  templateUrl: './compra.html',
  styleUrl: './compra.scss'
})
export class Compra implements OnInit {

  purchases: any[] = [];
  suppliers: any[] = [];
  products: any[] = [];
  showModal = false;
  showDetailsModal = false;
  selectedPurchase: any = null;
  compraForm: FormGroup;

  constructor(
    private supplierService: SupplierService,
    private productService: ProductService
  ) {
    this.compraForm = new FormGroup({
      supplierId: new FormControl('', [Validators.required]),
      productCode: new FormControl('', [Validators.required]),
      quantity: new FormControl(1, [Validators.required, Validators.min(1)])
    });
  }

  ngOnInit() {
    this.carregarHistorico();
    this.carregarFornecedores();
    this.carregarProdutos();
  }

  carregarHistorico() {
    this.supplierService.getHistory().subscribe({
      next: (data) => this.purchases = data.supplierRequests || [],
      error: (err) => console.error('Erro ao carregar histórico:', err)
    });
  }

  carregarFornecedores() {
    this.supplierService.getSuppliers().subscribe({
      next: (data) => this.suppliers = data.suppliers || [],
      error: (err) => console.error('Erro ao carregar fornecedores:', err)
    });
  }

  carregarProdutos() {
    this.productService.getProducts().subscribe({
      next: (data) => this.products = data || [],
      error: (err) => console.error('Erro ao carregar produtos:', err)
    });
  }

  novaCompra() {
    this.showModal = true;
  }

  fecharModal() {
    this.showModal = false;
    this.compraForm.reset({ quantity: 1 });
  }

  fecharDetalhesModal() {
    this.showDetailsModal = false;
    this.selectedPurchase = null;
  }

  confirmarCompra() {
    if (this.compraForm.invalid) return;

    const { supplierId, productCode, quantity } = this.compraForm.value;
    const products = [{ code: productCode, quantity }];

    this.supplierService.createRequest(supplierId, products).subscribe({
      next: () => {
        alert('Pedido de compra enviado com sucesso!');
        this.fecharModal();
        this.carregarHistorico();
      },
      error: (err) => {
        alert('Erro ao enviar pedido: ' + (err.error?.error || 'Erro desconhecido'));
        console.error(err);
      }
    });
  }

}