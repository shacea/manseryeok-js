/**
 * 월운(月運) 계산 모듈
 *
 * 특정 연도의 12개월 월운 간지와 십성, 12신살, 12운성을 계산합니다.
 *
 * 월주 천간 시작 규칙 (오인두법):
 * - 갑/기년: 인월=병인 (stemStart=2)
 * - 을/경년: 인월=무인 (stemStart=4)
 * - 병/신년: 인월=경인 (stemStart=6)
 * - 정/임년: 인월=임인 (stemStart=8)
 * - 무/계년: 인월=갑인 (stemStart=0)
 */

import { STEMS, BRANCHES, STEMS_HANJA, BRANCHES_HANJA, type TenGod, type TwelveState } from '../data/stem-branch-data';
import { getTenGodByStem, getTenGodByBranch } from './ten-gods';
import { getTwelveState } from './twelve-states';
import { getTwelveSpirit, type TwelveSpirit } from './twelve-spirits';

export interface MonthlyFortune {
  month: number;
  pillar: string;
  pillarHanja: string;
  stemTenGod: TenGod;
  branchTenGod: TenGod;
  twelveSpirit: TwelveSpirit | null;
  twelveState: TwelveState;
}

// 오인두법: 년간 인덱스 → 인월(寅月) 천간 시작 인덱스
const MONTH_STEM_START: Record<number, number> = {
  0: 2,
  5: 2, // 갑/기 → 병(2)
  1: 4,
  6: 4, // 을/경 → 무(4)
  2: 6,
  7: 6, // 병/신 → 경(6)
  3: 8,
  8: 8, // 정/임 → 임(8)
  4: 0,
  9: 0, // 무/계 → 갑(0)
};

// 사주 월 → 지지 인덱스: 인(2)부터 12개월
// month 1=축(1), 2=인(2), 3=묘(3), ..., 11=자(0), 12=자(0)...
// 실제: 사주월 1→자(0), 2→인(2), 3→묘(3), ..., 12→축(1)
// 정확한 매핑: 양력 기준 1월=축월, 2월=인월, ...12월=자월
// 지지순서: 인(2), 묘(3), 진(4), 사(5), 오(6), 미(7), 신(8), 유(9), 술(10), 해(11), 자(0), 축(1)
const MONTH_BRANCH_ORDER = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1];

function getYearPillarStemIdx(year: number): number {
  const base = (year - 4) % 60;
  const idx = base < 0 ? base + 60 : base;
  return idx % 10;
}

/**
 * 특정 연도의 12개월 월운을 계산합니다.
 *
 * @param dayStem 일간
 * @param yearBranch 사주의 년지 (12신살 기준)
 * @param targetYear 월운을 계산할 연도
 */
export function calculateMonthlyFortune(dayStem: string, yearBranch: string, targetYear: number): MonthlyFortune[] {
  const results: MonthlyFortune[] = [];

  for (let m = 1; m <= 12; m++) {
    // 1월(축월)은 전년 년간 기준, 2~12월은 당년 년간 기준
    const effectiveYear = m === 1 ? targetYear - 1 : targetYear;
    const yearStemIdx = getYearPillarStemIdx(effectiveYear);
    const monthStemStart = MONTH_STEM_START[yearStemIdx];

    // 인월(2월)=0번째, 묘월(3월)=1번째, ..., 축월(1월)=11번째
    const monthOffset = m === 1 ? 11 : m - 2;
    const mStemIdx = (monthStemStart + monthOffset) % 10;
    const mBranchIdx = MONTH_BRANCH_ORDER[monthOffset];

    const fStem = STEMS[mStemIdx];
    const fBranch = BRANCHES[mBranchIdx];

    results.push({
      month: m,
      pillar: fStem + fBranch,
      pillarHanja: STEMS_HANJA[mStemIdx] + BRANCHES_HANJA[mBranchIdx],
      stemTenGod: getTenGodByStem(dayStem, fStem),
      branchTenGod: getTenGodByBranch(dayStem, fBranch),
      twelveSpirit: getTwelveSpirit(yearBranch, fBranch),
      twelveState: getTwelveState(dayStem, fBranch),
    });
  }

  return results;
}
