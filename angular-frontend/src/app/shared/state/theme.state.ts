import { ThemeEnum } from '../interfaces/theme.enum';

export const THEME_FEATURE_KEY = 'theme';

export interface ThemeState {
    currentTheme: ThemeEnum;
    isSystemPreference: boolean;
}

export const THEME_INITIAL_STATE: ThemeState = {
    currentTheme: ThemeEnum.LIGHT,
    isSystemPreference: false
};
