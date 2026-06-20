import { Component, Input, forwardRef } from '@angular/core';
import { ReactiveFormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

type InputTypes = 'text' | 'email' | 'password' | 'number';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-primary-input',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './primary-input.html',
  styleUrl: './primary-input.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PrimaryInput),
      multi: true
    }
  ]
})
export class PrimaryInput implements ControlValueAccessor {

  @Input() type: InputTypes = 'text';
  @Input() placeholder: string = '';
  @Input() label: string = '';
  @Input() inputName: string = '';
  @Input() hasError: boolean | null | undefined = false;
  @Input() errorMsg: string = '';

  value: string = ''
  showPassword: boolean = false;
  onChange: any = () => { }
  onTouched: any = () => { }

  get displayType(): string {
    if (this.type === 'password') {
      return this.showPassword ? 'text' : 'password';
    }
    return this.type;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onInput(event: any) {
    const value = event.target.value;
    this.value = value;
    this.onChange(value);
  }

  writeValue(value: any): void {
    this.value = value
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  setDisabledState?(isDisabled: boolean): void { }
}
