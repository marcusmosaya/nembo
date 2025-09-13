import { SelectState } from "./States.js";
export class MouseActionContext {
    constructor(panel) {
        this._state = new SelectState();
        this._canvas = panel;
    }
    setState(state) {
        this._state = state;
    }
    getState() {
        return this._state;
    }
    mouseDown(e) {
        this._state.handleMouseDown(e, this._canvas);
    }
    mouseUp(e) {
        this._state.handleMouseUp(e, this._canvas);
    }
    mouseMove(e) {
        this._state.handleMouseMove(e, this._canvas);
    }
    contextMenu(e) {
        this._state.handleContextMenu(e, this._canvas);
    }
}
