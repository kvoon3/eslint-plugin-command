import { assert, describe, expect, it } from 'vitest'
import { builtinCommands } from '.'
import { toBlockComment, toLineComment } from '../utils'

describe('match-cases', async () => {
  for (const { name, matchCases, match, commentType = 'line' } of builtinCommands) {
    it(name, () => {
      for (const matchCase of matchCases || []) {
        if (typeof match === 'function') {
          const toAssertMessage = (result: any) => [
            '',
            `Expected: \`${matchCase}\``,
            `Received: \`${result}\``,
          ].join('\n')

          const checkBlock = () => {
            if (matchCase.startsWith('/'))
              return

            const result = match(toBlockComment(matchCase))
            assert(!!result, toAssertMessage(result))
          }

          const checkLine = () => {
            const result = match(toLineComment(matchCase))
            assert(!!result, toAssertMessage(result))
          }

          if (commentType === 'block') {
            checkBlock()
          }
          else if (commentType === 'line') {
            checkLine()
          }
          else {
            checkBlock()
            checkLine()
          }
        }
        else {
          const checkBlock = () => {
            if (matchCase.startsWith('/')) {
              const value = toBlockComment(matchCase).value
              expect(value.match(match)?.[0]).toBe(matchCase)
            }
          }

          const checkLine = () => {
            const value = toLineComment(matchCase).value
            expect(value.match(match)?.[0]).toBe(matchCase)
          }

          if (commentType === 'block') {
            checkBlock()
          }
          else if (commentType === 'line') {
            checkLine()
          }
          else {
            checkBlock()
            checkLine()
          }
        }
      }
    })
  }
})
