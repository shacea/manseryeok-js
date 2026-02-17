/**
 * 신살(神殺)과 길성(吉星) 모듈
 *
 * PDF에 표시된 신살: 현침살, 천을귀인, 도화살, 태극귀인, 화개살, 천문성, 문곡귀인, 정록
 */

import {
  stemIndex,
  branchIndex,
  STEM_ELEMENT,
  STEM_YINYANG,
  BRANCH_ELEMENT,
  BRANCH_YINYANG,
} from '../data/stem-branch-data';

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
// 천덕귀인 (天德貴人)
// ============================================================

/**
 * 천덕귀인: 월지 기준
 * 인=정, 묘=신, 진=임, 사=경, 오=갑, 미=계, 신=임, 유=경, 술=병, 해=을, 자=기, 축=경
 */
const CHEONDEOK_TABLE: readonly number[] = [
  5, // 자 → 기
  6, // 축 → 경
  3, // 인 → 정
  7, // 묘 → 신
  8, // 진 → 임
  6, // 사 → 경
  0, // 오 → 갑
  9, // 미 → 계
  8, // 신 → 임
  6, // 유 → 경
  2, // 술 → 병
  1, // 해 → 을
];

export function isCheondeokGwiin(monthBranch: string, targetStem: string): boolean {
  const monthIdx = branchIndex(monthBranch);
  const stemIdx = stemIndex(targetStem);
  return CHEONDEOK_TABLE[monthIdx] === stemIdx;
}

// ============================================================
// 월덕귀인 (月德貴人)
// ============================================================

/**
 * 월덕귀인: 월지 기준
 * 인=병, 묘=갑, 진=임, 사=경, 오=병, 미=갑, 신=임, 유=경, 술=병, 해=갑, 자=임, 축=경
 */
const WOLDEOK_TABLE: readonly number[] = [
  8, // 자 → 임
  6, // 축 → 경
  2, // 인 → 병
  0, // 묘 → 갑
  8, // 진 → 임
  6, // 사 → 경
  2, // 오 → 병
  0, // 미 → 갑
  8, // 신 → 임
  6, // 유 → 경
  2, // 술 → 병
  0, // 해 → 갑
];

export function isWoldeokGwiin(monthBranch: string, targetStem: string): boolean {
  const monthIdx = branchIndex(monthBranch);
  const stemIdx = stemIndex(targetStem);
  return WOLDEOK_TABLE[monthIdx] === stemIdx;
}

// ============================================================
// 장성 (將星)
// ============================================================

/**
 * 장성: 년지 또는 일지 기준
 * 신자진=자, 해묘미=묘, 인오술=오, 사유축=유
 */
const JANGSEONG_TABLE: Record<number, number> = {
  8: 0,
  0: 0,
  4: 0, // 신자진 → 자
  11: 3,
  3: 3,
  7: 3, // 해묘미 → 묘
  2: 6,
  6: 6,
  10: 6, // 인오술 → 오
  5: 9,
  9: 9,
  1: 9, // 사유축 → 유
};

export function isJangseong(baseBranch: string, targetBranch: string): boolean {
  const baseIdx = branchIndex(baseBranch);
  const targetIdx = branchIndex(targetBranch);
  return JANGSEONG_TABLE[baseIdx] === targetIdx;
}

// ============================================================
// 귀문관살 (鬼門關殺)
// ============================================================

/**
 * 귀문관살: 일지 기준
 * 자=유, 축=오, 인=미, 묘=신, 진=사, 사=해, 오=축, 미=인, 신=묘, 유=자, 술=해, 해=사
 */
const GWIMUN_GWANSAL_TABLE: readonly number[] = [
  9, // 자 → 유
  6, // 축 → 오
  7, // 인 → 미
  8, // 묘 → 신
  5, // 진 → 사
  11, // 사 → 해
  1, // 오 → 축
  2, // 미 → 인
  3, // 신 → 묘
  0, // 유 → 자
  11, // 술 → 해
  5, // 해 → 사
];

export function isGwimunGwansal(dayBranch: string, targetBranch: string): boolean {
  const dayIdx = branchIndex(dayBranch);
  const targetIdx = branchIndex(targetBranch);
  return GWIMUN_GWANSAL_TABLE[dayIdx] === targetIdx;
}

