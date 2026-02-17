/**
 * 천간(天干)·지지(地支) 기초 데이터
 *
 * 사주팔자 분석에 필요한 모든 기초 상수 및 매핑을 제공합니다.
 */

// ============================================================
// 천간 (天干, Heavenly Stems)
// ============================================================

/** 천간 한글 배열 (index 0~9) */
export const STEMS = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'] as const;

/** 천간 한자 배열 */
export const STEMS_HANJA = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const;

/** 오행 타입 */
export type FiveElement = '목' | '화' | '토' | '금' | '수';

/** 오행 한자 매핑 */
export const ELEMENT_HANJA: Record<FiveElement, string> = {
  목: '木',
  화: '火',
  토: '土',
  금: '金',
  수: '水',
};

/** 오행 영문 매핑 */
export const ELEMENT_ENGLISH: Record<FiveElement, string> = {
  목: 'wood',
  화: 'fire',
  토: 'earth',
  금: 'metal',
  수: 'water',
};

/** 천간 → 오행 매핑 (갑을=목, 병정=화, 무기=토, 경신=금, 임계=수) */
export const STEM_ELEMENT: readonly FiveElement[] = [
  '목',
  '목',
  '화',
  '화',
  '토',
  '토',
  '금',
  '금',
  '수',
  '수',
] as const;

/** 천간 → 음양 매핑 (짝수 index=양, 홀수=음) */
export const STEM_YINYANG: readonly ('양' | '음')[] = [
  '양',
  '음',
  '양',
  '음',
  '양',
  '음',
  '양',
  '음',
  '양',
  '음',
] as const;

/** 천간 인덱스 조회 */
export function stemIndex(stem: string): number {
  const idx = STEMS.indexOf(stem as (typeof STEMS)[number]);
  if (idx === -1) throw new Error(`Invalid stem: ${stem}`);
  return idx;
}

// ============================================================
// 지지 (地支, Earthly Branches)
// ============================================================

/** 지지 한글 배열 (index 0~11) */
export const BRANCHES = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'] as const;

/** 지지 한자 배열 */
export const BRANCHES_HANJA = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;

/** 12지지 동물 (띠) */
export const BRANCH_ANIMALS = [
  '쥐',
  '소',
  '호랑이',
  '토끼',
  '용',
  '뱀',
  '말',
  '양',
  '원숭이',
  '닭',
  '개',
  '돼지',
] as const;

/** 지지 → 오행 매핑 */
export const BRANCH_ELEMENT: readonly FiveElement[] = [
  '수',
  '토',
  '목',
  '목',
  '토',
  '화',
  '화',
  '토',
  '금',
  '금',
  '토',
  '수',
] as const;

/** 지지 → 음양 매핑 */
export const BRANCH_YINYANG: readonly ('양' | '음')[] = [
  '양',
  '음',
  '양',
  '음',
  '양',
  '음',
  '양',
  '음',
  '양',
  '음',
  '양',
  '음',
] as const;

/** 지지 인덱스 조회 */
export function branchIndex(branch: string): number {
  const idx = BRANCHES.indexOf(branch as (typeof BRANCHES)[number]);
  if (idx === -1) throw new Error(`Invalid branch: ${branch}`);
  return idx;
}

// ============================================================
// 오행 상생·상극 관계
// ============================================================

/** 오행 상생 (生): 목→화→토→금→수→목 */
export const ELEMENT_GENERATES: Record<FiveElement, FiveElement> = {
  목: '화',
  화: '토',
  토: '금',
  금: '수',
  수: '목',
};

/** 오행 상극 (剋): 목→토→수→화→금→목 */
export const ELEMENT_CONTROLS: Record<FiveElement, FiveElement> = {
  목: '토',
  화: '금',
  토: '수',
  금: '목',
  수: '화',
};

/** A가 B를 생하는지 */
export function generates(a: FiveElement, b: FiveElement): boolean {
  return ELEMENT_GENERATES[a] === b;
}

/** A가 B를 극하는지 */
export function controls(a: FiveElement, b: FiveElement): boolean {
  return ELEMENT_CONTROLS[a] === b;
}

// ============================================================
// 십성 (十神, Ten Gods)
// ============================================================

/** 십성 이름 */
export type TenGod = '비견' | '겁재' | '식신' | '상관' | '편재' | '정재' | '편관' | '정관' | '편인' | '정인';

/** 십성 한자 */
export const TEN_GOD_HANJA: Record<TenGod, string> = {
  비견: '比肩',
  겁재: '劫財',
  식신: '食神',
  상관: '傷官',
  편재: '偏財',
  정재: '正財',
  편관: '偏官',
  정관: '正官',
  편인: '偏印',
  정인: '正印',
};

// ============================================================
// 12운성 (十二運星, Twelve Growth Stages)
// ============================================================

/** 12운성 이름 배열 (순서: 장생부터) */
export const TWELVE_STATES = [
  '장생',
  '목욕',
  '관대',
  '건록',
  '제왕',
  '쇠',
  '병',
  '사',
  '묘',
  '절',
  '태',
  '양',
] as const;

/** 12운성 한자 */
export const TWELVE_STATES_HANJA = [
  '長生',
  '沐浴',
  '冠帶',
  '建祿',
  '帝旺',
  '衰',
  '病',
  '死',
  '墓',
  '絶',
  '胎',
  '養',
] as const;

export type TwelveState = (typeof TWELVE_STATES)[number];

// ============================================================
// 유틸리티
// ============================================================

/**
 * 사주 기둥(pillar) 문자열에서 천간/지지 분리
 * @param pillar 예: "갑자", "을축"
 * @returns [천간, 지지]
 */
export function splitPillar(pillar: string): [string, string] {
  if (pillar.length !== 2) throw new Error(`Invalid pillar: ${pillar}`);
  return [pillar[0], pillar[1]];
}

/**
 * 천간/지지 인덱스로 기둥 문자열 생성
 */
export function makePillar(stemIdx: number, branchIdx: number): string {
  return STEMS[stemIdx % 10] + BRANCHES[branchIdx % 12];
}

/**
 * 천간/지지 인덱스로 한자 기둥 문자열 생성
 */
export function makePillarHanja(stemIdx: number, branchIdx: number): string {
  return STEMS_HANJA[stemIdx % 10] + BRANCHES_HANJA[branchIdx % 12];
}
