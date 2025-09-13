import { Select, CreateElement, CloneElement } from "./Commands.js";
import { drawAlignment, showProperties } from "../utilities.js";
import { canvas, historyManager, canvas_class, setAlignmentDrawn, getAlignmentDrawn } from "../index.js";
export class IState {
    handleMouseDown(e, _canvas) {
    }
    handleMouseMove(e, _canvas) {
    }
    handleMouseUp(e, _canvas) {
    }
    handleContextMenu(e, _canvas) {
    }
}
export class SelectState extends IState {
    handleMouseDown(e, _canvas) {
        const context = _canvas._ctx;
        const rect = _canvas._canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        setAlignmentDrawn(false);
        if (_canvas._panel._selectedElement && _canvas._panel._selectedElement.isPointOnResizeHandle(mouseX, mouseY)) {
            _canvas._panel._isResizing = true;
            _canvas._panel._firstMouseX = mouseX;
            _canvas._panel._firstMouseY = mouseY;
            _canvas._panel._lastMouseX = mouseX;
            _canvas._panel._lastMouseY = mouseY;
            _canvas._canvas.style.cursor = 'nwse-resize';
            return;
        }
        let foundShape = null;
        for (let i = _canvas._panel.elements.length - 1; i >= 0; i--) {
            if (_canvas._panel.elements[i].isPointInside(mouseX, mouseY)) {
                foundShape = _canvas._panel.elements[i];
                break;
            }
        }
        if (_canvas._panel._selectedElement && _canvas._panel._selectedElement !== foundShape) {
            _canvas._panel._selectedElement._isSelected = false;
        }
        if (foundShape) {
            historyManager.execute(new Select(_canvas._panel, foundShape));
            //_canvas._panel._selectedElement =<NElement> foundShape;
            //_canvas._panel._selectedElement._isSelected = true;
            _canvas._panel._isDragging = true;
            _canvas._panel._lastMouseX = mouseX;
            _canvas._panel._lastMouseY = mouseY;
            _canvas._canvas.style.cursor = 'grabbing';
            showProperties();
        }
        else {
            _canvas._panel._selectedElement = null;
            _canvas._canvas.style.cursor = 'default';
            showProperties();
        }
        _canvas.drawAll();
    }
    handleMouseMove(e, canva) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        if (canva._panel._selectedElement && canva._panel._selectedElement.isPointOnResizeHandle(mouseX, mouseY)) {
            canva._canvas.style.cursor = 'nwse-resize';
        }
        else if (canva._panel._selectedElement && canva._panel._selectedElement.isPointInside(mouseX, mouseY) && !canva._panel._isDragging && !canva._panel._isResizing) {
            canva._canvas.style.cursor = 'grab';
        }
        else if (!canva._panel._isDragging && !canva._panel._isResizing) {
            canva._canvas.style.cursor = 'default';
        }
        if (canva._panel._isDragging && canva._panel._selectedElement) {
            const dx = mouseX - canva._panel._lastMouseX;
            const dy = mouseY - canva._panel._lastMouseY;
            canva._panel._selectedElement._location['x'] += dx;
            canva._panel._selectedElement._location['y'] += dy;
            canva._panel._lastMouseX = mouseX;
            canva._panel._lastMouseY = mouseY;
            canva.drawAll();
            drawAlignment(canva._ctx);
            showProperties();
        }
        else if (canva._panel._isResizing && canva._panel._selectedElement) {
            const dx = mouseX - canva._panel._lastMouseX;
            const dy = mouseY - canva._panel._lastMouseY;
            canva._panel._selectedElement.resize(dx, dy);
            canva._panel._lastMouseX = mouseX;
            canva._panel._lastMouseY = mouseY;
            canva.drawAll();
            drawAlignment(canva._ctx);
            showProperties();
        }
    }
    handleMouseUp(e, canva) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const dx = mouseX - canva._panel._firstMouseX;
        const dy = mouseY - canva._panel._firstMouseY;
        /*if (canva._panel._selectedElement && canva._panel._selectedElement.isPointOnResizeHandle(mouseX, mouseY)) {
                historyManager.execute(new Resize(canvas_class._panel,dx,dy));
        }*/
        if (getAlignmentDrawn()) {
            setAlignmentDrawn(false);
        }
        canva._panel._isDragging = false;
        canva._panel._isResizing = false;
        canva._canvas.style.cursor = 'default';
    }
}
export class NElementState extends IState {
    handleMouseDown(e, canva) {
        const rect = canva._canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        historyManager.execute(new CreateElement(canvas_class._panel, mouseX, mouseY));
        //canva._panel.createElement(mouseX,mouseY);
        canva.drawAll();
    }
}
export class CloneState extends IState {
    handleMouseDown(e, canva) {
        const rect = canva._canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        historyManager.execute(new CloneElement(canvas_class._panel, mouseX, mouseY));
        //canva._panel.createElement(mouseX,mouseY);
        canva.drawAll();
    }
}
