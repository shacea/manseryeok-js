/**
 * 궁성(宮星) 및 육친(六親) 매핑 모듈
 *
 * 사주의 네 기둥(年柱·月柱·日柱·時柱)은 각각 인생의 특정 영역을 상징합니다.
 *
 * 궁성 구조:
 * ┌─────────┬──────────────────────────────────────┐
 * │ 시주(時) │ 자녀운, 결실, 노년기 (49세~)          │
 * │ 일주(日) │ 정체성, 자아, 배우자, 중년기 (36~48세)  │
 * │ 월주(月) │ 부모/사회운, 청년기 (18~35세)           │
 * │ 년주(年) │ 조상운, 시대상, 유년기 (~17세)          │
 * └─────────┴──────────────────────────────────────┘
 *
 * 육친 매핑:
 * 남성 기준 (일간 기준 십성):
 * - 비견/겁재 = 형제
 * - 정재 = 아내
 * - 편관 = 아들
 * - 정관 = 딸
 * - 편인 = 편모/계모
 * - 정인 = 어머니
 * - 편재 = 아버지
 * - 식신 = 장모
 * - 상관 = 조모
 *
 * 여성 기준 (일간 기준 십성):
 * - 비견/겁재 = 형제/자매
 * - 정관 = 남편
 * - 편관 = 연인/내연남
 * - 식신 = 아들
 * - 상관 = 딸
 * - 정인 = 어머니
 * - 편인 = 편모/계모
 * - 편재 = 아버지
 * - 정재 = 시어머니
 */

import type { TenGod } from '../data/stem-branch-data';

// ============================================================
// 궁성 (宮星)
// ============================================================

/**
 * 궁성 정보
 */
export interface PalaceInfo {
  /** 궁성 이름 */
  name: string;
  /** 궁성 설명 */
  description: string;
  /** 해당 인생 시기 */
  period: string;
  /** 나이 범위 */
  ageRange: string;
}

/**
 * 사주 네 기둥의 궁성 정보를 반환합니다.
 */
export function getPalaces(): {
  year: PalaceInfo;
  month: PalaceInfo;
  day: PalaceInfo;
  hour: PalaceInfo;
} {
  return {
    year: {
      name: '년주(年柱)',
      description: '조상궁 - 조상/시대/뿌리',
      period: '유년기',
      ageRange: '0~17세',
    },
    month: {
      name: '월주(月柱)',
      description: '부모궁/사회궁 - 부모/사회운/직업',
      period: '청년기',
      ageRange: '18~35세',
    },
    day: {
      name: '일주(日柱)',
      description: '자아궁/배우자궁 - 정체성/배우자',
      period: '중년기',
      ageRange: '36~48세',
    },
    hour: {
      name: '시주(時柱)',
      description: '자녀궁/결실궁 - 자녀/노후/결실',
      period: '노년기',
      ageRange: '49세~',
    },
  };
}

// ============================================================
// 육친 (六親) 매핑
// ============================================================

/**
 * 육친 이름
 */
export type SixRelation =
  | '형제' | '자매'
  | '아버지' | '어머니' | '편모'
  | '아내' | '남편'
  | '아들' | '딸'
  | '연인' | '시어머니' | '장모' | '조모'
  | '조부' | '조모(부)'
  | '자기자신';

/**
 * 남성 기준 십성 → 육친 매핑
 */
const MALE_RELATION_MAP: Record<TenGod, SixRelation> = {
  비견: '형제',
  겁재: '형제',
  식신: '장모',
  상관: '조모',
  편재: '아버지',
  정재: '아내',
  편관: '아들',
  정관: '딸',
  편인: '편모',
  정인: '어머니',
};

/**
 * 여성 기준 십성 → 육친 매핑
 */
const FEMALE_RELATION_MAP: Record<TenGod, SixRelation> = {
  비견: '자매',
  겁재: '자매',
  식신: '아들',
  상관: '딸',
  편재: '아버지',
  정재: '시어머니',
  편관: '연인',
  정관: '남편',
  편인: '편모',
  정인: '어머니',
};

/**
 * 십성으로부터 육친을 결정합니다.
 *
 * @param tenGod 십성
 * @param isMale 남성 여부
 * @returns 육친 이름
 */
export function getSixRelation(tenGod: TenGod, isMale: boolean): SixRelation {
  return isMale ? MALE_RELATION_MAP[tenGod] : FEMALE_RELATION_MAP[tenGod];
}

/**
 * 사주 전체의 육친을 분석합니다.
 *
 * @param stemTenGods 천간 십성 {year, month, hour}
 * @param branchTenGods 지지 십성 {year, month, day, hour}
 * @param isMale 남성 여부
 */
export function analyzeSixRelations(
  stemTenGods: { year: TenGod; month: TenGod; hour: TenGod | null },
  branchTenGods: { year: TenGod; month: TenGod; day: TenGod; hour: TenGod | null },
  isMale: boolean
): {
  stem: { year: SixRelation; month: SixRelation; day: '자기자신'; hour: SixRelation | null };
  branch: { year: SixRelation; month: SixRelation; day: SixRelation; hour: SixRelation | null };
} {
  return {
    stem: {
      year: getSixRelation(stemTenGods.year, isMale),
      month: getSixRelation(stemTenGods.month, isMale),
      day: '자기자신',
      hour: stemTenGods.hour ? getSixRelation(stemTenGods.hour, isMale) : null,
    },
    branch: {
      year: getSixRelation(branchTenGods.year, isMale),
      month: getSixRelation(branchTenGods.month, isMale),
      day: getSixRelation(branchTenGods.day, isMale),
      hour: branchTenGods.hour ? getSixRelation(branchTenGods.hour, isMale) : null,
    },
  };
}
