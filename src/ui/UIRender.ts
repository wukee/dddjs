import Base from "../Base";
import { UIObject } from "./UIObject";
import { UIShader } from "./UIShader";
import { UICamera } from "./UICamera";
import { UICanvas } from "./UICanvas";

export class UIRender extends Base {
  public ctx: WebGLRenderingContext | null;
  private pool: Object[] = [];
  constructor(public canvas: UICanvas, public camera: UICamera) {
    super()
    this.ctx = canvas.ctx;
  }

  // create buffer object
  createBO(data: Float32Array, is_index: boolean = false, buffer_static: any = true) {
    if (this.ctx === null) return null;
    let gl = this.ctx;
    let usage: number | null = null;
    let target = is_index ? gl.ELEMENT_ARRAY_BUFFER : gl.ARRAY_BUFFER;
    switch (buffer_static) {
      case false:
      case "dynamic": {
        usage = gl.DYNAMIC_DRAW;
      } break;
      case "stream": {
        usage = gl.STREAM_DRAW;
      } break;
      case true:
      case 'static':
      default: {
        usage = gl.STATIC_DRAW;
      } break;
    }
    var bo = gl.createBuffer();
    gl.bindBuffer(target, bo);
    gl.bufferData(target, data, usage);
    gl.bindBuffer(target, null);

    return bo;
  }

  addRenderObject(obj: UIObject, shader: UIShader) {
    let vbo = this.createBO(obj.vertices, false, true);
    let ibo = this.createBO(obj.indices, true, true);

    this.pool.push({
      obj,
      vbo,
      ibo,
      shader
    });
  }

  renderItem(item: any) {
    if (this.ctx === null) return;
    let gl = this.ctx, shader = item.shader, vbo = item.vbo, ibo = item.ibo, obj = item.obj;
    shader.use();


    let proj_matrix = this.camera._projectMatrix.elements;
    let view_matrix = this.camera._viewMatrix.elements;
    let mov_matrix = obj._modelMatrix.elements;
    shader.uploadItem('Pmatrix', proj_matrix)
    shader.uploadItem('Vmatrix', view_matrix)
    shader.uploadItem('Mmatrix', mov_matrix)

    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.vertexAttribPointer(shader.location('position'), 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shader.location('position'));
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.drawElements(gl.TRIANGLES, obj.indices.length, gl.UNSIGNED_SHORT, 0);
  }

  clean() {
    if (this.ctx === null) return;
    let gl = this.ctx;
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clearColor(0.5, 0.5, 0.5, 0.9);
    gl.clearDepth(1.0);

    gl.viewport(0.0, 0.0, this.canvas.width, this.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  render() {
    this.clean()
    this.pool.forEach(item => {
      this.renderItem(item);
    })
  }

  get className() {
    return 'UIRender';
  }

  clone() {
    // return new UIShader(this.ctx, this.vertSource, this.fragSource, this.name);
  }

  toString() {
    return '()';
  }
}