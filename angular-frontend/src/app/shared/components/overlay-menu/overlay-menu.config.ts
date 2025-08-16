import { NavigationItem } from '../../interfaces/navigation.interface';

export const NAVIGATION_ITEMS: readonly NavigationItem[] = [
    {
        routerLink: '/campaigns',
        icon: 'list',
        text: 'Campaigns'
    },
    {
        routerLink: '/dashboard',
        icon: 'dashboard',
        text: 'Dashboard'
    }
] as const;
