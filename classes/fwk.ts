interface Point {
    x: number;
    y: number;
}

interface Drawable {
    draw(): void;
}

class FwkException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'FwkException';
    }
}

class Coordinates implements Point {
    constructor(public x: number, public y: number) { }
}

interface DrawableParams {
    coordinates: Coordinates;
    ctx: CanvasRenderingContext2D;
}

class CircleParams implements DrawableParams {
    constructor(
        public coordinates: Coordinates,
        public ctx: CanvasRenderingContext2D,
        public radius: number,
        public fillColor: string,
        public strokeColor: string,
        public lineWidth?: number
    ) { }
}

class RectangleParams implements DrawableParams {
    constructor(
        public coordinates: Coordinates,
        public ctx: CanvasRenderingContext2D,
        public width: number,
        public height: number,
        public fillColor: string,
        public strokeColor: string,
        public lineWidth?: number
    ) { }
}

class TextParams implements DrawableParams {
    constructor(
        public coordinates: Coordinates,
        public ctx: CanvasRenderingContext2D,
        public text: string,
        public font: string,
        public color: string,
        public borderWidth?: number,
        public borderColor?: string
    ) { }
}

interface DrawStrategy {
    draw(params: DrawableParams): void;
}

class CircleStrategy implements DrawStrategy {
    draw(circleParams: CircleParams): void {
        const ctx = circleParams.ctx;
        ctx.beginPath();
        ctx.arc(circleParams.coordinates.x, circleParams.coordinates.y, circleParams.radius, 0, 2 * Math.PI);
        ctx.fillStyle = circleParams.fillColor;
        ctx.fill();
        if (circleParams.lineWidth) {
            ctx.strokeStyle = circleParams.strokeColor;
            ctx.lineWidth = circleParams.lineWidth;
            ctx.stroke();
        }
        ctx.closePath(); // Close the path
    }
}

class RectangleStrategy implements DrawStrategy {
    draw(rectangleParams: RectangleParams): void {
        const ctx = rectangleParams.ctx;
        ctx.beginPath();
        ctx.rect(rectangleParams.coordinates.x, rectangleParams.coordinates.y, rectangleParams.width, rectangleParams.height);
        ctx.fillStyle = rectangleParams.fillColor;
        ctx.fill();
        if (rectangleParams.lineWidth) {
            ctx.strokeStyle = rectangleParams.strokeColor;
            ctx.lineWidth = rectangleParams.lineWidth;
            ctx.stroke();
        }
        ctx.closePath(); // Close the path
    }
}

class TextStrategy implements DrawStrategy {
    draw(textParams: TextParams): void {
        const ctx = textParams.ctx;
        ctx.font = textParams.font;
        ctx.fillStyle = textParams.color;
        ctx.fillText(textParams.text, textParams.coordinates.x, textParams.coordinates.y);
        if (textParams.borderWidth) {
            ctx.strokeStyle = textParams.borderColor || '';
            ctx.strokeText(textParams.text, textParams.coordinates.x, textParams.coordinates.y);
        }
    }
}

abstract class ShapeDrawable implements Drawable {
    constructor(public params: DrawableParams, protected drawStrategy: DrawStrategy) { }

    abstract draw(): void;
}

class CircleDrawable extends ShapeDrawable {
    constructor(circleParams: CircleParams) {
        super(circleParams, new CircleStrategy());
    }

    draw(): void {
        this.drawStrategy.draw(this.params);
    }
}

class RectangleDrawable extends ShapeDrawable {
    constructor(rectangleParams: RectangleParams) {
        super(rectangleParams, new RectangleStrategy());
    }

    draw(): void {
        this.drawStrategy.draw(this.params);
    }
}

class TextDrawable extends ShapeDrawable {
    constructor(textParams: TextParams) {
        super(textParams, new TextStrategy());
    }
    draw(): void {
        this.drawStrategy.draw(this.params);
    }
}

interface IsInsideStrategy {
    isInside(point: Point, params: DrawableParams): boolean;
}


class CircleIsInsideStrategy implements IsInsideStrategy {
    isInside(point: Point, params: CircleParams): boolean {
        const { coordinates, radius } = params;
        return Math.pow(point.x - coordinates.x, 2) + Math.pow(point.y - coordinates.y, 2) <= Math.pow(radius, 2);
    }
}

