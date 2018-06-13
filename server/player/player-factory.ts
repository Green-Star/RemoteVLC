import { PlayerMethods } from '../models'
import { logger } from '../logger'

import { VLCPlayer } from './players'

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
