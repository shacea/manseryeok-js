/**
 * 오행(五行) / 십성(十神) 비율 분석 모듈
 *
 * PDF 출력 형식:
 * - 오행 분석: 목37.5%, 화12.5%, 토25.0%, 금12.5%, 수12.5%
 * - 십성 분석: 편관12.5%, 정관25.0%, 편인12.5%, 비견12.5%, 겁재12.5%, 상관12.5%, 편재12.5%
 *
 * 계산 방식: 사주 8글자(천간4 + 지지4)의 오행/십성을 동일 비중으로 카운팅
 * (지장간 가중치 방식이 아닌 단순 카운팅 방식)
 */

import {
  STEM_ELEMENT,
  BRANCH_ELEMENT,
  type FiveElement,
  type TenGod,
  stemIndex,
  branchIndex,
} from '../data/stem-branch-data';
import { getTenGodByStem, getTenGodByBranch } from './ten-gods';

// ============================================================
// 오행 비율 분석
// ============================================================

/**
 * 오행 비율 판정
 */
export type ElementLevel = '과다' | '발달' | '적정' | '부족';

/**
 * 오행 분석 결과
 */
export interface FiveElementAnalysis {
  /** 오행별 개수 (8글자 기준) */
  counts: Record<FiveElement, number>;
  /** 오행별 비율 (0~1) */
  ratios: Record<FiveElement, number>;
  /** 오행별 백분율 문자열 (예: "37.5%") */
  percentages: Record<FiveElement, string>;
  /** 오행별 판정 */
  levels: Record<FiveElement, ElementLevel>;
  /** 총 글자 수 */
  total: number;
}

/**
 * 오행 비율 판정 기준
 * - 과다: 37.5% 이상 (3개 이상)
 * - 발달: 25.0% (2개)
 * - 적정: 12.5% (1개)
 * - 부족: 12.5% 미만 (0~1개)
 */
function getElementLevel(ratio: number): ElementLevel {
  if (ratio >= 0.375) return '과다';
  if (ratio >= 0.25) return '발달';
  if (ratio >= 0.125) return '적정';
  return '부족';
}

/**
 * 사주 8글자의 오행 비율을 분석합니다.
 *
 * 천간 4글자 + 지지 4글자 = 8글자의 오행을 동일 비중으로 카운팅합니다.
 *
 * @param yearStem 년간
 * @param monthStem 월간
 * @param dayStem 일간
 * @param hourStem 시간 (null 가능)
 * @param yearBranch 년지
 * @param monthBranch 월지
 * @param dayBranch 일지
 * @param hourBranch 시지 (null 가능)
 */
export function analyzeFiveElements(
  yearStem: string,
  monthStem: string,
  dayStem: string,
  hourStem: string | null,
  yearBranch: string,
  monthBranch: string,
  dayBranch: string,
  hourBranch: string | null,
): FiveElementAnalysis {
  const counts: Record<FiveElement, number> = {
    목: 0,
    화: 0,
    토: 0,
    금: 0,
    수: 0,
  };

  // 천간 오행 카운팅
  const stems = [yearStem, monthStem, dayStem, ...(hourStem ? [hourStem] : [])];
  for (const stem of stems) {
    const idx = stemIndex(stem);
    counts[STEM_ELEMENT[idx]]++;
  }

  // 지지 오행 카운팅
  const branches = [yearBranch, monthBranch, dayBranch, ...(hourBranch ? [hourBranch] : [])];
  for (const branch of branches) {
    const idx = branchIndex(branch);
    counts[BRANCH_ELEMENT[idx]]++;
  }

  const total = stems.length + branches.length;

  // 비율 계산
  const ratios = {} as Record<FiveElement, number>;
  const percentages = {} as Record<FiveElement, string>;
  const levels = {} as Record<FiveElement, ElementLevel>;

  for (const el of ['목', '화', '토', '금', '수'] as FiveElement[]) {
    ratios[el] = total > 0 ? counts[el] / total : 0;
    percentages[el] = (ratios[el] * 100).toFixed(1) + '%';
    levels[el] = getElementLevel(ratios[el]);
  }

  return { counts, ratios, percentages, levels, total };
}

// ============================================================
// 십성 비율 분석
// ============================================================

export interface TenGodAnalysis {
  counts: Record<TenGod, number>;
  ratios: Record<TenGod, number>;
  percentages: Record<TenGod, string>;
  total: number;
  details: {
    position: string;
    tenGod: TenGod;
  }[];
}

export function analyzeTenGods(
  dayStem: string,
  yearStem: string,
  monthStem: string,
  hourStem: string | null,
  yearBranch: string,
  monthBranch: string,
  dayBranch: string,
  hourBranch: string | null,
): TenGodAnalysis {
  const allTenGods: TenGod[] = ['비견', '겁재', '식신', '상관', '편재', '정재', '편관', '정관', '편인', '정인'];

  const counts = {} as Record<TenGod, number>;
  for (const tg of allTenGods) counts[tg] = 0;

  const details: { position: string; tenGod: TenGod }[] = [];

  // 천간 십성 (일간 포함 — 일간 자신 = 비견)
  const dayStemTg = getTenGodByStem(dayStem, dayStem);
  counts[dayStemTg]++;
  details.push({ position: '일간', tenGod: dayStemTg });

  const stemPairs: [string, string][] = [
    [yearStem, '년간'],
    [monthStem, '월간'],
  ];
  if (hourStem) stemPairs.push([hourStem, '시간']);

  for (const [stem, position] of stemPairs) {
    const tg = getTenGodByStem(dayStem, stem);
    counts[tg]++;
    details.push({ position, tenGod: tg });
  }

  // 지지 십성
  const branchPairs: [string, string][] = [
    [yearBranch, '년지'],
    [monthBranch, '월지'],
    [dayBranch, '일지'],
  ];
  if (hourBranch) branchPairs.push([hourBranch, '시지']);

  for (const [branch, position] of branchPairs) {
    const tg = getTenGodByBranch(dayStem, branch);
    counts[tg]++;
    details.push({ position, tenGod: tg });
  }

  const total = details.length;

  const ratios = {} as Record<TenGod, number>;
  const percentages = {} as Record<TenGod, string>;

  for (const tg of allTenGods) {
    ratios[tg] = total > 0 ? counts[tg] / total : 0;
    percentages[tg] = (ratios[tg] * 100).toFixed(1) + '%';
  }

  return { counts, ratios, percentages, total, details };
}
