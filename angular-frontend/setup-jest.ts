import 'jest-preset-angular/setup-jest';

declare const jest: any;

// Mock global objects that might not be available in jsdom
Object.defineProperty(window, 'CSS', { value: null });

Object.defineProperty(window, 'getComputedStyle', {
    value: () => {
        return {
            display: 'none',
            appearance: ['-webkit-appearance'],
        };
    },
});

Object.defineProperty(document, 'doctype', {
    value: '<!DOCTYPE html>',
});

Object.defineProperty(window, 'matchMedia', {
    value: () => {
        return {
            matches: false,
            addListener: () => { },
            removeListener: () => { },
        };
    },
});

// Mock ResizeObserver
(window as any).ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));

// Mock IntersectionObserver
(window as any).IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));

// Mock Element.animate for Angular animations
Object.defineProperty(Element.prototype, 'animate', {
    value: jest.fn().mockImplementation(() => ({
        play: jest.fn(),
        pause: jest.fn(),
        cancel: jest.fn(),
        finish: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
    })),
    writable: true,
});
