"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainPanelIterator = void 0;
class MainPanelIterator {
    constructor(components) {
        this._currentIndex = 0;
        this._components = components;
    }
    hasNext() {
        if (this._currentIndex < this._components.length) {
            return true;
        }
        else {
            return false;
        }
    }
    next() {
        let component = this._components[this._currentIndex];
        this._currentIndex++;
        return component;
    }
    findComponent(component) {
        while (this.hasNext()) {
            let nextComponent = this.next();
            if (nextComponent === component) {
                this._currentIndex = 0;
                return nextComponent;
            }
        }
    }
    findComponentIndex(component) {
        while (this.hasNext()) {
            let nextComponent = this.next();
            if (nextComponent === component) {
                let temp = this._currentIndex;
                this._currentIndex = 0;
                return temp;
            }
        }
    }
    getMemory() {
    }
}
exports.MainPanelIterator = MainPanelIterator;
