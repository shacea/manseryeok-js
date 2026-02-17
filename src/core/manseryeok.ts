/**
 * 통합 만세력(萬歲曆) 분석 함수
 *
 * 사주팔자를 기반으로 모든 분석 결과를 한 번에 계산합니다.
 *
 * 포함 분석:
 * - 사주팔자 (년주, 월주, 일주, 시주)
 * - 십성 (천간/지지)
 * - 지장간
 * - 12운성
 * - 12신살
 * - 신살/길성
 * - 합충형파해, 공망
 * - 오행/십성 비율 분석
 * - 신강/신약 판정
 * - 용신
 * - 대운
 * - 궁성/육친
 */

import { calculateSaju, type SajuResult, type SajuOptions } from './saju';
import { splitPillar, stemIndex, branchIndex } from '../data/stem-branch-data';
import { calculateAllTenGods, getAllTenGodsByBranch } from './ten-gods';
import { getHiddenStems, getHiddenStemsString, getHiddenStemsHanjaString } from './hidden-stems';
import { calculateAllTwelveStates, calculateGeobeop12States } from './twelve-states';
import { calculateAllTwelveSpirits } from './twelve-spirits';
import { analyzeSpecialStars, type SpecialStarResult } from './special-stars';
import { analyzeRelations, type PillarRelations } from './relations';
import {
  analyzeFiveElements,
  analyzeTenGods,
  type FiveElementAnalysis,
  type TenGodAnalysis,
} from './five-elements-analysis';
import { calculateBodyStrength, type BodyStrengthResult } from './body-strength';
import { determineUsefulGod, type UsefulGodResult } from './useful-god';
import { calculateMajorFortune, type MajorFortuneResult } from './major-fortune';
import { getPalaces, analyzeSixRelations, type PalaceInfo, type SixRelation } from './palace';
import { calculateAnnualFortune, type AnnualFortune } from './annual-fortune';
import { calculateMonthlyFortune, type MonthlyFortune } from './monthly-fortune';
import { calculateDailyFortune, type DailyFortune } from './daily-fortune';

import type { TenGod, TwelveState } from '../data/stem-branch-data';

// ============================================================
// 통합 결과 타입
// ============================================================

/**
 * 통합 만세력 분석 결과
 */
export interface ManseryeokResult {
  /** 사주팔자 기본 정보 */
  saju: SajuResult;

  /** 사주 기둥 분해 */
  pillars: {
    year: { stem: string; branch: string };
    month: { stem: string; branch: string };
    day: { stem: string; branch: string };
    hour: { stem: string; branch: string } | null;
  };

  tenGods: {
    stem: { year: TenGod; month: TenGod; day: '비견'; hour: TenGod | null };
    branch: { year: TenGod; month: TenGod; day: TenGod; hour: TenGod | null };
    branchAll: { year: TenGod[]; month: TenGod[]; day: TenGod[]; hour: TenGod[] | null };
  };

  /** 지장간 */
  hiddenStems: {
    year: { stems: readonly string[]; string: string; hanjaString: string };
    month: { stems: readonly string[]; string: string; hanjaString: string };
    day: { stems: readonly string[]; string: string; hanjaString: string };
    hour: { stems: readonly string[]; string: string; hanjaString: string } | null;
  };

  twelveStates: {
    year: TwelveState;
    month: TwelveState;
    day: TwelveState;
    hour: TwelveState | null;
  };

  twelveStatesGeobeop: {
    year: TwelveState;
    month: TwelveState;
    day: TwelveState;
    hour: TwelveState | null;
  };

  /** 12신살 (년지 기준) */
  twelveSpirits: {
    year: string | null;
    month: string | null;
    day: string | null;
    hour: string | null;
  };

  /** 신살/길성 */
  specialStars: SpecialStarResult[];

  /** 합충형파해, 공망 */
  relations: PillarRelations;

  /** 오행 비율 분석 */
  fiveElements: FiveElementAnalysis;

  /** 십성 비율 분석 */
  tenGodAnalysis: TenGodAnalysis;

  /** 신강/신약 판정 */
  bodyStrength: BodyStrengthResult;

  /** 용신 */
  usefulGod: UsefulGodResult;

  majorFortune: MajorFortuneResult | null;

