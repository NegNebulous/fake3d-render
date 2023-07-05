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

        this.#x = this.#h;
        this.#y = 0;
    }

    get x() {
        return this.#x * this.#h;
    }

    get y() {
        return this.#y * this.#h;
    }

    getAngle() {
        return this.getRad() * (180/Math.PI);
    }

    getRad() {
        return Math.atan2(this.#y, this.#x);
    }

    angle(deg) {
        if (this.#h == 0) return this;
        deg = deg * (Math.PI/180);

        this.#x = Math.cos(deg) * this.#h;
        this.#y = Math.sin(deg) * this.#h;

        return this;
    }

    changeAngle(deg) {
        if (this.#h == 0) return this;
        deg = deg * (Math.PI/180);

        const ang = this.getRad();

        this.#x = Math.cos(ang + deg) * this.#h;
        this.#y = Math.sin(ang + deg) * this.#h;

        return this;
    }
}