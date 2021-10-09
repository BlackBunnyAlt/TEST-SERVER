class Shape {
    constructor() {
        this.shape = null
    }

    create(key, x, y, z, range, dimension) {
     this.shape = mp.colshapes.newSphere(x, y, z, range, dimension)
     this.shape.prop = key
    }

    isGetShape() {
        return this.shape
    }

    delete(id) {
        if(this.shape !== null) {
            this.shape.destroy()
            this.shape = null
        }
    }
}

export default Shape