  annualFortune: AnnualFortune[] | null;

  monthlyFortune: MonthlyFortune[] | null;

  dailyFortune: DailyFortune[] | null;

  /** 궁성 */
  palaces: {
    year: PalaceInfo;
    month: PalaceInfo;
    day: PalaceInfo;
    hour: PalaceInfo;
  };

  /** 육친 (성별 필요) */
  sixRelations: {
    stem: { year: SixRelation; month: SixRelation; day: '자기자신'; hour: SixRelation | null };
    branch: { year: SixRelation; month: SixRelation; day: SixRelation; hour: SixRelation | null };
  } | null;
}

/**
 * 통합 만세력 분석 옵션
 */
export interface ManseryeokOptions extends SajuOptions {
  /** 남성 여부 (대운/육친에 필요, null이면 대운/육친 미계산) */
  isMale?: boolean | null;
  /** 대운 개수 (기본값: 10) */
  fortuneCount?: number;
}

// ============================================================
// 통합 계산 함수
// ============================================================

/**
 * 통합 만세력 분석을 수행합니다.
 *
 * @param solarYear 양력 년
 * @param solarMonth 양력 월 (1~12)
 * @param solarDay 양력 일 (1~31)
 * @param solarHour 양력 시 (0~23, 선택)
 * @param solarMinute 양력 분 (0~59, 기본값: 0)
 * @param options 옵션 (경도, 시간보정, 성별 등)
 * @returns 통합 만세력 분석 결과
 */
