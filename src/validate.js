const toInt = (e) => parseInt(e, 10)

function hasValidDate(fodselsnummer) {
  const d = toInt(fodselsnummer.substr(0, 2))
  const m = toInt(fodselsnummer.substr(2, 2)) - 1
  const y = toInt(fodselsnummer.substr(4, 2))
  const currentCentury = 2000
  const yyyy = currentCentury + y
  const date = new Date(yyyy, m, d)
  const now = new Date()
  const previousCenturyYYYY = yyyy - 100
  if (date > now) return isValidDateValues(previousCenturyYYYY, m, d)
  else return isValidDateValues(previousCenturyYYYY, m, d) || isValidDateValues(yyyy, m, d)
}

function isValidDateValues(yyyy, m, d) {
  const date = new Date(yyyy, m, d)
  return date.getFullYear() === yyyy && date.getMonth() === m && date.getDate() === d
}

const k1Multipliers = [3, 7, 6, 1, 8, 9, 4, 5, 2]
const k2Multipliers = [5, 4, 3, 2, 7, 6, 5, 4, 3]
const checksumMaths = (multipliers, digits) => multipliers.reduce((acc, multiplier, idx) => acc + (multiplier * digits[idx]), 0)

function hasValidChecksum(fodselsnummer) {
  const digits = Array.from(fodselsnummer).map(Number)
  let k1 = 11 - (checksumMaths(k1Multipliers, digits)) % 11
  let k2 = 11 - (checksumMaths(k2Multipliers, digits) + 2 * k1) % 11
  if (k1 === 11) k1 = 0
  if (k2 === 11) k2 = 0
  return k1 === digits[9] && k2 === digits[10]
}

const validArg = (e) => typeof e === "string" && e.match(/^[0-9]{11}$/)

/**
 * Check if a string is a D-Number
 * @arg {string} str
 * @returns {boolean}
 */
export function isDNumber(str) {
  if (!validArg(str)) return false
  return toInt(str[0]) > 3
}

/**
 * Check if a string is a valid fodselsnummer
 * @arg {string} str
 * @returns {boolean}
 */
export function isValidFodselsnummer(str) {
  if (!validArg(str)) return false
  if (!hasValidDate(str)) return false
  return hasValidChecksum(str)
}

const isGender = female => str => {
  if (!isValidFodselsnummer(str)) throw "Invalid person number"
  return (str[8] % 2) == (female ? 0 : 1)
}

/**
 * Check if a fodselsnummer string has a female gender-digit
 * @type {(str: string) => boolean}
 */
export const isFemale = isGender(true)

/**
 * Check if a fodselsnummer string has a male gender-digit
 * @type {(str: string) => boolean}
 */
export const isMale = isGender(false)
