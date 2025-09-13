import { Rectangle, Arc } from "./Components.js";
import { showProperties, toDictionary } from "../utilities.js";
export class Command {
    constructor(receiver) {
        this._receiver = receiver;
    }
    execute() {
    }
    undo() {
    }
}
export class CreateElement {
    constructor(receiver, mouseX, mouseY) {
        this._elementId = 0;
        this._receiver = receiver;
        this._mouseX = mouseX;
        this._mouseY = mouseY;
    }
    execute() {
        let id = this._receiver.createElement(this._mouseX, this._mouseY);
        this._elementId = id;
    }
    undo() {
        this._receiver.deleteElement(this._elementId);
    }
}
export class DeleteElement {
    constructor(receiver) {
        this._elementId = 0;
        this._properties = {};
        this._receiver = receiver;
    }
    execute(id) {
        this._elementId = id;
        this._properties = toDictionary(Object.entries(this._receiver.findElement(id)));
        this._receiver.deleteElement(id);
    }
    undo() {
    }
}
export class SetState extends Command {
    constructor(receiver, state) {
        super(receiver);
        this._undoState = undefined;
        this._redoState = null;
        this._receiver = receiver;
        this._initialState = state;
    }
    execute() {
        this._undoState = this._receiver.getState();
        this._receiver.setState(this._initialState);
    }
    undo() {
        this._redoState = this._receiver.getState();
        if (typeof this._undoState !== "undefined") {
            this._receiver.setState(this._undoState);
        }
    }
}
export class Layer extends Command {
    constructor(receiver, index1, index2) {
        super(receiver);
        this._receiver = receiver;
        this._index1 = index1;
        this._index2 = index2;
    }
    execute() {
        this._receiver.swap(this._index1, this._index2);
    }
    undo() {
        this._receiver.swap(this._index2, this._index1);
    }
}
export class Resize extends Command {
    constructor(receiver, x, y) {
        super(receiver);
        this._credentials = {};
        this._receiver = receiver;
        this._element = receiver._selectedElement;
        this._dx = x;
        this._dy = y;
    }
    execute() {
        if (this._element) {
            if (this._element instanceof Rectangle) {
                let data = { width: 0, height: 0 };
                data['width'] = this._element._structure['width'];
                data['height'] = this._element._structure['height'];
                this._credentials = data;
            }
            else if (this._receiver._selectedElement instanceof Arc) {
                this._credentials['radius'] = this._receiver._selectedElement._structure['radius'];
            }
            this._element.resize(this._dx, this._dy);
        }
    }
    undo() {
        if (this._element) {
            if (this._element instanceof Rectangle) {
                this._element._structure['width'] = this._credentials['width'];
                this._element._structure['height'] = this._credentials['height'];
            }
            else if (this._element instanceof Arc) {
                this._element._structure['radius'] = this._credentials['radius'];
            }
            this._element.resize(this._dx, this._dy);
        }
    }
}
export class Move extends Command {
}
export class Select extends Command {
    constructor(receiver, element) {
        super(receiver);
        this._previousElement = null;
        this._receiver = receiver;
        this._selectElement = element;
    }
    execute() {
        if (this._receiver) {
            this._previousElement = this._receiver._selectedElement;
            if (this._previousElement)
                this._previousElement._isSelected = false;
            this._receiver._selectedElement = this._selectElement;
            if (this._receiver._selectedElement)
                this._receiver._selectedElement._isSelected = true;
            showProperties();
        }
    }
    undo() {
        this._selectElement = this._receiver._selectedElement;
        if (this._selectElement)
            this._selectElement._isSelected = false;
        this._receiver._selectedElement = this._previousElement;
        if (this._previousElement)
            this._previousElement._isSelected = true;
        showProperties();
    }
}
export class Update extends Command {
    constructor(receiver, newProperties) {
        super(receiver);
        this._receiver = receiver;
        this._initialProperties = receiver.getProperties();
        this._newProperties = newProperties;
    }
    execute() {
        this._receiver.update(this._newProperties);
    }
    undo() {
        this._receiver.update(this._initialProperties);
    }
}
export class Hide extends Command {
    constructor(receiver) {
        super(receiver);
        this._receiver = receiver;
    }
    execute() {
        this._receiver._isHidden = true;
    }
    undo() {
        this._receiver._isHidden = false;
    }
}
export class Unhide extends Command {
    constructor(receiver) {
        super(receiver);
        this._receiver = receiver;
    }
    execute() {
        this._receiver._isHidden = false;
    }
    undo() {
        this._receiver._isHidden = true;
    }
}
export class CloneElement extends Command {
    constructor(receiver, mouseX, mouseY) {
        super(receiver);
        this._elementId = 0;
        this._receiver = receiver;
        this._mouseX = mouseX;
        this._mouseY = mouseY;
    }
    execute() {
        let id = 0;
        if (this._receiver._selectedElement) {
            id = this._receiver.cloneElement(this._mouseX, this._mouseY);
        }
        this._elementId = id;
    }
    undo() {
        this._receiver.deleteElement(this._elementId);
    }
}
export class Invoker {
    constructor() {
        this.cmd = null;
    }
    ;
    setCommand(_cmd) {
        this.cmd = _cmd;
    }
}
