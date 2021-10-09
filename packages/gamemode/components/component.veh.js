module.exports = class Vehicle {
    constructor() {
        this.veh = null
    }

    create(player, model, position, heading, number, color, dimension) {
        return this.veh = mp.vehicles.new(mp.joaat(model), position,
            {
                heading: heading,
                numberPlate: number,
                alpha: 255,
                color: color,
                locked: false,
                engine: true,
                dimension: dimension,
                prop: 'race'
            })
    }

    delete(player) {
      if(this.veh !== null)
          this.veh.destroy()
    }
}