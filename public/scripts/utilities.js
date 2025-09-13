import { actual, canvas_class, propertiesPanel, setAlignmentDrawn } from "./index.js";
import { HEX, IGradient, LinearGradient, RadialGradient, ConicGradient } from "./library/Colors.js";
import { historyManager, canvas } from "./index.js";
import { Layer } from "./library/Commands.js";
export function toDictionary(array) {
    let obj = {};
    for (let index = 0; index < array.length; index++) {
        obj[array[index][0]] = array[index][1];
    }
    return obj;
}
export function listComponents() {
    actual.innerHTML = '';
    let list = canvas_class._panel.elements;
    for (const index in list) {
        let div = document.createElement("div");
        let span = document.createElement("span");
        span.innerHTML = list[index]._type;
        span.classList = "text-neutral-500";
        div.appendChild(span);
        div.setAttribute("draggable", 'true');
        div.id = String(list[index]._id);
        div.classList = "layer-item";
        div.addEventListener("dragover", (e) => {
            allowDrop(e);
        });
        div.addEventListener("dragstart", (e) => {
            dragStart(e);
        });
        div.addEventListener("drop", (e) => {
            dropData(e);
        });
        if (list[index]._isSelected) {
            div.classList = "layer-item active-layer";
        }
        ;
        actual.appendChild(div);
    }
}
export function showProperties() {
    var _a;
    propertiesPanel.innerHTML = '';
    if (canvas_class._panel._selectedElement) {
        let element = (_a = canvas_class._panel._selectedElement) === null || _a === void 0 ? void 0 : _a.getProperties();
        let mainPanel;
        for (const key in element) {
            let part = element[key];
            let group = document.createElement("h4");
            mainPanel = document.createElement("div");
            mainPanel.classList = "section-group";
            mainPanel.style.border = "1px solid #ddf0f0";
            mainPanel.style.padding = "2px";
            mainPanel.style.marginBottom = "5px";
            group.classList = "font-bold";
            switch (key) {
                case "_location":
                    group.textContent = "Location.";
                    break;
                case "_structure":
                    group.textContent = "Structure.";
                    break;
                case "_pallete":
                    group.textContent = "Pallete.";
                    break;
                case "_transformation":
                    group.textContent = "Transformations.";
                    break;
                case "_line":
                    group.textContent = "Line.";
                    break;
                case "_text":
                    group.textContent = "Text.";
                    break;
                case "_font":
                    group.textContent = "Font.";
                default:
                    mainPanel.hidden = false;
                    break;
            }
            mainPanel.appendChild(group);
            construct(mainPanel, part);
            if (mainPanel.innerHTML !== '')
                propertiesPanel.appendChild(mainPanel);
        }
    }
}
export function updateProperties() {
    let propertDict;
    if (canvas_class._panel._selectedElement) {
        propertDict = canvas_class._panel._selectedElement.getProperties();
        for (const group in propertDict) {
            for (const property in propertDict[group]) {
                let val = document.getElementById(propertDict[group][property].id);
                switch (propertDict[group][property].type) {
                    case "number":
                        propertDict[group][property].value = Number(val.value);
                        break;
                    case "string":
                    case "select":
                        propertDict[group][property].value = String(val.value);
                        break;
                    case "color":
                        let color = new HEX();
                        color.setColor(String(val.value));
                        propertDict[group][property].value = color;
                        break;
                    case "gradient":
                        let colorStops = val.getElementsByClassName("colorStop");
                        let colors = val.getElementsByClassName("colorOpt");
                        let valueArray = [];
                        let variation = document.getElementById(`variation-${property}`);
                        let gradient;
                        for (let index = 0; index < colorStops.length; index++) {
                            let dict = { colorStop: 1, color: new HEX() };
                            dict['colorStop'] = Number(colorStops[index].value);
                            let color = new HEX();
                            color.setColor(colors[index].value);
                            dict['color'] = color;
                            valueArray.push(dict);
                        }
                        switch (variation.value) {
                            case "horizontal-linear-gradient":
                            case "vertical-linear-gradient":
                            case "major-diagonal-gradient":
                            case "minor-diagonal-gradient":
                                gradient = new LinearGradient(valueArray);
                                gradient.setVariation(variation.value);
                                break;
                            case "radial-gradient":
                                gradient = new RadialGradient(valueArray);
                                break;
                            case "conical-gradient":
                                gradient = new ConicGradient(valueArray);
                                break;
                            default:
                                throw new Error("");
                        }
                        propertDict[group][property].value = gradient;
                        break;
                    default:
                        break;
                }
            }
        }
        canvas_class._panel._selectedElement.update(propertDict);
        canvas_class.drawAll();
    }
}
export function construct(divElement, part) {
    for (const property in part) {
        divElement.appendChild(fill(part[property]));
    }
}
export function fill(value) {
    let container = document.createElement("div");
    let inputRow = document.createElement("div");
    inputRow.classList = "input-row";
    let label, input;
    label = document.createElement("label");
    label.textContent = value.label;
    label.htmlFor = value.id;
    let type = { number: "number", string: "text", color: "color", };
    switch (value.type) {
        case "number":
        case "string":
        case "color":
            input = document.createElement("input");
            if (value.type === "color") {
                colorType(container, value.id);
                input.classList.add("colorpick");
            }
            input.type = type[value.type];
            input.value = String(value.value);
            input.id = value.id;
            input.addEventListener("input", () => { updateProperties(); });
            if (value.type === "number") {
                input.min = value['min'];
                input.max = value['max'];
                input.step = value['step'];
            }
            break;
        case "select":
            let options = value.options;
            input = document.createElement("select");
            input.id = value.id;
            input.addEventListener("input", () => { updateProperties(); });
            if (options) {
                for (let index = 0; index < options.length; index++) {
                    let opt = document.createElement("option");
                    opt.value = options[index];
                    opt.textContent = options[index];
                    input.appendChild(opt);
                }
            }
            input.value = value.value;
            break;
        case "gradient":
            let div = document.createElement("div");
            input = document.createElement("input");
            input.hidden = true;
            let arrayofVals = value.value;
            div.id = value.id;
            colorType(container, value.id, value['variation']);
            for (let index = 0; index < arrayofVals.length; index++) {
                let deleteButton = document.createElement("button");
                deleteButton.innerHTML = "&minus;";
                deleteButton.classList = "remove-color";
                deleteButton.addEventListener("click", (e) => {
                    let v = deleteButton.parentElement;
                    let selectIndexString = v === null || v === void 0 ? void 0 : v.id;
                    if (selectIndexString) {
                        let selectIndex = Number(selectIndexString.split('-')[1]);
                        let selectComponent = canvas_class._panel._selectedElement;
                        if (selectComponent) {
                            let color = selectComponent._pallete[value.id];
                            if (color instanceof IGradient) {
                                color._gradient.splice(selectIndex, 1);
                                v === null || v === void 0 ? void 0 : v.remove();
                            }
                            updateProperties();
                        }
                    }
                });
                let span = document.createElement("div");
                let colorStop = document.createElement("input");
                let color = document.createElement("input");
                span.classList = "color-swatch-row color-props";
                colorStop.addEventListener("input", () => { updateProperties(); });
                colorStop.type = "number";
                colorStop.min = "0";
                colorStop.max = "1";
                colorStop.step = "0.01";
                colorStop.className = "colorStop";
                span.id = `igradient-${index}`;
                colorStop.value = String(arrayofVals[index].colorStop);
                color.type = "color";
                color.className = "colorOpt colorpick";
                color.value = arrayofVals[index].color.convert("hex").getColor();
                color.addEventListener("input", () => { updateProperties(); });
                span.appendChild(color);
                span.appendChild(colorStop);
                div.appendChild(span);
                span.appendChild(deleteButton);
            }
            container.appendChild(div);
            break;
        default:
            throw new Error("unknown");
    }
    inputRow.appendChild(label);
    inputRow.appendChild(input);
    container.appendChild(inputRow);
    return container;
}
export function allowDrop(e) {
    e.preventDefault();
}
export function dragStart(e) {
    var _a;
    let selectedelement = e.srcElement;
    if (selectedelement !== null) {
        (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.setData("text", selectedelement.id);
    }
}
export function dropData(e) {
    var _a;
    let destination = e.target;
    let destinationData = destination.innerHTML;
    let destinationId = destination.id;
    let data;
    e.preventDefault();
    if (e.dataTransfer !== null && e.target !== null) {
        data = e.dataTransfer.getData("text");
        destination.innerHTML = (_a = document.getElementById(data)) === null || _a === void 0 ? void 0 : _a.innerHTML;
        destination.id = data;
        let htmlHandler = document.getElementById(data);
        htmlHandler.innerHTML = destinationData;
        htmlHandler.id = destinationId;
    }
    historyManager.execute(new Layer(canvas_class._panel, Number(destination.id), Number(data)));
    canvas_class.drawAll();
    listComponents();
}
export function colorType(container, id, variation) {
    let colorOptions = ["color", "vertical-linear-gradient", "horizontal-linear-gradient", "major-diagonal-gradient", "minor-diagonal-gradient", "radial-gradient", "conical-gradient"];
    let typ = document.createElement("select");
    let parent = document.createElement("div");
    let defaultColor;
    parent.classList = "input-row";
    typ.id = `variation-${id}`;
    parent.appendChild(typ);
    container.appendChild(parent);
    typ.addEventListener("input", () => {
        if (typ.value === "color") {
            defaultColor = new HEX();
            defaultColor.setColor("#000000");
        }
        else {
            let color1 = new HEX();
            let color2 = new HEX();
            color1.setColor("#ff0000");
            color2.setColor("#00ff00");
            let valueArray = [{ colorStop: 0, color: color1 }, { colorStop: 1, color: color2 }];
            if (canvas_class._panel._selectedElement) {
                if (canvas_class._panel._selectedElement._pallete[id] instanceof IGradient) {
                    updateProperties();
                    return;
                }
            }
            switch (typ.value) {
                case "horizontal-linear-gradient":
                case "vertical-linear-gradient":
                case "major-diagonal-gradient":
                case "minor-diagonal-gradient":
                    defaultColor = new LinearGradient(valueArray);
                    defaultColor.setVariation(typ.value);
                    break;
                case "radial-gradient":
                    defaultColor = new RadialGradient(valueArray);
                    break;
                case "conical-gradient":
                    defaultColor = new ConicGradient(valueArray);
                    break;
                default:
                    throw new Error("");
                    break;
            }
        }
        if (canvas_class._panel._selectedElement) {
            canvas_class._panel._selectedElement._pallete[id] = defaultColor;
            canvas_class.drawAll();
            showProperties();
        }
    });
    for (let index = 0; index < colorOptions.length; index++) {
        let opt = document.createElement("option");
        opt.value = colorOptions[index];
        opt.textContent = colorOptions[index];
        typ.appendChild(opt);
    }
    if (variation) {
        typ.value = variation;
        let addButton = document.createElement("button");
        addButton.innerHTML = "&plus;";
        addButton.classList = "add-color";
        addButton.addEventListener("click", (e) => {
            var _a;
            let deleteButton = document.createElement("button");
            let div = document.createElement("div");
            let par = document.getElementById(id);
            deleteButton.innerHTML = "&minus;";
            deleteButton.classList = "remove-color";
            deleteButton.addEventListener("click", (e) => {
                let v = deleteButton.parentElement;
                let selectIndexString = v === null || v === void 0 ? void 0 : v.id;
                console.log(selectIndexString, "iuytrertyui");
                if (selectIndexString) {
                    let selectIndex = Number(selectIndexString.split('-')[1]);
                    let selectComponent = canvas_class._panel._selectedElement;
                    if (selectComponent) {
                        let color = selectComponent._pallete[id];
                        console.log(color, "oiuytre");
                        if (color instanceof IGradient) {
                            color._gradient.splice(selectIndex, 1);
                            v === null || v === void 0 ? void 0 : v.remove();
                        }
                        updateProperties();
                    }
                }
                canvas_class.drawAll();
                showProperties();
            });
            let span = document.createElement("div");
            let colorStop = document.createElement("input");
            let color = document.createElement("input");
            span.classList = "color-swatch-row color-props";
            colorStop.addEventListener("input", () => { updateProperties(); });
            colorStop.type = "number";
            colorStop.min = "0";
            colorStop.max = "1";
            colorStop.step = "0.01";
            colorStop.value = "0";
            colorStop.className = "colorStop";
            let lastIndexDetect = (_a = canvas_class._panel._selectedElement) === null || _a === void 0 ? void 0 : _a._pallete[id];
            if (lastIndexDetect instanceof IGradient) {
                let newColor = new HEX();
                newColor.setColor("#000000");
                span.id = `igradient-${lastIndexDetect._gradient.length}`;
            }
            color.type = "color";
            color.className = "colorOpt";
            color.addEventListener("input", () => { updateProperties(); });
            span.appendChild(color);
            span.appendChild(colorStop);
            div.appendChild(span);
            span.appendChild(deleteButton);
            par === null || par === void 0 ? void 0 : par.appendChild(span);
            updateProperties();
        });
        parent.appendChild(addButton);
    }
    else {
        typ.value = "color";
    }
}
export function drawHorizontalAxis(ctx, coordinate, width) {
    ctx.beginPath();
    ctx.setLineDash([5]);
    ctx.moveTo(0, coordinate);
    ctx.lineTo(width, coordinate);
    ctx.strokeStyle = "#00ff00";
    ctx.stroke();
}
export function drawVerticalAxis(ctx, coordinate, height) {
    ctx.beginPath();
    ctx.setLineDash([5]);
    ctx.moveTo(coordinate, 0);
    ctx.lineTo(coordinate, height);
    ctx.strokeStyle = "#00ff00";
    ctx.stroke();
}
export function drawAlignment(ctx) {
    let selected = canvas_class._panel._selectedElement;
    let elements = canvas_class._panel.elements;
    setAlignmentDrawn(true);
    if (selected) {
        for (let index = 0; index < elements.length; index++) {
            if (selected._id !== elements[index]._id) {
                if (selected._alignmentCoordinates['startX'] === elements[index]._alignmentCoordinates['startX'] || selected._alignmentCoordinates['endX'] === elements[index]._alignmentCoordinates['startX']) {
                    drawVerticalAxis(ctx, elements[index]._alignmentCoordinates['startX'], canvas.height);
                    return;
                }
                else if (selected._alignmentCoordinates['startX'] === elements[index]._alignmentCoordinates['endX'] || selected._alignmentCoordinates['endX'] === elements[index]._alignmentCoordinates['endX']) {
                    drawVerticalAxis(ctx, elements[index]._alignmentCoordinates['endX'], canvas.height);
                    return;
                }
                else if (selected._alignmentCoordinates['startY'] === elements[index]._alignmentCoordinates['startY'] || selected._alignmentCoordinates['endY'] === elements[index]._alignmentCoordinates['startY']) {
                    drawHorizontalAxis(ctx, elements[index]._alignmentCoordinates['startY'], canvas.width);
                    return;
                }
                else if (selected._alignmentCoordinates['startY'] === elements[index]._alignmentCoordinates['endY'] || selected._alignmentCoordinates['endY'] === elements[index]._alignmentCoordinates['endY']) {
                    drawHorizontalAxis(ctx, elements[index]._alignmentCoordinates['endY'], canvas.width);
                    return;
                }
            }
        }
    }
}
