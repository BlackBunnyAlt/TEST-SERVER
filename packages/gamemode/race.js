let Vehicle = require('./components/component.veh')
let mysql = require('./components/component.mysql')

let veh = new Vehicle()

module.exports = class Race {
    constructor(config) {
        this.config = config
        this.dimension = null
        this.lastPosition = null
        this.baseData = []
        this.findArr = []
    }

    init(player) {
        player.call('client:race:init', [JSON.stringify(this.config)])
        this.initBd()
    }

    initBd() {
        if(this.baseData.length)
            this.baseData = []

        mysql.query("SELECT * FROM tops", (err, rows) => {
            if(err)
                return console.log(err)

            if(!rows.length)
                return

            rows.forEach(item => {
               this.baseData.push({
                   id: item.id,
                   owner: item.owner_id,
                   social: item.social_club,
                   time: item.time_best,
                   tabs: item.tabs_key,
               })
            })
        })
    }

    waitRace (player) {
        if(player.race)
            return player.notify(this.config.message[0])

        this.lastPosition = new mp.Vector3(player.position.x, player.position.y, player.position.z)

        this.dimension = player.id + this.config.dimension

        player.position = new mp.Vector3(2499.47, 4124.64, 38.37)
        player.heading = this.config.checkpoints[0].heading

        player.dimension = this.dimension
        player.race = true

        player.outputChatBox('Ожидайте начало заезда...')

        this.createVehicleWait(player)
    }
    createVehicleWait (player) {

      let vehicle = null
      for (let i in this.config.checkpoints) {
        if(this.config.checkpoints[i].key === 'start') {
            let vehicle = veh.create(
                player,
                this.config.auto,
                new mp.Vector3(
                    this.config.checkpoints[i].position.x,
                    this.config.checkpoints[i].position.y,
                    this.config.checkpoints[i].position.z
                ),
                this.config.checkpoints[i].heading,
                this.config.numberPlate,
                this.config.standarColor,
                this.dimension
            )
        }
      }
    }

    setTops(player, isValue, time) {
        let type = ''

        isValue ? type = 'cold' : type = 'hot'

        if(this.baseData.length < 20) {
             let arrCold = []
             let arrHot = []

             this.baseData.forEach(item => {

                 if(item.type === 'cold')
                     arrCold.push(item)

                 if(item.type === 'hot')
                     arrHot.push(item)
             })

             if(arrCold.length >= 10 || arrHot.length >= 10)
                 return

             mysql.query(`INSERT INTO tops SET owner_id=${player.id}, social_club='${player.socialClub}', time_best='${time}', tabs_key='${type}'`, (err) => {
               if(err)
                  return console.log(err)
             })
        } else {
              this.baseData.forEach(row => {
               if(row.time > time && row.time === type)
                   mysql.query(`UPDATE tabs SET owner_id=${player.id}, social_club='${player.socialClub}', time_best='${time}' WHERE id=${row['id']}`, (err) => {
                       if(err)
                           return console.log(err)
                   })
             })
        }

        this.initBd()
    }

    getTops(player, isValue) {
              if(!this.baseData.length)
                  return player.outputChatBox('Топ пустой. Будь первым рекордсменом!')

              if(isValue)
                  player.outputChatBox('Лучшие результаты холодной гонки:')
              else
                  player.outputChatBox('Лучшие результаты горячей гонки:')

              let i = 1

              this.baseData.forEach(row => {
                 if(isValue) {
                     if (row.tabs === 'cold')
                         player.outputChatBox(`${i}. ${row.time} (id ${row.owner}) SocialClub: ${row.social}`)

                     else if (row.tabs === 'hot')
                         player.outputChatBox(`${i}. ${row.time} (id ${row.owner}) SocialClub: ${row.social}`)
                 }
                 i++
              })
    }

    setDeleteTops(player, isValue) {
       if(isValue) {
         mysql.query("DELETE FROM tops WHERE tabs_key='cold'", (err, rows) => {
             if(err)
                 return console.log(err)

             if(!rows.length)
                 return player.notify('В холодном топе нет записей!')

             player.notify('Холодный топ был очищен!')
         })
       } else {
          mysql.query("DELETE FROM tops WHERE tabs_key='hot'", (err, rows) => {
              if(err)
                  return console.log(err)

              if(!rows.length)
                  return player.notify('В горячем топе нет записей!')

              player.notify('Горячий топ был очищен!')
          })
       }
    }

    restartRace(player) {
        this.endRace(player)

        this.waitRace(player)
    }

    endRace(player) {
      if(!player.race) return

      player.race = false

      veh.delete(player)

      player.position = this.lastPosition
      player.dimension = 0
      player.call('client:race:endRace')

      this.lastPosition = null
      player.notify('Вы закончили гонку.')
    }
}