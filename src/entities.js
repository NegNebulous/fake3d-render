class Entity {

    _x = 0;
    _y = 0;
    _hasMoved = false;
    _cell = null;
    _id = uniqueId();

    constructor(x, y) {
        this._x = x;
        this._y = y;
    }

    get cell() {
        return this._cell;
    }
    set cell(c) {
        this._cell = c;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get hasMoved() {
        return this._hasMoved;
    }

    update(delta) {
        
    }

    drawDebug(draw) {
        draw.rect(this.x - 5, this.y - 5, 10, 10);
    }

    draw(draw) {
        draw.rect(this.x - 5, this.y - 5, 10, 10);
    }
}

class Player extends Entity {

    #view = (new Vector(1)).angle(0);
    #fov = 90;

    constructor(x, y) {
        super(x, y);
    }

    getAngle() {
        return this.#view.getAngle();
    }

    getRad() {
        return this.#view.getRad();
    }

    update(delta) {
        this.#view.changeAngle(90 * delta);
    }

    draw(draw) {
        draw.rect(this.x - 5, this.y - 5, 10, 10, "red");

        draw.line(this.x, this.y, this.x + this.#view.x * 150, this.y + this.#view.y * 150);

        let vec1 = (new Vector(1)).angle(this.#view.getAngle());

        vec1.changeAngle(this.#fov/2 * -1);
        draw.line(this.x, this.y, this.x + vec1.x * 100, this.y + vec1.y * 100, 1, "red");

        vec1.changeAngle(this.#fov);
        draw.line(this.x, this.y, this.x + vec1.x * 100, this.y + vec1.y * 100, 1, "red");
    }
}

class RandMover extends Entity {

    #vec = (new Vector(10)).angle(Math.random() * 360);

    constructor(x, y) {
        super(x, y);
    }

    update(delta) {
        this._hasMoved = false;
        if (Math.random() < 10 * delta) {
            this.#vec.angle(Math.random() * 360);
        }
        
        this._x += this.#vec.x * delta;
        this._y += this.#vec.y * delta;
        this._hasMoved = true;
    }
}