// ============================================================
// 천복귀인 (天福貴人)
// ============================================================

/**
 * 천복귀인: 일간 기준
 * 갑=해자, 을=자축, 병=축인, 정=인묘, 무=묘진, 기=진사, 경=사오, 신=오미, 임=미신, 계=신유
 */
const CHEONBOK_TABLE: readonly [number, number][] = [
  [11, 0], // 갑 → 해, 자
  [0, 1], // 을 → 자, 축
  [1, 2], // 병 → 축, 인
  [2, 3], // 정 → 인, 묘
  [3, 4], // 무 → 묘, 진
  [4, 5], // 기 → 진, 사
  [5, 6], // 경 → 사, 오
  [6, 7], // 신 → 오, 미
  [7, 8], // 임 → 미, 신
  [8, 9], // 계 → 신, 유
];

export function isCheonbokGwiin(dayStem: string, targetBranch: string): boolean {
  const dayIdx = stemIndex(dayStem);
  const targetIdx = branchIndex(targetBranch);
  return CHEONBOK_TABLE[dayIdx]?.includes(targetIdx) ?? false;
}

// ============================================================
// 천의성 (天醫星)
// ============================================================

/**
 * 천의성: 월지 기준
 * 인=축, 묘=인, 진=묘, 사=진, 오=사, 미=오, 신=미, 유=신, 술=유, 해=술, 자=해, 축=자
 */
const CHEONUI_TABLE: readonly number[] = [
  11, // 자 → 해
  0, // 축 → 자
  1, // 인 → 축
  2, // 묘 → 인
  3, // 진 → 묘
  4, // 사 → 진
  5, // 오 → 사
  6, // 미 → 오
  7, // 신 → 미
  8, // 유 → 신
  9, // 술 → 유
  10, // 해 → 술
];

export function isCheonuiSeong(monthBranch: string, targetBranch: string): boolean {
  const monthIdx = branchIndex(monthBranch);
  const targetIdx = branchIndex(targetBranch);
  return CHEONUI_TABLE[monthIdx] === targetIdx;
}

// ============================================================
// 고신 (孤辰)
// ============================================================

/**
 * 고신: 년지 기준
 * 해자축=인, 인묘진=사, 사오미=신, 신유술=해
 */
const GOSIN_TABLE: Record<number, number> = {
  11: 2,
  0: 2,
  1: 2, // 해자축 → 인
  2: 5,
  3: 5,
  4: 5, // 인묘진 → 사
  5: 8,
  6: 8,
  7: 8, // 사오미 → 신
  8: 11,
  9: 11,
  10: 11, // 신유술 → 해
};

export function isGosin(yearBranch: string, targetBranch: string): boolean {
  const yearIdx = branchIndex(yearBranch);
  const targetIdx = branchIndex(targetBranch);
  return GOSIN_TABLE[yearIdx] === targetIdx;
}

// ============================================================
// 지망 (寡宿)
// ============================================================

/**
 * 지망(과수): 년지 기준
 * 해자축=술, 인묘진=축, 사오미=진, 신유술=미
 */
const JIMANG_TABLE: Record<number, number> = {
  11: 10,
  0: 10,
  1: 10, // 해자축 → 술
  2: 1,
  3: 1,
  4: 1, // 인묘진 → 축
  5: 4,
  6: 4,
  7: 4, // 사오미 → 진
  8: 7,
  9: 7,
  10: 7, // 신유술 → 미
};

export function isJimang(yearBranch: string, targetBranch: string): boolean {
  const yearIdx = branchIndex(yearBranch);
  const targetIdx = branchIndex(targetBranch);
  return JIMANG_TABLE[yearIdx] === targetIdx;
}

// ============================================================
// 관귀학관 (官貴學館)
// ============================================================

/**
 * 관귀학관: 일간 기준
 * 갑=사, 을=오, 병=신, 정=유, 무=신, 기=유, 경=해, 신=자, 임=인, 계=묘
 */
