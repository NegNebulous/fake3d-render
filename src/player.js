class Player extends Entity {

    #viewDist = 500;
    #view = (new Vector(this.#viewDist)).angle(0);
    #viewVertical = (new Vector(this.#viewDist)).angle(0);
    #fov = 90; // DO NOT CHANGE
    #vfov = null;
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

        // maybe this needs to be re-calcualted every time the canvas size changes
        this.#vfov = this.#fov * (draw.height / draw.width) * 1.1598124856411365923; // I have no idea why this needs to be here
        // console.log(this.#fov);
        // console.log(this.#vfov);
        // this.#vfov = this.#fov * (draw.width / draw.height);
        // this.#vfov = 94;

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

        if (world.getKey(" ")) {
            this._z += this.#moveSpeed * delta;
        }
        if (world.getKey("Shift")) {
            this._z -= this.#moveSpeed * delta;
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
            // TODO limit this so the player doesn't wrap around and break everything
            const oldAngle = this.#viewVertical.getAngle();
            const sign = (oldAngle > 0 ? 1 : -1);
            if (Math.abs(oldAngle + my * this.#mouseSensitivity) > 180) {
                this.#viewVertical.angle(179 * sign);
                return;
            }
            
            this.#viewVertical.changeAngle(my * this.#mouseSensitivity);
        }
    }

    drawPov(world) {
        this.#draw.clear();
        const ents = world.getEntitiesInView(this, this.#view, this.#fov);
        
        ents.forEach(ent => {
            const relAngx = (Vector.minAngle(this.angleTo(ent), this.#view.getAngle()) + this.#fov / 2) / this.#fov;
            const relAngy = (Vector.minAngle(this.angleTo(ent, true), this.#viewVertical.getAngle()) + this.#vfov / 2) / this.#vfov;

            // const h = this.distTo(ent, false);
            // const bh = this.distTo(ent, true);
            // const dist = Math.sin(this.angleTo(ent) * (Math.PI / 180)) * bh;

            ent.draw(this.#draw, relAngx, relAngy, this.distTo(ent, false), this.#fov, this.#vfov);
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