class RectangleIsInsideStrategy implements IsInsideStrategy {
    isInside(point: Point, params: RectangleParams): boolean {
        const { coordinates, width, height } = params;
        return (
            point.x >= coordinates.x &&
            point.x <= coordinates.x + width &&
            point.y >= coordinates.y &&
            point.y <= coordinates.y + height
        );
    }
}

class TextIsInsideStrategy implements IsInsideStrategy {
    isInside(point: Point, params: TextParams): boolean {
        const { ctx, text, coordinates } = params;
        const textWidth = ctx.measureText(text).width;
        const textHeight = parseInt(params.font, 10);
        return (
            point.x >= coordinates.x &&
            point.x <= coordinates.x + textWidth &&
            point.y >= coordinates.y - textHeight &&
            point.y <= coordinates.y
        );
    }
}

class IsInsideDrawableMap {
    private static map = new Map<new (...args: any[]) => any, IsInsideStrategy>([
        [CircleDrawable, new CircleIsInsideStrategy()],
        [RectangleDrawable, new RectangleIsInsideStrategy()],
        [TextDrawable, new TextIsInsideStrategy()],
    ]);

    static getStrategy(drawableClass: new (...args: any[]) => any): IsInsideStrategy | undefined {
        return this.map.get(drawableClass);
    }
}

// Define a generic type for the constructor function of drawable types
type DrawableConstructor<T extends ShapeDrawable> = new (params: DrawableParams) => T;


class DrawableFactory {
    static create<T extends ShapeDrawable>(
        drawableClass: DrawableConstructor<T>,
        params: DrawableParams
    ): T {
        const isInsideStrategy = IsInsideDrawableMap.getStrategy(drawableClass);
        if (!isInsideStrategy) {
            throw new FwkException(`No IsInsideStrategy found for ${drawableClass.name}`);
        }
        return new drawableClass(params);
    }
}

interface GUIElement extends Drawable {
    // Interfaccia per gli elementi della GUI
    // Estende l'interfaccia Drawable
    // Aggiunge il metodo onClick per gestire il click sull'elemento
}

interface Clickable {
    // Interfaccia per gli elementi cliccabili della GUI
    // Definisce il comportamento di quando un elemento viene cliccato
    onClick(callback: () => void): void;
}

interface ButtonParams extends DrawableParams {
    drawableParams: DrawableParams;
    textParams: TextParams;
}

class Button implements GUIElement, Clickable {
    private drawable: ShapeDrawable;
    private text: TextDrawable;

    constructor(private params: ButtonParams) {
        this.drawable = DrawableFactory.create(RectangleDrawable as DrawableConstructor<RectangleDrawable>, params.drawableParams);
        this.text = DrawableFactory.create(TextDrawable as DrawableConstructor<TextDrawable>, params.textParams);

    }
    onClick(callback: () => void): void {
        throw new Error("Method not implemented.");
    }

    draw(): void {
        this.drawable.draw();
        this.text.draw();
    }
    
}

class Canvas {
    private elements: GUIElement[] = [];
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    constructor(private canvasId: string) {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d')!;
    }

    addElement(element: GUIElement): void {
        this.elements.push(element);
    }

    draw(): void {
        this.elements.forEach((element) => element.draw());
    }

    getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }

    getCtx(): CanvasRenderingContext2D {
        return this.ctx;
    }
}

//usage 
const canvas = new Canvas('canvas');
const ctx = canvas.getCtx();

const drawableParams: DrawableParams = {
    coordinates: new Coordinates(10, 10),
    ctx: ctx,
};

const circleParams: CircleParams = {
    ...drawableParams,
    radius: 10,
    fillColor: 'red',
    strokeColor: 'black',
    lineWidth: 2,
};

const rectangleParams: RectangleParams = {
    ...drawableParams,
    width: 100,
    height: 50,
    fillColor: 'blue',
    strokeColor: 'black',
    lineWidth: 2,
};

const textParams: TextParams = {
    ...drawableParams,
    text: 'Hello, World!',
    font: '20px Arial',
    color: 'black',
    borderWidth: 2,
    borderColor: 'black',
};

const circle = new CircleDrawable(circleParams);
const rectangle = new RectangleDrawable(rectangleParams);
const text = new TextDrawable(textParams);

canvas.addElement(circle);
canvas.addElement(rectangle);
canvas.addElement(text);

canvas.draw();



