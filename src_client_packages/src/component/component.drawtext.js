
class DrawText {
    constructor() {}

    show(caption, xPos, yPos, scale, r, g, b, a, font, justify, shadow, outline) {
        mp.game.ui.setTextFont(font)
        mp.game.ui.setTextScale(1, scale)
        mp.game.ui.setTextColour(r, g, b, a)

        if (shadow)
            mp.game.invoke('0x1CA3E9EAC9D93E5E')
        if (outline)
            mp.game.invoke('0x2513DFB0FB8400FE')

        switch (justify)
        {
            case 1:
                mp.game.ui.setTextCentre(true)
                break
            case 2:
                mp.game.ui.setTextRightJustify(true)
                mp.game.ui.setTextWrap(0, xPos)
                break
        }

        mp.game.ui.setTextEntry('STRING')
        mp.game.ui.addTextComponentSubstringPlayerName(caption)
        mp.game.ui.drawText(xPos, yPos)
    }
}

export default DrawText