/**
 * 특정 최소 자리 수까지 숫자 왼쪽에 0을 채운 문자열을 반환하는 함수
 * @param num 왼쪽에 0을 채울 원본 숫자
 * @param length 0으로 채울 최소 자리 수
 * @returns 특정 최소 자리 수까지 숫자 왼쪽에 0을 채운 문자열
 */
export function zeroFill(num: number, length: number) {
  return num.toString().padStart(length, '0');
}

/**
 * 날짜 객체를 "YYYY-MM-DDThh:mm:ssZ" 형식의 문자열로 반환하는 함수
 * @param date 날짜 객체
 * @returns "YYYY-MM-DDThh:mm:ssZ" 형식의 문자열
 */
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
