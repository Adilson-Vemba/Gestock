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

  // Modals
  showModal = false;
  showDetailsModal = false;
  showSupplierModal = false;
  showSupplierListPanel = false;

  selectedPurchase: any = null;

  get pendingCount(): number {
    return this.purchases.filter(p => p.status === 'PENDENTE').length;
  }

  compraForm: FormGroup;
  supplierForm: FormGroup;

  constructor(
    private supplierService: SupplierService,
    private productService: ProductService
  ) {
    this.compraForm = new FormGroup({
      supplierId: new FormControl('', [Validators.required]),
      productCode: new FormControl('', [Validators.required]),
      quantity: new FormControl(1, [Validators.required, Validators.min(1)])
    });

    this.supplierForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('')
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

  // --- Nova Compra ---
  novaCompra() {
    this.showModal = true;
  }

  fecharModal() {
    this.showModal = false;
    this.compraForm.reset({ quantity: 1 });
  }

  confirmarCompra() {
    if (this.compraForm.invalid) return;

    const { supplierId, productCode, quantity } = this.compraForm.value;
    const products = [{ code: productCode, quantity }];

    this.supplierService.createRequest(supplierId, products).subscribe({
      next: () => {
        this.fecharModal();
        this.carregarHistorico();
      },
      error: (err) => {
        alert('Erro ao enviar pedido: ' + (err.error?.error || 'Erro desconhecido'));
        console.error(err);
      }
    });
  }

  // --- Ver Detalhes ---
  fecharDetalhesModal() {
    this.showDetailsModal = false;
    this.selectedPurchase = null;
  }

  verDetalhes(purchase: any) {
    this.selectedPurchase = purchase;
    this.showDetailsModal = true;
  }

  // --- Gestão de Fornecedores ---
  toggleSupplierPanel() {
    this.showSupplierListPanel = !this.showSupplierListPanel;
  }

  abrirModalNovoFornecedor() {
    this.showSupplierModal = true;
  }

  fecharModalFornecedor() {
    this.showSupplierModal = false;
    this.supplierForm.reset();
  }

  confirmarNovoFornecedor() {
    if (this.supplierForm.invalid) return;

    this.supplierService.createSupplier(this.supplierForm.value).subscribe({
      next: () => {
        this.fecharModalFornecedor();
        this.carregarFornecedores();
      },
      error: (err) => {
        alert('Erro ao criar fornecedor: ' + (err.error?.error || 'Erro desconhecido'));
        console.error(err);
      }
    });
  }

  eliminarFornecedor(id: string) {
    if (!confirm('Tem a certeza que quer eliminar este fornecedor?')) return;

    this.supplierService.deleteSupplier(id).subscribe({
      next: () => this.carregarFornecedores(),
      error: (err) => {
        alert('Erro ao eliminar fornecedor: ' + (err.error?.error || 'Erro desconhecido'));
        console.error(err);
      }
    });
  }
}