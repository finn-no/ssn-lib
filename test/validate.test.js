import { isValidFodselsnummer, isDNumber, isFemale, isMale } from "../src/validate.js"
import { suite } from 'uvu'
import * as assert from 'uvu/assert'

const Validate = suite('Validate')

Validate("validates valid birth numbers", () => {
  assert.ok(isValidFodselsnummer("09018125495"))
  assert.ok(isValidFodselsnummer("27124842803"))
  assert.ok(isValidFodselsnummer("08099127091"))
  assert.ok(isValidFodselsnummer("17017203606"))
  assert.ok(isValidFodselsnummer("06116934939"))
  assert.ok(isValidFodselsnummer("03103949210"))
  assert.ok(isValidFodselsnummer("24046126501"))
  assert.ok(isValidFodselsnummer("14115904400"))
  assert.ok(isValidFodselsnummer("20039607655"))
  assert.ok(isValidFodselsnummer("03107127401"))
  assert.ok(isValidFodselsnummer("28046339004"))
  assert.ok(isValidFodselsnummer("30099420258"))
  assert.ok(isValidFodselsnummer("08109315592"))
})

Validate("does not validate birth numbers with invalid content", () => {
  assert.not(isValidFodselsnummer("0901896"))
  assert.not(isValidFodselsnummer("0"))
  assert.not(isValidFodselsnummer(198882))
})

Validate("does not validate birth numbers with invalid control digits", () => {
  assert.not(isValidFodselsnummer("09018125496"))
  assert.not(isValidFodselsnummer("27124842802"))
  assert.not(isValidFodselsnummer("08099127000"))
})

Validate("does not validate birth numbers with invalid date", () => {
  const twoDigits = Array.from({ length: 10 }, (_, v) => String(v)).map((e, _, arr) => arr.map(i => e + i)).flat()

  // feb 30th is never valid
  const isInvalid = (lastTwo) => isValidFodselsnummer("300290123" + lastTwo) == false
  // at least one from feb 29th is valid
  const isValid = (lastTwo) => isValidFodselsnummer("290268123" + lastTwo) == true
  assert.ok(twoDigits.every(isInvalid))
  assert.ok(twoDigits.some(isValid))
})

Validate("29th feb is valid", () => {
  assert.ok(isValidFodselsnummer("29026848146"))
})

Validate("can determine gender", () => {
  assert.ok(isFemale('20039607655'))
  assert.ok(isMale('06116934939'))
})

Validate("can detect d-numbers", () => {
  assert.not(isDNumber("29026848146"))
  assert.not(isDNumber("49026848"))
  assert.ok(isDNumber("49026848146"))
})

Validate.run()
