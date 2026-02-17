/**
 * 신살(神殺)과 길성(吉星) 모듈
 *
 * PDF에 표시된 신살: 현침살, 천을귀인, 도화살, 태극귀인, 화개살, 천문성, 문곡귀인, 정록
 */

import { stemIndex, branchIndex } from '../data/stem-branch-data';

// ============================================================
// 도화살 (桃花殺) = 함지살
// ============================================================

/**
 * 도화살: 년지 또는 일지 기준
 * 신자진 → 유, 인오술 → 묘, 사유축 → 오, 해묘미 → 자
 */
const DOWHWA_TABLE: Record<number, number> = {
  8: 9,
  0: 9,
  4: 9, // 신자진 → 유
  2: 3,
  6: 3,
  10: 3, // 인오술 → 묘
  5: 6,
  9: 6,
  1: 6, // 사유축 → 오
  11: 0,
  3: 0,
  7: 0, // 해묘미 → 자
};

/**
 * 도화살 확인
 * @param baseBranch 기준 지지 (년지 또는 일지)
 * @param targetBranch 확인할 지지
 */
export function isDohwaSal(baseBranch: string, targetBranch: string): boolean {
  const baseIdx = branchIndex(baseBranch);
  const targetIdx = branchIndex(targetBranch);
  return DOWHWA_TABLE[baseIdx] === targetIdx;
}

// ============================================================
// 화개살 (華蓋殺)
// ============================================================

/**
 * 화개살: 년지 또는 일지 기준
 * 신자진 → 진, 인오술 → 술, 사유축 → 축, 해묘미 → 미
 */
const HWAGAE_TABLE: Record<number, number> = {
  8: 4,
  0: 4,
  4: 4, // 신자진 → 진
  2: 10,
  6: 10,
  10: 10, // 인오술 → 술
  5: 1,
  9: 1,
  1: 1, // 사유축 → 축
  11: 7,
  3: 7,
  7: 7, // 해묘미 → 미
};

export function isHwagaeSal(baseBranch: string, targetBranch: string): boolean {
  const baseIdx = branchIndex(baseBranch);
  const targetIdx = branchIndex(targetBranch);
  return HWAGAE_TABLE[baseIdx] === targetIdx;
}

// ============================================================
// 역마살 (驛馬殺)
// ============================================================

/**
 * 역마살: 년지 또는 일지 기준
 * 신자진 → 인, 인오술 → 신, 사유축 → 해, 해묘미 → 사
 */
const YEOKMA_TABLE: Record<number, number> = {
  8: 2,
  0: 2,
  4: 2, // 신자진 → 인
  2: 8,
  6: 8,
  10: 8, // 인오술 → 신
  5: 11,
  9: 11,
  1: 11, // 사유축 → 해
  11: 5,
  3: 5,
  7: 5, // 해묘미 → 사
};

export function isYeokmaSal(baseBranch: string, targetBranch: string): boolean {
  const baseIdx = branchIndex(baseBranch);
  const targetIdx = branchIndex(targetBranch);
  return YEOKMA_TABLE[baseIdx] === targetIdx;
}

// ============================================================
// 천을귀인 (天乙貴人)
// ============================================================

/**
 * 천을귀인: 일간 기준
 * 갑무경=축미, 을기=자신, 병정=해유, 임계=묘사, 신=인오
 */
const CHEONUL_TABLE: Record<number, number[]> = {
  0: [1, 7], // 갑 → 축, 미
  4: [1, 7], // 무 → 축, 미
  6: [1, 7], // 경 → 축, 미
  1: [0, 8], // 을 → 자, 신
  5: [0, 8], // 기 → 자, 신
  2: [11, 9], // 병 → 해, 유
  3: [11, 9], // 정 → 해, 유
  8: [3, 5], // 임 → 묘, 사
  9: [3, 5], // 계 → 묘, 사
  7: [2, 6], // 신 → 인, 오
};

export function isCheonulGwiin(dayStem: string, targetBranch: string): boolean {
  const sIdx = stemIndex(dayStem);
  const bIdx = branchIndex(targetBranch);
  return CHEONUL_TABLE[sIdx]?.includes(bIdx) ?? false;
}

// ============================================================
// 현침살 (懸針殺)
// ============================================================

/**
 * 현침살: 천간이 갑(甲), 신(辛)인 경우
 * 갑(甲)과 신(辛)은 글자 획이 뾰족하여 현침살이 됨
 */
export function isHyeonchimSal(stem: string): boolean {
  return stem === '갑' || stem === '신';
}

// ============================================================
// 태극귀인 (太極貴人)
// ============================================================

/**
 * 태극귀인: 일간 기준
 * 갑기=자오, 을경=축미, 병신=인묘, 정임=사유, 무계=사유(또는 진술)
 * (여러 유파가 있으므로 가장 일반적인 버전 사용)
 */
const TAEGEUK_TABLE: Record<number, number[]> = {
  0: [0, 6], // 갑 → 자, 오
  5: [0, 6], // 기 → 자, 오
  1: [1, 7], // 을 → 축, 미
  6: [1, 7], // 경 → 축, 미
  2: [2, 3], // 병 → 인, 묘
  7: [2, 3], // 신 → 인, 묘
  3: [5, 9], // 정 → 사, 유
  8: [5, 9], // 임 → 사, 유
  4: [5, 9], // 무 → 사, 유
  9: [5, 9], // 계 → 사, 유
};

