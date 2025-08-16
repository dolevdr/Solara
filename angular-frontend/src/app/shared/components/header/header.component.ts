import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [MatToolbarModule, MatButtonModule, MatIconModule, ThemeToggleComponent],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent {
    @Output() menuToggle = new EventEmitter<void>();

    onMenuToggle(): void {
        this.menuToggle.emit();
    }
}
