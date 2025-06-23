import type { Command } from '../types'
import { isFunction, isString } from '@antfu/utils'
import { assert, describe, expect, it } from 'vitest'
import { builtinCommands } from '.'
import { toBlockComment, toLineComment } from '../utils'

describe('match-cases', async () => {
  for (const { name, cases = [], match, commentType = 'line' } of builtinCommands) {
    it(name, () => {
      for (const caseItem of genMatchCases(cases, commentType)) {
        if (isFunction(match)) {
          const toAssertMessage = (result: any) => [
            '',
            `Expected: \`${caseItem}\``,
            `Received: \`${result}\``,
          ].join('\n')

          if (isString(caseItem)) {
            const result = match(toLineComment(caseItem))
            assert(!!result, toAssertMessage(result))
          }
          else {
            const result = match(toBlockComment(caseItem))
            assert(!!result, toAssertMessage(result))
          }
        }
        else {
          if (isString(caseItem)) {
            const value = toLineComment(caseItem).value
            expect(value.match(match)?.[0]).toBe(caseItem)
          }
          else {
            const value = toBlockComment(caseItem).value
            expect(value.match(match)?.[0].trim()).toBe(caseItem[0])
          }
        }
      }
    })
  }
})

type LineCase = string
type BlockCase = string[]

export function genMatchCases(
  names: string[],
  type: Command['commentType'] = 'line',
): LineCase[] | BlockCase[] | (LineCase | BlockCase)[] {
  if (type === 'line') {
    return names.flatMap(nameToLineCases)
  }
  else if (type === 'block') {
    return names.map(nameToBlockCase)
  }
  else {
    return names.flatMap(name => [
      ...nameToLineCases(name),
      nameToBlockCase(name),
    ])
  }
}

function nameToLineCases(name: string): LineCase[] {
  return [`/${name}`, `@${name}`]
}

function nameToBlockCase(name: string): BlockCase {
  return [
    `@${name}`,
    '@description foo bar',
  ]
}
