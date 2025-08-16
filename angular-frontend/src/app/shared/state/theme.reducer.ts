import { ThemeEnum } from '../interfaces/theme.enum';
import { ThemeActions, ThemeActionTypes } from './theme.actions';
import { THEME_INITIAL_STATE, ThemeState } from './theme.state';

export function themeReducer(
    state: ThemeState = THEME_INITIAL_STATE,
    action: ThemeActions
): ThemeState {
    switch (action.type) {
        case ThemeActionTypes.SET_THEME:
            return {
                ...state,
                currentTheme: action.payload.theme,
                isSystemPreference: false
            };

        case ThemeActionTypes.TOGGLE_THEME:
            return {
                ...state,
                currentTheme: state.currentTheme === ThemeEnum.LIGHT ? ThemeEnum.DARK : ThemeEnum.LIGHT,
                isSystemPreference: false
            };

        case ThemeActionTypes.SET_SYSTEM_PREFERENCE:
            return {
                ...state,
                isSystemPreference: action.payload.isSystemPreference
            };

        default:
            return state;
    }
}
