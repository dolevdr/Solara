import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable } from 'rxjs';
import { ThemeEnum } from '../../interfaces/theme.enum';
import { ThemeService } from '../../services/theme.service';

@Component({
    selector: 'app-theme-toggle',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatTooltipModule
    ],
    templateUrl: './theme-toggle.component.html',
    styleUrls: ['./theme-toggle.component.scss']
})
export class ThemeToggleComponent {
    currentTheme$: Observable<ThemeEnum> = this.themeService.currentTheme$;
    ThemeEnum = ThemeEnum;

    constructor(private themeService: ThemeService) {
    }


    setTheme(theme: ThemeEnum): void {
        this.themeService.setTheme(theme);
    }
}
