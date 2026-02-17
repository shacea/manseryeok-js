/**
 * 신강/신약(身强/身弱) 판별 모듈
 *
 * 일간(日干)의 강약을 오행 점수 시스템으로 계산합니다.
 *
 * 알고리즘 출처:
 * - china-testing/bazi (Python, ⭐1162): bazi.py L206-287, ganzhi.py L44-56
 * - http://www.131.com.tw/word/b3_2_14.htm (五行 점수 계산 원전)
 *
 * 핵심 공식:
 * 1. 천간 각각 5점
 * 2. 지지 지장간 점수 (자=8, 묘=8, 유=8; 나머지는 본기5+중기2+여기1)
 * 3. 월지(月支)는 2배 가중치
 * 4. 일간과 같은 오행(비견·겁재) + 일간을 생하는 오행(편인·정인) 합산
 * 5. 합산 점수 > 전체 점수의 절반 → 신강(身强), 이하 → 신약(身弱)
 */

import {
  STEMS,
  BRANCHES,
  STEM_ELEMENT,
  BRANCH_ELEMENT,
  ELEMENT_GENERATES,
  type FiveElement,
  stemIndex,
  branchIndex,
} from '../data/stem-branch-data';
import { HIDDEN_STEMS } from './hidden-stems';

// ============================================================
// 지장간 점수 테이블
// 출처: china-testing/bazi ganzhi.py L44-56
// 자(子)·묘(卯)·유(酉)는 단일 지장간으로 8점
// 나머지는 본기 5점 + 중기 2점 + 여기 1점
// ============================================================

/**
 * 지지별 지장간 점수 테이블
 * key: 지지 한글, value: { 천간 한글: 점수 }
 */
export const HIDDEN_STEM_SCORES: Record<string, Record<string, number>> = {
  자: { 임: 3, 계: 7 },          // 壬3 癸7 (합계 10 → 실제 비율 기준)
  축: { 계: 3, 신: 3, 기: 4 },   // 癸3 辛3 己4
  인: { 무: 1, 병: 3, 갑: 6 },   // 戊1 丙3 甲6
  묘: { 갑: 3, 을: 7 },          // 甲3 乙7
  진: { 을: 3, 계: 3, 무: 4 },   // 乙3 癸3 戊4
  사: { 무: 1, 경: 3, 병: 6 },   // 戊1 庚3 丙6
  오: { 병: 3, 기: 3, 정: 4 },   // 丙3 己3 丁4
  미: { 정: 3, 을: 3, 기: 4 },   // 丁3 乙3 己4
  신: { 무: 1, 임: 3, 경: 6 },   // 戊1 壬3 庚6
  유: { 경: 3, 신: 7 },          // 庚3 辛7
  술: { 신: 3, 정: 3, 무: 4 },   // 辛3 丁3 戊4
  해: { 무: 1, 갑: 3, 임: 6 },   // 戊1 甲3 壬6
};

// ============================================================
// 오행 점수 계산
// ============================================================

/**
 * 사주 전체의 오행별 점수를 계산합니다.
 *
 * @param yearStem 년간 (한글)
 * @param monthStem 월간 (한글)
 * @param dayStem 일간 (한글)
 * @param hourStem 시간 (한글, null 가능)
 * @param yearBranch 년지 (한글)
 * @param monthBranch 월지 (한글)
 * @param dayBranch 일지 (한글)
 * @param hourBranch 시지 (한글, null 가능)
 * @returns 오행별 점수 맵
 */
export function calculateElementScores(
  yearStem: string,
  monthStem: string,
  dayStem: string,
  hourStem: string | null,
  yearBranch: string,
  monthBranch: string,
  dayBranch: string,
  hourBranch: string | null
): Record<FiveElement, number> {
  const scores: Record<FiveElement, number> = {
    목: 0, 화: 0, 토: 0, 금: 0, 수: 0,
  };

  // 1. 천간 점수 (각 5점)
  const stems = [yearStem, monthStem, dayStem, hourStem].filter(Boolean) as string[];
  for (const stem of stems) {
    const idx = stemIndex(stem);
    scores[STEM_ELEMENT[idx]] += 5;
  }

  // 2. 지지 지장간 점수 (월지는 2배)
  const branches: Array<{ branch: string; multiplier: number }> = [
    { branch: yearBranch, multiplier: 1 },
    { branch: monthBranch, multiplier: 2 },  // 월지 2배 가중치
    { branch: dayBranch, multiplier: 1 },
    ...(hourBranch ? [{ branch: hourBranch, multiplier: 1 }] : []),
  ];

  for (const { branch, multiplier } of branches) {
    const stemScores = HIDDEN_STEM_SCORES[branch];
    if (!stemScores) continue;

    for (const [hiddenStem, score] of Object.entries(stemScores)) {
      const idx = stemIndex(hiddenStem);
      scores[STEM_ELEMENT[idx]] += score * multiplier;
    }
  }

  return scores;
}

/**
 * 천간별 점수를 계산합니다 (오행 점수와 별도로 개별 천간 추적).
 */
