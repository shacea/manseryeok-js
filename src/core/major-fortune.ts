/**
 * 대운수(大運數) 계산 모듈
 *
 * 대운(大運)의 시작 나이와 각 대운 간지를 계산합니다.
 *
 * 알고리즘 출처:
 * - rath/orrery TypeScript (⭐33): pillars.ts L401-443
 * - china-testing/bazi Python (⭐1162): bazi.py L236-254
 *
 * 핵심 공식:
 * 1. 순행/역행 결정: 양남음녀=순행, 음남양녀=역행
 * 2. 순행이면 다음 절기(節氣)까지의 일수, 역행이면 이전 절기까지의 일수
 * 3. 대운 시작 나이 = 절기까지 일수 / 3 (3일 = 1년)
 * 4. 대운은 월주(月柱)에서 순/역행으로 10년씩 진행
 *
 * 절기 데이터 없는 연도: 평균 절기 날짜로 근사 계산
 */

import { STEM_YINYANG, stemIndex, makePillar, makePillarHanja } from '../data/stem-branch-data';
import { SOLAR_TERMS_DATA } from '../data/solar-terms-data';

// ============================================================
// 절기(節氣) 평균 날짜 (데이터 없는 연도용 근사값)
// 한국 기준 평균 절기 날짜 (시각은 12:00 기본)
// ============================================================

/** 사주 월을 결정하는 12개 절기 이름 */
const JEOLGI_NAMES = ['소한', '입춘', '경칩', '청명', '입하', '망종', '소서', '입추', '백로', '한로', '입동', '대설'];

/** 절기 평균 날짜 [월, 일] */
const JEOLGI_APPROX: Record<string, [number, number]> = {
  소한: [1, 6],
  입춘: [2, 4],
  경칩: [3, 6],
  청명: [4, 5],
  입하: [5, 6],
  망종: [6, 6],
  소서: [7, 7],
  입추: [8, 7],
  백로: [9, 8],
  한로: [10, 8],
  입동: [11, 7],
  대설: [12, 7],
};

/**
 * 특정 연도의 절기 시각을 Date 객체로 반환합니다.
 * 데이터가 없으면 평균 날짜로 근사합니다.
 */
function getSolarTermDate(year: number, termName: string): Date {
  const yearData = SOLAR_TERMS_DATA[year];
  if (yearData) {
    const term = yearData.find((t) => t.name === termName);
    if (term) {
      return new Date(year, term.month - 1, term.day, term.hour, term.minute, 0, 0);
    }
  }

  // 근사값 사용
  const approx = JEOLGI_APPROX[termName];
  if (approx) {
    return new Date(year, approx[0] - 1, approx[1], 12, 0, 0, 0);
  }

  throw new Error(`Unknown solar term: ${termName}`);
}

/**
 * 출생일 기준으로 다음/이전 절기(節氣) 날짜를 찾습니다.
 */
function findNearestJeolgi(
  birthYear: number,
  birthMonth: number,
  birthDay: number,
  birthHour: number,
  birthMinute: number,
  forward: boolean,
): Date {
  const birthDate = new Date(birthYear, birthMonth - 1, birthDay, birthHour, birthMinute);

  // 검색 범위: 전후 2년
  const searchYears = forward ? [birthYear, birthYear + 1] : [birthYear - 1, birthYear];

  const candidates: Date[] = [];

  for (const year of searchYears) {
    for (const termName of JEOLGI_NAMES) {
      const termDate = getSolarTermDate(year, termName);

      if (forward && termDate > birthDate) {
        candidates.push(termDate);
      } else if (!forward && termDate < birthDate) {
        candidates.push(termDate);
      }
    }
  }

  if (candidates.length === 0) {
    // 폴백: 출생일 기준 15일 후/전
    const fallback = new Date(birthDate);
    fallback.setDate(fallback.getDate() + (forward ? 15 : -15));
    return fallback;
  }

  // 가장 가까운 절기 선택
  candidates.sort((a, b) => Math.abs(a.getTime() - birthDate.getTime()) - Math.abs(b.getTime() - birthDate.getTime()));
  return candidates[0];
}

// ============================================================
// 대운수 계산
// ============================================================

/**
 * 대운 정보
 */
