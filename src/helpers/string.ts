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