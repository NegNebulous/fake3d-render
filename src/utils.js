class Util {
    static async sleep(time) {
        await new Promise(r => setTimeout(r, time));
    }
}

class HashMap {
    #map = new Map();
    #hashFunc = (val) => {return val};

    /**
     * @param {Function} hashFunc
     */
    constructor(hashFunc) {
        if (hashFunc != null)
            this.#hashFunc = hashFunc;
    }

    get size() {
        return this.#map.size;
    }

    add(val) {
        const key = this.#hashFunc(val);
        // make list to prevent key collision
        const list = this.#map.get(key);

        if (list == null)
            this.#map.set(key, [val]);
        else
            list.push(val);
    }

    remove(val) {
        const key = this.#hashFunc(val);
        const list = this.#map.get(key);

        // console.log(this.#map);
        // console.log(val);
        // throw new Error();

        if (list == null)
            return null;

        const idx = list.indexOf(val);
        if (!(idx > -1)) return null;

        list.splice(idx, 1);
        if (list.length == 0)
            this.#map.delete(key);

        return val;
    }

    getAll() {
        let arr = [];

        let it = this.#map.values();
        let val = it.next();
        while (!val.done) {
            arr = arr.concat(val.value);
            val = it.next();
        }

        return arr;
    }
}

const uniqueId = function() {
    this.counter += 1;
    return this.counter;
}.bind({counter: 0});

class Vector {
    
    #x = 0;
    #y = 0;
    #h = 1;

    /**
     * @param {Number=} h
     */
    constructor(h) {
        if (h != null)
            this.#h = h;

        this.#x = 1;
        this.#y = 0;
    }

    /**
     * @param {Number} x
     * @param {Number} y
     * @returns {Vector}
     */
    static xy(x, y) {
        const v = new Vector(Math.sqrt((x*x + y*y)));

        v.#x = x / v.#h;
        v.#y = y / v.#h;

        return v;
    }

    /**
     * @returns {Number}
     */
    get x() {
        return this.#x * this.#h;
    }

    /**
     * @returns {Number}
     */
    get y() {
        return this.#y * this.#h;
    }

    /**
     * @returns {Number}
     */
    get nx() {
        return this.#x;
    }

    /**
     * @returns {Number}
     */
    get ny() {
        return this.#y;
    }

    /**
     * @returns {Number}
     */
    get h() {
        return this.#h;
    }
    set h(v) {
        this.#h = v;
    }

    /**
     * @returns {Number}
     */
    getAngle() {
        return this.getRad() * (180/Math.PI);
    }

    
    /**
     * @returns {Number}
     */
    getRad() {
        return Math.atan2(this.#y, this.#x);
    }

    angle(deg) {
        if (this.#h == 0) return this;
        deg = deg * (Math.PI/180);

        this.#x = Math.cos(deg);
        this.#y = Math.sin(deg);

        return this;
    }

    changeAngle(deg) {
        if (this.#h == 0) return this;
        deg = deg * (Math.PI/180);

        const ang = this.getRad();

        this.#x = Math.cos(ang + deg);
        this.#y = Math.sin(ang + deg);

        return this;
    }

    /**
     * @param {Number} ang 
     * @returns {Number}
     */
    static convertTo360(ang) {
        if (ang < 0) {
            return 180 + (180 - Math.abs(ang))
        }
        return ang;
    }

    /**
     * @param {Number} ang1 
     * @param {Number} ang2 
     * @returns {Number}
     */
    static minAngle(ang1, ang2) {
        ang1 = Vector.convertTo360(ang1);
        ang2 = Vector.convertTo360(ang2);
        
        const result = ang1 - ang2;
        const s = (result < 0 ? -1 : 1);

        return (Math.abs(result) > 180 ? (Math.abs(result) - 360) * s : result);
    }
}

class MapDefault extends Map {
    get(key) {
        if (!this.has(key)) {
            this.set(key, this.defaultVal);
        }
        return super.get(key);
    }
    
    constructor(defaultVal, entries) {
        super(entries);
        this.defaultVal = defaultVal;
    }
}