import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, ToastMessage } from '../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.scss'
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: (ToastMessage & { id: number, visible: boolean })[] = [];
  private subscription!: Subscription;
  private idCounter = 0;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.subscription = this.notificationService.toastState$.subscribe(toast => {
      const newToast = { ...toast, id: ++this.idCounter, visible: true };
      this.toasts.push(newToast);

      if (toast.duration && toast.duration > 0) {
        setTimeout(() => this.remove(newToast.id), toast.duration);
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  remove(id: number) {
    const toast = this.toasts.find(t => t.id === id);
    if (toast) {
      toast.visible = false;
      setTimeout(() => {
        this.toasts = this.toasts.filter(t => t.id !== id);
      }, 300); // Wait for animation
    }
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success': return 'fa-check-circle';
      case 'error': return 'fa-exclamation-circle';
      case 'warning': return 'fa-exclamation-triangle';
      default: return 'fa-info-circle';
    }
  }
}
