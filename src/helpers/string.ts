/**
 * Truncates given text
 * @param text string
 * @param length number
 * @param suffix string
 * @returns string
 */
export default function truncate (
  text: string, length: number, suffix: string = '...'
) {
  if (text.length <= length)
    return text

  return text.substring(0, length) + suffix
}

export function pluralize(word: string, count: number, suffix = 's') {
  if (count === 1) return word
  return `${word}${suffix}`
}