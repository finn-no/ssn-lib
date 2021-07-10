import { generateAll, generateOne } from "../src/generate.js"
import { isValidFodselsnummer } from "../src/validate.js"
import { suite } from 'uvu'
import * as assert from 'uvu/assert'

const Generate = suite('Generate')

Generate("creates array of valid birth numbers", () => {
  const ids = generateAll(new Date("1987-07-10"))
  assert.ok(ids.length > 0)
  assert.ok(ids.every(isValidFodselsnummer))
})

Generate('correct age range generated', () => {
  const generated = generateOne()
  const generatedYear = '19' + generated.substring(4,6) // lol this will fail in 20 years
  const currentYear = new Date().getFullYear()
  const age = parseInt(currentYear) - parseInt(generatedYear)
  assert.ok(35 < age < 45)
})

Generate('unique if called twice', () => {
  const g1 = generateOne()
  const g2 = generateOne()
  assert.is.not(g1, g2)
})

Generate('generates a specific gender', () => {
  const date = new Date("1987-07-10")
  const all = generateAll(date)
  const females = generateAll(date, "F")
  const males = generateAll(date, "M")
  assert.ok(all.length > females.length)
  assert.ok(all.length > males.length)
  assert.is(females.length, 203)
  assert.is(males.length, 198)
  assert.ok(females.includes('10078703291'))
  assert.ok(males.includes('10078706177'))
})

Generate.run()