export function calculateManseryeok(
  solarYear: number,
  solarMonth: number,
  solarDay: number,
  solarHour?: number,
  solarMinute: number = 0,
  options: ManseryeokOptions = {},
): ManseryeokResult {
  const { isMale = null, fortuneCount = 10, ...sajuOptions } = options;

  // 1. 사주팔자 계산
  const saju = calculateSaju(solarYear, solarMonth, solarDay, solarHour, solarMinute, sajuOptions);

  // 2. 기둥 분해
  const [yearStem, yearBranch] = splitPillar(saju.yearPillar);
  const [monthStem, monthBranch] = splitPillar(saju.monthPillar);
  const [dayStem, dayBranch] = splitPillar(saju.dayPillar);

  let hourStem: string | null = null;
  let hourBranch: string | null = null;
  if (saju.hourPillar) {
    [hourStem, hourBranch] = splitPillar(saju.hourPillar);
  }

  const pillars = {
    year: { stem: yearStem, branch: yearBranch },
    month: { stem: monthStem, branch: monthBranch },
    day: { stem: dayStem, branch: dayBranch },
    hour: hourStem && hourBranch ? { stem: hourStem, branch: hourBranch } : null,
  };

  // 3. 십성
  const tenGods = calculateAllTenGods(
    dayStem,
    yearStem,
    monthStem,
    hourStem,
    yearBranch,
    monthBranch,
    dayBranch,
    hourBranch,
  );

  const branchAll = {
    year: getAllTenGodsByBranch(dayStem, yearBranch),
    month: getAllTenGodsByBranch(dayStem, monthBranch),
    day: getAllTenGodsByBranch(dayStem, dayBranch),
    hour: hourBranch ? getAllTenGodsByBranch(dayStem, hourBranch) : null,
  };

  // 4. 지장간
  const hiddenStems = {
    year: {
      stems: getHiddenStems(yearBranch),
      string: getHiddenStemsString(yearBranch),
      hanjaString: getHiddenStemsHanjaString(yearBranch),
    },
    month: {
      stems: getHiddenStems(monthBranch),
      string: getHiddenStemsString(monthBranch),
      hanjaString: getHiddenStemsHanjaString(monthBranch),
    },
    day: {
      stems: getHiddenStems(dayBranch),
      string: getHiddenStemsString(dayBranch),
      hanjaString: getHiddenStemsHanjaString(dayBranch),
    },
    hour: hourBranch
      ? {
          stems: getHiddenStems(hourBranch),
          string: getHiddenStemsString(hourBranch),
          hanjaString: getHiddenStemsHanjaString(hourBranch),
        }
      : null,
  };

  // 5-1. 12운성 (봉법 — 일간 기준)
  const twelveStates = calculateAllTwelveStates(dayStem, yearBranch, monthBranch, dayBranch, hourBranch);

  // 5-2. 12운성 (거법 — 각 기둥 천간 기준)
  const twelveStatesGeobeop = calculateGeobeop12States(
    yearStem,
    yearBranch,
    monthStem,
    monthBranch,
    dayStem,
    dayBranch,
    hourStem,
    hourBranch,
  );

  // 6. 12신살
  const twelveSpirits = calculateAllTwelveSpirits(yearBranch, monthBranch, dayBranch, hourBranch);

  // 7. 신살/길성
  const specialStars = analyzeSpecialStars(
    yearStem,
    monthStem,
    dayStem,
    hourStem,
    yearBranch,
    monthBranch,
    dayBranch,
    hourBranch,
  );

  // 8. 합충형파해, 공망
  const relations = analyzeRelations(
    yearStem,
    monthStem,
    dayStem,
    hourStem,
    yearBranch,
    monthBranch,
    dayBranch,
    hourBranch,
  );

  // 9. 오행 비율 분석
  const fiveElements = analyzeFiveElements(
    yearStem,
    monthStem,
    dayStem,
    hourStem,
    yearBranch,
    monthBranch,
    dayBranch,
    hourBranch,
  );

  // 10. 십성 비율 분석
  const tenGodAnalysis = analyzeTenGods(
    dayStem,
    yearStem,
    monthStem,
    hourStem,
    yearBranch,
    monthBranch,
    dayBranch,
    hourBranch,
  );

  // 11. 신강/신약
  const bodyStrengthBase = calculateBodyStrength(
    yearStem,
    monthStem,
    dayStem,
    hourStem,
    yearBranch,
    monthBranch,
    dayBranch,
    hourBranch,
  );
  const bodyStrength = bodyStrengthBase;

  // 12. 용신
  const usefulGod = determineUsefulGod(dayStem, bodyStrengthBase);

  // 13. 대운 (성별 필요)
  let majorFortune: MajorFortuneResult | null = null;
  if (isMale !== null && isMale !== undefined) {
    const monthStemIdx = stemIndex(monthStem);
    const monthBranchIdx = branchIndex(monthBranch);

    // 시간 보정 적용된 시간 사용
    const effectiveHour = saju.correctedTime?.hour ?? solarHour ?? 0;
    const effectiveMinute = saju.correctedTime?.minute ?? solarMinute;

    majorFortune = calculateMajorFortune(
      isMale,
      solarYear,
      solarMonth,
      solarDay,
      effectiveHour,
      effectiveMinute,
      monthStemIdx,
      monthBranchIdx,
      yearStem,
      fortuneCount,
      dayStem,
      yearBranch,
    );
  }

  // 14. 궁성
  const palaces = getPalaces();

  // 15. 육친 (성별 필요)
  let sixRelations: ManseryeokResult['sixRelations'] = null;
  if (isMale !== null && isMale !== undefined) {
    sixRelations = analyzeSixRelations(
      { year: tenGods.stem.year, month: tenGods.stem.month, hour: tenGods.stem.hour },
      { year: tenGods.branch.year, month: tenGods.branch.month, day: tenGods.branch.day, hour: tenGods.branch.hour },
      isMale,
    );
  }

  // 16. 세운 (현재 연도 기준 ±5년)
  const currentYear = new Date().getFullYear();
  const annualFortune = calculateAnnualFortune(dayStem, yearBranch, currentYear, 10);

  // 17. 월운 (현재 연도 기준)
  const monthlyFortune = calculateMonthlyFortune(dayStem, yearBranch, currentYear);

  // 18. 일운 (현재 월 기준)
  const currentMonth = new Date().getMonth() + 1;
  const dailyFortune = calculateDailyFortune(dayStem, yearBranch, currentYear, currentMonth);

  return {
    saju,
    pillars,
    tenGods: {
      ...tenGods,
      branchAll,
    },
    hiddenStems,
    twelveStates,
    twelveStatesGeobeop,
    twelveSpirits,
    specialStars,
    relations,
    fiveElements,
    tenGodAnalysis,
    bodyStrength,
    usefulGod,
    majorFortune,
    annualFortune,
    monthlyFortune,
    dailyFortune,
    palaces,
    sixRelations,
  };
}
