import { Rectangle, Arc, Polygon, Ellipse, TextElement, Star } from "./Components.js";
export class ElementFactory {
    createElement(mouseX, mouseY, elementType) {
        switch (elementType) {
            case "rectangle":
                return new Rectangle(mouseX, mouseY);
            case "arc":
                return new Arc(mouseX, mouseY);
            case "polygon":
                return new Polygon(mouseX, mouseY);
            case "ellipse":
                return new Ellipse(mouseX, mouseY);
            case "text":
                return new TextElement(mouseX, mouseY, "Write Text");
            case "star":
                return new Star(mouseX, mouseY);
            default:
                throw new Error("Unknown type");
        }
    }
}
