import { ChartBase } from '../core/chart-base';
import { SVGRenderer } from '../renderers/svg-renderer';
import { CanvasRenderer } from '../renderers/canvas-renderer';
import { ChartTypes } from '../types/chart-types';
import { MathUtils } from '../utils/math-utils';
import { EasingFunctions } from './easing-functions';

interface Animation {
  id: string;
  element: ChartElement;
  properties: AnimationProperties;
  startTime: number;
  duration: number;
  easing: EasingFunction;
  status: 'running' | 'paused' | 'completed';
}

interface AnimationProperties {
  [key: string]: number | string;
}

type EasingFunction = (t: number) => number;

type ChartElement = SVGElement | HTMLCanvasElement;

export class AnimationManager {
  private activeAnimations: Map<string, Animation>;
  private animationQueue: Queue<Animation>;
  private renderer: SVGRenderer | CanvasRenderer;
  private lastFrameTime: number;
  private animationFrameId: number | null;

  constructor(renderer: SVGRenderer | CanvasRenderer) {
    this.activeAnimations = new Map();
    this.animationQueue = new Queue<Animation>();
    this.renderer = renderer;
    this.lastFrameTime = 0;
    this.animationFrameId = null;
  }

  public startAnimation(
    element: ChartElement,
    properties: AnimationProperties,
    duration: number,
    easing: EasingFunction
  ): string {
    const animationId = this.generateUniqueId();
    const animation: Animation = {
      id: animationId,
      element,
      properties,
      startTime: performance.now(),
      duration,
      easing,
      status: 'running',
    };

    this.activeAnimations.set(animationId, animation);

    if (this.activeAnimations.size === 1) {
      this.startAnimationLoop();
    }

    return animationId;
  }

  public stopAnimation(animationId: string): void {
    const animation = this.activeAnimations.get(animationId);
    if (animation) {
      animation.status = 'completed';
      this.activeAnimations.delete(animationId);
    }

    if (this.activeAnimations.size === 0) {
      this.stopAnimationLoop();
    }
  }

  public pauseAnimation(animationId: string): void {
    const animation = this.activeAnimations.get(animationId);
    if (animation && animation.status === 'running') {
      animation.status = 'paused';
    }
  }

  public resumeAnimation(animationId: string): void {
    const animation = this.activeAnimations.get(animationId);
    if (animation && animation.status === 'paused') {
      animation.status = 'running';
      animation.startTime = performance.now() - (animation.duration * (performance.now() - animation.startTime) / animation.duration);
    }
  }

  private updateAnimations(timestamp: number): void {
    const deltaTime = timestamp - this.lastFrameTime;
    this.lastFrameTime = timestamp;

    for (const [id, animation] of this.activeAnimations) {
      if (animation.status === 'running') {
        const progress = Math.min((timestamp - animation.startTime) / animation.duration, 1);
        const easedProgress = animation.easing(progress);

        for (const [prop, endValue] of Object.entries(animation.properties)) {
          const startValue = parseFloat(getComputedStyle(animation.element as Element).getPropertyValue(prop));
          const currentValue = MathUtils.lerp(startValue, parseFloat(endValue as string), easedProgress);
          
          if (this.renderer instanceof SVGRenderer) {
            (animation.element as SVGElement).setAttribute(prop, currentValue.toString());
          } else if (this.renderer instanceof CanvasRenderer) {
            // For CanvasRenderer, we need to update the element's properties
            // and then call a redraw method on the renderer
            (animation.element as any)[prop] = currentValue;
            this.renderer.redraw();
          }
        }

        if (progress === 1) {
          this.stopAnimation(id);
        }
      }
    }

    if (this.activeAnimations.size > 0) {
      this.animationFrameId = requestAnimationFrame(this.updateAnimations.bind(this));
    }
  }

  private startAnimationLoop(): void {
    if (!this.animationFrameId) {
      this.lastFrameTime = performance.now();
      this.animationFrameId = requestAnimationFrame(this.updateAnimations.bind(this));
    }
  }

  private stopAnimationLoop(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private generateUniqueId(): string {
    return `animation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

class Queue<T> {
  private items: T[] = [];

  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  peek(): T | undefined {
    return this.items[0];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }
}