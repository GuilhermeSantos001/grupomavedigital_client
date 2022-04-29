/**
 * @description Verifica se o formato do período está valido
 * @author GuilhermeSantos001
 * @update 14/10/2021
 */

interface Period {
  year: string,
  month: string,
  day: string
}

export default function verifyPeriodIsValid(start: Period, end: Period) {
  return (
    parseInt(start.year) >= 2016 &&
    parseInt(end.year) >= parseInt(start.year) &&
    parseInt(start.month) > 0 &&
    parseInt(start.month) <= 12 &&
    parseInt(end.month) > 0 &&
    parseInt(end.month) <= 12 &&
    parseInt(start.day) > 0 &&
    parseInt(start.day) <= 31 &&
    parseInt(end.day) > 0 &&
    parseInt(end.day) <= 31
  )
}