export interface MajorFortune {
  /** 대운 순서 (1부터 시작) */
  index: number;
  /** 대운 간지 (한글) */
  pillar: string;
  /** 대운 간지 (한자) */
  pillarHanja: string;
  /** 대운 시작 나이 */
  startAge: number;
  /** 대운 종료 나이 */
  endAge: number;
}

/**
 * 대운수 계산 결과
 */
export interface MajorFortuneResult {
  /** 순행(true) / 역행(false) */
  isForward: boolean;
  /** 대운 시작 나이 (소수점 포함) */
  startAgeExact: number;
  /** 대운 시작 나이 (반올림) */
  startAge: number;
  /** 대운 시작 나이 계산에 사용된 절기까지의 일수 */
  daysToJeolgi: number;
  /** 대운 목록 */
  fortunes: MajorFortune[];
  /** 계산 방법 설명 */
  description: string;
}

/**
 * 대운수를 계산합니다.
 *
 * @param isMale 남성 여부
 * @param birthYear 출생 연도
 * @param birthMonth 출생 월
 * @param birthDay 출생 일
 * @param birthHour 출생 시 (기본값: 0)
 * @param birthMinute 출생 분 (기본값: 0)
 * @param monthStemIdx 월간 인덱스 (0~9)
 * @param monthBranchIdx 월지 인덱스 (0~11)
 * @param yearStem 년간 (한글) - 순행/역행 결정에 사용
 * @param count 대운 개수 (기본값: 10)
 */
export function calculateMajorFortune(
  isMale: boolean,
  birthYear: number,
  birthMonth: number,
  birthDay: number,
  birthHour: number = 0,
  birthMinute: number = 0,
  monthStemIdx: number,
  monthBranchIdx: number,
  yearStem: string,
  count: number = 10,
): MajorFortuneResult {
  // 1. 순행/역행 결정
  // 양남음녀 = 순행, 음남양녀 = 역행
  const yearStemIdx = stemIndex(yearStem);
  const isYangYear = STEM_YINYANG[yearStemIdx] === '양';
  const isForward = (isMale && isYangYear) || (!isMale && !isYangYear);

  // 2. 절기까지의 일수 계산
  const birthDate = new Date(birthYear, birthMonth - 1, birthDay, birthHour, birthMinute);
  const jeolgiDate = findNearestJeolgi(birthYear, birthMonth, birthDay, birthHour, birthMinute, isForward);

  const diffMs = Math.abs(jeolgiDate.getTime() - birthDate.getTime());
  const daysToJeolgi = diffMs / (1000 * 60 * 60 * 24);

  // 핵심 공식: 3일 = 1년
  const startAgeExact = daysToJeolgi / 3;
  const startAge = Math.round(startAgeExact);

  // 3. 대운 간지 생성 (월주에서 순/역행)
  const flow = isForward ? 1 : -1;
  const fortunes: MajorFortune[] = [];

  for (let i = 0; i < count; i++) {
    const offset = (i + 1) * flow;
    const sIdx = (((monthStemIdx + offset) % 10) + 10) % 10;
    const bIdx = (((monthBranchIdx + offset) % 12) + 12) % 12;

    fortunes.push({
      index: i + 1,
      pillar: makePillar(sIdx, bIdx),
      pillarHanja: makePillarHanja(sIdx, bIdx),
      startAge: startAge + i * 10,
      endAge: startAge + (i + 1) * 10 - 1,
    });
  }

  const direction = isForward ? '순행(順行)' : '역행(逆行)';
  const description = `${direction} | 절기까지 ${daysToJeolgi.toFixed(1)}일 → 대운 시작 ${startAgeExact.toFixed(1)}세 (반올림: ${startAge}세)`;

  return {
    isForward,
    startAgeExact,
    startAge,
    daysToJeolgi,
    fortunes,
    description,
  };
}

/**
 * 현재 나이에 해당하는 대운을 찾습니다.
 *
 * @param fortunes 대운 목록
 * @param currentAge 현재 나이
 * @returns 현재 대운 또는 null
 */
export function getCurrentFortune(fortunes: MajorFortune[], currentAge: number): MajorFortune | null {
  return fortunes.find((f) => currentAge >= f.startAge && currentAge <= f.endAge) ?? null;
}
