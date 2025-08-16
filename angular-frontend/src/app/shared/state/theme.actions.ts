import { Action } from '@ngrx/store';
import { ThemeEnum } from '../interfaces/theme.enum';

export enum ThemeActionTypes {
    SET_THEME = '[Theme] Set Theme',
    TOGGLE_THEME = '[Theme] Toggle Theme',
    SET_SYSTEM_PREFERENCE = '[Theme] Set System Preference',
    INITIALIZE_THEME = '[Theme] Initialize Theme'
}

// Set Theme
export class SetTheme implements Action {
    readonly type = ThemeActionTypes.SET_THEME;
    constructor(public payload: { theme: ThemeEnum }) { }
}

// Toggle Theme
export class ToggleTheme implements Action {
    readonly type = ThemeActionTypes.TOGGLE_THEME;
}

// Set System Preference
export class SetSystemPreference implements Action {
    readonly type = ThemeActionTypes.SET_SYSTEM_PREFERENCE;
    constructor(public payload: { isSystemPreference: boolean }) { }
}

// Initialize Theme
export class InitializeTheme implements Action {
    readonly type = ThemeActionTypes.INITIALIZE_THEME;
}

export type ThemeActions =
    | SetTheme
    | ToggleTheme
    | SetSystemPreference
    | InitializeTheme;
