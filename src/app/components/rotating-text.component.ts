import {
  AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Inject,
  Input, NgZone, OnDestroy, OnInit, Output, PLATFORM_ID, Renderer2, ViewChild
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

/** Types to mirror your React props */
type Transition = { type?: 'spring'; damping?: number; stiffness?: number; duration?: number; ease?: string } | undefined;
type StaggerFrom = 'first' | 'last' | 'center' | 'random' | number;
type SplitBy = 'characters' | 'words' | 'lines' | string;

@Component({
  selector: 'app-rotating-text',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span #root
          class="rt-root flex flex-wrap whitespace-pre-wrap relative"
          [ngClass]="mainClassName"
          [attr.data-index]="currentTextIndex"
          aria-live="polite">
      <span class="sr-only">{{ texts[currentTextIndex] || '' }}</span>
      <!-- single active layer; we sequence exit->cleanup->enter to mimic AnimatePresence mode='wait' -->
      <span #layer class="rt-layer flex flex-wrap whitespace-pre-wrap relative" aria-hidden="true"></span>
    </span>
  `,
  styles: [`
    .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
    .rt-root{display:inline-flex;position:relative}
    .rt-layer{display:inline-flex;position:relative}
    .rt-word{display:inline-flex}
    .rt-char{display:inline-block;will-change:transform,opacity}
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RotatingTextComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('root',  { static: true }) rootRef!: ElementRef<HTMLElement>;
  @ViewChild('layer', { static: true }) layerRef!: ElementRef<HTMLElement>;

  /** ===== React-like inputs (names & defaults preserved) ===== */
  @Input() texts: string[] = [];

  @Input() transition: Transition = { type: 'spring', damping: 25, stiffness: 300 };
  @Input() initial:  { y?: string|number; opacity?: number } = { y: '100%',  opacity: 0 };
  @Input() animate:  { y?: string|number; opacity?: number } = { y: 0,       opacity: 1 };
  @Input() exit:     { y?: string|number; opacity?: number } = { y: '-120%', opacity: 0 };

  @Input() animatePresenceMode: 'wait' | 'sync' = 'wait';               // we honor 'wait' semantics
  @Input() animatePresenceInitial = false;                               // first mount animates only if true

  @Input() rotationInterval = 2000;
  @Input() staggerDuration = 0;                                          // seconds
  @Input() staggerFrom: StaggerFrom = 'first';
  @Input() loop = true;
  @Input() auto = true;
  @Input() splitBy: SplitBy = 'characters';

  @Input() mainClassName = '';               // container classes
  @Input() splitLevelClassName = '';         // wrapper per word/line
  @Input() elementLevelClassName = '';       // per-character

  /** matches the onNext callback */
  @Output() onNext = new EventEmitter<number>();

  currentTextIndex = 0;

  private isBrowser: boolean;
  private gsap: any | null = null;
  private intervalId: any = null;
  private animating = false; // prevents overlap (wait semantics)

  constructor(
    private r: Renderer2,
    private zone: NgZone,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.texts || this.texts.length === 0) this.texts = [''];
  }

  async ngAfterViewInit(): Promise<void> {
    if (!this.isBrowser) return;

    // Browser-only lazy import to avoid SSR "window is not defined"
    const mod = await import('gsap');
    this.gsap = (mod as any).gsap || (mod as any).default || mod;

    // initial render
    this.renderCurrent(!this.animatePresenceInitial);

    if (this.auto) {
      this.zone.runOutsideAngular(() => {
        this.intervalId = setInterval(() => this.next(), this.rotationInterval);
      });
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  /** ===== Public-like controls (same names as React) ===== */
  next(): void {
    if (this.animating) return;
    const nextIndex = this.currentTextIndex === this.texts.length - 1 ? (this.loop ? 0 : this.currentTextIndex) : this.currentTextIndex + 1;
    if (nextIndex !== this.currentTextIndex) this.swapTo(nextIndex);
  }
  previous(): void {
    if (this.animating) return;
    const prevIndex = this.currentTextIndex === 0 ? (this.loop ? this.texts.length - 1 : 0) : this.currentTextIndex - 1;
    if (prevIndex !== this.currentTextIndex) this.swapTo(prevIndex);
  }
  jumpTo(index: number): void {
    if (this.animating) return;
    const clamped = Math.max(0, Math.min(index, this.texts.length - 1));
    if (clamped !== this.currentTextIndex) this.swapTo(clamped);
  }
  reset(): void { this.jumpTo(0); }

  /** ===== Core: AnimatePresence mode='wait' semantics (sequence) ===== */
  private async swapTo(newIndex: number): Promise<void> {
    if (!this.gsap) return;
    this.animating = true;

    const layer = this.layerRef.nativeElement;
    const outChars = Array.from(layer.querySelectorAll<HTMLElement>('.rt-char'));
    const totalOut = outChars.length || 1;

    // EXIT current (staggered)
    await Promise.all(outChars.map((el, i) => this.tween(el, {
      y: this.val(this.exit.y, '-120%'),
      opacity: this.val(this.exit.opacity, 0),
      delay: this.getStaggerDelay(i, totalOut),
      direction: 'to'
    })));

    // CLEANUP old DOM
    layer.innerHTML = '';

    // ENTER next
    this.currentTextIndex = newIndex;
    this.renderCurrent(/*applyInitial*/ true);

    const inChars = Array.from(layer.querySelectorAll<HTMLElement>('.rt-char'));
    const totalIn = inChars.length || 1;

    await Promise.all(inChars.map((el, i) => this.tween(el, {
      fromY: this.val(this.initial.y, '100%'),
      fromOpacity: this.val(this.initial.opacity, 0),
      toY: this.val(this.animate.y, 0),
      toOpacity: this.val(this.animate.opacity, 1),
      delay: this.getStaggerDelay(i, totalIn),
      direction: 'fromTo'
    })));

    this.onNext.emit(newIndex);
    this.animating = false;
  }

  /** Create DOM for current index; optionally apply initial pose */
  private renderCurrent(applyInitial: boolean): void {
    const layer = this.layerRef.nativeElement;
    layer.innerHTML = '';

    const frag = document.createDocumentFragment();
    const items = this.buildElements(this.texts[this.currentTextIndex]);

    items.forEach(w => {
      const word = this.r.createElement('span');
      this.r.addClass(word, 'rt-word');
      if (this.splitLevelClassName) this.addClasses(word, this.splitLevelClassName);

      w.characters.forEach((ch: string) => {
        const span = this.r.createElement('span') as HTMLElement;
        this.r.addClass(span, 'rt-char');
        if (this.elementLevelClassName) this.addClasses(span, this.elementLevelClassName);
        span.textContent = ch;

        if (applyInitial) {
          const y = this.val(this.initial.y, '100%');
          const op = this.val(this.initial.opacity, 0);
          span.style.transform = `translateY(${typeof y === 'number' ? `${y}px` : y})`;
          span.style.opacity = String(op);
        }

        this.r.appendChild(word, span);
      });

      if (w.needsSpace) this.r.appendChild(word, this.r.createText(' '));
      this.r.appendChild(frag, word);
    });

    this.r.appendChild(layer, frag);
  }

  /** ====== Helpers matching the React logic ====== */
  private buildElements(text: string): Array<{ characters: string[]; needsSpace: boolean }> {
    const splitIntoCharacters = (t: string) => {
      try {
        // @ts-ignore
        if (typeof Intl !== 'undefined' && Intl.Segmenter) {
          // @ts-ignore
          const seg = new Intl.Segmenter('en', { granularity: 'grapheme' });
          // @ts-ignore
          return Array.from(seg.segment(t), (s: any) => s.segment);
        }
      } catch {}
      return Array.from(t);
    };

    if (this.splitBy === 'characters') {
      const words = text.split(' ');
      return words.map((word, i) => ({
        characters: splitIntoCharacters(word),
        needsSpace: i !== words.length - 1
      }));
    }
    if (this.splitBy === 'words') {
      const parts = text.split(' ');
      return parts.map((w, i, arr) => ({ characters: [w], needsSpace: i !== arr.length - 1 }));
    }
    if (this.splitBy === 'lines') {
      const parts = text.split('\n');
      return parts.map((line, i, arr) => ({ characters: [line], needsSpace: i !== arr.length - 1 }));
    }
    const parts = text.split(String(this.splitBy));
    return parts.map((p, i, arr) => ({ characters: [p], needsSpace: i !== arr.length - 1 }));
  }

  private getStaggerDelay(index: number, totalChars: number): number {
    const s = this.staggerDuration || 0;
    const from = this.staggerFrom;
    if (from === 'first') return index * s;
    if (from === 'last')  return (totalChars - 1 - index) * s;
    if (from === 'center') {
      const c = Math.floor(totalChars / 2);
      return Math.abs(c - index) * s;
    }
    if (from === 'random') {
      const ri = Math.floor(Math.random() * totalChars);
      return Math.abs(ri - index) * s;
    }
    if (typeof from === 'number') return Math.abs(from - index) * s;
    return index * s;
  }

  /** tiny gsap wrapper returning a Promise to sequence like AnimatePresence 'wait' */
  private tween(el: HTMLElement, opts: {
    y?: string|number; opacity?: number; delay?: number; direction: 'to'|'fromTo';
    fromY?: string|number; fromOpacity?: number; toY?: string|number; toOpacity?: number;
  }): Promise<void> {
    const duration = this.resolveDuration();
    const ease = this.transition?.ease ?? 'power3.out';

    return new Promise<void>((res) => {
      if (opts.direction === 'to') {
        this.gsap!.to(el, {
          y: this.cssTranslate(opts.y), opacity: opts.opacity,
          duration, ease, delay: opts.delay ?? 0, onComplete: () => res()
        });
      } else {
        this.gsap!.fromTo(el,
          { y: this.cssTranslate(opts.fromY), opacity: opts.fromOpacity },
          { y: this.cssTranslate(opts.toY),   opacity: opts.toOpacity,
            duration, ease, delay: opts.delay ?? 0, onComplete: () => res() }
        );
      }
    });
  }

  private resolveDuration(): number {
    if (this.transition?.type === 'spring') {
      const d = this.transition.damping ?? 25;
      const k = this.transition.stiffness ?? 300;
      return Math.max(0.35, Math.min(0.9, (d / 60) + (500 / (k + 1))));
    }
    return this.transition?.duration ?? 0.55;
  }

  private cssTranslate(v: string | number | undefined): string | number | undefined {
    if (v === undefined) return v;
    return typeof v === 'number' ? `${v}px` : v;
  }

  private val<T>(v: T | undefined, d: T): T { return v === undefined ? d : v; }

  private addClasses(el: Element, cls: string) {
    cls.split(/\s+/).filter(Boolean).forEach(c => this.r.addClass(el, c));
  }
}
