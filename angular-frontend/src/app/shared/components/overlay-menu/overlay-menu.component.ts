import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NAVIGATION_ITEMS } from './overlay-menu.config';

@Component({
    selector: 'app-overlay-menu',
    standalone: true,
    imports: [MatButtonModule, MatIconModule, RouterLink, RouterLinkActive],
    templateUrl: './overlay-menu.component.html',
    styleUrl: './overlay-menu.component.scss'
})
export class OverlayMenuComponent {
    @Input() isOpen = false;
    @Output() closeMenu = new EventEmitter<void>();

    readonly navigationItems = NAVIGATION_ITEMS;

    onCloseMenu(): void {
        this.closeMenu.emit();
    }

    onMenuClick(event: Event): void {
        event.stopPropagation();
    }
}
