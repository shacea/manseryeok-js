/**
 * 십성(十神) 계산 모듈
 *
 * 일간(日干)을 기준으로 다른 천간/지지의 십성을 판별합니다.
 *
 * 십성 판별 규칙:
 * - 비견(比肩): 같은 오행, 같은 음양
 * - 겁재(劫財): 같은 오행, 다른 음양
 * - 식신(食神): 내가 생하는 오행, 같은 음양
 * - 상관(傷官): 내가 생하는 오행, 다른 음양
 * - 편재(偏財): 내가 극하는 오행, 같은 음양
 * - 정재(正財): 내가 극하는 오행, 다른 음양
 * - 편관(偏官): 나를 극하는 오행, 같은 음양
 * - 정관(正官): 나를 극하는 오행, 다른 음양
 * - 편인(偏印): 나를 생하는 오행, 같은 음양
 * - 정인(正印): 나를 생하는 오행, 다른 음양
 */

import {
  type TenGod,
  type FiveElement,
  STEM_ELEMENT,
  STEM_YINYANG,
  stemIndex,
  ELEMENT_GENERATES,
  ELEMENT_CONTROLS,
} from '../data/stem-branch-data';
import { getMainStem } from './hidden-stems';

/**
 * 두 천간 사이의 십성 관계를 계산합니다.
 *
 * @param dayStem 일간 (기준)
 * @param targetStem 대상 천간
 * @returns 십성 이름
 */
export function getTenGodByStem(dayStem: string, targetStem: string): TenGod {
  const dayIdx = stemIndex(dayStem);
  const targetIdx = stemIndex(targetStem);

  const dayElement = STEM_ELEMENT[dayIdx];
  const targetElement = STEM_ELEMENT[targetIdx];
  const samePolarity = STEM_YINYANG[dayIdx] === STEM_YINYANG[targetIdx];

  return determineTenGod(dayElement, targetElement, samePolarity);
}

/**
 * 일간과 지지 사이의 십성 관계를 계산합니다.
 * (지지의 본기(本氣) 오행 기준)
 *
 * @param dayStem 일간
 * @param targetBranch 대상 지지
 * @returns 십성 이름
 */
export function getTenGodByBranch(dayStem: string, targetBranch: string): TenGod {
  const dayIdx = stemIndex(dayStem);

  const dayElement = STEM_ELEMENT[dayIdx];

  // 지지의 십성은 본기(本氣) 천간 기준으로 판별
  const mainStem = getMainStem(targetBranch);
  const mainStemIdx = stemIndex(mainStem);
  const targetElement = STEM_ELEMENT[mainStemIdx];
  const samePolarity = STEM_YINYANG[dayIdx] === STEM_YINYANG[mainStemIdx];

  return determineTenGod(dayElement, targetElement, samePolarity);
}

/**
 * 오행 관계와 음양으로 십성을 결정합니다.
 */
function determineTenGod(
  dayElement: FiveElement,
  targetElement: FiveElement,
  samePolarity: boolean
): TenGod {
  // 같은 오행 → 비견/겁재
  if (dayElement === targetElement) {
    return samePolarity ? '비견' : '겁재';
  }

  // 내가 생하는 오행 (식상) → 식신/상관
  if (ELEMENT_GENERATES[dayElement] === targetElement) {
    return samePolarity ? '식신' : '상관';
  }

  // 내가 극하는 오행 (재성) → 편재/정재
  if (ELEMENT_CONTROLS[dayElement] === targetElement) {
    return samePolarity ? '편재' : '정재';
  }

  // 나를 극하는 오행 (관성) → 편관/정관
  if (ELEMENT_CONTROLS[targetElement] === dayElement) {
    return samePolarity ? '편관' : '정관';
  }

  // 나를 생하는 오행 (인성) → 편인/정인
  if (ELEMENT_GENERATES[targetElement] === dayElement) {
    return samePolarity ? '편인' : '정인';
  }

  // 이론적으로 도달 불가
  throw new Error(`Cannot determine ten god: ${dayElement} vs ${targetElement}`);
}

/**
 * 사주 전체의 십성을 계산합니다.
 *
 * @param dayStem 일간
 * @param yearStem 년간
 * @param monthStem 월간
 * @param hourStem 시간 (optional)
 * @param yearBranch 년지
 * @param monthBranch 월지
 * @param dayBranch 일지
 * @param hourBranch 시지 (optional)
 */
export function calculateAllTenGods(
  dayStem: string,
  yearStem: string,
  monthStem: string,
  hourStem: string | null,
  yearBranch: string,
  monthBranch: string,
  dayBranch: string,
  hourBranch: string | null
): {
  stem: { year: TenGod; month: TenGod; day: '비견'; hour: TenGod | null };
  branch: { year: TenGod; month: TenGod; day: TenGod; hour: TenGod | null };
} {
  return {
    stem: {
      year: getTenGodByStem(dayStem, yearStem),
      month: getTenGodByStem(dayStem, monthStem),
      day: '비견', // 일간은 자기 자신
      hour: hourStem ? getTenGodByStem(dayStem, hourStem) : null,
    },
    branch: {
      year: getTenGodByBranch(dayStem, yearBranch),
      month: getTenGodByBranch(dayStem, monthBranch),
      day: getTenGodByBranch(dayStem, dayBranch),
      hour: hourBranch ? getTenGodByBranch(dayStem, hourBranch) : null,
    },
  };
}
