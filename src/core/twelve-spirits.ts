/**
 * 12신살(十二神殺) 계산 모듈
 *
 * 년지(年支) 또는 일지(日支) 기준으로 각 지지의 12신살을 판별합니다.
 *
 * 12신살: 겁살, 재살, 천살, 지살, 년살, 월살, 망신살, 장성살, 반안살, 역마살, 육해살, 화개살
 */

import { branchIndex } from '../data/stem-branch-data';

/**
 * 12신살 이름
 */
export const TWELVE_SPIRIT_NAMES = [
  '겁살',
  '재살',
  '천살',
  '지살',
  '년살',
  '월살',
  '망신살',
  '장성살',
  '반안살',
  '역마살',
  '육해살',
  '화개살',
] as const;

export type TwelveSpirit = (typeof TWELVE_SPIRIT_NAMES)[number];

/**
 * 12신살 기준 테이블
 *
 * 기준지지(년지 또는 일지)에 따라 겁살부터 시작하는 12신살이 대응하는 지지
 *
 * 삼합 기준:
 * - 신자진(수국): 겁살=사, 재살=오, 천살=미, ...
 * - 해묘미(목국): 겁살=신, 재살=유, 천살=술, ...
 * - 인오술(화국): 겁살=해, 재살=자, 천살=축, ...
 * - 사유축(금국): 겁살=인, 재살=묘, 천살=진, ...
 */
const SPIRIT_TABLE: Record<number, readonly number[]> = {
  // 신자진(수국) 기준 - 겁살 시작: 사(5)
  8: [5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4], // 신
  0: [5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4], // 자
  4: [5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4], // 진

  // 해묘미(목국) 기준 - 겁살 시작: 신(8)
  11: [8, 9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7], // 해
  3: [8, 9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7], // 묘
  7: [8, 9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7], // 미

  // 인오술(화국) 기준 - 겁살 시작: 해(11)
  2: [11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // 인
  6: [11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // 오
  10: [11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // 술

  // 사유축(금국) 기준 - 겁살 시작: 인(2)
  5: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1], // 사
  9: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1], // 유
  1: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1], // 축
};

/**
 * 기준 지지와 대상 지지의 12신살을 판별합니다.
 *
 * @param baseBranch 기준 지지 (년지 또는 일지)
 * @param targetBranch 대상 지지
 * @returns 12신살 이름 또는 null
 */
export function getTwelveSpirit(baseBranch: string, targetBranch: string): TwelveSpirit | null {
  const baseIdx = branchIndex(baseBranch);
  const targetIdx = branchIndex(targetBranch);

  const table = SPIRIT_TABLE[baseIdx];
  if (!table) return null;

  const spiritIdx = table.indexOf(targetIdx);
  if (spiritIdx === -1) return null;

  return TWELVE_SPIRIT_NAMES[spiritIdx];
}

/**
 * 사주 전체의 12신살을 계산합니다.
 *
 * - 년주: 일지(日支) 기준
 * - 월주/일주/시주: 년지(年支) 기준
 */
export function calculateAllTwelveSpirits(
  yearBranch: string,
  monthBranch: string,
  dayBranch: string,
  hourBranch: string | null,
): {
  year: TwelveSpirit | null;
  month: TwelveSpirit | null;
  day: TwelveSpirit | null;
  hour: TwelveSpirit | null;
} {
  return {
    year: getTwelveSpirit(dayBranch, yearBranch),
    month: getTwelveSpirit(yearBranch, monthBranch),
    day: getTwelveSpirit(yearBranch, dayBranch),
    hour: hourBranch ? getTwelveSpirit(yearBranch, hourBranch) : null,
  };
}
