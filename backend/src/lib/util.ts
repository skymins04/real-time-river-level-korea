export function zeroFill(num: number, length: number) {
  return num.toString().padStart(length, '0');
}

export function getDateString(date: Date) {
  return `${date.getUTCFullYear()}-${zeroFill(
    date.getUTCMonth() + 1,
    2,
  )}-${zeroFill(date.getUTCDate(), 2)}T${zeroFill(
    date.getUTCHours(),
    2,
  )}:${zeroFill(date.getUTCMinutes(), 2)}:${zeroFill(
    date.getUTCSeconds(),
    2,
  )}Z`;
}