export function isTaegeukGwiin(dayStem: string, targetBranch: string): boolean {
  const sIdx = stemIndex(dayStem);
  const bIdx = branchIndex(targetBranch);
  return TAEGEUK_TABLE[sIdx]?.includes(bIdx) ?? false;
}

// ============================================================
// 천문성 (天門星)
// ============================================================

/**
 * 천문성: 일간 기준으로 해(亥)가 사주에 있으면 천문성
 * (일반적으로 해(亥)궁이 천문에 해당)
 */
export function isCheonmunseong(targetBranch: string): boolean {
  return targetBranch === '해';
}

// ============================================================
// 문곡귀인 (文曲貴人)
// ============================================================

/**
 * 문곡귀인: 일간 기준
 * 갑기=사, 을경=오, 병신=신, 정임=유, 무계=미
 * (학문/예술 능력)
 */
const MUNGOK_TABLE: Record<number, number> = {
  0: 5, // 갑 → 사
  5: 5, // 기 → 사
  1: 6, // 을 → 오
  6: 6, // 경 → 오
  2: 8, // 병 → 신
  7: 8, // 신 → 신
  3: 9, // 정 → 유
  8: 9, // 임 → 유
  4: 7, // 무 → 미
  9: 7, // 계 → 미
};

export function isMungokGwiin(dayStem: string, targetBranch: string): boolean {
  const sIdx = stemIndex(dayStem);
  const bIdx = branchIndex(targetBranch);
  return MUNGOK_TABLE[sIdx] === bIdx;
}

// ============================================================
// 정록 (正祿) = 건록
// ============================================================

/**
 * 정록(건록): 일간의 건록 위치
 * 갑=인, 을=묘, 병=사, 정=오, 무=사, 기=오, 경=신, 신=유, 임=해, 계=자
 */
const JEONGROK_TABLE: readonly number[] = [
  2, // 갑 → 인
  3, // 을 → 묘
  5, // 병 → 사
  6, // 정 → 오
  5, // 무 → 사
  6, // 기 → 오
  8, // 경 → 신
  9, // 신 → 유
  11, // 임 → 해
  0, // 계 → 자
];

export function isJeongrok(dayStem: string, targetBranch: string): boolean {
  const sIdx = stemIndex(dayStem);
  const bIdx = branchIndex(targetBranch);
  return JEONGROK_TABLE[sIdx] === bIdx;
}

// ============================================================
// 통합 신살 분석
// ============================================================

export interface SpecialStarResult {
  name: string;
  nameHanja: string;
  type: 'gilseong' | 'hyungsal';
  position: string; // '년', '월', '일', '시'
}

/**
 * 사주 전체의 신살/길성을 분석합니다.
 */
export function analyzeSpecialStars(
  yearStem: string,
  monthStem: string,
  dayStem: string,
  hourStem: string | null,
  yearBranch: string,
  monthBranch: string,
  dayBranch: string,
  hourBranch: string | null,
): SpecialStarResult[] {
  const results: SpecialStarResult[] = [];
  const stems = [yearStem, monthStem, dayStem, ...(hourStem ? [hourStem] : [])];
  const branches = [yearBranch, monthBranch, dayBranch, ...(hourBranch ? [hourBranch] : [])];
  const positions = ['년', '월', '일', '시'];

  // 천간 신살
  stems.forEach((stem, i) => {
    if (isHyeonchimSal(stem)) {
      results.push({ name: '현침살', nameHanja: '懸針殺', type: 'hyungsal', position: positions[i] });
    }
  });

  // 지지 신살 (년지 기준 + 일지 기준 + 일간 기준)
  branches.forEach((branch, i) => {
    // 년지 기준 도화살
    if (isDohwaSal(yearBranch, branch)) {
      results.push({ name: '도화살', nameHanja: '桃花殺', type: 'hyungsal', position: positions[i] });
    }
    // 일지 기준 도화살도 체크
    if (dayBranch !== yearBranch && isDohwaSal(dayBranch, branch)) {
      results.push({ name: '도화살', nameHanja: '桃花殺', type: 'hyungsal', position: positions[i] });
    }

    // 화개살 (년지 기준)
    if (isHwagaeSal(yearBranch, branch)) {
      results.push({ name: '화개살', nameHanja: '華蓋殺', type: 'gilseong', position: positions[i] });
    }

    // 역마살 (년지 기준)
    if (isYeokmaSal(yearBranch, branch)) {
      results.push({ name: '역마살', nameHanja: '驛馬殺', type: 'hyungsal', position: positions[i] });
    }

    // 천을귀인 (일간 기준)
    if (isCheonulGwiin(dayStem, branch)) {
      results.push({ name: '천을귀인', nameHanja: '天乙貴人', type: 'gilseong', position: positions[i] });
    }

    // 태극귀인 (일간 기준)
    if (isTaegeukGwiin(dayStem, branch)) {
      results.push({ name: '태극귀인', nameHanja: '太極貴人', type: 'gilseong', position: positions[i] });
    }

    // 천문성
    if (isCheonmunseong(branch)) {
      results.push({ name: '천문성', nameHanja: '天門星', type: 'gilseong', position: positions[i] });
    }

    // 문곡귀인 (일간 기준)
    if (isMungokGwiin(dayStem, branch)) {
      results.push({ name: '문곡귀인', nameHanja: '文曲貴人', type: 'gilseong', position: positions[i] });
    }

    // 정록 (일간 기준)
    if (isJeongrok(dayStem, branch)) {
      results.push({ name: '정록', nameHanja: '正祿', type: 'gilseong', position: positions[i] });
    }
  });

  return results;
}
