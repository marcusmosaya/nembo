export class IColor {
    constructor() {
        this._value = '';
    }
    convert(color) {
        throw new Error("This class acts as an Interface.");
    }
    ;
    getColor() {
        throw new Error("This class acts as an interface.");
    }
    setColor(color) {
        throw new Error("This class acts as an interface.");
    }
    clone() {
        throw new Error("This class acts as an interface.");
    }
}
export class RGBA extends IColor {
    constructor() {
        super(...arguments);
        this._rgbaArray = [];
    }
    convert(color) {
        switch (color) {
            case "hex":
                return this.handleToHexaDecimalColor(color);
            case "rgba":
                return this;
            default:
                throw new Error("Unknown color scheme.");
        }
    }
    getColor() {
        return this._value;
    }
    clone() {
        let copy = new RGBA();
        copy.setColor(this._rgbaArray);
        return copy;
    }
    setColor(color) {
        let rgba;
        if (color.length !== 4) {
            throw new Error(`The array has an invalid length of ${color.length} instead of 4`);
        }
        for (let colorIndex = 0; colorIndex < color.length; colorIndex++) {
            const element = color[colorIndex];
            if (colorIndex === 3) {
                if (element > 1 || element < 0) {
                    throw new Error(`The alpha value ${element} is out of range`);
                }
            }
            if (element > 255 || element < 0) {
                throw new Error(`The color value ${element} is out of range.`);
            }
        }
        rgba = `rgba(${color[0]},${color[1]},${color[2]},${color[3]})`;
        this._rgbaArray = color;
        this._value = rgba;
    }
    toHexdecimalstring(base10) {
        let hexRange = { '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 'A', '11': 'B', '12': 'C', '13': 'D', '14': 'E', '15': 'F' };
        let hexaDecimalNumber = [];
        let dividend = base10;
        while (dividend > 0) {
            let quotient = Math.floor(dividend / 16);
            let newDivident = quotient;
            let remainder = dividend - (quotient * 16);
            let rem = hexRange[String(remainder)];
            hexaDecimalNumber.unshift(rem);
            dividend = newDivident;
        }
        let hexaDecimalString = "";
        for (let index = 0; index < hexaDecimalNumber.length; index++) {
            hexaDecimalString += hexaDecimalNumber[index];
        }
        if (hexaDecimalString.length === 1) {
            hexaDecimalString = "0" + hexaDecimalString;
        }
        if (hexaDecimalString.length === 0) {
            hexaDecimalString = "00";
        }
        return hexaDecimalString;
    }
    handleToHexaDecimalColor(color) {
        let hexString = '#';
        for (let index = 0; index < this._rgbaArray.length - 1; index++) {
            hexString += this.toHexdecimalstring(this._rgbaArray[index]);
        }
        let hexColor = new HEX();
        hexColor.setColor(hexString);
        return hexColor;
    }
}
export class HEX extends IColor {
    convert(color) {
        switch (color) {
            case "rgba":
                return this.handleToRGBA(color);
            case "hex":
                return this;
            default:
                throw new Error("unknown color scheme");
        }
    }
    clone() {
        let copy = new HEX();
        copy.setColor(this._value);
        return copy;
    }
    getColor() {
        return this._value;
    }
    setColor(color) {
        this._value = color;
    }
    toDecimalString(hexValue) {
        let hexRange = { "0": 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, 'a': 10, 'b': 11, 'c': 12, 'd': 13, 'e': 14, 'f': 15 };
        let number = 0;
        let position = hexValue.length - 1;
        for (let index = 0; index < hexValue.length; index++) {
            number += hexRange[hexValue[index]] * 16 ** (position);
            position--;
        }
        return number;
    }
    toHexadecimalArray() {
        let hexVal = this._value.substring(1);
        let array = [];
        for (let index = 0; index < hexVal.length; index = index + 2) {
            let val = hexVal.substring(index, index + 2);
            array.push(val);
        }
        return array;
    }
    handleToRGBA(color) {
        let hexArray = this.toHexadecimalArray();
        let rgb = [];
        for (let index = 0; index < hexArray.length; index++) {
            const element = this.toDecimalString(hexArray[index]);
            rgb.push(element);
        }
        let rgba = new RGBA();
        rgba.setColor([...rgb, 1]);
        return rgba;
    }
}
export class IGradient {
    constructor(gradient) {
        this._type = '';
        this._variation = '';
        this._gradient = gradient;
    }
    getVariation() {
        return this._variation;
    }
    setVariation(variation) {
        throw new Error("This class acts as an interface.");
    }
    ;
    apply(canvasContext, parameters) {
        throw new Error("This class acts as an interface.");
    }
    ;
    clone() {
        throw new Error("This class acts as an interface");
    }
}
export class LinearGradient extends IGradient {
    constructor(gradient) {
        super(gradient);
        this._variation = "horizontal-linear-gradient";
        this._type = "linearGradient";
    }
    setVariation(variation) {
        this._variation = variation;
    }
    apply(canvasContext, parameters) {
        let graphicContext = canvasContext.createLinearGradient(parameters.x0, parameters.y0, parameters.x1, parameters.y1);
        for (const index in this._gradient) {
            graphicContext.addColorStop(this._gradient[index].colorStop, this._gradient[index].color.getColor());
        }
        return graphicContext;
    }
    clone() {
        let copyArray = [];
        for (let index = 0; index < this._gradient.length; index++) {
            let color = this._gradient[index]['color'].clone();
            let colorStop = this._gradient[index]['colorStop'];
            copyArray.push({ color, colorStop });
        }
        let copy = new LinearGradient(copyArray);
        copy._variation = this.getVariation();
        return copy;
    }
}
export class RadialGradient extends IGradient {
    constructor(gradient) {
        super(gradient);
        this._type = "radialGradient";
        this._variation = "radial-gradient";
    }
    setVariation(variation) {
        this._variation = variation;
    }
    apply(canvasContext, parameters) {
        let graphicContext = canvasContext.createRadialGradient(parameters.x0, parameters.y0, parameters.r0, parameters.x1, parameters.y1, parameters.r1);
        for (const index in this._gradient) {
            graphicContext.addColorStop(this._gradient[index].colorStop, this._gradient[index].color.getColor());
        }
        return graphicContext;
    }
    clone() {
        let copyArray = [];
        for (let index = 0; index < this._gradient.length; index++) {
            let color = this._gradient[index]['color'].clone();
            let colorStop = this._gradient[index]['colorStop'];
            copyArray.push({ color, colorStop });
        }
        let copy = new RadialGradient(copyArray);
        return copy;
    }
}
export class ConicGradient extends IGradient {
    constructor(gradient) {
        super(gradient);
        this._type = "conicGradient";
        this._variation = "conical-gradient";
    }
    setVariation(variation) {
        this._variation = variation;
    }
    apply(canvasContext, parameters) {
        let graphicContext = canvasContext.createConicGradient(parameters.startAngle, parameters.x, parameters.y);
        for (const index in this._gradient) {
            graphicContext.addColorStop(this._gradient[index].colorStop, this._gradient[index].color.getColor());
        }
        return graphicContext;
    }
    clone() {
        let copyArray = [];
        for (let index = 0; index < this._gradient.length; index++) {
            let color = this._gradient[index]['color'].clone();
            let colorStop = this._gradient[index]['colorStop'];
            copyArray.push({ color, colorStop });
        }
        let copy = new ConicGradient(copyArray);
        return copy;
    }
}
