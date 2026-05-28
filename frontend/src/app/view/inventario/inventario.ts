import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Navbar } from '../../components/navbar/navbar';
import { Menu } from '../../components/menu/menu';
import { ProductService } from '../../services/product';
import { NotificationService } from '../../services/notification.service';


@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, Navbar, Menu, ReactiveFormsModule],
  templateUrl: './inventario.html',
  styleUrl: './inventario.scss'
})
export class Inventario implements OnInit {
  products: any[] = [];
  showModal = false;
  editingProduct: any = null;
  productForm: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private notify: NotificationService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0.01)]],
      quantity: [1, Validators.min(1)],
      category: ['Geral'],
      code: ['']
    });
  }

  ngOnInit() {
    this.carregarProdutos();
  }

  carregarProdutos() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data.map(p => {
          if (p.photo) p.photo = p.photo.replace(/\\/g, '/');
          return p;
        });
      },
      error: (err) => this.notify.error('Erro ao carregar produtos.')
    });
  }

  abrirModal(product: any = null) {
    this.editingProduct = product;
    if (product) {
      this.productForm.patchValue({
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        category: product.category || 'Geral',
        code: product.code
      });
    } else {
      this.productForm.reset({ quantity: 1 });
    }
    this.showModal = true;
  }

  fecharModal() {
    this.showModal = false;
    this.editingProduct = null;
    this.selectedFile = null;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  salvarProduto() {
    if (this.productForm.invalid) return;

    const formData = new FormData();
    Object.keys(this.productForm.value).forEach(key => {
      formData.append(key, this.productForm.value[key]);
    });
    if (this.selectedFile) {
      formData.append('photo', this.selectedFile);
    }

    if (this.editingProduct) {
      this.productService.updateProduct(this.editingProduct.code || this.editingProduct._id, formData).subscribe({
        next: () => {
          this.notify.success('Produto atualizado com sucesso!');
          this.carregarProdutos();
          this.fecharModal();
        },
        error: (err) => this.notify.error('Erro ao atualizar produto')
      });
    } else {
      this.productService.createProduct(formData).subscribe({
        next: () => {
          this.notify.success('Produto criado com sucesso!');
          this.carregarProdutos();
          this.fecharModal();
        },
        error: (err) => this.notify.error('Erro ao criar produto')
      });
    }
  }

  eliminarProduto(product: any) {
    if (confirm(`Tem a certeza que deseja eliminar o produto ${product.name}?`)) {
      this.productService.deleteProduct(product.code || product._id).subscribe({
        next: () => {
          this.notify.success('Produto eliminado!');
          this.carregarProdutos();
        },
        error: (err) => this.notify.error('Erro ao eliminar produto')
      });
    }
  }

  estoqueEntrada(product: any) {
    const quantity = prompt(`Quantidade para adicionar ao estoque de ${product.name}:`);
    if (quantity && !isNaN(Number(quantity))) {
      const newQuantity = (product.quantity || 0) + Number(quantity);
      this.productService.updateProduct(product.code || product._id, { quantity: newQuantity }).subscribe(() => {
        this.notify.success('Estoque atualizado!');
        this.carregarProdutos();
      });
    }
  }
}