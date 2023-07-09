class Entity {

    _x = 0;
    _y = 0;
    _z = 0;
    _hasMoved = false;
    _cell = null;
    #id = uniqueId();
    _debugColor = null;
    _size = 20;

    constructor(x, y, z) {
        this._x = x;
        this._y = y;

        if (z == null) z = 0;
        this._z = z;
    }

    get size() {
        return this._size;
    }

    get id() {
        return this.#id;
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

    get z() {
        return this._z;
    }

    get hasMoved() {
        return this._hasMoved;
    }

    /**
     * @param {Entity} ent
     * @param {Boolean=} isVertical defaults to false
     * @returns {Number}
     */
    angleTo(ent, isVertical) {
        if (isVertical == null) isVertical = false;

        let ang;

        if (isVertical) {
            ang = this.vecBetween(ent, true).getAngle();
        }
        else {
            ang = this.vecBetween(ent).getAngle();
        }
        return ang;
    }

    /**
     * @param {Entity} ent
     * @returns {Number}
     */
    distTo(ent) {
        return Math.sqrt(Math.pow(this.x - ent.x, 2) + Math.pow(this.y - ent.y, 2));
    }

    /**
     * @param {Entity} ent
     * @param {Boolean=} isVertical defaults to false
     * @returns {Vector}
     */
    vecBetween(ent, isVertical) {
        if (isVertical == null) isVertical = false;

        if (isVertical) {
            return Vector.xy(ent.distTo(this), ent.z - this.z);
        }
        else {
            return Vector.xy(ent.x - this.x, ent.y - this.y);
        }
    }

    update(delta) {
        
    }

    drawDebug(draw) {
        if (this._debugColor != null) {
            draw.rect(this.x - this.size/2, this.y - this.size/2, this.size, this.size, this._debugColor);
            this._debugColor = null;
        }
        else {
            draw.rect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
        }
    }

    /**
     * @param {Draw} draw
     * @param {Number} relPos
     * @param {Number} dist
     * @param {Number} fov
     */
    draw(draw, relPosx, relPosy, dist, fov) {
        const relSize = (this.size / ( 2 * (Math.tan(fov/2) * dist))) * draw.width;
        draw.fillRect(draw.width * relPosx - relSize/2, draw.height * relPosy - relSize/2, relSize, relSize);
    }
}

class Player extends Entity {

    #viewDist = 500;
    #view = (new Vector(this.#viewDist)).angle(0);
    #viewVertical = (new Vector(this.#viewDist)).angle(0);
    #fov = 90;
    #vfov = this.#fov;
    #draw;

    #moveSpeed = 50;
    #turnSpeed = 45;
    #mouseSensitivity = 0;
    #drawCursor = true;

    /**
     * @param {Draw} draw
     * @param {Number} x
     * @param {Number} y
     */
    constructor(draw, x, y) {
        super(x, y);
        this.#draw = draw;
        this.sensitivity = 0.34; // val sens

        this.#draw.canvas.addEventListener("click", async () => {
            await this.#draw.canvas.requestPointerLock({
                unadjustedMovement: true,
            });
        });
    }

    get sensitivity() {
        return this.#mouseSensitivity / 0.07;
    }
    set sensitivity(n) {
        this.#mouseSensitivity = 0.07 * n;
    }

    getAngle() {
        return this.#view.getAngle();
    }

    getRad() {
        return this.#view.getRad();
    }

    /**
     * @param {Number} delta
     * @param {World} world
     */
    update(delta, world) {
        this._hasMoved = false;
        // this.#view.changeAngle(30 * delta);
        if (world.getKey("w")) {
            this._x += this.#view.nx * this.#moveSpeed * delta;
            this._y += this.#view.ny * this.#moveSpeed * delta;
            this._hasMoved = true;
        }
        if (world.getKey("s")) {
            this._x -= this.#view.nx * this.#moveSpeed * delta;
            this._y -= this.#view.ny * this.#moveSpeed * delta;
            this._hasMoved = true;
        }
        if (world.getKey("a")) {
            const rotated = (new Vector(1)).angle(this.#view.getAngle() + 90);
            this._x -= rotated.nx * this.#moveSpeed * delta;
            this._y -= rotated.ny * this.#moveSpeed * delta;
            this._hasMoved = true;
        }
        if (world.getKey("d")) {
            const rotated = (new Vector(1)).angle(this.#view.getAngle() - 90);
            this._x -= rotated.nx * this.#moveSpeed * delta;
            this._y -= rotated.ny * this.#moveSpeed * delta;
            this._hasMoved = true;
        }

        if (world.getKey("q") || world.getKey("ArrowLeft")) {
            this.#view.changeAngle(-1 * this.#turnSpeed * delta);
        }
        if (world.getKey("e") || world.getKey("ArrowRight")) {
            this.#view.changeAngle(this.#turnSpeed * delta);
        }

        const mobj = world.getMouse();
        const mx = mobj.x;
        const my = mobj.y;

        if (mx != 0) {
            this.#view.changeAngle(mx * this.#mouseSensitivity);
        }
        if (my != 0) {
            this.#viewVertical.changeAngle(my * this.#mouseSensitivity);
        }
    }

    drawPov(world) {
        this.#draw.clear();
        const ents = world.getEntitiesInView(this, this.#view, this.#fov);
        
        ents.forEach(ent => {
            const relAngx = (Vector.minAngle(this.angleTo(ent), this.#view.getAngle()) + this.#fov / 2) / this.#fov;
            const relAngy = (Vector.minAngle(this.angleTo(ent, true), this.#viewVertical.getAngle()) + this.#fov / 2) / this.#fov;

            const dist = this.distTo(ent);

            ent.draw(this.#draw, relAngx, relAngy, dist, this.#fov);
        });

        if (this.#drawCursor) {
            const cx = this.#draw.width/2;
            const cy = this.#draw.height/2;
            this.#draw.line(cx - 5, cy, cx + 5, cy, 2, "black");
            this.#draw.line(cx, cy - 5, cx, cy + 5, 2, "black");
        }
    }

    drawDebug(draw) {
        return this.draw(draw);
    }

    draw(draw) {
        draw.rect(this.x - 5, this.y - 5, 10, 10, "red");

        draw.line(this.x, this.y, this.x + this.#view.x, this.y + this.#view.y);

        let vec1 = (new Vector(this.#viewDist)).angle(this.#view.getAngle());

        vec1.changeAngle(this.#fov/2 * -1);
        draw.line(this.x, this.y, this.x + vec1.x, this.y + vec1.y, 1, "red");

        vec1.changeAngle(this.#fov);
        draw.line(this.x, this.y, this.x + vec1.x, this.y + vec1.y, 1, "red");
    }
}

class RandMover extends Entity {

    #vec = (new Vector(0)).angle(Math.random() * 360);

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