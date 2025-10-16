import {
  AfterViewInit, ChangeDetectionStrategy, Component, ElementRef,
  EventEmitter, Inject, Input, OnChanges, OnDestroy, Output,
  PLATFORM_ID, SimpleChanges, ViewChild
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';

type SplitKind = 'chars' | 'words' | 'lines' | 'chars,words' | 'words,lines' | 'chars,words,lines';
type GVars = Record<string, any>;

@Component({
  selector: 'app-split-text',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container [ngSwitch]="tag">
      <h1 *ngSwitchCase="'h1'" #splitEl [style.textAlign]="textAlign" class="split-parent overflow-hidden inline-block whitespace-normal" [ngClass]="className" [style.color]="color">{{ text }}</h1>
      <h2 *ngSwitchCase="'h2'" #splitEl [style.textAlign]="textAlign" class="split-parent overflow-hidden inline-block whitespace-normal" [ngClass]="className" [style.color]="color">{{ text }}</h2>
      <h3 *ngSwitchCase="'h3'" #splitEl [style.textAlign]="textAlign" class="split-parent overflow-hidden inline-block whitespace-normal" [ngClass]="className" [style.color]="color">{{ text }}</h3>
      <h4 *ngSwitchCase="'h4'" #splitEl [style.textAlign]="textAlign" class="split-parent overflow-hidden inline-block whitespace-normal" [ngClass]="className" [style.color]="color">{{ text }}</h4>
      <h5 *ngSwitchCase="'h5'" #splitEl [style.textAlign]="textAlign" class="split-parent overflow-hidden inline-block whitespace-normal" [ngClass]="className" [style.color]="color">{{ text }}</h5>
      <h6 *ngSwitchCase="'h6'" #splitEl [style.textAlign]="textAlign" class="split-parent overflow-hidden inline-block whitespace-normal" [ngClass]="className" [style.color]="color">{{ text }}</h6>
      <p  *ngSwitchDefault      #splitEl [style.textAlign]="textAlign" class="split-parent overflow-hidden inline-block whitespace-normal" [ngClass]="className" [style.color]="color">{{ text }}</p>
    </ng-container>
  `,
  styles: [`
    .split-parent { will-change: transform, opacity; }
    .split-line { display:block; overflow:hidden; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SplitTextComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('splitEl', { static: false }) splitEl!: ElementRef<HTMLElement>;

  // Inputs
  @Input() text = '';
  @Input() className = '';
  @Input() color?: string;
  @Input() delay = 100;            // ms
  @Input() duration = 0.6;         // seconds
  @Input() ease = 'power3.out';
  @Input() splitType: SplitKind = 'chars';
  @Input() from: GVars = { opacity: 0, y: 40 };
  @Input() to:   GVars = { opacity: 1, y: 0 };
  @Input() threshold = 0.1;
  @Input() rootMargin = '-100px';
  @Input() textAlign: 'left'|'center'|'right'|'justify' = 'center';
  @Input() tag: 'p'|'h1'|'h2'|'h3'|'h4'|'h5'|'h6' = 'p';

  // Output
  @Output() letterAnimationComplete = new EventEmitter<void>();

  private splitInstance?: any;
  private fontsLoaded = false;
  private isBrowser: boolean;

  // Hold references to dynamically-loaded plugins
  private SplitText?: any;
  private ScrollTrigger?: any;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  async ngAfterViewInit() {
    if (!this.isBrowser) return; // SSR: do nothing

    // Load fonts (best effort, browser only)
    await this.waitForFonts();
    this.fontsLoaded = true;

    // Dynamically import plugins only in the browser
    const [{ ScrollTrigger }, { SplitText }] = await Promise.all([
      import('gsap/ScrollTrigger'),
      import('gsap/SplitText'),
    ]);
    this.ScrollTrigger = ScrollTrigger;
    this.SplitText = SplitText;
    gsap.registerPlugin(ScrollTrigger, SplitText);

    this.setup();
  }

  ngOnChanges(_: SimpleChanges) {
    if (!this.isBrowser || !this.fontsLoaded || !this.SplitText) return;
    if (this.splitEl) this.setup();
  }

  ngOnDestroy() { this.cleanup(); }

  private async waitForFonts() {
    try {
      // @ts-ignore
      if (document?.fonts?.status === 'loaded') return;
      // @ts-ignore
      await document?.fonts?.ready;
    } catch { /* ignore if unsupported */ }
  }

  private computeStart(): string {
    const startPct = (1 - this.threshold) * 100;
    const m = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(this.rootMargin ?? '');
    const v = m ? parseFloat(m[1]) : 0;
    const u = m ? (m[2] || 'px') : 'px';
    const sign = v === 0 ? '' : (v < 0 ? `-=${Math.abs(v)}${u}` : `+=${v}${u}`);
    return `top ${startPct}%${sign}`;
  }

  private setup() {
    if (!this.isBrowser || !this.SplitText) return;

    const el = this.splitEl?.nativeElement;
    if (!el || !this.text) return;

    this.cleanup();

    this.splitInstance = new this.SplitText(el, {
      type: this.splitType,
      smartWrap: true,
      autoSplit: this.splitType === 'lines',
      linesClass: 'split-line',
      wordsClass: 'split-word',
      charsClass: 'split-char',
      reduceWhiteSpace: false,
      onSplit: (self: any) => {
        // Determine targets (never undefined)
        let targets: Element[] = [];
        if (this.splitType.includes('chars')  && Array.isArray(self.chars)  && self.chars.length)  targets = self.chars;
        if (!targets.length && this.splitType.includes('words') && Array.isArray(self.words) && self.words.length) targets = self.words;
        if (!targets.length && this.splitType.includes('lines') && Array.isArray(self.lines) && self.lines.length) targets = self.lines;
        if (!targets.length) {
          const fallback = (self.chars?.length ? self.chars
                         : self.words?.length ? self.words
                         : self.lines?.length ? self.lines
                         : [el]);
          targets = fallback as Element[];
        }

        return gsap.fromTo(
          targets,
          { ...this.from },
          {
            ...this.to,
            duration: this.duration,
            ease: this.ease,
            stagger: this.delay / 1000,
            scrollTrigger: {
              trigger: el,
              start: this.computeStart(),
              once: true,
              fastScrollEnd: true,
              anticipatePin: 0.4
            },
            willChange: 'transform, opacity',
            force3D: true,
            onComplete: () => this.letterAnimationComplete.emit()
          }
        );
      }
    });
  }

  private cleanup() {
    const el = this.splitEl?.nativeElement;
    if (this.isBrowser && this.ScrollTrigger && el) {
      this.ScrollTrigger.getAll().forEach((st: any) => { if (st.trigger === el) st.kill(); });
    }
    try { this.splitInstance?.revert(); } catch {}
    this.splitInstance = undefined;
  }
}
