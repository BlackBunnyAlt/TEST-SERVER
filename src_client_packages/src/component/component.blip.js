class Blip {
    constructor() {
        this.blip = null
    }

    create(sprite, position, name, dimension) {
        this.blip = mp.blips.new(sprite, position,
            {
                name: name,
                scale: 1,
                color: 29,
                alpha: [255],
                drawDistance: false,
                shortRange: false,
                dimension: dimension,
            })
        this.blip.setRoute(true)
    }

    delete() {
        if(this.blip !== null) {
            this.blip.setRoute(false)
            this.blip.destroy()
            this.blip = null
        }
    }
}

export default Blip