export function calculateStemScores(
  yearStem: string,
  monthStem: string,
  dayStem: string,
  hourStem: string | null,
  yearBranch: string,
  monthBranch: string,
  dayBranch: string,
  hourBranch: string | null
): Record<string, number> {
  const stemScores: Record<string, number> = {};
  for (const s of STEMS) stemScores[s] = 0;

  // 천간 점수 (각 5점)
  const stems = [yearStem, monthStem, dayStem, hourStem].filter(Boolean) as string[];
  for (const stem of stems) {
    stemScores[stem] = (stemScores[stem] ?? 0) + 5;
  }

  // 지지 지장간 점수 (월지 2배)
  const branches: Array<{ branch: string; multiplier: number }> = [
    { branch: yearBranch, multiplier: 1 },
    { branch: monthBranch, multiplier: 2 },
    { branch: dayBranch, multiplier: 1 },
    ...(hourBranch ? [{ branch: hourBranch, multiplier: 1 }] : []),
  ];

  for (const { branch, multiplier } of branches) {
    const scores = HIDDEN_STEM_SCORES[branch];
    if (!scores) continue;
    for (const [hiddenStem, score] of Object.entries(scores)) {
      stemScores[hiddenStem] = (stemScores[hiddenStem] ?? 0) + score * multiplier;
    }
  }

  return stemScores;
}

// ============================================================
// 신강/신약 판별
// ============================================================

/**
 * 신강/신약 판별 결과
 */
export interface BodyStrengthResult {
  /** 신강(true) / 신약(false) */
  isStrong: boolean;
  /** 일간 오행 점수 (비견·겁재·편인·정인 합산) */
  selfScore: number;
  /** 전체 점수 */
  totalScore: number;
  /** 자기 세력 비율 (0~1) */
  selfRatio: number;
  /** 오행별 점수 */
  elementScores: Record<FiveElement, number>;
  /** 천간별 점수 */
  stemScores: Record<string, number>;
  /** 판별 근거 설명 */
  description: string;
}

/**
 * 신강/신약을 판별합니다.
 *
 * 판별 기준:
 * - 일간과 같은 오행(비견·겁재) + 일간을 생하는 오행(편인·정인) 점수 합산
 * - 합산 점수 > 전체 점수의 50% → 신강(身强)
 * - 합산 점수 ≤ 전체 점수의 50% → 신약(身弱)
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
export function calculateBodyStrength(
  yearStem: string,
  monthStem: string,
  dayStem: string,
  hourStem: string | null,
  yearBranch: string,
  monthBranch: string,
  dayBranch: string,
  hourBranch: string | null
): BodyStrengthResult {
  const elementScores = calculateElementScores(
    yearStem, monthStem, dayStem, hourStem,
    yearBranch, monthBranch, dayBranch, hourBranch
  );

  const stemScores = calculateStemScores(
    yearStem, monthStem, dayStem, hourStem,
    yearBranch, monthBranch, dayBranch, hourBranch
  );

  // 일간 오행
  const dayIdx = stemIndex(dayStem);
  const dayElement = STEM_ELEMENT[dayIdx];

  // 일간을 생하는 오행 (인성 오행)
  // ELEMENT_GENERATES[A] = B → A가 B를 생함 → B를 생하는 것은 A
  // 즉 dayElement를 생하는 오행 = ELEMENT_GENERATES의 역방향
  const generatesDay = (Object.keys(ELEMENT_GENERATES) as FiveElement[]).find(
    el => ELEMENT_GENERATES[el] === dayElement
  )!;

  // 자기 세력 = 비견·겁재(같은 오행) + 편인·정인(생하는 오행)
  const selfScore = elementScores[dayElement] + elementScores[generatesDay];

  // 전체 점수
  const totalScore = Object.values(elementScores).reduce((a, b) => a + b, 0);

  const selfRatio = totalScore > 0 ? selfScore / totalScore : 0;
  const isStrong = selfRatio > 0.5;

  const description = isStrong
    ? `신강(身强): 자기 세력 ${selfScore}점 / 전체 ${totalScore}점 (${(selfRatio * 100).toFixed(1)}%)`
    : `신약(身弱): 자기 세력 ${selfScore}점 / 전체 ${totalScore}점 (${(selfRatio * 100).toFixed(1)}%)`;

  return {
    isStrong,
    selfScore,
    totalScore,
    selfRatio,
    elementScores,
    stemScores,
    description,
  };
}

/**
 * 신강/신약 강도를 세분화합니다.
 *
 * - 극강(極强): selfRatio > 0.7
 * - 강(强): selfRatio > 0.55
 * - 중화(中和): 0.45 ≤ selfRatio ≤ 0.55
 * - 약(弱): selfRatio < 0.45
 * - 극약(極弱): selfRatio < 0.3
 */
export type BodyStrengthLevel = '극강' | '강' | '중화' | '약' | '극약';

export function getBodyStrengthLevel(selfRatio: number): BodyStrengthLevel {
  if (selfRatio > 0.7) return '극강';
  if (selfRatio > 0.55) return '강';
  if (selfRatio >= 0.45) return '중화';
  if (selfRatio >= 0.3) return '약';
  return '극약';
}
