var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var FwkException = /** @class */ (function (_super) {
    __extends(FwkException, _super);
    function FwkException(message) {
        var _this = _super.call(this, message) || this;
        _this.name = 'FwkException';
        return _this;
    }
    return FwkException;
}(Error));
var Coordinates = /** @class */ (function () {
    function Coordinates(x, y) {
        this.x = x;
        this.y = y;
    }
    return Coordinates;
}());
var CircleParams = /** @class */ (function () {
    function CircleParams(coordinates, ctx, radius, fillColor, strokeColor, lineWidth) {
        this.coordinates = coordinates;
        this.ctx = ctx;
        this.radius = radius;
        this.fillColor = fillColor;
        this.strokeColor = strokeColor;
        this.lineWidth = lineWidth;
    }
    return CircleParams;
}());
var RectangleParams = /** @class */ (function () {
    function RectangleParams(coordinates, ctx, width, height, fillColor, strokeColor, lineWidth) {
        this.coordinates = coordinates;
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.fillColor = fillColor;
        this.strokeColor = strokeColor;
        this.lineWidth = lineWidth;
    }
    return RectangleParams;
}());
var TextParams = /** @class */ (function () {
    function TextParams(coordinates, ctx, text, font, color, borderWidth, borderColor) {
        this.coordinates = coordinates;
        this.ctx = ctx;
        this.text = text;
        this.font = font;
        this.color = color;
        this.borderWidth = borderWidth;
        this.borderColor = borderColor;
    }
    return TextParams;
}());
var CircleStrategy = /** @class */ (function () {
    function CircleStrategy() {
    }
    CircleStrategy.prototype.draw = function (circleParams) {
        var ctx = circleParams.ctx;
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
    };
    return CircleStrategy;
}());
var RectangleStrategy = /** @class */ (function () {
    function RectangleStrategy() {
    }
    RectangleStrategy.prototype.draw = function (rectangleParams) {
        var ctx = rectangleParams.ctx;
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
    };
    return RectangleStrategy;
}());
var TextStrategy = /** @class */ (function () {
    function TextStrategy() {
    }
    TextStrategy.prototype.draw = function (textParams) {
        var ctx = textParams.ctx;
        ctx.font = textParams.font;
        ctx.fillStyle = textParams.color;
        ctx.fillText(textParams.text, textParams.coordinates.x, textParams.coordinates.y);
        if (textParams.borderWidth) {
            ctx.strokeStyle = textParams.borderColor || '';
            ctx.strokeText(textParams.text, textParams.coordinates.x, textParams.coordinates.y);
        }
    };
    return TextStrategy;
}());
var ShapeDrawable = /** @class */ (function () {
    function ShapeDrawable(params, drawStrategy) {
        this.params = params;
        this.drawStrategy = drawStrategy;
    }
    return ShapeDrawable;
}());
var CircleDrawable = /** @class */ (function (_super) {
    __extends(CircleDrawable, _super);
    function CircleDrawable(circleParams) {
        return _super.call(this, circleParams, new CircleStrategy()) || this;
    }
    CircleDrawable.prototype.draw = function () {
        this.drawStrategy.draw(this.params);
    };
    return CircleDrawable;
}(ShapeDrawable));
var RectangleDrawable = /** @class */ (function (_super) {
    __extends(RectangleDrawable, _super);
    function RectangleDrawable(rectangleParams) {
        return _super.call(this, rectangleParams, new RectangleStrategy()) || this;
    }
    RectangleDrawable.prototype.draw = function () {
        this.drawStrategy.draw(this.params);
    };
    return RectangleDrawable;
}(ShapeDrawable));
var TextDrawable = /** @class */ (function (_super) {
    __extends(TextDrawable, _super);
    function TextDrawable(textParams) {
        return _super.call(this, textParams, new TextStrategy()) || this;
    }
    TextDrawable.prototype.draw = function () {
        this.drawStrategy.draw(this.params);
    };
    return TextDrawable;
}(ShapeDrawable));
var CircleIsInsideStrategy = /** @class */ (function () {
    function CircleIsInsideStrategy() {
    }
    CircleIsInsideStrategy.prototype.isInside = function (point, params) {
        var coordinates = params.coordinates, radius = params.radius;
        return Math.pow(point.x - coordinates.x, 2) + Math.pow(point.y - coordinates.y, 2) <= Math.pow(radius, 2);
    };
    return CircleIsInsideStrategy;
}());
var RectangleIsInsideStrategy = /** @class */ (function () {
    function RectangleIsInsideStrategy() {
    }
    RectangleIsInsideStrategy.prototype.isInside = function (point, params) {
        var coordinates = params.coordinates, width = params.width, height = params.height;
        return (point.x >= coordinates.x &&
            point.x <= coordinates.x + width &&
            point.y >= coordinates.y &&
            point.y <= coordinates.y + height);
    };
    return RectangleIsInsideStrategy;
}());
var TextIsInsideStrategy = /** @class */ (function () {
    function TextIsInsideStrategy() {
    }
    TextIsInsideStrategy.prototype.isInside = function (point, params) {
        var ctx = params.ctx, text = params.text, coordinates = params.coordinates;
        var textWidth = ctx.measureText(text).width;
        var textHeight = parseInt(params.font, 10);
        return (point.x >= coordinates.x &&
            point.x <= coordinates.x + textWidth &&
            point.y >= coordinates.y - textHeight &&
            point.y <= coordinates.y);
    };
    return TextIsInsideStrategy;
}());
var IsInsideDrawableMap = /** @class */ (function () {
    function IsInsideDrawableMap() {
    }
    IsInsideDrawableMap.getStrategy = function (drawableClass) {
        return this.map.get(drawableClass);
    };
    IsInsideDrawableMap.map = new Map([
        [CircleDrawable, new CircleIsInsideStrategy()],
        [RectangleDrawable, new RectangleIsInsideStrategy()],
        [TextDrawable, new TextIsInsideStrategy()],
    ]);
    return IsInsideDrawableMap;
}());
var DrawableFactory = /** @class */ (function () {
    function DrawableFactory() {
    }
    DrawableFactory.create = function (drawableClass, params) {
        var isInsideStrategy = IsInsideDrawableMap.getStrategy(drawableClass);
        if (!isInsideStrategy) {
            throw new FwkException("No IsInsideStrategy found for ".concat(drawableClass.name));
        }
        return new drawableClass(params);
    };
    return DrawableFactory;
}());
var Button = /** @class */ (function () {
    function Button(params) {
        this.params = params;
        this.drawable = DrawableFactory.create(RectangleDrawable, params.drawableParams);
        this.text = DrawableFactory.create(TextDrawable, params.textParams);
    }
    Button.prototype.onClick = function (callback) {
        throw new Error("Method not implemented.");
    };
    Button.prototype.draw = function () {
        this.drawable.draw();
        this.text.draw();
    };
    return Button;
}());
var Canvas = /** @class */ (function () {
    function Canvas(canvasId) {
        this.canvasId = canvasId;
        this.elements = [];
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
    }
    Canvas.prototype.addElement = function (element) {
        this.elements.push(element);
    };
    Canvas.prototype.draw = function () {
        this.elements.forEach(function (element) { return element.draw(); });
    };
    Canvas.prototype.getCanvas = function () {
        return this.canvas;
    };
    Canvas.prototype.getCtx = function () {
        return this.ctx;
    };
    return Canvas;
}());
//usage 
var canvas = new Canvas('canvas');
var ctx = canvas.getCtx();
var drawableParams = {
    coordinates: new Coordinates(10, 10),
    ctx: ctx,
};
var circleParams = __assign(__assign({}, drawableParams), { radius: 10, fillColor: 'red', strokeColor: 'black', lineWidth: 2 });
var rectangleParams = __assign(__assign({}, drawableParams), { width: 100, height: 50, fillColor: 'blue', strokeColor: 'black', lineWidth: 2 });
var textParams = __assign(__assign({}, drawableParams), { text: 'Hello, World!', font: '20px Arial', color: 'black', borderWidth: 2, borderColor: 'black' });
var circle = new CircleDrawable(circleParams);
var rectangle = new RectangleDrawable(rectangleParams);
var text = new TextDrawable(textParams);
canvas.addElement(circle);
canvas.addElement(rectangle);
canvas.addElement(text);
canvas.draw();
