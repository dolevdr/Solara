import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Input } from '@angular/core';

@Component({
    selector: 'app-image-preview',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './image-preview.component.html',
    styleUrl: './image-preview.component.scss'
})
export class ImagePreviewComponent {
    @Input() src: string = '';
    @Input() alt: string = '';
    @Input() showPreview: boolean = true;

    isHovered = false;
    tooltipPosition = { x: 0, y: 0 };

    constructor(private elementRef: ElementRef) { }


    @HostListener('document:mouseover', ['$event'])
    onDocumentMouseOver(event: MouseEvent): void {
        // Check if mouse is over THIS specific image container
        const target = event.target as HTMLElement;
        const imageContainer = target.closest('.image-container') as HTMLElement | null;

        // Only show preview if mouse is over THIS component's image container
        if (imageContainer && this.showPreview && this.src && this.isThisComponentContainer(imageContainer)) {
            // Pre-calculate position and show immediately
            this.updateTooltipPosition(event);
            this.isHovered = true;
        } else if (imageContainer && !this.isThisComponentContainer(imageContainer)) {
            this.isHovered = false;
        }
    }

    @HostListener('document:mouseout', ['$event'])
    onDocumentMouseOut(event: MouseEvent): void {
        // Check if mouse left THIS specific image container
        const target = event.target as HTMLElement;
        const imageContainer = target.closest('.image-container') as HTMLElement | null;

        if (!imageContainer || !this.isThisComponentContainer(imageContainer)) {
            this.isHovered = false;
        }
    }

    private isThisComponentContainer(container: HTMLElement): boolean {
        // Check if this container belongs to this component instance
        const nativeElement = this.elementRef.nativeElement as HTMLElement;
        return container.contains(nativeElement) ||
            nativeElement.closest('.image-container') === container;
    }

    private updateTooltipPosition(event: MouseEvent): void {
        // Estimate tooltip size for positioning
        const estimatedWidth = 350;
        const estimatedHeight = 350;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Position tooltip near the mouse but ensure it stays in viewport
        let x = event.clientX + 10;
        let y = event.clientY + 10;

        // Adjust if tooltip would go off screen
        if (x + estimatedWidth > viewportWidth) {
            x = event.clientX - estimatedWidth - 10;
        }
        if (y + estimatedHeight > viewportHeight) {
            y = event.clientY - estimatedHeight - 10;
        }

        // Ensure tooltip doesn't go off the left or top edges
        x = Math.max(10, x);
        y = Math.max(10, y);

        this.tooltipPosition = { x, y };
    }
}
