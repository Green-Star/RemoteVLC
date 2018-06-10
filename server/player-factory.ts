import { PlayerMethods } from './player-methods.model'

import { VLCPlayer } from './vlc-player'
import { logger } from './logger'

export class PlayerFactory {
	static getPlayer (playerName: string, filename: string): PlayerMethods {
		switch (playerName) {
			case 'vlc':
        logger.verbose('Use VLC player')
        return new VLCPlayer(filename)

      default:
        logger.error('Unsupported player name: ' + playerName)
        return undefined
		}
	}
}
