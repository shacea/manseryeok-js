/**
 * 세운(歲運) / 년운 계산 모듈
 *
 * 특정 연도의 세운 간지와 십성, 12신살, 12운성을 계산합니다.
 */

import { STEMS, BRANCHES, STEMS_HANJA, BRANCHES_HANJA, type TenGod, type TwelveState } from '../data/stem-branch-data';
import { getTenGodByStem, getTenGodByBranch } from './ten-gods';
import { getTwelveState } from './twelve-states';
import { getTwelveSpirit, type TwelveSpirit } from './twelve-spirits';

export interface AnnualFortune {
  year: number;
  pillar: string;
  pillarHanja: string;
  stemTenGod: TenGod;
  branchTenGod: TenGod;
  twelveSpirit: TwelveSpirit | null;
  twelveState: TwelveState;
}

/**
 * 특정 연도의 60갑자 년주를 계산합니다.
 * 공식: (year - 4) % 60 으로 60갑자 인덱스를 구함
 * (서기 4년이 갑자년)
 */
function getYearPillarIndices(year: number): { stemIdx: number; branchIdx: number } {
  const base = (year - 4) % 60;
  const idx = base < 0 ? base + 60 : base;
  return {
    stemIdx: idx % 10,
    branchIdx: idx % 12,
  };
}

/**
 * 세운(년운)을 계산합니다.
 *
 * @param dayStem 일간 (사주의 일주 천간)
 * @param yearBranch 사주의 년지 (12신살 기준)
 * @param targetYear 세운을 계산할 중심 연도
 * @param count 총 연도 수 (기본값: 10)
 * @returns 세운 목록
 */
export function calculateAnnualFortune(
  dayStem: string,
  yearBranch: string,
  targetYear: number,
  count: number = 10,
): AnnualFortune[] {
  const results: AnnualFortune[] = [];
  const halfBefore = Math.floor(count / 2);
  const startYear = targetYear - halfBefore;

  for (let i = 0; i < count; i++) {
    const yr = startYear + i;
    const { stemIdx, branchIdx } = getYearPillarIndices(yr);
    const fStem = STEMS[stemIdx];
    const fBranch = BRANCHES[branchIdx];

    results.push({
      year: yr,
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
 * 특정 연도의 세운을 단건 계산합니다.
 */
export function getAnnualFortune(dayStem: string, yearBranch: string, targetYear: number): AnnualFortune {
  const { stemIdx, branchIdx } = getYearPillarIndices(targetYear);
  const fStem = STEMS[stemIdx];
  const fBranch = BRANCHES[branchIdx];

  return {
    year: targetYear,
    pillar: fStem + fBranch,
    pillarHanja: STEMS_HANJA[stemIdx] + BRANCHES_HANJA[branchIdx],
    stemTenGod: getTenGodByStem(dayStem, fStem),
    branchTenGod: getTenGodByBranch(dayStem, fBranch),
    twelveSpirit: getTwelveSpirit(yearBranch, fBranch),
    twelveState: getTwelveState(dayStem, fBranch),
  };
}
