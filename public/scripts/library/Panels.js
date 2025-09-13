import { ElementFactory } from "./Factory.js";
export class Panel {
    constructor() {
        this.elements = [];
        this.currentType = '';
        this.elementFactory = new ElementFactory();
        this.currentId = 1;
        this._selectedElement = null;
        this._isDragging = false;
        this._isResizing = false;
        this._firstMouseX = 0;
        this._firstMouseY = 0;
        this._lastMouseX = 0;
        this._lastMouseY = 0;
    }
    addElement(element) {
        this.elements.push(element);
    }
    createElement(mouseX, mouseY) {
        let id = this.currentId;
        let element = this.elementFactory.createElement(mouseX, mouseY, this.currentType);
        element._id = id;
        this.addElement(element);
        this.currentId += 1;
        return id;
    }
    cloneElement(mouseX, mouseY) {
        let id = this.currentId;
        if (this._selectedElement) {
            let element = this._selectedElement.clone(mouseX, mouseY);
            element._id = id;
            this.addElement(element);
            this.currentId += 1;
        }
        return id;
    }
    deleteElement(id) {
        for (let index = 0; index < this.elements.length; index++) {
            if (this.elements[index]._id === id) {
                this.elements.splice(index, 1);
                this._selectedElement = null;
            }
            else {
                console.log("problem");
            }
        }
    }
    findElement(id) {
        for (let index = 0; index < this.elements.length; index++) {
            if (this.elements[index]._id === id) {
                return this.elements[index];
            }
        }
        throw new Error("Does not exist");
    }
    swap(component1Id, component2Id) {
        let index1 = -1;
        let index2 = -1;
        for (let i = 0; i < this.elements.length; i++) {
            if (this.elements[i]._id === component1Id) {
                index1 = i;
            }
            if (this.elements[i]._id === component2Id) {
                index2 = i;
            }
            // Optimization: If both are found, no need to continue
            if (index1 !== -1 && index2 !== -1) {
                break;
            }
        }
        // Perform the swap if both IDs were found
        if (index1 !== -1 && index2 !== -1) {
            let w = [this.elements[index2], this.elements[index1]];
            let v = [this.elements[index1], this.elements[index2]] = w; // ES6 array destructuring swap
        }
        else {
            console.warn(`Could not swap: One or both IDs (${component1Id}, ${component2Id}) not found in the array.`);
        }
    }
}
