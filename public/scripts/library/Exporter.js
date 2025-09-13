import { RGBA } from "./Colors";
let defaultExporterBackgroundColor = new RGBA();
defaultExporterBackgroundColor.setColor([255, 255, 255, 0]);
export class ExportList {
    constructor(list = []) {
        this._list = [];
        this._list = list;
    }
    add(product) {
        this._list.push(product);
    }
}
export class Exporter {
    constructor(type = "png", width = 640, height = 480, backgroundColorSet = [defaultExporterBackgroundColor]) {
        this._backgroundColorSet = [defaultExporterBackgroundColor];
        this._type = type;
        this._width = width;
        this._height = height;
        this._backgroundColorSet = backgroundColorSet;
    }
    exportFile() {
        if (this._type === "png") {
        }
    }
}
export class Director {
    constructor(builder) {
        this._builder = builder;
    }
    construct(structure) {
        for (let index = 0; index < structure.length; index++) {
            const element = structure[index];
            for (const key in element) {
                let propery = element[key];
                this._builder.buildPart(key, propery);
            }
            if (this._builder instanceof ExporterBuilder) {
                this._builder._exportList.add(this._builder.getResult());
            }
        }
    }
}
export class ExporterBuilder {
    constructor() {
        this._type = "png";
        this._width = 640;
        this._height = 480;
        this._backgroundColorSet = [defaultExporterBackgroundColor];
        this._exportList = new ExportList();
    }
    buildPart(key, value) {
        switch (key) {
            case "_type":
                this.setType(value);
                break;
            case "_width":
                this.setWidth(value);
                break;
            case "_height":
                this.setHeight(value);
                break;
            case "_backgroundColorSet":
                this.setBackgroundColorSet(value);
                break;
            default:
                throw new Error("Unknown Key");
        }
    }
    setType(type) {
        this._type = type;
    }
    ;
    setWidth(width) {
        this._width = width;
    }
    setHeight(height) {
        this._height = height;
    }
    setBackgroundColorSet(colorSet) {
        this._backgroundColorSet = colorSet;
    }
    getResult() {
        return new Exporter(this._type, this._width, this._height, this._backgroundColorSet);
    }
    addExportList() {
        this._exportList._list.push(this.getResult());
    }
}
