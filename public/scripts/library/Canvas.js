import { MouseActionContext } from "./Contexts.js";
import { listComponents } from "../utilities.js";
export class Canvas {
    constructor(canvas, panel) {
        this._canvas = canvas;
        this._ctx = canvas.getContext('2d') || new CanvasRenderingContext2D();
        this._panel = panel;
        this._mouseActionCtx = new MouseActionContext(this);
        this.addEventListeners();
    }
    setPanel(panel) {
        this._panel = panel;
    }
    drawAll() {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._panel.elements.forEach(element => {
            element.draw(this._ctx);
        });
        listComponents();
    }
    addEventListeners() {
        this._canvas.addEventListener('mousedown', (e) => { this._mouseActionCtx.mouseDown(e); });
        this._canvas.addEventListener('mousemove', (e) => { this._mouseActionCtx.mouseMove(e); });
        this._canvas.addEventListener('mouseup', (e) => { this._mouseActionCtx.mouseUp(e); });
    }
}
