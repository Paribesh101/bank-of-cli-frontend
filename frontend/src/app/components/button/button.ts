import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-button',
  imports: [MatProgressSpinnerModule],
  templateUrl: './button.html',
  styleUrl: './button.css'
})
export class Button {
  @Input() label: string = '';
  @Input() variant: 'primary' | 'secondary' = 'primary';
  @Input() loading: boolean = false;
  @Input() disabled: boolean = false;

  @Output() clicked = new EventEmitter<void>();

  onClick(){
    this.clicked.emit();
  }
}
