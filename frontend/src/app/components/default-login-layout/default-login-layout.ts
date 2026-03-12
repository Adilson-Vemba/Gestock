import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-default-login-layout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './default-login-layout.html',
  styleUrls: ['./default-login-layout.scss']
})
export class DefaultLoginLayout {
  @Input() title: string = '';
  @Input() primarybtnText: string = '';
  @Input() secondarybtnText: string = '';

  @Output("submit") onSubmit = new EventEmitter<void>();
  @Output("secondaryAction") onSecondaryAction = new EventEmitter<void>();

  submit() {
    this.onSubmit.emit();
  }

  secondaryClick() {
    this.onSecondaryAction.emit();
  }
}
