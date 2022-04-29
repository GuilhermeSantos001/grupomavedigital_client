import ptBRLocale from 'date-fns/locale/pt-BR';

import {
  format,
  formatDistance,
  formatRelative,
  differenceInCalendarDays,
  intervalToDuration,
  addHours,
  subHours,
  addMinutes,
  subMinutes,
  addSeconds,
  subSeconds,
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  addYears,
  subYears,
  isSameDay,
  isSameWeek,
  isSameMonth,
  isSameYear,
  isSameHour,
  isSameMinute,
  isSameSecond,
  isBefore,
  isAfter,
  isEqual,
  isWithinInterval,
} from 'date-fns'

class DateEx {
  // ? Formata a data
  format(date: Date, formatDate: string): string {
    return format(date, formatDate);
  }
  // ? Retorna a diferença entre as duas datas
  formatDistance(date: Date, baseDate: Date): string {
    return formatDistance(date, baseDate, { includeSeconds: true, locale: ptBRLocale });
  }
  // ? Retorna a última vez que a data foi atualizada
  formatRelative(date: Date, baseDate: Date): string {
    return formatRelative(date, baseDate, { locale: ptBRLocale });
  }
  // ? Retorna a diferença entre as duas datas em dias
  differenceInCalendarDays(dateLeft: Date, dateRight: Date): number {
    return differenceInCalendarDays(dateLeft, dateRight);
  }
  // ? Retorna o intervalo entre as datas
  interval(interval: { start: Date, end: Date }) {
    return intervalToDuration({
      start: interval.start,
      end: interval.end
    });
  }
  // ? Adiciona horas na data
  addHours(date: Date, hours: number): Date {
    return addHours(date, hours);
  }
  // ? Subtrai horas da data
  subHours(date: Date, hours: number): Date {
    return subHours(date, hours);
  }
  // ? Adiciona minutos na data
  addMinutes(date: Date, minutes: number): Date {
    return addMinutes(date, minutes);
  }
  // ? Subtrai minutos da data
  subMinutes(date: Date, minutes: number): Date {
    return subMinutes(date, minutes);
  }
  // ? Adiciona segundos na data
  addSeconds(date: Date, seconds: number): Date {
    return addSeconds(date, seconds);
  }
  // ? Subtrai segundos da data
  subSeconds(date: Date, seconds: number): Date {
    return subSeconds(date, seconds);
  }
  // ? Adiciona dias na data
  addDays(date: Date, days: number): Date {
    return addDays(date, days);
  }
  // ? Subtrai dias da data
  subDays(date: Date, days: number): Date {
    return subDays(date, days);
  }
  // ? Adiciona semanas na data
  addWeeks(date: Date, weeks: number): Date {
    return addWeeks(date, weeks);
  }
  // ? Subtrai semanas da data
  subWeeks(date: Date, weeks: number): Date {
    return subWeeks(date, weeks);
  }
  // ? Adiciona meses na data
  addMonths(date: Date, months: number): Date {
    return addMonths(date, months);
  }
  // ? Subtrai meses da data
  subMonths(date: Date, months: number): Date {
    return subMonths(date, months);
  }
  // ? Adiciona anos na data
  addYears(date: Date, years: number): Date {
    return addYears(date, years);
  }
  // ? Subtrai anos da data
  subYears(date: Date, years: number): Date {
    return subYears(date, years);
  }
  // ? Verifica se é o mesmo dia
  isSameDay(date: Date, dateToCompare: Date): boolean {
    return isSameDay(date, dateToCompare);
  }
  // ? Verifica se é a mesma semana
  isSameWeek(date: Date, dateToCompare: Date): boolean {
    return isSameWeek(date, dateToCompare);
  }
  // ? Verifica se é o mesmo mês
  isSameMonth(date: Date, dateToCompare: Date): boolean {
    return isSameMonth(date, dateToCompare);
  }
  // ? Verifica se é o mesmo ano
  isSameYear(date: Date, dateToCompare: Date): boolean {
    return isSameYear(date, dateToCompare);
  }
  // ? Verifica se é a mesma hora
  isSameHour(date: Date, dateToCompare: Date): boolean {
    return isSameHour(date, dateToCompare);
  }
  // ? Verifica se é o mesmo minuto
  isSameMinute(date: Date, dateToCompare: Date): boolean {
    return isSameMinute(date, dateToCompare);
  }
  // ? Verifica se é o mesmo segundo
  isSameSecond(date: Date, dateToCompare: Date): boolean {
    return isSameSecond(date, dateToCompare);
  }
  // ? Verifica se a data é antes da data atual
  isBefore(date: Date, dateToCompare: Date, compareTime?: boolean): boolean {
    date.setSeconds(0);
    date.setMilliseconds(0);
    dateToCompare.setSeconds(0);
    dateToCompare.setMilliseconds(0);

    if (!compareTime) {
      date.setHours(0);
      date.setMinutes(0);
      dateToCompare.setHours(0);
      dateToCompare.setMinutes(0);
    }

    return isBefore(date, dateToCompare);
  }
  // ? Verifica se a data é depois da data atual
  isAfter(date: Date, dateToCompare: Date, compareTime?: boolean): boolean {
    date.setSeconds(0);
    date.setMilliseconds(0);
    dateToCompare.setSeconds(0);
    dateToCompare.setMilliseconds(0);

    if (!compareTime) {
      date.setHours(0);
      date.setMinutes(0);
      dateToCompare.setHours(0);
      dateToCompare.setMinutes(0);
    }

    return isAfter(date, dateToCompare);
  }
  // ? Verifica se a data é igual a data atual
  isEqual(date: Date, dateToCompare: Date, compareTime?: boolean): boolean {
    date.setSeconds(0);
    date.setMilliseconds(0);
    dateToCompare.setSeconds(0);
    dateToCompare.setMilliseconds(0);

    if (!compareTime) {
      date.setHours(0);
      date.setMinutes(0);
      dateToCompare.setHours(0);
      dateToCompare.setMinutes(0);
    }

    return isEqual(date, dateToCompare);
  }
  // ? Verifica se a data está dentro do intervalo
  isWithinInterval(date: Date, interval: { start: Date, end: Date }, compareTime?: boolean): boolean {
    date.setSeconds(0);
    date.setMilliseconds(0);
    interval.start.setSeconds(0);
    interval.start.setMilliseconds(0);
    interval.end.setSeconds(0);
    interval.end.setMilliseconds(0);

    if (!compareTime) {
      date.setHours(0);
      date.setMinutes(0);
      interval.start.setHours(0);
      interval.start.setMinutes(0);
      interval.end.setHours(0);
      interval.end.setMinutes(0);
    }

    return isWithinInterval(date, interval);
  }
}

export default new DateEx();