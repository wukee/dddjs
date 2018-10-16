import { Camera } from "./Camera";
import { Mat4 } from "../math/Mat4";

export class OrthographicCamera extends Camera {
  constructor(w: number = 1, h: number = 1, near: number = 1.0, far: number = 1000) {
    super('Orthographic Camera');
    this._perspectMatrix = Mat4.orthographicWHNF(w, h, near, far);
  }
}