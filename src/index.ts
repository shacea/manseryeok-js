/**
 * @fullstackfamily/manseryeok
 *
 * Korean Lunar Calendar (만세력) JavaScript Library
 *
 * @description
 * 1900년 ~ 2050년 한국 음력 데이터를 제공하는 순수 JavaScript 라이브러리입니다.
 * DB 없이 동작하며, 빠른 조회 성능과 완전한 TypeScript 지원을 제공합니다.
 *
 * @example
 * ```ts
 * import { solarToLunar, getGapja } from '@fullstackfamily/manseryeok';
 *
 * // 양력 → 음력 변환
 * const lunar = solarToLunar(2024, 2, 10);
 * console.log(lunar.lunar);
 * // { year: 2024, month: 1, day: 1, isLeapMonth: false }
 *
 * // 갑자 계산
 * const gapja = getGapja(1984, 2, 2);
 * console.log(gapja.yearPillar); // '갑자'
 * ```
 *
 * @license MIT
 * @author fullstackfamily
 * @copyright 2026
 */

// ============================================
// Types
// ============================================
export * from './types';

// ============================================
// Utility Functions
// ============================================
export { isSupportedYear, getSupportedRange } from './utils/range';

// ============================================
// Core Functions
// ============================================
export { solarToLunar, lunarToSolar, getGapja } from './core/solar-lunar-converter';

// ============================================
// Saju (사주팔자)
// ============================================
export {
  calculateSaju,
  calculateSajuSimple,
  type SajuResult,
  type SajuOptions,
} from './core/saju';

// ============================================
// Solar Terms (절기)
// ============================================
export {
  getAllSolarTerms,
  getSolarTermInfoByIndex,
  getSolarTermInfoByName,
  getSolarTermsBySajuMonth,
  getSolarTermsByYear,
  getSolarTermForDate,
  getSolarTermsByMonth,
  getSupportedSolarTermYears,
  getSajuMonth,
  isBeforeLichun,
} from './core/solar-term';
export { SOLAR_TERM_NAMES } from './data/solar-terms';
export { SOLAR_TERMS_DATA, SUPPORTED_SOLAR_TERM_YEARS } from './data/solar-terms-data';
export type { SolarTermWithDate } from './core/solar-term';

// ============================================
// Data Access (for advanced usage)
// ============================================
export { SIXTY_PILLARS, getPillarById, getPillarByHangul } from './data/sixty-pillars';
export { SOLAR_TO_LUNAR_INDEX, getMonthlyIndex } from './data/date-index';

// ============================================
// Body Strength (신강/신약)
// ============================================
export {
  calculateBodyStrength,
  calculateElementScores,
  calculateStemScores,
  getBodyStrengthLevel,
  HIDDEN_STEM_SCORES,
  type BodyStrengthResult,
  type BodyStrengthLevel,
} from './core/body-strength';

// ============================================
// Major Fortune (대운수)
// ============================================
export {
  calculateMajorFortune,
  getCurrentFortune,
  type MajorFortune,
  type MajorFortuneResult,
} from './core/major-fortune';

// ============================================
// Useful God (용신)
// ============================================
export {
  determineUsefulGod,
  getElementGroup,
  getElementGroupMap,
  classifyElement,
  type UsefulGodResult,
  type TenGodGroup,
  type GodType,
} from './core/useful-god';

// ============================================
// Ten Gods (십성)
// ============================================
export {
  getTenGodByStem,
  getTenGodByBranch,
  calculateAllTenGods,
} from './core/ten-gods';

// ============================================
// Twelve States (12운성)
// ============================================
export {
  getTwelveState,
  getAllTwelveStates,
  calculateAllTwelveStates,
} from './core/twelve-states';

// ============================================
// Hidden Stems (지장간)
// ============================================
export {
  getHiddenStems,
  getMainStem,
  getHiddenStemsString,
  getHiddenStemsHanjaString,
  HIDDEN_STEMS,
  HIDDEN_STEMS_HANJA,
} from './core/hidden-stems';

// ============================================
// Relations (합충형파해/공망)
// ============================================
export {
  getStemHarmony,
  isStemClash,
  getBranchSixHarmony,
  getBranchTripleHarmony,
  findTripleHarmonies,
  getBranchDirectionalHarmony,
  isBranchClash,
  isBranchPunishment,
  isBranchDestruction,
  isBranchHarm,
  getGongmang,
  analyzeRelations,
  type PillarRelations,
} from './core/relations';

// ============================================
// Twelve Spirits (12신살)
// ============================================
export {
  getTwelveSpirit,
  calculateAllTwelveSpirits,
  TWELVE_SPIRIT_NAMES,
  type TwelveSpirit,
} from './core/twelve-spirits';

// ============================================
// Special Stars (신살/길성)
// ============================================
export {
  isDohwaSal,
  isHwagaeSal,
  isYeokmaSal,
  isCheonulGwiin,
  isHyeonchimSal,
  isTaegeukGwiin,
  isCheonmunseong,
  isMungokGwiin,
  isJeongrok,
  analyzeSpecialStars,
  type SpecialStarResult,
} from './core/special-stars';

// ============================================
// Five Elements Analysis (오행/십성 비율)
// ============================================
export {
  analyzeFiveElements,
  analyzeTenGods,
  type FiveElementAnalysis,
  type TenGodAnalysis,
  type ElementLevel,
} from './core/five-elements-analysis';

// ============================================
// Palace (궁성/육친)
// ============================================
export {
  getPalaces,
  getSixRelation,
  analyzeSixRelations,
  type PalaceInfo,
  type SixRelation,
} from './core/palace';

// ============================================
// Integrated Manseryeok (통합 만세력)
// ============================================
export {
  calculateManseryeok,
  type ManseryeokResult,
  type ManseryeokOptions,
} from './core/manseryeok';

// ============================================
// Stem-Branch Data (천간/지지 기초 데이터)
// ============================================
export {
  STEMS,
  STEMS_HANJA,
  BRANCHES,
  BRANCHES_HANJA,
  BRANCH_ANIMALS,
  STEM_ELEMENT,
  STEM_YINYANG,
  BRANCH_ELEMENT,
  BRANCH_YINYANG,
  ELEMENT_HANJA,
  ELEMENT_ENGLISH,
  ELEMENT_GENERATES,
  ELEMENT_CONTROLS,
  generates,
  controls,
  stemIndex,
  branchIndex,
  splitPillar,
  makePillar,
  makePillarHanja,
  TWELVE_STATES,
  TWELVE_STATES_HANJA,
  TEN_GOD_HANJA,
  type FiveElement,
  type TenGod,
  type TwelveState,
} from './data/stem-branch-data';
