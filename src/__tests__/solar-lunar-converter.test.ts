/**
 * solar-lunar-converter 테스트
 */

import { solarToLunar, lunarToSolar, getGapja } from '../core/solar-lunar-converter';
import { OutOfRangeError, InvalidDateError } from '../types';

describe('solarToLunar', () => {
  test('2024년 설날 (양력 2024-02-10 → 음력 2024-01-01)', () => {
    const result = solarToLunar(2024, 2, 10);

    expect(result.solar).toEqual({ year: 2024, month: 2, day: 10 });
    expect(result.lunar).toEqual({
      year: 2024,
      month: 1,
      day: 1,
      isLeapMonth: false,
    });
    expect(result.gapja.yearPillar).toBe('갑진');
    expect(result.gapja.yearPillarHanja).toBe('甲辰');
  });

  test('1984년 입춘 이후 (양력 1984-02-04 → 갑자년 시작)', () => {
    const result = solarToLunar(1984, 2, 4);

    expect(result.lunar).toEqual({
      year: 1984,
      month: 1,
      day: 3,
      isLeapMonth: false,
    });
    // 입춘 이후부터 갑자년으로 변경
    expect(result.gapja.yearPillar).toBe('갑자');
    expect(result.gapja.yearPillarHanja).toBe('甲子');
  });

  test('1984년 입춘 이전 (양력 1984-02-02 → 아직 계해년)', () => {
    const result = solarToLunar(1984, 2, 2);

    expect(result.lunar).toEqual({
      year: 1984,
      month: 1,
      day: 1,
      isLeapMonth: false,
    });
    // 입춘 전이라 아직 계해년
    expect(result.gapja.yearPillar).toBe('계해');
    expect(result.gapja.yearPillarHanja).toBe('癸亥');
  });

  test('2000년 밀레니엄 (양력 2000-01-01)', () => {
    const result = solarToLunar(2000, 1, 1);

    expect(result.solar).toEqual({ year: 2000, month: 1, day: 1 });
    expect(result.gapja.yearPillar).toBe('기묘');
    expect(result.gapja.yearPillarHanja).toBe('己卯');
  });

  test('지원 범위 밖 연도 (1899년)', () => {
    expect(() => solarToLunar(1899, 1, 1)).toThrow(OutOfRangeError);
  });

  test('지원 범위 밖 연도 (2051년)', () => {
    expect(() => solarToLunar(2051, 1, 1)).toThrow(OutOfRangeError);
  });

  test('유효하지 않은 날짜 (2024-02-30)', () => {
    expect(() => solarToLunar(2024, 2, 30)).toThrow(InvalidDateError);
  });

  test('지원 범위 경계 (1900년)', () => {
    const result = solarToLunar(1900, 1, 31);
    expect(result.solar.year).toBe(1900);
  });

  test('지원 범위 경계 (2050년)', () => {
    const result = solarToLunar(2050, 12, 31);
    expect(result.solar.year).toBe(2050);
  });
});

describe('lunarToSolar', () => {
  test('2024년 정월 초하루 (음력 2024-01-01 → 양력 2024-02-10)', () => {
    const result = lunarToSolar(2024, 1, 1, false);

    expect(result.lunar).toEqual({
      year: 2024,
      month: 1,
      day: 1,
      isLeapMonth: false,
    });
    expect(result.solar).toEqual({ year: 2024, month: 2, day: 10 });
  });

  test('1984년 정월 초하루 (입춘 전)', () => {
    const result = lunarToSolar(1984, 1, 1, false);

    expect(result.solar).toEqual({ year: 1984, month: 2, day: 2 });
    // 입춘 전이라 아직 계해년
    expect(result.gapja.yearPillar).toBe('계해');
  });

  test('지원 범위 밖 연도 (1899년)', () => {
    expect(() => lunarToSolar(1899, 1, 1)).toThrow(OutOfRangeError);
  });

  test('유효하지 않은 날짜 (음력 2024-13-01)', () => {
    expect(() => lunarToSolar(2024, 13, 1)).toThrow(InvalidDateError);
  });
});

describe('getGapja', () => {
  test('1984년 입춘 (갑자년 시작)', () => {
    const gapja = getGapja(1984, 2, 4);

    expect(gapja.yearPillar).toBe('갑자');
    expect(gapja.yearPillarHanja).toBe('甲子');
    expect(gapja.monthPillar).toBe('병인');
    expect(gapja.monthPillarHanja).toBe('丙寅');
  });

  test('1984년 입춘 전 (아직 계해년)', () => {
    const gapja = getGapja(1984, 2, 2);

    expect(gapja.yearPillar).toBe('계해');
    expect(gapja.yearPillarHanja).toBe('癸亥');
  });

  test('2024년 갑진년', () => {
    const gapja = getGapja(2024, 2, 10);

    expect(gapja.yearPillar).toBe('갑진');
    expect(gapja.yearPillarHanja).toBe('甲辰');
  });

  test('2000년 기묘년', () => {
    const gapja = getGapja(2000, 1, 1);

    expect(gapja.yearPillar).toBe('기묘');
    expect(gapja.yearPillarHanja).toBe('己卯');
  });
});
