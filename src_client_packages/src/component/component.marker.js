class Marker {
    constructor() {
     this.marker = null
     this.sprite = null
    }

    create(type, position, scale, dimension) {
        this.marker = mp.markers.new(type, position, scale,
            {
                color: [0, 0, 255, 100],
                dimension: dimension
            })
    }
    createSprite(type, position, direction, rotation, scale, dimension) {
        this.sprite = mp.markers.new(type, position, scale,
            {
                direction: direction,
                rotation: rotation,
                color: [255, 255, 255, 100],
                dimension: dimension
            })
    }

    delete() {
        if(this.marker !== null) {
            this.marker.destroy()
            this.marker = null
        }
        if(this.sprite !== null) {
            this.sprite.destroy()
            this.sprite = null
        }
    }
}

export default Marker