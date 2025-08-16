import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ThemeEnum } from '../interfaces/theme.enum';
import { THEME_FEATURE_KEY, ThemeState } from './theme.state';

export const selectThemeState = createFeatureSelector<ThemeState>(THEME_FEATURE_KEY);

export const selectCurrentTheme = createSelector(
    selectThemeState,
    (state: ThemeState) => state.currentTheme
);

export const selectIsSystemPreference = createSelector(
    selectThemeState,
    (state: ThemeState) => state.isSystemPreference
);

export const selectIsDarkTheme = createSelector(
    selectCurrentTheme,
    (theme: ThemeEnum) => theme === ThemeEnum.DARK
);
