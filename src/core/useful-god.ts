/**
 * 억부용신(抑扶用神) 결정 모듈
 *
 * 신강/신약에 따라 용신(用神)과 기신(忌神)을 결정합니다.
 *
 * 알고리즘 출처:
 * - 억부용신 원리: 신강하면 억제(억부), 신약하면 부조(扶助)
 * - 오행 상생·상극 관계 기반
 *
 * 억부용신 결정 원칙:
 * ┌─────────┬──────────────────────────────────────────────────────┐
 * │ 신강(强) │ 식상(食傷)·재성(財星)·관성(官星)으로 억제           │
 * │         │ 우선순위: 식상 > 재성 > 관성                         │
 * ├─────────┼──────────────────────────────────────────────────────┤
 * │ 신약(弱) │ 비겁(比劫)·인성(印星)으로 부조                      │
 * │         │ 우선순위: 인성 > 비겁                                 │
 * └─────────┴──────────────────────────────────────────────────────┘
 */

import {
  STEM_ELEMENT,
  ELEMENT_GENERATES,
  ELEMENT_CONTROLS,
  type FiveElement,
  stemIndex,
} from '../data/stem-branch-data';
import type { BodyStrengthResult, BodyStrengthLevel } from './body-strength';
import { getBodyStrengthLevel } from './body-strength';

// ============================================================
// 십성 그룹 분류
// ============================================================

/**
 * 십성 그룹
 * - 비겁(比劫): 비견 + 겁재 (같은 오행)
 * - 식상(食傷): 식신 + 상관 (내가 생하는 오행)
 * - 재성(財星): 편재 + 정재 (내가 극하는 오행)
 * - 관성(官星): 편관 + 정관 (나를 극하는 오행)
 * - 인성(印星): 편인 + 정인 (나를 생하는 오행)
 */
export type TenGodGroup = '비겁' | '식상' | '재성' | '관성' | '인성';

/**
 * 일간 오행 기준으로 각 오행의 십성 그룹을 반환합니다.
 */
export function getElementGroup(dayElement: FiveElement, targetElement: FiveElement): TenGodGroup {
  if (dayElement === targetElement) return '비겁';
  if (ELEMENT_GENERATES[dayElement] === targetElement) return '식상';
  if (ELEMENT_CONTROLS[dayElement] === targetElement) return '재성';
  if (ELEMENT_CONTROLS[targetElement] === dayElement) return '관성';
  // 나를 생하는 오행
  return '인성';
}

/**
 * 일간 기준 각 오행의 십성 그룹 맵을 반환합니다.
 */
export function getElementGroupMap(dayStem: string): Record<FiveElement, TenGodGroup> {
  const dayIdx = stemIndex(dayStem);
  const dayElement = STEM_ELEMENT[dayIdx];
  const elements: FiveElement[] = ['목', '화', '토', '금', '수'];

  const result = {} as Record<FiveElement, TenGodGroup>;
  for (const el of elements) {
    result[el] = getElementGroup(dayElement, el);
  }
  return result;
}

// ============================================================
// 용신 결정
// ============================================================

/**
 * 용신 결정 결과
 */
export interface UsefulGodResult {
  /** 용신 오행 */
  usefulElement: FiveElement;
  /** 희신 오행 (용신을 돕는 오행) */
  favorableElement: FiveElement;
  /** 기신 오행 (용신을 방해하는 오행) */
  unfavorableElement: FiveElement;
  /** 구신 오행 (기신을 돕는 오행) */
  adverseElement: FiveElement;
  /** 용신 십성 그룹 */
  usefulGroup: TenGodGroup;
  /** 신강/신약 강도 */
  strengthLevel: BodyStrengthLevel;
  /** 결정 근거 설명 */
  description: string;
}

/**
 * 억부용신을 결정합니다.
 *
 * @param dayStem 일간 (한글)
 * @param bodyStrength 신강/신약 계산 결과
 * @returns 용신 결정 결과
 */
