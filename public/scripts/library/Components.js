import { IColor, IGradient, LinearGradient, HEX, RadialGradient, ConicGradient } from "./Colors.js";
import { defaultColor } from "../index.js";
import { toDictionary } from "../utilities.js";
export class NElement {
    constructor(x, y) {
        this._id = 0;
        this._isSelected = false;
        this._isHidden = false;
        this._type = '';
        this._alignmentCoordinates = { startX: 0, startY: 0, endX: 0, endY: 0 };
        this._location = { x: 0, y: 0 };
        this._structure = {};
        this._transformation = { rotation: 0, skewX: 0, skewY: 0 };
        this._pallete = { fillStyle: new IColor(), strokeStyle: new IColor(), shadowColor: new IColor(), shadowBlur: 0, shadowOffsetX: 0, shadowOffsetY: 0 };
        this._line = { lineWidth: 1, lineDash: [0], lineJoin: "miter", lineCap: "butt" };
        this._location.x = x;
        this._location.y = y;
        this._pallete['fillStyle'] = defaultColor;
        this._pallete['strokeStyle'] = defaultColor;
        this._pallete['shadowColor'] = defaultColor;
    }
    setAlignmentCoordinate(startX, startY, endX, endY) {
        this._alignmentCoordinates['startX'] = startX;
        this._alignmentCoordinates['startY'] = startY;
        this._alignmentCoordinates['endX'] = endX;
        this._alignmentCoordinates['endY'] = endY;
    }
    draw(ctx) {
    }
    resize(dx, dy) {
    }
    clone(mouseX, mouseY) {
        throw new Error("This class acts as an interface.");
    }
    drawResizeHandle(ctx) {
    }
    isPointOnResizeHandle(px, py) {
        throw new Error("use the class not interface");
    }
    isPointInside(px, py) {
        throw new Error("use the class not interface");
    }
    getResizeHandle() {
        throw new Error("");
    }
    handleLinearGradientVariation(variation, style, ctx) {
        throw new Error("This class acts as an interface.");
    }
    handleRadialGradient(canvasContext, style) {
        throw new Error("This class acts as an interface.");
    }
    handleConicGradient(canvasContext, style) {
        throw new Error("This class acts as an interface.");
    }
    fill_and_stroke(ctx) {
        let colorProperties = ['fillStyle', 'strokeStyle'];
        for (const key in this._pallete) {
            let property = key;
            ctx.setLineDash([0]);
            if (key === "fillStyle" || key === "strokeStyle" || key === "shadowColor") {
                if (this._pallete[key] instanceof IColor) {
                    ctx[key] = this._pallete[key].getColor();
                }
                else {
                    if (this._pallete[key] instanceof LinearGradient) {
                        ctx[key] = this.handleLinearGradientVariation(this._pallete[key].getVariation(), property, ctx);
                    }
                    else if (this._pallete[key] instanceof RadialGradient) {
                        ctx[key] = this.handleRadialGradient(ctx, property);
                    }
                    else if (this._pallete[key] instanceof ConicGradient) {
                        ctx[key] = this.handleConicGradient(ctx, property);
                    }
                }
            }
            else {
                ctx[key] = this._pallete[key];
            }
        }
        if (this instanceof TextElement) {
            ctx.fillText(this._text['textContent'], this._location['x'], this._location['y']);
            ctx.strokeText(this._text['textContent'], this._location['x'], this._location['y']);
        }
        else {
            ctx.fill();
            ctx.stroke();
        }
    }
    draw_if_selected(ctx) {
        if (this._isSelected) {
            ctx.beginPath();
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]);
            if (this instanceof Rectangle) {
                ctx.rect(this._location['x'] - 4, this._location['y'] - 4, this._structure['width'] + 8, this._structure['height'] + 8);
            }
            else if (this instanceof Arc) {
                ctx.arc(this._location['x'], this._location['y'], this._structure['radius'] + 3, this._structure['startAngle'], this._structure['endAngle']);
            }
            else if (this instanceof Polygon) {
                let radius = this._structure['radius'] + 5;
                let sides = this.getPoints(radius);
                ctx.moveTo(this._location['x'] + radius * Math.cos(-Math.PI / 2), this._location['y'] + radius * Math.sin(-Math.PI / 2));
                const angleIncrement = (2 * Math.PI) / this._structure['sides'];
                for (let i = 1; i <= this._structure['sides']; i++) {
                    const angle = i * angleIncrement - Math.PI / 2;
                    const x = this._location['x'] + radius * Math.cos(angle);
                    const y = this._location['y'] + radius * Math.sin(angle);
                    ctx.lineTo(x, y);
                }
                ctx.closePath();
            }
            ctx.stroke();
            ctx.closePath();
            this.drawResizeHandle(ctx);
        }
        if (this instanceof Rectangle) {
            this.setAlignmentCoordinate(this['_location']['x'], this['_location']['y'], this['_location']['x'] + this['_structure']['width'], this['_location']['y'] + this['_structure']['height']);
        }
        else if (this instanceof Arc) {
            this.setAlignmentCoordinate(this['_location']['x'] - this['_structure']['radius'], this['_location']['y'] - this['_structure']['radius'], this['_location']['x'] + this['_structure']['radius'], this['_location']['y'] + this['_structure']['radius']);
        }
    }
    getProperties() {
        let allowed = ['_pallete', '_line', '_structure', '_location', '_transformation', '_text', '_font'];
        let props = {};
        let allProps = toDictionary(Object.entries(this));
        for (const key in allProps) {
            if (allowed.includes(key)) {
                let temp = {};
                temp[key] = this.handleProps(key, allProps[key]);
                props = Object.assign(Object.assign({}, props), temp);
            }
        }
        return props;
    }
    update(props) {
        let propertyDict = this.getProperties();
        let proposedDict = { _pallete: { fillStyle: new HEX(), strokeStyle: new HEX() }, _location: { x: 0, y: 0 } };
        for (const group in props) {
            if (Object.prototype.hasOwnProperty.call(propertyDict, group)) {
                for (const key in props[group]) {
                    if (Object.prototype.hasOwnProperty.call(props[group], key)) {
                        if (key === "fillStyle" || key === "strokeStyle") {
                            if (props[group][key]['value'] instanceof IGradient) {
                                this[group][key] = props[group][key]['value'].clone();
                            }
                            else {
                                this[group][key] = props[group][key]['value'];
                            }
                        }
                        else {
                            let angles = ['rotation', 'startAngle', 'endAngle'];
                            console.log(group);
                            if (angles.includes(props[group][key]['id'])) {
                                this[group][key] = this.toRadians(props[group][key]['value']);
                            }
                            else {
                                this[group][key] = props[group][key]['value'];
                            }
                        }
                    }
                }
            }
        }
        if (this instanceof Rectangle) {
            this.setAlignmentCoordinate(this['_location']['x'], this['_location']['y'], this['_location']['x'] + this['_structure']['width'], this['_location']['y'] + this['_structure']['height']);
        }
        else if (this instanceof Arc) {
            this.setAlignmentCoordinate(this['_location']['x'] - this['_structure']['radius'], this['_location']['y'] - this['_structure']['radius'], this['_location']['x'] + this['_structure']['radius'], this['_location']['y'] + this['_structure']['radius']);
        }
        else if (this instanceof Polygon) {
            this._structure['points'] = this.points();
        }
        else if (this instanceof TextElement) {
            this._text['font'] = `${this._font['fontStyle']} ${this._font['fontWeight']} ${this._font['fontSize']}px ${this._font['fontFamily']}`;
        }
    }
    handleProps(prop, val) {
        switch (prop) {
            case "_pallete":
                return this.handlePallete(val);
            case "_line":
                return this.handleLine(val);
            case "_structure":
                return this.handleStructure(val);
            case "_location":
                return this.handleLocation(val);
            case "_transformation":
                return this.handleTransformation(val);
            case "_font":
                return this.handleFont(val);
            case "_text":
                return this.handleTextContent(val);
            default:
                break;
        }
    }
    handleTextContent(val) {
        let valuedict = val;
        let toreturn = {};
        for (const key in valuedict) {
            switch (key) {
                case "textContent":
                    let textContent = {
                        label: "content",
                        id: "textContent",
                        type: "string",
                        value: valuedict[key]
                    };
                    toreturn = Object.assign(Object.assign({}, toreturn), { textContent });
                    break;
                case "letterSpacing":
                    let letterSpacing = {
                        label: "Letter spacing",
                        id: "letterSpacing",
                        type: "number",
                        step: "0.01",
                        value: valuedict[key]
                    };
                    toreturn = Object.assign(Object.assign({}, toreturn), { letterSpacing });
                    break;
                case "wordSpacing":
                    let wordSpacing = {
                        label: "word Spacing",
                        id: "wordSpacing",
                        type: "number",
                        step: "0.01",
                        value: valuedict[key]
                    };
                    toreturn = Object.assign(Object.assign({}, toreturn), { wordSpacing });
                    break;
                default:
                    break;
            }
        }
        return toreturn;
    }
    handleFont(val) {
        let fontFamilyOptions = [
            "'Courier New'",
            "Courier",
            "'Franklin Gothic Medium'",
            "'Arial Narrow'",
            "Arial",
            "'Gill Sans'",
            "'Gill Sans MT'",
            "Calibri",
            "'Trebuchet MS'",
            "'Lucida Sans'",
            "'Lucida Sans Regular'",
            "Geneva",
            "Verdana",
            "'Segoe UI'",
            "Tahoma",
            "'Times New Roman'",
            "Times",
            "'Trebuchet MS'",
            "'Lucida Sans Unicode'", "'Lucida Grande'", "'Lucida Sans'",
            "Arial",
            "Helvetica",
            "Cambria",
            "Cochin",
            "Georgia",
            "Impact", "Haettenschweiler",
            "fantasy",
            "monospace",
            "sans-serif",
            "serif",
            "system-ui",
            "-apple-system",
            "BlinkMacSystemFont",
            "Roboto", "Oxygen",
            "Ubuntu",
            "Cantarell",
            "'Open Sans'",
            "'Helvetica Neue'",
            "cursive"
        ];
        let fontStyleOptions = ["italic", "normal", "oblique"];
        let fontWeightoptions = ["bold", "normal", "100", "200", "300", "500", "600", "800", "900"];
        let valuedict = val;
        let toreturn = {};
        for (const key in valuedict) {
            switch (key) {
                case "fontFamily":
                    let fontFamily = {
                        label: "Family",
                        id: "fontFamily",
                        type: "select",
                        options: fontFamilyOptions,
                        value: valuedict[key]
                    };
                    toreturn = Object.assign(Object.assign({}, toreturn), { fontFamily });
                    break;
                case "fontStyle":
                    let fontStyle = {
                        label: "Style",
                        id: "fontStyle",
                        type: "select",
                        options: fontStyleOptions,
                        value: valuedict[key]
                    };
                    toreturn = Object.assign(Object.assign({}, toreturn), { fontStyle });
                    break;
                case "fontWeight":
                    let fontWeight = {
                        label: "Weight",
                        id: "fontWeight",
                        type: "select",
                        options: fontWeightoptions,
                        value: valuedict[key]
                    };
                    toreturn = Object.assign(Object.assign({}, toreturn), { fontWeight });
                    break;
                case "fontSize":
                    let fontSize = {
                        label: "Size",
                        id: "fontSize",
                        type: "number",
                        min: 1,
                        options: fontWeightoptions,
                        value: valuedict[key]
                    };
                    toreturn = Object.assign(Object.assign({}, toreturn), { fontSize });
                    break;
                default:
                    break;
            }
        }
        return toreturn;
    }
    handleTransformation(val) {
        let valuedict = val;
        let toreturn = {};
        for (const key in valuedict) {
            switch (key) {
                case "rotation":
                    let rotation = {
                        label: "rotation",
                        id: "rotation",
                        type: "number",
                        value: this.toDregrees(valuedict[key])
                    };
                    toreturn = Object.assign(Object.assign({}, toreturn), { rotation });
                    break;
                case "skewX":
                    let skewX = {
                        label: "skew x",
                        id: "skewX",
                        type: "number",
                        min: "-1",
                        max: "1",
                        step: "0.01",
                        value: valuedict[key]
                    };
                    toreturn = Object.assign(Object.assign({}, toreturn), { skewX });
                    break;
                case "skewY":
                    let skewY = {
                        label: "skew y",
                        id: "skewY",
                        type: "number",
                        min: "-1",
                        max: "1",
                        step: "0.01",
                        value: valuedict[key]
                    };
                    toreturn = Object.assign(Object.assign({}, toreturn), { skewY });
                    break;
                default:
                    break;
            }
        }
        return toreturn;
    }
    handleLocation(val) {
        let valuedict = val;
        let toreturn = {};
        for (const key in valuedict) {
            switch (key) {
                case "x":
                    let x = {
                        label: "x",
                        id: "x",
                        type: "number",
                        value: valuedict[key]
                    };
                    toreturn = Object.assign(Object.assign({}, toreturn), { x });
                    break;
                case "y":
                    let y = {
                        label: "y",
                        id: "y",
                        type: "number",
                        value: valuedict[key]
                    };
                    toreturn = Object.assign(Object.assign({}, toreturn), { y });
                    break;
                default:
                    break;
            }
        }
        return toreturn;
    }
    handleLine(val) {
        let valuedict = val;
        let toreturn = {};
        for (const key in valuedict) {
            switch (key) {
                case "lineWidth":
                    let lineWidth = {
                        label: "line width",
                        id: "lineWidth",
                        type: "number",
                        value: valuedict[key]
                    };
                    toreturn = Object.assign(Object.assign({}, toreturn), { lineWidth });
                    break;
                case "lineDash":
                    let lineDash = {
                        label: "line dash",
                        id: "lineDash",
                        type: "number",
                        value: valuedict[key]
                    };
                    toreturn = Object.assign(Object.assign({}, toreturn), { lineDash });
                    break;
                case "lineCap":
                    let lineCap = {
                        label: "line cap",
                        id: "lineCap",
                        type: "select",
                        options: ['butt', 'round', 'square'],
                        value: valuedict[key]
                    };
                    toreturn = Object.assign(Object.assign({}, toreturn), { lineCap });
                    break;
                case "lineJoin":
                    let lineJoin = {
                        label: "line join",
                        id: "lineJoin",
                        type: "select",
                        options: ['bevel', 'round', 'miter'],
                        value: valuedict[key]
                    };
                    toreturn = Object.assign(Object.assign({}, toreturn), { lineJoin });
                    break;
                default:
                    break;
            }
        }
        return toreturn;
    }
    handlePallete(val) {
        let valuedict = val;
        let palleteType, currentGradientType, temporaryValue;
        let toreturn = {};
        for (const key in valuedict) {
            switch (key) {
                case "fillStyle":
                    if (valuedict[key] instanceof IColor) {
                        temporaryValue = valuedict[key].convert("hex").getColor();
                        palleteType = "color";
                    }
                    else {
                        palleteType = "gradient";
                        temporaryValue = valuedict[key]._gradient;
                        currentGradientType = valuedict[key]._type;
                    }
                    let fillStyle = {
                        label: "fill",
                        id: "fillStyle",
                        type: palleteType,
                        value: temporaryValue
                    };
                    if (valuedict[key] instanceof IGradient || valuedict[key] instanceof IGradient) {
                        fillStyle['variation'] = valuedict[key].getVariation();
                    }
                    toreturn = Object.assign(Object.assign({}, toreturn), { fillStyle });
                    break;
                case "strokeStyle":
                    if (valuedict[key] instanceof IColor) {
                        temporaryValue = valuedict[key].convert("hex").getColor();
                        palleteType = "color";
                    }
                    else {
                        palleteType = "gradient";
                        temporaryValue = valuedict[key]._gradient;
                        currentGradientType = valuedict[key]._type;
                    }
                    let strokeStyle = {
                        label: "stroke",
                        id: "strokeStyle",
                        type: palleteType,
                        value: temporaryValue,
                    };
                    if (valuedict[key] instanceof LinearGradient || valuedict[key] instanceof LinearGradient) {
                        strokeStyle['variation'] = valuedict[key].getVariation();
                    }
                    toreturn = Object.assign(Object.assign({}, toreturn), { strokeStyle });
                    break;
                case "shadowColor":
                    let shadowColor = {
                        label: "Shadow",
                        id: "shadowColor",
                        type: "color",
                        value: this._pallete['shadowColor'].convert("hex").getColor()
                    };
                    toreturn = Object.assign(Object.assign({}, toreturn), { shadowColor });
                    break;
                case "shadowBlur":
                    let shadowBlur = {
                        label: "Shadow blur",
                        id: "shadowBlur",
                        type: "number",
                        value: this._pallete['shadowBlur']
                    };
                    toreturn = Object.assign(Object.assign({}, toreturn), { shadowBlur });
                    break;
                case "shadowOffsetX":
                    let shadowOffsetX = {
                        label: "Offset X",
                        id: "shadowOffsetX",
                        type: "number",
                        value: this._pallete['shadowOffsetX']
                    };
                    toreturn = Object.assign(Object.assign({}, toreturn), { shadowOffsetX });
                    break;
                case "shadowOffsetY":
                    let shadowOffsetY = {
                        label: "Offset Y",
                        id: "shadowOffsetY",
                        type: "number",
                        value: this._pallete['shadowOffsetY']
                    };
                    toreturn = Object.assign(Object.assign({}, toreturn), { shadowOffsetY });
                    break;
                default:
                    break;
            }
        }
        return toreturn;
    }
    handleStructure(val) {
        let valuedict = val;
        let toreturn = {};
        if (this instanceof Rectangle) {
            for (const key in valuedict) {
                switch (key) {
                    case "width":
                        let width = {
                            label: "width",
                            id: "width",
                            type: "number",
                            value: valuedict[key]
                        };
                        toreturn = Object.assign(Object.assign({}, toreturn), { width });
                        break;
                    case "height":
                        let height = {
                            label: "height",
                            id: "height",
                            type: "number",
                            value: valuedict[key]
                        };
                        toreturn = Object.assign(Object.assign({}, toreturn), { height });
                        break;
                    case "radius":
                        let radius = {
                            label: "radius",
                            id: "radius",
                            type: "number",
                            value: valuedict[key]
                        };
                        toreturn = Object.assign(Object.assign({}, toreturn), { radius });
                        break;
                    default:
                        break;
                }
            }
        }
        else if (this instanceof Arc) {
            for (const key in valuedict) {
                switch (key) {
                    case "radius":
                        let radius = {
                            label: "radius",
                            id: "radius",
                            type: "number",
                            value: valuedict[key]
                        };
                        toreturn = Object.assign(Object.assign({}, toreturn), { radius });
                        break;
                    case "startAngle":
                        let startAngle = {
                            label: "start angle",
                            id: "startAngle",
                            type: "number",
                            value: this.toDregrees(valuedict[key])
                        };
                        toreturn = Object.assign(Object.assign({}, toreturn), { startAngle });
                        break;
                    case "endAngle":
                        let endAngle = {
                            label: "end angle",
                            id: "endAngle",
                            type: "number",
                            value: this.toDregrees(valuedict[key])
                        };
                        toreturn = Object.assign(Object.assign({}, toreturn), { endAngle });
                        break;
                    default:
                        break;
                }
            }
        }
        else if (this instanceof Polygon) {
            for (const key in valuedict) {
                switch (key) {
                    case "radius":
                        let radius = {
                            label: "radius",
                            id: "radius",
                            type: "number",
                            value: valuedict[key]
                        };
                        toreturn = Object.assign(Object.assign({}, toreturn), { radius });
                        break;
                    case "sides":
                        let sides = {
                            label: "sides",
                            id: "sides",
                            type: "number",
                            value: valuedict[key]
                        };
                        toreturn = Object.assign(Object.assign({}, toreturn), { sides });
                        break;
                    default:
                        break;
                }
            }
        }
        else if (this instanceof Ellipse) {
            for (const key in valuedict) {
                switch (key) {
                    case "radiusX":
                        let radius = {
                            label: "radius x",
                            id: "radiusX",
                            type: "number",
                            value: valuedict[key]
                        };
                        toreturn = Object.assign(Object.assign({}, toreturn), { radius });
                        break;
                    case "radiusY":
                        let radiusY = {
                            label: "radius y",
                            id: "radiusY",
                            type: "number",
                            value: valuedict[key]
                        };
                        toreturn = Object.assign(Object.assign({}, toreturn), { radiusY });
                        break;
                    case "rotation":
                        let rotation = {
                            label: "rotation",
                            id: "rotation",
                            type: "number",
                            value: this.toDregrees(valuedict[key])
                        };
                        toreturn = Object.assign(Object.assign({}, toreturn), { rotation });
                        break;
                    case "startAngle":
                        let startAngle = {
                            label: "starta angle",
                            id: "startAngle",
                            type: "number",
                            value: this.toDregrees(valuedict[key])
                        };
                        toreturn = Object.assign(Object.assign({}, toreturn), { startAngle });
                        break;
                    case "endAngle":
                        let endAngle = {
                            label: "end angle",
                            id: "endAngle",
                            type: "number",
                            value: this.toDregrees(valuedict[key])
                        };
                        toreturn = Object.assign(Object.assign({}, toreturn), { endAngle });
                        break;
                    default:
                        break;
                }
            }
        }
        else if (this instanceof Star) {
            for (const key in valuedict) {
                switch (key) {
                    case "radius":
                        let radius = {
                            label: "radius",
                            id: "radius",
                            type: "number",
                            value: valuedict[key]
                        };
                        toreturn = Object.assign(Object.assign({}, toreturn), { radius });
                        break;
                    case "innerRadiusRatio":
                        let innerRadiusRatio = {
                            label: "Inner radius ratio",
                            id: "innerRadiusRatio",
                            type: "number",
                            value: valuedict[key]
                        };
                        toreturn = Object.assign(Object.assign({}, toreturn), { innerRadiusRatio });
                        break;
                    case "sides":
                        let sides = {
                            label: "sides",
                            id: "sides",
                            type: "number",
                            value: valuedict[key]
                        };
                        toreturn = Object.assign(Object.assign({}, toreturn), { sides });
                        break;
                    default:
                        break;
                }
            }
        }
        return toreturn;
    }
    toRadians(degrees) {
        return (degrees * 2 * Math.PI) / 360;
    }
    toDregrees(radians) {
        return Math.floor((radians * 360) / (2 * Math.PI));
    }
    addTransformation(ctx) {
        ctx.rotate(this._transformation['rotation']);
        ctx.transform(1, this._transformation['skewY'], this._transformation['skewX'], 1, 0, 0);
    }
    addLine(ctx) {
        ctx.lineCap = this._line['lineCap'];
        ctx.lineWidth = this._line['lineWidth'];
        ctx.setLineDash([0]);
        ctx.lineJoin = this._line['lineJoin'];
    }
}
export class Rectangle extends NElement {
    constructor(x, y, width = 100, height = 50, radius = 0) {
        super(x, y);
        this._structure = { width: 100, height: 50, radius: 0 };
        this._structure.width = width;
        this._structure.height = height;
        this._structure.radius = radius;
        this.setAlignmentCoordinate(x, y, x + width, y + width);
        this._type = "Rectangle";
    }
    draw(ctx) {
        if (this._isHidden)
            return;
        ctx.save();
        ctx.beginPath();
        this.addLine(ctx);
        this.addTransformation(ctx);
        ctx.roundRect(this._location['x'], this._location['y'], this._structure['width'], this._structure['height'], this._structure['radius']);
        this.fill_and_stroke(ctx);
        this.draw_if_selected(ctx);
        ctx.restore();
    }
    handleLinearGradientVariation(variation, style, ctx) {
        switch (variation) {
            case "horizontal-linear-gradient":
                ctx[style] = this._pallete[style].apply(ctx, { x0: this._location['x'], x1: this._structure['width'] + this._location['x'], y0: this._location['y'], y1: this._location['y'] });
                return ctx[style];
            case "vertical-linear-gradient":
                ctx[style] = this._pallete[style].apply(ctx, { x0: this._location['x'], x1: this._location['x'], y0: this._location['y'], y1: this._location['y'] + this._structure['height'] });
                return ctx[style];
            case "major-diagonal-gradient":
                ctx.fillStyle = this._pallete[style].apply(ctx, { x0: this._location['x'], x1: this._structure['width'] + this._location['x'], y0: this._location['y'] + this._structure['height'], y1: this._location['y'] });
                return ctx[style];
            case "minor-diagonal-gradient":
                ctx.fillStyle = this._pallete[style].apply(ctx, { x0: this._location['x'], x1: this._structure['width'] + this._location['x'], y0: this._location['y'], y1: this._location['y'] + this._structure['height'] });
                return ctx[style];
            default:
                ctx.fillStyle = this._pallete[style].apply(ctx, { x0: this._location['x'], x1: this._structure['width'] + this._location['x'], y0: this._location['y'], y1: this._location['y'] });
                return ctx[style];
        }
    }
    handleRadialGradient(canvasContext, style) {
        canvasContext[style] = this._pallete[style].apply(canvasContext, { x0: this._location['x'] + this._structure['width'] / 2, y0: this._location['y'] + this._structure['height'] / 2, r0: 15, x1: this._location['x'] + this._structure['width'] / 2, y1: this._location['y'] + this._structure['height'] / 2, r1: 40 });
        return canvasContext[style];
    }
    handleConicGradient(canvasContext, style) {
        canvasContext[style] = this._pallete[style].apply(canvasContext, { startAngle: 0, x: this._location['x'] + this._structure['width'] / 2, y: this._location['y'] + this._structure['height'] / 2 });
        return canvasContext[style];
    }
    isPointInside(px, py) {
        return px > this._location['x'] && px < this._location['x'] + this._structure['width']
            && py > this._location['y'] && py < this._location['y'] + this._structure['height'];
    }
    drawResizeHandle(ctx) {
        const handle = this.getResizeHandle();
        ctx.beginPath();
        ctx.fillStyle = "#000000";
        ctx.fillRect(handle.x, handle.y, handle.width, handle.height);
        ctx.closePath();
    }
    getResizeHandle() {
        const resizeHandle = 6;
        return { x: 4 + this._location['x'] + this._structure['width'] - resizeHandle / 2, y: 4 + this._location['y'] + this._structure['height'] - resizeHandle / 2, width: resizeHandle, height: resizeHandle };
    }
    isPointOnResizeHandle(px, py) {
        const handle = this.getResizeHandle();
        return px > handle.x && px < handle.x + handle.width && py > handle.y && py > handle.y + handle.height;
    }
    resize(dx, dy) {
        this._structure['width'] = Math.max(10, this._structure['width'] + dx);
        this._structure['height'] = Math.max(10, this._structure['height'] + dy);
    }
}
export class Polygon extends NElement {
    constructor(x, y, radius = 50, sides = 5) {
        super(x, y);
        this._points = [];
        this._radius = 50;
        this._structure = { radius: 50, sides: 5, points: [] };
        this._structure['radius'] = radius;
        this._structure['sides'] = sides;
        this._structure['points'] = this.points();
        this._type = "Polygon";
    }
    draw(canvasContext) {
        if (this._isHidden)
            return;
        canvasContext.save();
        canvasContext.beginPath();
        this.addLine(canvasContext);
        this.addTransformation(canvasContext);
        canvasContext.moveTo(this._location['x'] + this._structure['radius'] * Math.cos(-Math.PI / 2), this._location['y'] + this._structure['radius'] * Math.sin(-Math.PI / 2));
        const angleIncrement = (2 * Math.PI) / this._structure['sides'];
        for (let i = 1; i <= this._structure['sides']; i++) {
            const angle = i * angleIncrement - Math.PI / 2;
            const x = this._location['x'] + this._structure['radius'] * Math.cos(angle);
            const y = this._location['y'] + this._structure['radius'] * Math.sin(angle);
            canvasContext.lineTo(x, y);
        }
        canvasContext.closePath();
        canvasContext.fill();
        canvasContext.stroke();
        this.fill_and_stroke(canvasContext);
        this.draw_if_selected(canvasContext);
        canvasContext.restore();
    }
    points() {
        let points = [];
        const angleIncrement = (2 * Math.PI) / this._structure['sides'];
        for (let i = 1; i <= this._structure['sides']; i++) {
            const angle = i * angleIncrement - Math.PI / 2; // Adjust angle to start from top
            const x = this._location['x'] + this._structure['radius'] * Math.cos(angle);
            const y = this._location['y'] + this._structure['radius'] * Math.sin(angle);
            points = [...points, x, y];
        }
        return points;
    }
    getPoints(radius) {
        let points = [];
        const angleIncrement = (2 * Math.PI) / this._structure['sides'];
        for (let i = 1; i <= this._structure['sides']; i++) {
            const angle = i * angleIncrement - Math.PI / 2; // Adjust angle to start from top
            const x = this._location['x'] + radius * Math.cos(angle);
            const y = this._location['y'] + radius * Math.sin(angle);
            points = [...points, x, y];
        }
        return points;
    }
    handleLinearGradientVariation(variation, style, ctx) {
        let _x0, _y0, _r0, _x1, _y1, _r1;
        _x0 = this._location['x'] - this._structure['radius'];
        _y0 = this._location['y'] - this._structure['radius'];
        _r0 = _r1 = this._structure['radius'];
        _x1 = _x0 + (this._structure['radius'] * 2);
        _y1 = _y0 + (this._structure['radius'] * 2);
        switch (variation) {
            case "horizontal-linear-gradient":
                ctx[style] = this._pallete[style].apply(ctx, { x0: _x0, x1: _x1, y0: _y0, y1: _y0 });
                return ctx[style];
            case "vertical-linear-gradient":
                ctx[style] = this._pallete[style].apply(ctx, { x0: _x0, x1: _x0, y0: _y0, y1: _y1 });
                return ctx[style];
            case "major-diagonal-gradient":
                ctx.fillStyle = this._pallete[style].apply(ctx, { x0: _x0, x1: _x1, y0: _y1, y1: _y0 });
                return ctx[style];
            case "minor-diagonal-gradient":
                ctx.fillStyle = this._pallete[style].apply(ctx, { x0: _x0, x1: _x1, y0: _y0, y1: _y1 });
                return ctx[style];
            default:
                ctx.fillStyle = this._pallete[style].apply(ctx, { x0: _x0, x1: _x1, y0: _y0, y1: _y0 });
                return ctx[style];
        }
    }
    handleRadialGradient(canvasContext, style) {
        canvasContext[style] = this._pallete[style].apply(canvasContext, { x0: this._location['x'], y0: this._location['y'], r0: 15, x1: this._location['x'], y1: this._location['y'], r1: 40 });
        return canvasContext[style];
    }
    handleConicGradient(canvasContext, style) {
        canvasContext[style] = this._pallete[style].apply(canvasContext, { startAngle: 0, x: this._location['x'], y: this._location['y'] });
        return canvasContext[style];
    }
    clone() {
        let copy = new Polygon(this._location['x'], this._location['y'], this._structure['radius'], this._structure['sides']);
        copy['_line'] = this['_line'];
        for (const key in this._pallete) {
            let property = key;
            if (key === "fillStyle" || key === "strokeStyle") {
                copy[property] = this._pallete[key].clone();
            }
            copy[property] = this._pallete[key];
        }
        return copy;
    }
    resize(changeX, changeY) {
        const delta = Math.max(Math.abs(changeX), Math.abs(changeY));
        if (changeX + changeY > 0) {
            this._structure['radius'] = Math.max(5, this._structure['radius'] + delta / 2);
        }
        else {
            this._structure['radius'] = Math.max(5, this._structure['radius'] - delta / 2);
        }
        this._structure['points'] = this.points();
    }
    getResizeHandle() {
        const resizeHandle = 8;
        return { x: this._location['x'] + this._structure['radius'] - resizeHandle / 2, y: this._location['y'] + this._structure['radius'] - resizeHandle / 2, width: resizeHandle, height: resizeHandle };
    }
    isPointOnResizeHandle(pointX, pointY) {
        const handle = this.getResizeHandle();
        return pointX > handle.x && pointX < handle.x + handle.width &&
            pointY > handle.y && pointY < handle.y + handle.height;
    }
    drawResizeHandle(canvasContext) {
        const handle = this.getResizeHandle();
        canvasContext.fillStyle = '#000000';
        canvasContext.fillRect(handle.x, handle.y, handle.width, handle.height);
    }
    isPointInside(pointX, pointY) {
        let yp = pointY;
        let xp = pointX;
        let count = 0;
        for (let index = 0; index < this._structure['points'].length; index = index + 2) {
            let x1 = this._structure['points'][index];
            let y1 = this._structure['points'][index + 1];
            let x2 = this._structure['points'][index + 2];
            let y2 = this._structure['points'][index + 3];
            if (typeof x1 === "undefined" || typeof y1 === "undefined" || typeof x2 === "undefined" || typeof y2 === "undefined") {
                x2 = this._structure['points'][0];
                y2 = this._structure['points'][1];
            }
            if (((yp < y1) !== (yp < y2)) && xp < x1 + ((yp - y1) / (y2 - y1)) * (x2 - x1)) {
                count = count + 1;
            }
        }
        return count % 2 === 1;
    }
}
export class Arc extends NElement {
    constructor(x, y, start_angle = 0, end_angle = 2 * Math.PI, radius = 50) {
        super(x, y);
        this._structure = { radius: 50, startAngle: 0, endAngle: 2 * Math.PI };
        this._startAngle = start_angle;
        this._endAgle = end_angle;
        this._structure = { startAngle: start_angle, endAngle: end_angle, radius: radius };
        this.setAlignmentCoordinate(x - radius, y - radius, x + radius, x + radius);
        this._type = "Arc";
    }
    draw(ctx) {
        if (this, this._isHidden)
            return;
        ctx.save();
        ctx.beginPath();
        this.addLine(ctx);
        this.addTransformation(ctx);
        ctx.arc(this._location['x'], this._location['y'], this._structure['radius'], this._structure['startAngle'], this._structure['endAngle']);
        this.fill_and_stroke(ctx);
        this.draw_if_selected(ctx);
        ctx.restore();
    }
    handleLinearGradientVariation(variation, style, ctx) {
        let _x0, _y0, _r0, _x1, _y1, _r1;
        _x0 = this._location['x'] - this._structure['radius'];
        _y0 = this._location['y'] - this._structure['radius'];
        _r0 = _r1 = this._structure['radius'];
        _x1 = _x0 + (this._structure['radius'] * 2);
        _y1 = _y0 + (this._structure['radius'] * 2);
        switch (variation) {
            case "horizontal-linear-gradient":
                ctx[style] = this._pallete[style].apply(ctx, { x0: _x0, x1: _x1, y0: _y0, y1: _y0 });
                return ctx[style];
            case "vertical-linear-gradient":
                ctx[style] = this._pallete[style].apply(ctx, { x0: _x0, x1: _x0, y0: _y0, y1: _y1 });
                return ctx[style];
            case "major-diagonal-gradient":
                ctx.fillStyle = this._pallete[style].apply(ctx, { x0: _x0, x1: _x1, y0: _y1, y1: _y0 });
                return ctx[style];
            case "minor-diagonal-gradient":
                ctx.fillStyle = this._pallete[style].apply(ctx, { x0: _x0, x1: _x1, y0: _y0, y1: _y1 });
                return ctx[style];
            default:
                ctx.fillStyle = this._pallete[style].apply(ctx, { x0: _x0, x1: _x1, y0: _y0, y1: _y0 });
                return ctx[style];
        }
    }
    handleRadialGradient(canvasContext, style) {
        canvasContext[style] = this._pallete[style].apply(canvasContext, { x0: this._location['x'], y0: this._location['y'], r0: 15, x1: this._location['x'], y1: this._location['y'], r1: 40 });
        return canvasContext[style];
    }
    handleConicGradient(canvasContext, style) {
        canvasContext[style] = this._pallete[style].apply(canvasContext, { startAngle: 0, x: this._location['x'], y: this._location['y'] });
        return canvasContext[style];
    }
    isPointInside(px, py) {
        const distance = Math.sqrt(Math.pow(px - this._location['x'], 2) + Math.pow(py - this._location['y'], 2));
        return distance < this._structure['radius'];
    }
    isPointOnResizeHandle(px, py) {
        const handle = this.getResizeHandle();
        return px > handle.x && px < handle.x + handle.width &&
            py > handle.y && py < handle.y + handle.height;
    }
    resize(dx, dy) {
        // Resize based on the largest change to maintain circularity
        const delta = Math.max(Math.abs(dx), Math.abs(dy));
        if (dx + dy > 0) { // Growing
            this._structure['radius'] = Math.max(5, this._structure['radius'] + delta / 2);
        }
        else { // Shrinking
            this._structure['radius'] = Math.max(5, this._structure['radius'] - delta / 2);
        }
    }
    drawResizeHandle(ctx) {
        const handle = this.getResizeHandle();
        ctx.fillStyle = '#000000'; // Red handle
        ctx.fillRect(handle.x, handle.y, handle.width, handle.height);
    }
    getResizeHandle() {
        const handleSize = 6;
        // Position handle at bottom-right of a conceptual bounding box
        return {
            x: 3 + this._location['x'] + this._structure['radius'] * Math.cos(Math.PI / 4) - handleSize / 2, // Approx bottom-right
            y: 3 + this._location['y'] + this._structure['radius'] * Math.sin(Math.PI / 4) - handleSize / 2, // Approx bottom-right
            width: handleSize,
            height: handleSize
        };
    }
}
export class TextElement extends NElement {
    constructor(x, y, text) {
        super(x, y);
        this._width = 0;
        this._font = { fontStyle: "normal", fontWeight: "normal", fontSize: 40, fontFamily: "'Courier New'" };
        this._text = { font: `${this._font['_fontStyle']} ${this._font['_fontWeight']} ${this._font['_fontSize']}px ${this._font['_fontFamily']}`, fontKerning: "normal", fontStretch: "normal", letterSpacing: 1.5, wordSpacing: 1.5, textContent: "write something" };
        this._type = "Text";
        this._text['textContent'] = text;
        this._font['fontStyle'] = 'normal';
        this._font['fontWeight'] = 'normal';
        this._font['fontFamily'] = "'Courier New'";
        this._font['fontSize'] = 40;
        this._text['font'] = `${this._font['fontStyle']} ${this._font['fontWeight']} ${this._font['fontSize']}px ${this._font['fontFamily']}`;
        this._text['fontKerning'] = 'normal';
        this._text['fontStretch'] = 'normal';
        this._text['letterSpacing'] = 1.5;
        this._text['wordSpacing'] = 1.5;
        this['_height'] = this._font['fontSize'];
    }
    draw(canvasContext) {
        if (this._isHidden)
            return;
        canvasContext.save();
        canvasContext.beginPath();
        this.addLine(canvasContext);
        this.addTransformation(canvasContext);
        canvasContext.textBaseline = 'top';
        for (const key in this._text) {
            if (key === "letterSpacing" || key === "wordSpacing") {
                canvasContext[key] = `${this._text[key]}px`;
            }
            else {
                canvasContext[key] = this._text[key];
            }
        }
        this._width = canvasContext.measureText(this._text['textContent']).width;
        this.fill_and_stroke(canvasContext);
        if (this._isSelected) {
            canvasContext.beginPath();
            canvasContext.strokeStyle = "#000000";
            canvasContext.lineWidth = 2;
            canvasContext.setLineDash([5, 5]);
            canvasContext.strokeRect(this._location['x'] - 5, this._location['y'] - 5, this['width'] + 10, this['height'] + 10);
            this.drawResizeHandle(canvasContext);
        }
        canvasContext.restore();
    }
    handleLinearGradientVariation(variation, style, ctx) {
        switch (variation) {
            case "horizontal-linear-gradient":
                ctx[style] = this._pallete[style].apply(ctx, { x0: this._location['x'], x1: this['_width'] + this._location['x'], y0: this._location['y'], y1: this._location['y'] });
                return ctx[style];
            case "vertical-linear-gradient":
                ctx[style] = this._pallete[style].apply(ctx, { x0: this._location['x'], x1: this._location['x'], y0: this._location['y'], y1: this._location['y'] + this['_height'] });
                return ctx[style];
            case "major-diagonal-gradient":
                ctx.fillStyle = this._pallete[style].apply(ctx, { x0: this._location['x'], x1: this['_width'] + this._location['x'], y0: this._location['y'] + this['_height'], y1: this._location['y'] });
                return ctx[style];
            case "minor-diagonal-gradient":
                ctx.fillStyle = this._pallete[style].apply(ctx, { x0: this._location['x'], x1: this['_width'] + this._location['x'], y0: this._location['y'], y1: this._location['y'] + this['_height'] });
                return ctx[style];
            default:
                ctx.fillStyle = this._pallete[style].apply(ctx, { x0: this._location['x'], x1: this['_width'] + this._location['x'], y0: this._location['y'], y1: this._location['y'] });
                return ctx[style];
        }
    }
    handleRadialGradient(canvasContext, style) {
        canvasContext[style] = this._pallete[style].apply(canvasContext, { x0: this._location['x'] + this['_width'] / 2, y0: this._location['y'] + this['_height'] / 2, r0: 15, x1: this._location['x'] + this['_width'] / 2, y1: this._location['y'] + this['_height'] / 2, r1: 40 });
        return canvasContext[style];
    }
    handleConicGradient(canvasContext, style) {
        canvasContext[style] = this._pallete[style].apply(canvasContext, { startAngle: 0, x: this._location['x'] + this['_width'] / 2, y: this._location['y'] + this['_height'] / 2 });
        return canvasContext[style];
    }
    clone() {
        let copy = new TextElement(this._location['_x'], this._location['y'], this._text['textContent']);
        copy['_line'] = this['_line'];
        for (const key in this._pallete) {
            let property = key;
            if (key === "fillStyle" || key === "strokeStyle") {
                copy[property] = this._pallete[key].clone();
            }
            copy[property] = this._pallete[key];
        }
        return copy;
    }
    isPointInside(pointX, pointY) {
        return pointX > this._location['x'] && pointX < this._location['x'] + this._width
            && pointY > this._location['y'] && pointY < this._location['y'] + this._height;
    }
    getResizeHandle() {
        let handleSize = 8;
        return { x: this._location['x'] + this['_width'] - handleSize / 2, y: this._location['y'] + handleSize / 32, width: handleSize, height: handleSize };
    }
    isPointOnResizeHandle(pointX, pointY) {
        const handle = this.getResizeHandle();
        return pointX > handle.x && pointX < handle.x + handle.width &&
            pointY > handle.y && pointY < handle.y + handle.height;
    }
    drawResizeHandle(canvasContext) {
        const handle = this.getResizeHandle();
        canvasContext.fillStyle = '#000000';
        canvasContext.fillRect(handle.x, handle.y, handle.width, handle.height);
    }
}
export class Ellipse extends NElement {
    constructor(x, y, radiusX = 50, radiusY = 25, rotation = 0, startAngle = 0, endAngle = 2 * Math.PI) {
        super(x, y);
        this._radiusX = 0;
        this._radiusY = 0;
        this._rotation = 0;
        this._startAngle = 0;
        this._endAngle = 0;
        this._type = "Ellipse";
        this._structure = { radiusX, radiusY, rotation, startAngle, endAngle };
    }
    draw(canvasContext) {
        if (this._isHidden)
            return;
        canvasContext.save();
        canvasContext.beginPath();
        this.addLine(canvasContext);
        this.addTransformation(canvasContext);
        canvasContext.ellipse(this._location['x'], this._location['y'], this._structure['radiusX'], this._structure['radiusY'], this._structure['rotation'], this._structure['startAngle'], this._structure['endAngle']);
        this.fill_and_stroke(canvasContext);
        this.draw_if_selected(canvasContext);
        canvasContext.restore();
    }
    handleLinearGradientVariation(variation, style, ctx) {
        let _x0, _y0, _r0, _x1, _y1, _r1;
        _x0 = this._location['x'] - this._structure['radiusX'];
        _y0 = this._location['y'] - this._structure['radiusY'];
        _r0 = _r1 = this._structure['radiusX'];
        _x1 = _x0 + (this._structure['radiusX'] * 2);
        _y1 = _y0 + (this._structure['radiusY'] * 2);
        switch (variation) {
            case "horizontal-linear-gradient":
                ctx[style] = this._pallete[style].apply(ctx, { x0: _x0, x1: _x1, y0: _y0, y1: _y0 });
                return ctx[style];
            case "vertical-linear-gradient":
                ctx[style] = this._pallete[style].apply(ctx, { x0: _x0, x1: _x0, y0: _y0, y1: _y1 });
                return ctx[style];
            case "major-diagonal-gradient":
                ctx.fillStyle = this._pallete[style].apply(ctx, { x0: _x0, x1: _x1, y0: _y1, y1: _y0 });
                return ctx[style];
            case "minor-diagonal-gradient":
                ctx.fillStyle = this._pallete[style].apply(ctx, { x0: _x0, x1: _x1, y0: _y0, y1: _y1 });
                return ctx[style];
            default:
                ctx.fillStyle = this._pallete[style].apply(ctx, { x0: _x0, x1: _x1, y0: _y0, y1: _y0 });
                return ctx[style];
        }
    }
    handleRadialGradient(canvasContext, style) {
        canvasContext[style] = this._pallete[style].apply(canvasContext, { x0: this._location['x'], y0: this._location['y'], r0: 15, x1: this._location['x'], y1: this._location['y'], r1: 40 });
        return canvasContext[style];
    }
    handleConicGradient(canvasContext, style) {
        canvasContext[style] = this._pallete[style].apply(canvasContext, { startAngle: 0, x: this._location['x'], y: this._location['y'] });
        return canvasContext[style];
    }
    clone() {
        let copy = new Ellipse(this._location['x'], this._location['y'], this._structure['radiusX'], this._structure['radiusY'], this._structure['rotation'], this._structure['startAngle'], this._structure['endAngle']);
        copy['_line'] = this['_line'];
        for (const key in this._pallete) {
            let property = key;
            if (key === "fillStyle" || key === "strokeStyle") {
                copy[property] = this._pallete[key].clone();
            }
            copy[property] = this._pallete[key];
        }
        return copy;
    }
    resize(changeX, changeY) {
        this._structure['radiusX'] = Math.max(10, this._structure['radiusX'] + changeX);
        this._structure['radiusY'] = Math.max(10, this._structure['radiusY'] + changeY);
    }
    isPointInside(pointX, pointY) {
        const distance = Math.sqrt(Math.pow(pointX - this._location['x'], 2) + Math.pow(pointY - this._location['y'], 2));
        return distance < this._structure['radiusX'] || distance < this._structure['radiusY'];
    }
    getResizeHandle() {
        const resizeHandle = 8;
        return { x: this._location['x'] + this._structure['radiusX'] - resizeHandle / 2, y: this._location['y'] + this._structure['radiusY'] - resizeHandle / 2, width: resizeHandle, height: resizeHandle };
    }
    isPointOnResizeHandle(pointX, pointY) {
        const handle = this.getResizeHandle();
        return pointX > handle.x && pointX < handle.x + handle.width &&
            pointY > handle.y && pointY < handle.y + handle.height;
    }
    drawResizeHandle(canvasContext) {
        const handle = this.getResizeHandle();
        canvasContext.fillStyle = '#000000';
        canvasContext.fillRect(handle.x, handle.y, handle.width, handle.height);
    }
}
export class Star extends NElement {
    constructor(x, y, radius = 50, innerRadiusRatio = 0.4, sides = 5) {
        super(x, y);
        this._structure = { radius: 50, innerRadiusRatio: 0.4, sides: 5, points: [] };
        this._type = "Star";
        this._structure['radius'] = radius;
        this._structure['innerRadiusRatio'] = innerRadiusRatio;
        this._structure['sides'] = sides;
        this._structure['points'] = this.points();
        let points = this._structure['points'];
        this._structure = { radius, innerRadiusRatio, sides, points };
    }
    draw(canvasContext) {
        if (this._isHidden)
            return;
        canvasContext.save();
        canvasContext.beginPath();
        this.addLine(canvasContext);
        this.addTransformation(canvasContext);
        const innerRadius = this._structure['radius'] * this._structure['innerRadiusRatio'];
        const angleIncrement = Math.PI / this._structure['sides'];
        for (let i = 0; i < this._structure['sides'] * 2; i++) {
            const currentRadius = (i % 2 === 0) ? this._structure['radius'] : innerRadius;
            const angle = i * angleIncrement - Math.PI / 2;
            const x = this._location['x'] + currentRadius * Math.cos(angle);
            const y = this._location['y'] + currentRadius * Math.sin(angle);
            if (i === 0) {
                canvasContext.moveTo(x, y);
            }
            else {
                canvasContext.lineTo(x, y);
            }
        }
        canvasContext.closePath();
        this.fill_and_stroke(canvasContext);
        this.draw_if_selected(canvasContext);
        canvasContext.restore();
    }
    points() {
        let points = [];
        const innerRadius = this._structure['radius'] * this._structure['innerRadiusRatio'];
        const angleIncrement = Math.PI / this._structure['sides'];
        for (let i = 0; i < this._structure['sides'] * 2; i++) {
            const currentRadius = (i % 2 === 0) ? this._structure['radius'] : innerRadius;
            const angle = i * angleIncrement - Math.PI / 2;
            const x = this._location['x'] + currentRadius * Math.cos(angle);
            const y = this._location['y'] + currentRadius * Math.sin(angle);
            points = [...points, x, y];
        }
        return points;
    }
    handleLinearGradientVariation(variation, style, ctx) {
        let _x0, _y0, _r0, _x1, _y1, _r1;
        _x0 = this._location['x'] - this._structure['radius'];
        _y0 = this._location['y'] - this._structure['radius'];
        _r0 = _r1 = this._structure['radius'];
        _x1 = _x0 + (this._structure['radius'] * 2);
        _y1 = _y0 + (this._structure['radius'] * 2);
        switch (variation) {
            case "horizontal-linear-gradient":
                ctx[style] = this._pallete[style].apply(ctx, { x0: _x0, x1: _x1, y0: _y0, y1: _y0 });
                return ctx[style];
            case "vertical-linear-gradient":
                ctx[style] = this._pallete[style].apply(ctx, { x0: _x0, x1: _x0, y0: _y0, y1: _y1 });
                return ctx[style];
            case "major-diagonal-gradient":
                ctx.fillStyle = this._pallete[style].apply(ctx, { x0: _x0, x1: _x1, y0: _y1, y1: _y0 });
                return ctx[style];
            case "minor-diagonal-gradient":
                ctx.fillStyle = this._pallete[style].apply(ctx, { x0: _x0, x1: _x1, y0: _y0, y1: _y1 });
                return ctx[style];
            default:
                ctx.fillStyle = this._pallete[style].apply(ctx, { x0: _x0, x1: _x1, y0: _y0, y1: _y0 });
                return ctx[style];
        }
    }
    handleRadialGradient(canvasContext, style) {
        canvasContext[style] = this._pallete[style].apply(canvasContext, { x0: this._location['x'], y0: this._location['y'], r0: 15, x1: this._location['x'], y1: this._location['y'], r1: 40 });
        return canvasContext[style];
    }
    handleConicGradient(canvasContext, style) {
        canvasContext[style] = this._pallete[style].apply(canvasContext, { startAngle: 0, x: this._location['x'], y: this._location['y'] });
        return canvasContext[style];
    }
    clone() {
        let copy = new Star(this._location['x'], this._location['y'], this._structure['radius'], this._structure['innerRadiusRatio'], this._structure['sides']);
        copy['_line'] = this['_line'];
        for (const key in this._pallete) {
            let property = key;
            if (key === "fillStyle" || key === "strokeStyle") {
                copy[property] = this._pallete[key].clone();
            }
            copy[property] = this._pallete[key];
        }
        return copy;
    }
    resize(changeX, changeY) {
        const delta = Math.max(Math.abs(changeX), Math.abs(changeY));
        if (changeX + changeY > 0) {
            this._structure['radius'] = Math.max(5, this._structure['radius'] + delta / 2);
        }
        else {
            this._structure['radius'] = Math.max(5, this._structure['radius'] - delta / 2);
        }
        this._structure['points'] = this.points();
    }
    getResizeHandle() {
        const resizeHandle = 8;
        return { x: this._location['x'] + this._structure['radius'] - resizeHandle / 2, y: this._location['y'] + this._structure['radius'] - resizeHandle / 2, width: resizeHandle, height: resizeHandle };
    }
    isPointOnResizeHandle(pointX, pointY) {
        const handle = this.getResizeHandle();
        return pointX > handle.x && pointX < handle.x + handle.width &&
            pointY > handle.y && pointY < handle.y + handle.height;
    }
    drawResizeHandle(canvasContext) {
        const handle = this.getResizeHandle();
        canvasContext.fillStyle = '#000000';
        canvasContext.fillRect(handle.x, handle.y, handle.width, handle.height);
    }
    isPointInside(pointX, pointY) {
        let yp = pointY;
        let xp = pointX;
        let count = 0;
        for (let index = 0; index < this._structure['points'].length; index = index + 2) {
            let x1 = this._structure['points'][index];
            let y1 = this._structure['points'][index + 1];
            let x2 = this._structure['points'][index + 2];
            let y2 = this._structure['points'][index + 3];
            if (typeof x1 === "undefined" || typeof y1 === "undefined" || typeof x2 === "undefined" || typeof y2 === "undefined") {
                x2 = this._structure['points'][0];
                y2 = this._structure['points'][1];
            }
            if (((yp < y1) !== (yp < y2)) && xp < x1 + ((yp - y1) / (y2 - y1)) * (x2 - x1)) {
                count = count + 1;
            }
        }
        return count % 2 === 1;
    }
}
