let Race = require('./race')
let config = require('./config')

let race = new Race(config)

mp.events.add('playerReady', (player) => {
    race.init(player)
})

mp.events.add('server:race:bestTime', (player, hms, isCold) => {
    if(isCold) {
        race.setTops(player, isCold, hms)

        player.notify(`Вы закончили холодный круг`)
    } else {
        race.setTops(player, isCold, hms)

        player.notify(`Вы закончили горячий круг`)
    }

    player.outputChatBox(`Круг занял ${hms} времени!`)
    player.notify('Для выхода из гонки напишите в чате команду - /race stop')
})

mp.events.addCommand('race', (player, ...args) => {
        switch(args[0]) {
            case 'start':
                race.waitRace(player)
                break
            case 'stop':
                race.endRace(player)
                break
            case 'restart':
                race.restartRace(player)
                break
            case 'top hot':
                race.getTops(player, false)
                break
            case 'top cold':
                race.getTops(player, true)
                break
            case 'clear hot':
                race.setDeleteTops(player, false)
                break
            case 'clear cold':
                race.setDeleteTops(player, true)
                break
            default:
                player.notify('Команда введена не правельно.')
                break
        }
})

mp.events.add('playerDeath', (player) => {
    race.endRace(player)
})

mp.events.add('playerQuit', (player) => {
    race.endRace(player)
})