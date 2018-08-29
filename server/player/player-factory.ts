import { PlayerMethods } from '../models'
import { logger } from '../logger'

import { MockPlayer, VLCPlayer } from './players'

export class PlayerFactory {
  static getPlayer (playerName: string, filename: string): PlayerMethods {
    switch (playerName) {
      case 'vlc':
        logger.verbose('Use VLC player')
        return new VLCPlayer(filename)

      case 'mock-player':
        logger.verbose('Use mock player')
        return new MockPlayer(filename)

      default:
        logger.error('Unsupported player name: ' + playerName)
        return undefined
    }
  }
}