const GWAN_GWI_HAK_GWAN_TABLE: readonly number[] = [
  5, // 갑 → 사
  6, // 을 → 오
  8, // 병 → 신
  9, // 정 → 유
  8, // 무 → 신
  9, // 기 → 유
  11, // 경 → 해
  0, // 신 → 자
  2, // 임 → 인
  3, // 계 → 묘
];

export function isGwanGwiHakGwan(dayStem: string, targetBranch: string): boolean {
  const dayIdx = stemIndex(dayStem);
  const targetIdx = branchIndex(targetBranch);
  return GWAN_GWI_HAK_GWAN_TABLE[dayIdx] === targetIdx;
}

// ============================================================
// 간여지동 (干與支同) = 간지동체
// ============================================================

/**
 * 간여지동: 천간과 지지가 오행 + 음양이 모두 같음
 * 해당 기둥: 갑인, 을묘, 병오, 정사, 무진, 무술, 기축, 기미, 경신, 신유, 임자, 계해
 */
export function isGanYeoJiDong(stem: string, branch: string): boolean {
  const stemIdx = stemIndex(stem);
  const branchIdx = branchIndex(branch);
  return STEM_ELEMENT[stemIdx] === BRANCH_ELEMENT[branchIdx] && STEM_YINYANG[stemIdx] === BRANCH_YINYANG[branchIdx];
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

    // 천덕귀인 (월지 기준)
    if (isCheondeokGwiin(monthBranch, stem)) {
      results.push({ name: '천덕귀인', nameHanja: '天德貴人', type: 'gilseong', position: positions[i] });
    }

    // 월덕귀인 (월지 기준)
    if (isWoldeokGwiin(monthBranch, stem)) {
      results.push({ name: '월덕귀인', nameHanja: '月德貴人', type: 'gilseong', position: positions[i] });
    }

    // 간여지동 (기둥 기준)
    const branch = branches[i];
    if (branch && isGanYeoJiDong(stem, branch)) {
      results.push({ name: '간여지동', nameHanja: '干與支同', type: 'gilseong', position: positions[i] });
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

    // 장성 (년지 기준)
    if (isJangseong(yearBranch, branch)) {
      results.push({ name: '장성', nameHanja: '將星', type: 'gilseong', position: positions[i] });
    }
    // 일지 기준 장성도 체크
    if (dayBranch !== yearBranch && isJangseong(dayBranch, branch)) {
      results.push({ name: '장성', nameHanja: '將星', type: 'gilseong', position: positions[i] });
    }

    // 역마살 (년지 기준)
    if (isYeokmaSal(yearBranch, branch)) {
      results.push({ name: '역마살', nameHanja: '驛馬殺', type: 'hyungsal', position: positions[i] });
    }

    // 귀문관살 (일지 기준)
    if (isGwimunGwansal(dayBranch, branch)) {
      results.push({ name: '귀문관살', nameHanja: '鬼門關殺', type: 'hyungsal', position: positions[i] });
    }

    // 고신 (년지 기준)
    if (isGosin(yearBranch, branch)) {
      results.push({ name: '고신', nameHanja: '孤辰', type: 'hyungsal', position: positions[i] });
    }

    // 지망 (년지 기준)
    if (isJimang(yearBranch, branch)) {
      results.push({ name: '지망', nameHanja: '寡宿', type: 'hyungsal', position: positions[i] });
    }

    // 천을귀인 (일간 기준)
    if (isCheonulGwiin(dayStem, branch)) {
      results.push({ name: '천을귀인', nameHanja: '天乙貴人', type: 'gilseong', position: positions[i] });
    }

    // 천복귀인 (일간 기준)
    if (isCheonbokGwiin(dayStem, branch)) {
      results.push({ name: '천복귀인', nameHanja: '天福貴人', type: 'gilseong', position: positions[i] });
    }

    // 천의성 (월지 기준)
    if (isCheonuiSeong(monthBranch, branch)) {
      results.push({ name: '천의성', nameHanja: '天醫星', type: 'gilseong', position: positions[i] });
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

    // 관귀학관 (일간 기준)
    if (isGwanGwiHakGwan(dayStem, branch)) {
      results.push({ name: '관귀학관', nameHanja: '官貴學館', type: 'gilseong', position: positions[i] });
    }
  });

  return results;
}
