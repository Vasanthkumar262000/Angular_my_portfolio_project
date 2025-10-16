import { Directive, ElementRef, Inject, Input, OnDestroy, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appHoverGlow]',
  standalone: true,
})
export class HoverGlowDirective implements OnInit, OnDestroy {
  @Input('appHoverGlow') haloColor: string | null = null;  // e.g. "#22d3ee"
  @Input() haloSize = 120;                                 // px

  private haloEl?: HTMLElement;
  private unsubs: Array<() => void> = [];
  private isBrowser: boolean;

  constructor(
    private host: ElementRef<HTMLElement>,
    private r: Renderer2,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    const el = this.host.nativeElement;
    this.r.addClass(el, 'hover-glow');

    // Create halo element
    this.haloEl = this.r.createElement('span');
    this.r.addClass(this.haloEl, 'glow-halo');
    this.r.appendChild(el, this.haloEl);

    // Initial customizations
    if (this.haloColor) el.style.setProperty('--halo-color', this.haloColor);
    if (this.haloSize)  el.style.setProperty('--halo-size', `${this.haloSize}px`);

    if (!this.isBrowser) return;

    // Mouse move updates CSS vars for position
    this.unsubs.push(this.r.listen(el, 'mousemove', (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--gx', `${e.clientX - rect.left}px`);
      el.style.setProperty('--gy', `${e.clientY - rect.top}px`);
    }));
    // Enter/leave toggles visibility
    this.unsubs.push(this.r.listen(el, 'mouseenter', () => this.r.addClass(el, 'is-hovering')));
    this.unsubs.push(this.r.listen(el, 'mouseleave', () => this.r.removeClass(el, 'is-hovering')));
  }

  ngOnDestroy(): void { this.unsubs.forEach(u => u()); }
}
