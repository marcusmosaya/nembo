import { Canvas } from "././library/Canvas.js";
import { HistoryManager } from "./library/HistoryManager.js";
import { SetState } from "./library/Commands.js";
import { Panel } from "./library/Panels.js";
import { SelectState, NElementState, CloneState } from "./library/States.js";
import { HEX } from "./library/Colors.js";
import { showProperties, listComponents } from "./utilities.js";
export let canvas = document.getElementById('board');
export let select_mode = document.getElementById('select_mode');
export let undo = document.getElementById('undo');
export let redo = document.getElementById('redo');
export let canvas_class = new Canvas(canvas, new Panel());
export let select_state = new SelectState();
export let clone_state = new CloneState();
export let textElement = document.getElementById("textState");
export let shapeElement = document.getElementById("shapeState");
export let element_state = new NElementState();
export let historyManager = new HistoryManager();
export let layers = document.getElementById("layers");
export let colorSelect = document.getElementById("default");
export let actual = document.getElementById("actual");
export let mousepop = document.getElementById("mouse-pop");
export let clone = document.getElementById("clone");
export let deleteElement = document.getElementById("delete");
export let alignmentDrawn = false;
export const panelTabs = document.querySelectorAll('.panel-tab');
export const propertiesPanel = document.getElementById('properties-panel');
export const layersPanel = document.getElementById('layers-panel');
export let defaultColor = new HEX();
export let currentElement = "rectangle";
export let rectangleElement = document.getElementById("rectangleElement");
export let arcElement = document.getElementById("arcElement");
export let ellipseElement = document.getElementById("ellipseElement");
export let elementsSelect = document.querySelectorAll('.tool-icon-shapes');
export const elementOptionsPane = document.getElementById("element-options");
defaultColor.setColor("#000000");
function renderCurrent(select) {
    switch (select) {
        case "rectangle":
            return `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" id="rectangle" ><rect  width="1rem" height="0.6rem"  title="shapes" x="5" y="5" /></svg>`;
        case "arc":
            return `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="4" fill="currentColor"/></svg>`;
        case "star":
            return `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24"><polygon points="10,1 4,19.8 19,7.8 1,7.8 16,19.8" fill="currentColor"/></svg>`;
        case "polygon":
            return `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24"><polygon points="10,4 2,20 16,20" fill="currentColor"/></svg>`;
        case "ellipse":
            return `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="10" ry="5" fill="currentColor"/></svg>`;
        default:
            return `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" id="rectangle"><rect  width="1rem" height="0.6rem"  title="shapes" x="5" y="5" /></svg>`;
    }
}
panelTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
        panelTabs.forEach(t => t.classList.remove('panel-active'));
        const targe = e.target;
        if (e.target) {
            targe.classList.add('panel-active');
            propertiesPanel.style.display = 'none';
            layersPanel.style.display = 'none';
            if (targe.textContent) {
                const panelName = targe.textContent.toLowerCase().trim();
                if (panelName === 'properties') {
                    propertiesPanel.style.display = 'block';
                    showProperties();
                }
                else if (panelName === 'layers') {
                    layersPanel.style.display = 'block';
                    listComponents();
                }
            }
        }
    });
    elementsSelect.forEach(element => {
        element.addEventListener('click', (e) => {
            const target = element;
            canvas_class._panel.currentType = target.id;
            shapeElement.innerHTML = renderCurrent(target.id);
            currentElement = target.id;
            canvas_class._canvas.style.cursor = "crosshair";
            if (canvas_class._mouseActionCtx.getState() instanceof NElementState)
                return;
            historyManager.execute(new SetState(canvas_class._mouseActionCtx, element_state));
            shapeElement.click();
        });
    });
});
undo.addEventListener("click", (e) => {
    historyManager.undo();
    canvas_class.drawAll();
});
redo.addEventListener("click", () => {
    historyManager.redo();
    canvas_class.drawAll();
});
select_mode.addEventListener("click", () => {
    canvas_class._canvas.style.cursor = "crosshair";
    if (canvas_class._mouseActionCtx.getState() instanceof SelectState)
        return;
    historyManager.execute(new SetState(canvas_class._mouseActionCtx, select_state));
});
textElement.addEventListener("click", () => {
    canvas_class._panel.currentType = "text";
    canvas_class._canvas.style.cursor = "crosshair";
    if (canvas_class._mouseActionCtx.getState() instanceof NElementState)
        return;
    historyManager.execute(new SetState(canvas_class._mouseActionCtx, element_state));
});
document.addEventListener("keydown", (e) => {
    if (e.ctrlKey === true)
        e.preventDefault();
});
document.addEventListener("keypress", (e) => {
    if (e.ctrlKey === true)
        e.preventDefault();
});
document.addEventListener("keyup", (e) => {
    /*if (e.code==="Delete") {

        if(canvas_class._panel._selectedElement){
    canvas_class._panel.deleteElement(canvas_class._panel._selectedElement?._id);
        }else{
            if(confirm("Are you sure you want to delete components?"))canvas_class._panel.elements=[];

        }
    canvas_class.drawAll();
   }*/
    if (e.ctrlKey === true) {
        e.preventDefault();
        switch (e.code) {
            case 'KeyZ':
                historyManager.undo();
                canvas_class.drawAll();
                return;
            case "KeyY":
                historyManager.redo();
                canvas_class.drawAll();
                return;
            case "KeyS":
                e.preventDefault();
                alert("Saving Project");
                return;
            default:
        }
    }
});
shapeElement.addEventListener("mousedown", (e) => {
    e.preventDefault();
    console.log(e.defaultPrevented);
    if (e.button === 0) {
        canvas_class._panel.currentType = currentElement;
        canvas_class._canvas.style.cursor = "crosshair";
        if (canvas_class._mouseActionCtx.getState() instanceof NElementState) {
            return;
        }
        ;
        historyManager.execute(new SetState(canvas_class._mouseActionCtx, element_state));
        elementOptionsPane.style.display = "none";
        return;
    }
    return;
});
shapeElement.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    elementOptionsPane.style.display = "block";
});
/*canvas.addEventListener("contextmenu",(e)=>{
    console.log(e);
    mousepop.style.left=`${String(e.clientX)}px`;
    mousepop.style.top=`${String(e.clientY)}px`;
    if(canvas_class._panel._selectedElement===null) return;
    
    if (canvas_class._mouseActionCtx.getState() instanceof SelectState) {
          mousepop.style.display="block";
    }
});*/
deleteElement.addEventListener("click", (e) => {
    var _a;
    if (canvas_class._panel._selectedElement) {
        canvas_class._panel.deleteElement((_a = canvas_class._panel._selectedElement) === null || _a === void 0 ? void 0 : _a._id);
    }
    else {
        if (confirm("Are you sure you want to delete components?"))
            canvas_class._panel.elements = [];
    }
    canvas_class.drawAll();
    mousepop.style.display = "none";
});
export function setAlignmentDrawn(state) {
    alignmentDrawn = state;
}
export function getAlignmentDrawn() {
    return alignmentDrawn;
}
document.addEventListener('DOMContentLoaded', () => {
    const toolIcons = document.querySelectorAll('.tool-icon');
    toolIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            toolIcons.forEach(i => i.classList.remove('tool-active'));
            icon.classList.add('tool-active');
        });
    });
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
    document.addEventListener('click', (e) => {
        if (elementOptionsPane.style.display === "block") {
            elementOptionsPane.style.display = "none";
        }
    });
    const panelTabs = document.querySelectorAll('.panel-tab');
    const propertiesPanel = document.getElementById('properties-panel');
    const layersPanel = document.getElementById('layers-panel');
    panelTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            panelTabs.forEach(t => t.classList.remove('panel-active'));
            if (e.target) {
                e.target.classList.add('panel-active');
                propertiesPanel.style.display = 'none';
                layersPanel.style.display = 'none';
                const panelName = e.target.textContent.toLowerCase().trim();
                if (panelName === 'properties') {
                    propertiesPanel.style.display = 'block';
                }
                else if (panelName === 'layers') {
                    layersPanel.style.display = 'block';
                }
            }
        });
    });
});
