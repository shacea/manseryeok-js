/**
 * 12운성(十二運星) 계산 모듈
 *
 * 일간(日干)을 기준으로 각 지지(地支)에서의 12운성을 계산합니다.
 *
 * 12운성 순서: 장생 → 목욕 → 관대 → 건록 → 제왕 → 쇠 → 병 → 사 → 묘 → 절 → 태 → 양
 *
 * 양간(甲丙戊庚壬)은 순행, 음간(乙丁己辛癸)은 역행합니다.
 */

import { stemIndex, branchIndex, type TwelveState, TWELVE_STATES } from '../data/stem-branch-data';

/**
 * 각 천간별 장생(長生) 시작 지지 인덱스
 *
 * 양간 (순행):
 * - 갑(甲, 양목): 장생=해(亥, 11)
 * - 병(丙, 양화): 장생=인(寅, 2)
 * - 무(戊, 양토): 장생=인(寅, 2)  (병과 동일)
 * - 경(庚, 양금): 장생=사(巳, 5)
 * - 임(壬, 양수): 장생=신(申, 8)
 *
 * 음간 (역행):
 * - 을(乙, 음목): 장생=오(午, 6)
 * - 정(丁, 음화): 장생=유(酉, 9)
 * - 기(己, 음토): 장생=유(酉, 9)  (정과 동일)
 * - 신(辛, 음금): 장생=자(子, 0)
 * - 계(癸, 음수): 장생=묘(卯, 3)
 */
const CHANGSHENG_START: readonly number[] = [
  11, // 갑(甲): 해(亥)
  6, // 을(乙): 오(午)
  2, // 병(丙): 인(寅)
  9, // 정(丁): 유(酉)
  2, // 무(戊): 인(寅)
  9, // 기(己): 유(酉)
  5, // 경(庚): 사(巳)
  0, // 신(辛): 자(子)
  8, // 임(壬): 신(申)
  3, // 계(癸): 묘(卯)
] as const;

/**
 * 일간과 지지로 12운성을 계산합니다.
 *
 * @param dayStem 일간 (갑, 을, 병, ...)
 * @param branch 지지 (자, 축, 인, ...)
 * @returns 12운성 이름
 */
export function getTwelveState(dayStem: string, branch: string): TwelveState {
  const sIdx = stemIndex(dayStem);
  const bIdx = branchIndex(branch);
  const isYang = sIdx % 2 === 0; // 양간

  const start = CHANGSHENG_START[sIdx];

  let offset: number;
  if (isYang) {
    // 양간: 순행 (지지 인덱스 증가 방향)
    offset = (bIdx - start + 12) % 12;
  } else {
    // 음간: 역행 (지지 인덱스 감소 방향)
    offset = (start - bIdx + 12) % 12;
  }

  return TWELVE_STATES[offset];
}

/**
 * 일간의 전체 12운성 표를 반환합니다.
 *
 * @param dayStem 일간
 * @returns 지지별 12운성 맵
 */
export function getAllTwelveStates(dayStem: string): Record<string, TwelveState> {
  const branches = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
  const result: Record<string, TwelveState> = {};

  for (const branch of branches) {
    result[branch] = getTwelveState(dayStem, branch);
  }

  return result;
}

/**
 * 거법(去法) 12운성: 각 기둥의 천간을 기준으로 자신의 지지에서 12운성을 계산합니다.
 * (봉법은 일간 기준, 거법은 각 기둥 천간 기준)
 */
export function calculateGeobeop12States(
  yearStem: string,
  yearBranch: string,
  monthStem: string,
  monthBranch: string,
  dayStem: string,
  dayBranch: string,
  hourStem: string | null,
  hourBranch: string | null,
): {
  year: TwelveState;
  month: TwelveState;
  day: TwelveState;
  hour: TwelveState | null;
} {
  return {
    year: getTwelveState(yearStem, yearBranch),
    month: getTwelveState(monthStem, monthBranch),
    day: getTwelveState(dayStem, dayBranch),
    hour: hourStem && hourBranch ? getTwelveState(hourStem, hourBranch) : null,
  };
}

/**
 * 사주 전체의 12운성을 계산합니다. (봉법 — 일간 기준)
 */
export function calculateAllTwelveStates(
  dayStem: string,
  yearBranch: string,
  monthBranch: string,
  dayBranch: string,
  hourBranch: string | null,
): {
  year: TwelveState;
  month: TwelveState;
  day: TwelveState;
  hour: TwelveState | null;
} {
  return {
    year: getTwelveState(dayStem, yearBranch),
    month: getTwelveState(dayStem, monthBranch),
    day: getTwelveState(dayStem, dayBranch),
    hour: hourBranch ? getTwelveState(dayStem, hourBranch) : null,
  };
}
