import { isMale, isFemale } from './validate.js'

const range = (from, to) => Array.from({ length: (to - from) }, (_, v) => v + from)
const toIndividnummerString = (n) => ("00" + n).slice(-3)

function getControlDigit(digits, constants) {
  const sum = digits.reduce((acc, digit, index) => acc + digit * constants[index], 0)
  const remainder = sum % 11
  switch (remainder) {
    case 0: return 0
    case 1: return
    default: return 11 - remainder
  }
}

function getChecksum(prefix, individnummer) {
  const digits = (prefix + individnummer).split("").map(numeral => Number(numeral))
  const firstControlDigit = getControlDigit(digits, [3, 7, 6, 1, 8, 9, 4, 5, 2, 1])
  if (!firstControlDigit) return
  const nextDigits = [...digits, firstControlDigit]
  const secondControlDigit = getControlDigit(nextDigits, [5, 4, 3, 2, 7, 6, 5, 4, 3, 2, 1])
  if (!secondControlDigit) return
  return "" + firstControlDigit + secondControlDigit
}

function getPrefix(date) {
  const isoString = date.toISOString()
  const year = isoString.substr(2, 2)
  const month = isoString.substr(5, 2)
  const day = isoString.substr(8, 2)
  return day + month + year
}

const isGender = (gender, genderKey) => gender.toUpperCase()[0] === genderKey
const isMaleArg = (gender) => isGender(gender, "M")
const isFemaleArg = (gender) => isGender(gender, "F")
const genderFilter = (gender) => {
  if (isMaleArg(gender)) return isMale
  if (isFemaleArg(gender)) return isFemale
  throw 'Unable to parse gender argument'
}

function getIndividnummerStrings(date, gender) {
  const fullYear = date.getFullYear()
  let numbers = []
  if (fullYear >= 1900 && fullYear <= 1999) numbers = [...numbers, ...range(0, 500)]
  if (fullYear >= 1854 && fullYear <= 1899) numbers = [...numbers, ...range(500, 749)]
  if (fullYear >= 2000 && fullYear <= 2039) numbers = [...numbers, ...range(500, 1000)]
  if (fullYear >= 1940 && fullYear <= 1999) numbers = [...numbers, ...range(900, 1000)]
  return numbers.map(toIndividnummerString)
}

/**
 * Generate all valid fodselsnummer for a given date
 * @arg {Date} dateOfBirth - the date of birth to generate ids for
 * @arg {string} [gender] - a gender to filter the resulting ids by
 * @returns {Array<string>}
 */
export function generateAll(dateOfBirth, gender) {
  const prefix = getPrefix(dateOfBirth)
  const individNummer = getIndividnummerStrings(dateOfBirth, gender)
  const fnums = individNummer.map(n => {
    const checksum = getChecksum(prefix, n)
    return checksum && (prefix + n + checksum)
  }).filter(Boolean)
  return gender ? fnums.filter(genderFilter(gender)) : fnums
}

const coinflip = () => (Math.random() > 0.5) ? '1' : '0'
const doubleCoinflip = (isDate) => {
  const firstDigit = coinflip()
  if (isDate && firstDigit == '0') return '01'
  return firstDigit + coinflip()
}

/**
 * Generate a single valid fodselsnummer - with a randomly generated date
 * @arg {string} [gender] - the gender of fodselsnummer to generate
 * @returns {string}
 */
export function generateOne(gender) {
  const ballparkAge = 40
  const ballparkBirthYear = Math.round((new Date().getFullYear() - ballparkAge) / 10)
  const dateString = ballparkBirthYear.toString() + coinflip() + '-' + doubleCoinflip(true) + '-' + doubleCoinflip(true)
  const fnums = generateAll(new Date(dateString), gender)
  return fnums[Math.floor(Math.random() * fnums.length)]
}

