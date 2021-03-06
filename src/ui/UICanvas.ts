import Base from "../Base";
import { CanvasEvent } from "../event/CanvasEvent";

export class UICanvas extends Base {
  ctx: WebGLRenderingContext | null;
  x: number;
  y: number;
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
  constructor(public canvas: HTMLCanvasElement) {
    super()
    if (Object.prototype.toString.call(canvas) !== "[object HTMLCanvasElement]") {
      throw new TypeError('The first paramter is not the HTMLCanvasElement type.')
    }
    this.initEvent();
    this.initCanvasCtx();
    this.boundingRect();
    this.resize();
  }

  initEvent() {
    return new CanvasEvent(this.canvas);
  }

  private initCanvasCtx() {

    this.ctx = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
    if (this.ctx === null) {
      throw new Error('Your browser not support the webgl .')
    } else {
      return this.ctx;
    }
  }

  private boundingRect() {
    let clientRect = this.canvas.getBoundingClientRect();
    this.x = clientRect.left;
    this.y = clientRect.right;
    this.left = clientRect.left;
    this.top = clientRect.right;
    this.right = clientRect.right;
    this.bottom = clientRect.bottom;
    this.width = clientRect.width;
    this.height = clientRect.height;

    // fix : canvas style- width and height, not the same as attribute
    this.canvas.setAttribute('width', `${this.width}`);
    this.canvas.setAttribute('height', `${this.height}`);

    return clientRect;
  }

  resize() {
    window.addEventListener('resize', () => this.boundingRect)
  }

  get gl() {
    return this.ctx;
  }


  get className() {
    return 'Node';
  }

  clone() {
    return new UICanvas(this.canvas);
  }

  toString() {
    return '()';
  }
}