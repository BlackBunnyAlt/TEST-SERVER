import Race from './Race'
import DrawText from "./component/component.drawtext"

let race = new Race()
let drawText = new DrawText()

mp.events.add('client:race:init', (data) => {
  race.init(data)
})

mp.events.add('client:race:endRace', () => {
  race.endRace()
})

mp.events.add('render', () => {
  if(race.isWait())
      drawText.show(`СТАРТ ЧЕРЕЗ: ${race.isTimeBar().time}`, 0.5, 0.5, 1, 255, 255, 255, 180, 1, 1, false, false)
})

mp.events.add('playerEnterColshape', (shape) => {
  if(shape === race.isGetRaceShape()) {
      race.setKeyRace()

      if(shape.prop === 28)
          race.getBestTimeCircle()

      race.endRace()

      race.startRace()
  }
})

mp.events.add('entityStreamIn', (entity) => {
   race.entityStreamIn(entity)
})

