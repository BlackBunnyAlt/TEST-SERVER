import Blip from "./component/component.blip";
import Marker from "./component/component.marker";
import Shape from "./component/component.shape";

let blip = new Blip()
let marker = new Marker()
let shape = new Shape()

class Race {
    constructor() {
        this.config = {}
        this.timebarInterval = null
        this.timebar = {time: 0}
        this.raceStart = false
        this.raceWait = false
        this.keyRace = 1
        this.startTime = null
        this.endTime = null
        this.bestTime = null
        this.lastCheckpoint = 29
        this.keyCricle = 1
        this.coldCircle = false
        this.hotCircle = false
    }

    init(data) {
        data = JSON.parse(data)
        this.config = data
    }

    startWait() {
     this.isFreezePosition(true)

     this.startTimeBar(true,true, 15)

     this.raceWait = true
    }

    isTimeBar() {
      return this.timebar
    }

    isWait() {
        return this.raceWait
    }

    isFreezePosition(enabled) {
        if(mp.players.local.vehicle)
            mp.players.local.vehicle.freezePosition(enabled)
    }

    startTimeBar(start, is, time) {
        let timers = time
        if(start) {
            if (this.timebarInterval !== null)
                clearInterval(this.timebarInterval)

            this.timebarInterval = setInterval(() => {
                if(time < 0 || time === undefined) {
                    time = timers
                }

                time -= 1

                this.timebar.time = `${time}`

                if (time === 0) {
                    clearInterval(this.timebarInterval)
                    this.timebarInterval = null

                    if(is)
                      this.startRace()
                }

            }, 1000)
        }
        else {
            clearInterval(this.timebarInterval)
            this.timebarInterval = null

            if(time !== undefined)
                this.timebar.time = `0`
        }
    }

    startRace() {
        this.isFreezePosition(false)

        this.keyCricle === 1
            ? this.coldCircle = true
            : this.hotCircle = true

        if(this.raceWait)
            this.raceWait = false

        if(this.startTime === null)
           this.startTime = new Date().getTime()

        if(this.keyRace === this.lastCheckpoint)
            this.keyRace = 1

        if(!this.raceStart) {
            for(let i in this.config.checkpoints) {
                if(this.config.checkpoints[i].key === this.keyRace) {
                    blip.create(1, new mp.Vector3(
                        this.config.checkpoints[i].position.x,
                        this.config.checkpoints[i].position.y,
                        this.config.checkpoints[i].position.z
                    ),
                        `Чекпоинт #${this.keyRace}`,
                        mp.players.local.dimension
                    )
                    marker.create(1, new mp.Vector3(
                        this.config.checkpoints[i].position.x,
                        this.config.checkpoints[i].position.y,
                        this.config.checkpoints[i].position.z
                    ),
                    5,
                         mp.players.local.dimension
                    )
                    marker.createSprite(this.config.checkpoints[i].sprite, new mp.Vector3(
                        this.config.checkpoints[i].position.x,
                        this.config.checkpoints[i].position.y,
                        this.config.checkpoints[i].position.z + 2
                    ),
                    new mp.Vector3(0, 0, this.config.checkpoints[i].position.z),
                    new mp.Vector3(0, 0, 0),
                    2,
                         mp.players.local.dimension
                    )
                    shape.create(
                        this.keyRace,
                        this.config.checkpoints[i].position.x,
                        this.config.checkpoints[i].position.y,
                        this.config.checkpoints[i].position.z,
                        5,
                        mp.players.local.dimension
                    )
                }
            }
            this.raceStart = true
        }
    }

    getBestTimeCircle() {
      this.endTime = new Date().getTime()
      this.bestTime = this.endTime - this.startTime

      let sec = this.bestTime / 1000
      let h = parseInt( sec / 3600 )
      sec = sec % 3600
      let min = parseInt( sec / 60 )
      sec = sec % 60
      h = (h < 10) ? "0" + h : h
      min = (min < 10) ? "0" + min : min
      sec = (sec < 10) ? "0" + sec.toFixed() : sec.toFixed()
      let hms = h+":"+min+":"+sec

      if(this.coldCircle) {
          mp.events.callRemote('server:race:bestTime', hms, true)
          this.coldCircle = false
      } else {
          mp.events.callRemote('server:race:bestTime', hms, false)
      }

      this.startTime = null
      this.endTime = null
      this.bestTime = null

      this.keyCricle++
    }

    setKeyRace() {
      this.keyRace++
    }

    isGetRaceShape() {
        return shape.isGetShape()
    }

    endRace() {
      if(this.raceWait)
          this.raceWait = false

      if(this.raceStart)
          this.raceStart = false

      if(this.timebarInterval !== null)
          this.startTimeBar(false, false, 0)

      this.coldCircle = false
      this.hotCircle = false

      blip.delete()
      marker.delete()
      shape.delete()
    }

    entityStreamIn(entity) {
       if(entity.type === 'vehicle') {
         mp.players.local.taskEnterVehicle(entity.handle, 5000, -1, 1, 1, 0)

         setTimeout(() => {
             this.startWait()
         }, 6000)
       }
    }

}

export default Race