export function determineUsefulGod(
  dayStem: string,
  bodyStrength: BodyStrengthResult
): UsefulGodResult {
  const dayIdx = stemIndex(dayStem);
  const dayElement = STEM_ELEMENT[dayIdx];
  const strengthLevel = getBodyStrengthLevel(bodyStrength.selfRatio);
  const groupMap = getElementGroupMap(dayStem);

  // 오행 목록
  const elements: FiveElement[] = ['목', '화', '토', '금', '수'];

  // 각 그룹별 오행 분류
  const byGroup: Record<TenGodGroup, FiveElement[]> = {
    비겁: [], 식상: [], 재성: [], 관성: [], 인성: [],
  };
  for (const el of elements) {
    byGroup[groupMap[el]].push(el);
  }

  let usefulGroup: TenGodGroup;
  let usefulElement: FiveElement;
  let favorableElement: FiveElement;
  let unfavorableElement: FiveElement;
  let adverseElement: FiveElement;
  let description: string;

  if (bodyStrength.isStrong) {
    // ── 신강(身强): 억제가 필요 ──
    // 우선순위: 식상 > 재성 > 관성
    // 가장 약한 그룹을 용신으로 (억제 효과 극대화)

    // 식상 오행 중 점수가 낮은 것 선택
    const foodScores = byGroup['식상'].map(el => ({ el, score: bodyStrength.elementScores[el] }));
    const wealthScores = byGroup['재성'].map(el => ({ el, score: bodyStrength.elementScores[el] }));
    const officialScores = byGroup['관성'].map(el => ({ el, score: bodyStrength.elementScores[el] }));

    // 식상이 있으면 우선 사용
    if (foodScores.length > 0) {
      usefulGroup = '식상';
      usefulElement = foodScores.sort((a, b) => a.score - b.score)[0].el;
    } else if (wealthScores.length > 0) {
      usefulGroup = '재성';
      usefulElement = wealthScores.sort((a, b) => a.score - b.score)[0].el;
    } else {
      usefulGroup = '관성';
      usefulElement = officialScores.sort((a, b) => a.score - b.score)[0].el;
    }

    // 희신: 용신을 생하는 오행 (용신의 인성)
    favorableElement = (Object.keys(ELEMENT_GENERATES) as FiveElement[]).find(
      el => ELEMENT_GENERATES[el] === usefulElement
    )!;

    // 기신: 용신을 극하는 오행 (비겁 또는 인성)
    unfavorableElement = dayElement; // 비겁 (일간과 같은 오행)

    // 구신: 기신을 생하는 오행
    adverseElement = (Object.keys(ELEMENT_GENERATES) as FiveElement[]).find(
      el => ELEMENT_GENERATES[el] === unfavorableElement
    )!;

    description = `신강(${strengthLevel}) → 억부용신: ${usefulGroup}(${usefulElement}) | 희신: ${favorableElement} | 기신: ${unfavorableElement}(비겁)`;

  } else {
    // ── 신약(身弱): 부조가 필요 ──
    // 우선순위: 인성 > 비겁

    const printScores = byGroup['인성'].map(el => ({ el, score: bodyStrength.elementScores[el] }));
    const siblingScores = byGroup['비겁'].map(el => ({ el, score: bodyStrength.elementScores[el] }));

    // 인성이 있으면 우선 사용
    if (printScores.length > 0) {
      usefulGroup = '인성';
      // 인성 중 점수가 낮은 것 (부족한 것)을 용신으로
      usefulElement = printScores.sort((a, b) => a.score - b.score)[0].el;
    } else {
      usefulGroup = '비겁';
      usefulElement = siblingScores.sort((a, b) => a.score - b.score)[0].el;
    }

    // 희신: 용신을 생하는 오행
    favorableElement = (Object.keys(ELEMENT_GENERATES) as FiveElement[]).find(
      el => ELEMENT_GENERATES[el] === usefulElement
    )!;

    // 기신: 용신을 극하는 오행 (재성 또는 관성)
    // 신약일 때 기신 = 재성(일간이 극하는 오행) 또는 관성(일간을 극하는 오행)
    // 관성이 더 직접적으로 일간을 극하므로 관성을 기신으로
    const officialEls = byGroup['관성'];
    unfavorableElement = officialEls.length > 0
      ? officialEls.sort((a, b) => bodyStrength.elementScores[b] - bodyStrength.elementScores[a])[0]
      : byGroup['재성'][0];

    // 구신: 기신을 생하는 오행
    adverseElement = (Object.keys(ELEMENT_GENERATES) as FiveElement[]).find(
      el => ELEMENT_GENERATES[el] === unfavorableElement
    )!;

    description = `신약(${strengthLevel}) → 억부용신: ${usefulGroup}(${usefulElement}) | 희신: ${favorableElement} | 기신: ${unfavorableElement}(관성)`;
  }

  return {
    usefulElement,
    favorableElement,
    unfavorableElement,
    adverseElement,
    usefulGroup,
    strengthLevel,
    description,
  };
}

/**
 * 특정 오행이 용신/희신/기신/구신 중 어디에 해당하는지 반환합니다.
 */
export type GodType = '용신' | '희신' | '기신' | '구신' | '한신';

export function classifyElement(
  element: FiveElement,
  usefulGod: UsefulGodResult
): GodType {
  if (element === usefulGod.usefulElement) return '용신';
  if (element === usefulGod.favorableElement) return '희신';
  if (element === usefulGod.unfavorableElement) return '기신';
  if (element === usefulGod.adverseElement) return '구신';
  return '한신';
}
