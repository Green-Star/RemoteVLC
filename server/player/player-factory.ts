import * as child_process from 'child_process'

import { PlayerMethods } from '../models'
import { logger } from '../logger'

import { Context } from './common'
import { MockPlayer, VLCPlayer } from './players'

export class PlayerFactory {
  static getPlayer (playerName: string, filename: string): PlayerMethods {
    switch (playerName) {
      case 'vlc':
        logger.verbose('Use VLC player')
        return new VLCPlayer(filename, child_process.spawn, new Context(), [], '')

      case 'mock-player':
        logger.verbose('Use mock player')
        return new MockPlayer(filename, new Context())

      default:
        logger.error('Unsupported player name: ' + playerName)
        return undefined
    }
  }
}
