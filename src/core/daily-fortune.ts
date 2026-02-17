/**
 * 일운(日運) 계산 모듈
 *
 * 특정 월의 매일 일운 간지와 십성, 12신살, 12운성을 계산합니다.
 */

import { STEMS, BRANCHES, STEMS_HANJA, BRANCHES_HANJA, type TenGod, type TwelveState } from '../data/stem-branch-data';
import { getTenGodByStem, getTenGodByBranch } from './ten-gods';
import { getTwelveState } from './twelve-states';
import { getTwelveSpirit, type TwelveSpirit } from './twelve-spirits';

export interface DailyFortune {
  year: number;
  month: number;
  day: number;
  pillar: string;
  pillarHanja: string;
  stemTenGod: TenGod;
  branchTenGod: TenGod;
  twelveSpirit: TwelveSpirit | null;
  twelveState: TwelveState;
}

/** 일주 기원일의 JD (갑자일) */
const DAY_PILLAR_EPOCH = 2415011;

/**
 * 양력 날짜를 율리우스 일수(Julian Day Number)로 변환합니다.
 */
function toJulianDay(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

/**
 * 특정 날짜의 일주 간지 인덱스를 계산합니다.
 */
function getDayPillarIndices(year: number, month: number, day: number): { stemIdx: number; branchIdx: number } {
  const jd = toJulianDay(year, month, day);
  const pillarId = (((jd - DAY_PILLAR_EPOCH) % 60) + 60) % 60;
  return {
    stemIdx: pillarId % 10,
    branchIdx: pillarId % 12,
  };
}

/**
 * 특정 월의 일운을 계산합니다.
 *
 * @param dayStem 일간 (사주의 일주 천간)
 * @param yearBranch 사주의 년지 (12신살 기준)
 * @param targetYear 대상 연도
 * @param targetMonth 대상 월 (1~12)
 * @returns 일운 목록
 */
export function calculateDailyFortune(
  dayStem: string,
  yearBranch: string,
  targetYear: number,
  targetMonth: number,
): DailyFortune[] {
  const results: DailyFortune[] = [];
  const daysInMonth = new Date(targetYear, targetMonth, 0).getDate();

  for (let d = 1; d <= daysInMonth; d++) {
    const { stemIdx, branchIdx } = getDayPillarIndices(targetYear, targetMonth, d);
    const fStem = STEMS[stemIdx];
    const fBranch = BRANCHES[branchIdx];

    results.push({
      year: targetYear,
      month: targetMonth,
      day: d,
      pillar: fStem + fBranch,
      pillarHanja: STEMS_HANJA[stemIdx] + BRANCHES_HANJA[branchIdx],
      stemTenGod: getTenGodByStem(dayStem, fStem),
      branchTenGod: getTenGodByBranch(dayStem, fBranch),
      twelveSpirit: getTwelveSpirit(yearBranch, fBranch),
      twelveState: getTwelveState(dayStem, fBranch),
    });
  }

  return results;
}

/**
 * 특정 날짜의 일운을 단건 계산합니다.
 */
export function getDailyFortune(
  dayStem: string,
  yearBranch: string,
  targetYear: number,
  targetMonth: number,
  targetDay: number,
): DailyFortune {
  const { stemIdx, branchIdx } = getDayPillarIndices(targetYear, targetMonth, targetDay);
  const fStem = STEMS[stemIdx];
  const fBranch = BRANCHES[branchIdx];

  return {
    year: targetYear,
    month: targetMonth,
    day: targetDay,
    pillar: fStem + fBranch,
    pillarHanja: STEMS_HANJA[stemIdx] + BRANCHES_HANJA[branchIdx],
    stemTenGod: getTenGodByStem(dayStem, fStem),
    branchTenGod: getTenGodByBranch(dayStem, fBranch),
    twelveSpirit: getTwelveSpirit(yearBranch, fBranch),
    twelveState: getTwelveState(dayStem, fBranch),
  };
}
