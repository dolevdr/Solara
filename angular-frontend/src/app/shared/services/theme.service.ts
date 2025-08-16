import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ThemeEnum } from '../interfaces/theme.enum';
import { SetSystemPreference, SetTheme, ToggleTheme } from '../state/theme.actions';
import { selectCurrentTheme } from '../state/theme.selectors';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private renderer: Renderer2;

    constructor(
        private store: Store,
        rendererFactory: RendererFactory2
    ) {
        this.renderer = rendererFactory.createRenderer(null, null);
        this.initializeTheme();
    }

    get currentTheme$(): Observable<ThemeEnum> {
        return this.store.select(selectCurrentTheme);
    }

    setTheme(theme: ThemeEnum): void {
        this.store.dispatch(new SetTheme({ theme }));
        this.applyTheme(theme);
        this.saveThemeToStorage(theme);
    }

    toggleTheme(): void {
        this.store.dispatch(new ToggleTheme());
        this.currentTheme$.subscribe(theme => {
            this.applyTheme(theme);
            this.saveThemeToStorage(theme);
        });
    }

    setSystemPreference(isSystemPreference: boolean): void {
        this.store.dispatch(new SetSystemPreference({ isSystemPreference }));
        if (isSystemPreference) {
            this.applySystemTheme();
        }
    }

    private initializeTheme(): void {
        const savedTheme = this.getThemeFromStorage();
        const systemPrefersDark = this.getSystemThemePreference();

        if (savedTheme) {
            this.setTheme(savedTheme);
        } else if (systemPrefersDark) {
            this.setTheme(ThemeEnum.DARK);
            this.setSystemPreference(true);
        } else {
            this.setTheme(ThemeEnum.LIGHT);
        }
    }

    private applyTheme(theme: ThemeEnum): void {
        const isDark = theme === ThemeEnum.DARK;
        const htmlElement = document.documentElement;

        // Remove existing theme classes
        this.renderer.removeClass(htmlElement, 'light-theme');
        this.renderer.removeClass(htmlElement, 'dark-theme');

        // Add new theme class
        this.renderer.addClass(htmlElement, `${theme}-theme`);

        // Set data attribute for CSS custom properties
        this.renderer.setAttribute(htmlElement, 'data-theme', theme);

        // Update Material theme
        this.updateMaterialTheme(isDark);
    }

    private updateMaterialTheme(isDark: boolean): void {
        const linkElement = document.getElementById('material-theme') as HTMLLinkElement;
        if (linkElement) {
            const themeName = isDark ? 'azure-blue-dark' : 'azure-blue';
            linkElement.href = `@angular/material/prebuilt-themes/${themeName}.css`;
        }
    }

    private applySystemTheme(): void {
        const systemPrefersDark = this.getSystemThemePreference();
        const theme = systemPrefersDark ? ThemeEnum.DARK : ThemeEnum.LIGHT;
        this.setTheme(theme);
    }

    private getSystemThemePreference(): boolean {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    private saveThemeToStorage(theme: ThemeEnum): void {
        localStorage.setItem('theme', theme);
    }

    private getThemeFromStorage(): ThemeEnum | null {
        const saved = localStorage.getItem('theme');
        return saved as ThemeEnum || null;
    }
}
