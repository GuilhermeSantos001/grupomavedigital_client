/**
 * @description Métodos essenciais para se trabalhar com datas
 * @author GuilhermeSantos001
 * @update 29/12/2021
 */

import ptBRLocale from 'date-fns/locale/pt-BR';

import {
  formatDistance,
  formatRelative,
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
} from 'date-fns'

class DateEx {
  // ? Retorna a diferença entre as duas datas
  getDifference(now: Date, old: Date): string {
    return formatDistance(now, old, { includeSeconds: true, locale: ptBRLocale });
  }
  // ? Retorna a última vez que a data foi atualizada
  getRelative(now: Date, old: Date): string {
    return formatRelative(now, old, { locale: ptBRLocale });
  }
  // ? Adiciona horas a data
  addHours(date: Date, hours: number): Date {
    return addHours(date, hours);
  }
  // ? Subtrai horas a data
  subHours(date: Date, hours: number): Date {
    return subHours(date, hours);
  }
  // ? Adiciona minutos a data
  addMinutes(date: Date, minutes: number): Date {
    return addMinutes(date, minutes);
  }
  // ? Subtrai minutos a data
  subMinutes(date: Date, minutes: number): Date {
    return subMinutes(date, minutes);
  }
  // ? Adiciona segundos a data
  addSeconds(date: Date, seconds: number): Date {
    return addSeconds(date, seconds);
  }
  // ? Subtrai segundos a data
  subSeconds(date: Date, seconds: number): Date {
    return subSeconds(date, seconds);
  }
  // ? Adiciona dias a data
  addDays(date: Date, days: number): Date {
    return addDays(date, days);
  }
  // ? Subtrai dias a data
  subDays(date: Date, days: number): Date {
    return subDays(date, days);
  }
  // ? Adiciona semanas a data
  addWeeks(date: Date, weeks: number): Date {
    return addWeeks(date, weeks);
  }
  // ? Subtrai semanas a data
  subWeeks(date: Date, weeks: number): Date {
    return subWeeks(date, weeks);
  }
  // ? Adiciona meses a data
  addMonths(date: Date, months: number): Date {
    return addMonths(date, months);
  }
  // ? Subtrai meses a data
  subMonths(date: Date, months: number): Date {
    return subMonths(date, months);
  }
  // ? Adiciona anos a data
  addYears(date: Date, years: number): Date {
    return addYears(date, years);
  }
  // ? Subtrai anos a data
  subYears(date: Date, years: number): Date {
    return subYears(date, years);
  }
  // ? Verifica se é o mesmo dia
  isSameDay(old: Date, now: Date): boolean {
    return isSameDay(old, now);
  }
  // ? Verifica se é a mesma semana
  isSameWeek(old: Date, now: Date): boolean {
    return isSameWeek(old, now);
  }
  // ? Verifica se é o mesmo mês
  isSameMonth(old: Date, now: Date): boolean {
    return isSameMonth(old, now);
  }
  // ? Verifica se é o mesmo ano
  isSameYear(old: Date, now: Date): boolean {
    return isSameYear(old, now);
  }
  // ? Verifica se é a mesma hora
  isSameHour(old: Date, now: Date): boolean {
    return isSameHour(old, now);
  }
  // ? Verifica se é o mesmo minuto
  isSameMinute(old: Date, now: Date): boolean {
    return isSameMinute(old, now);
  }
  // ? Verifica se é o mesmo segundo
  isSameSecond(old: Date, now: Date): boolean {
    return isSameSecond(old, now);
  }
  // ? Verifica se a data é antes da data atual
  isBefore(old: Date, now: Date): boolean {
    return isBefore(old, now);
  }
  // ? Verifica se a data é depois da data atual
  isAfter(old: Date, now: Date): boolean {
    return isAfter(old, now);
  }
  // ? Verifica se a data é igual a data atual
  isEqual(old: Date, now: Date): boolean {
    return isEqual(old, now);
  }
}

export default new DateEx();