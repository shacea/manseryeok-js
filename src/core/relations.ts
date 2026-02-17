/**
 * 합(合)·충(沖)·형(刑)·파(破)·해(害) 및 공망(空亡)·원진(元嗔) 모듈
 *
 * 사주팔자의 천간/지지 관계를 분석합니다.
 */

import { stemIndex, branchIndex, STEMS, BRANCHES, type FiveElement } from '../data/stem-branch-data';

// ============================================================
// 천간합 (天干合)
// ============================================================

/**
 * 천간합 쌍 (5조합, 합화 오행)
 * 갑+기=토, 을+경=금, 병+신=수, 정+임=목, 무+계=화
 */
const STEM_HARMONY_PAIRS: [number, number, FiveElement][] = [
  [0, 5, '토'],  // 갑+기 → 토
  [1, 6, '금'],  // 을+경 → 금
  [2, 7, '수'],  // 병+신 → 수
  [3, 8, '목'],  // 정+임 → 목
  [4, 9, '화'],  // 무+계 → 화
];

/**
 * 두 천간이 합(合)인지 확인합니다.
 * @returns 합화 오행 또는 null
 */
export function getStemHarmony(stem1: string, stem2: string): FiveElement | null {
  const i1 = stemIndex(stem1);
  const i2 = stemIndex(stem2);
  for (const [a, b, element] of STEM_HARMONY_PAIRS) {
    if ((i1 === a && i2 === b) || (i1 === b && i2 === a)) {
      return element;
    }
  }
  return null;
}

// ============================================================
// 천간충 (天干沖)
// ============================================================

/**
 * 천간충 쌍
 * 갑↔경, 을↔신, 병↔임, 정↔계 (무↔기는 같은 토이므로 충 없음)
 */
const STEM_CLASH_PAIRS: [number, number][] = [
  [0, 6],  // 갑↔경
  [1, 7],  // 을↔신
  [2, 8],  // 병↔임
  [3, 9],  // 정↔계
];

/**
 * 두 천간이 충(沖)인지 확인합니다.
 */
export function isStemClash(stem1: string, stem2: string): boolean {
  const i1 = stemIndex(stem1);
  const i2 = stemIndex(stem2);
  return STEM_CLASH_PAIRS.some(([a, b]) => (i1 === a && i2 === b) || (i1 === b && i2 === a));
}

// ============================================================
// 지지육합 (地支六合)
// ============================================================

/**
 * 지지육합 쌍 (합화 오행)
 * 자+축=토, 인+해=목, 묘+술=화, 진+유=금, 사+신=수, 오+미=화
 */
const BRANCH_SIXHARMONY_PAIRS: [number, number, FiveElement][] = [
  [0, 1, '토'],   // 자+축 → 토
  [2, 11, '목'],  // 인+해 → 목
  [3, 10, '화'],  // 묘+술 → 화
  [4, 9, '금'],   // 진+유 → 금
  [5, 8, '수'],   // 사+신 → 수
  [6, 7, '화'],   // 오+미 → 화 (午未合化火)
];

/**
 * 두 지지가 육합(六合)인지 확인합니다.
 * @returns 합화 오행 또는 null
 */
export function getBranchSixHarmony(branch1: string, branch2: string): FiveElement | null {
  const i1 = branchIndex(branch1);
  const i2 = branchIndex(branch2);
  for (const [a, b, element] of BRANCH_SIXHARMONY_PAIRS) {
    if ((i1 === a && i2 === b) || (i1 === b && i2 === a)) {
      return element;
    }
  }
  return null;
}

// ============================================================
// 지지삼합 (地支三合)
// ============================================================

/**
 * 지지삼합 (합화 오행)
 * 신자진=수, 해묘미=목, 인오술=화, 사유축=금
 */
const BRANCH_TRIPLE_HARMONY: [number, number, number, FiveElement][] = [
  [8, 0, 4, '수'],   // 신+자+진 → 수국
  [11, 3, 7, '목'],  // 해+묘+미 → 목국
  [2, 6, 10, '화'],  // 인+오+술 → 화국
  [5, 9, 1, '금'],   // 사+유+축 → 금국
];

/**
 * 세 지지가 삼합(三合)인지 확인합니다.
 * @returns 합화 오행 또는 null
 */
export function getBranchTripleHarmony(b1: string, b2: string, b3: string): FiveElement | null {
  const indices = [branchIndex(b1), branchIndex(b2), branchIndex(b3)].sort((a, b) => a - b);
  for (const [a, b, c, element] of BRANCH_TRIPLE_HARMONY) {
    const sorted = [a, b, c].sort((x, y) => x - y);
    if (indices[0] === sorted[0] && indices[1] === sorted[1] && indices[2] === sorted[2]) {
      return element;
    }
  }
  return null;
}

/**
 * 사주의 지지들에서 삼합 조합을 찾습니다.
 */
export function findTripleHarmonies(branches: string[]): { branches: [string, string, string]; element: FiveElement }[] {
  const results: { branches: [string, string, string]; element: FiveElement }[] = [];
  for (let i = 0; i < branches.length; i++) {
    for (let j = i + 1; j < branches.length; j++) {
      for (let k = j + 1; k < branches.length; k++) {
        const el = getBranchTripleHarmony(branches[i], branches[j], branches[k]);
        if (el) {
          results.push({ branches: [branches[i], branches[j], branches[k]], element: el });
        }
      }
    }
  }
  return results;
}

// ============================================================
// 지지방합 (地支方合)
// ============================================================

/**
 * 지지방합 (방위 합)
 * 인묘진=동방목, 사오미=남방화, 신유술=서방금, 해자축=북방수
 */
const BRANCH_DIRECTIONAL_HARMONY: [number, number, number, FiveElement][] = [
  [2, 3, 4, '목'],    // 인+묘+진 → 동방 목
  [5, 6, 7, '화'],    // 사+오+미 → 남방 화
  [8, 9, 10, '금'],   // 신+유+술 → 서방 금
  [11, 0, 1, '수'],   // 해+자+축 → 북방 수
];

/**
 * 세 지지가 방합(方合)인지 확인합니다.
 */
export function getBranchDirectionalHarmony(b1: string, b2: string, b3: string): FiveElement | null {
  const indices = [branchIndex(b1), branchIndex(b2), branchIndex(b3)].sort((a, b) => a - b);
  for (const [a, b, c, element] of BRANCH_DIRECTIONAL_HARMONY) {
    const sorted = [a, b, c].sort((x, y) => x - y);
    if (indices[0] === sorted[0] && indices[1] === sorted[1] && indices[2] === sorted[2]) {
      return element;
    }
  }
  return null;
}

// ============================================================
// 지지충 (地支沖)
// ============================================================

/**
 * 지지충 쌍 (6쌍, 인덱스 차이 = 6)
 * 자↔오, 축↔미, 인↔신, 묘↔유, 진↔술, 사↔해
 */
export function isBranchClash(branch1: string, branch2: string): boolean {
  const i1 = branchIndex(branch1);
  const i2 = branchIndex(branch2);
  return Math.abs(i1 - i2) === 6;
}

// ============================================================
// 지지형 (地支刑)
// ============================================================

/**
 * 지지형 (三刑 + 自刑)
 * - 인사신 삼형 (무례지형)
 * - 축술미 삼형 (지세지형)
 * - 자묘 상형 (무은지형)
 * - 진진, 오오, 유유, 해해 자형
 */
const BRANCH_PUNISHMENT_PAIRS: [number, number][] = [
  // 인사신 삼형 (양방향 쌍으로 표현)
  [2, 5],   // 인 → 사
  [5, 8],   // 사 → 신
  [8, 2],   // 신 → 인
  // 축술미 삼형
  [1, 10],  // 축 → 술
  [10, 7],  // 술 → 미
  [7, 1],   // 미 → 축
  // 자묘 상형
  [0, 3],   // 자 → 묘
  [3, 0],   // 묘 → 자
  // 자형
  [4, 4],   // 진 → 진
  [6, 6],   // 오 → 오
  [9, 9],   // 유 → 유
  [11, 11], // 해 → 해
];

/**
 * 두 지지가 형(刑) 관계인지 확인합니다.
 */
export function isBranchPunishment(branch1: string, branch2: string): boolean {
  const i1 = branchIndex(branch1);
  const i2 = branchIndex(branch2);
  return BRANCH_PUNISHMENT_PAIRS.some(([a, b]) => i1 === a && i2 === b);
}

// ============================================================
// 지지파 (地支破)
// ============================================================

/**
 * 지지파 쌍
 * 자↔유, 축↔진, 인↔해, 묘↔오, 사↔신, 미↔술
 */
const BRANCH_DESTRUCTION_PAIRS: [number, number][] = [
  [0, 9],   // 자↔유
  [1, 4],   // 축↔진
  [2, 11],  // 인↔해
  [3, 6],   // 묘↔오
  [5, 8],   // 사↔신
  [7, 10],  // 미↔술
];

/**
 * 두 지지가 파(破) 관계인지 확인합니다.
 */
export function isBranchDestruction(branch1: string, branch2: string): boolean {
  const i1 = branchIndex(branch1);
  const i2 = branchIndex(branch2);
  return BRANCH_DESTRUCTION_PAIRS.some(([a, b]) => (i1 === a && i2 === b) || (i1 === b && i2 === a));
}

// ============================================================
// 지지해 (地支害/六害)
// ============================================================

const BRANCH_HARM_PAIRS: [number, number][] = [
  [0, 7],   // 자↔미
  [1, 6],   // 축↔오
  [2, 5],   // 인↔사
  [3, 4],   // 묘↔진
  [8, 11],  // 신↔해
  [9, 10],  // 유↔술
];

export function isBranchHarm(branch1: string, branch2: string): boolean {
  const i1 = branchIndex(branch1);
  const i2 = branchIndex(branch2);
  return BRANCH_HARM_PAIRS.some(([a, b]) => (i1 === a && i2 === b) || (i1 === b && i2 === a));
}

// ============================================================
// 원진 (怨嗔) — 해(害)와는 다른 별도의 관계
// ============================================================

const BRANCH_WONJIN_PAIRS: [number, number][] = [
  [0, 7],   // 자↔미
  [1, 6],   // 축↔오
  [2, 9],   // 인↔유
  [3, 8],   // 묘↔신
  [4, 11],  // 진↔해
  [5, 10],  // 사↔술
];

export function isBranchWonjin(branch1: string, branch2: string): boolean {
  const i1 = branchIndex(branch1);
  const i2 = branchIndex(branch2);
  return BRANCH_WONJIN_PAIRS.some(([a, b]) => (i1 === a && i2 === b) || (i1 === b && i2 === a));
}

// ============================================================
// 공망 (空亡)
// ============================================================

/**
 * 공망 계산
 *
 * 공망은 60갑자에서 10간과 12지의 조합에서 빠지는 2개의 지지입니다.
 * 일주(日柱)의 갑자 순(旬)에 따라 결정됩니다.
 *
 * 예: 갑자순 → 술해 공망, 갑술순 → 신유 공망, ...
 *
 * @param dayStem 일간
 * @param dayBranch 일지
 * @returns 공망 지지 2개
 */
export function getGongmang(dayStem: string, dayBranch: string): [string, string] {
  const sIdx = stemIndex(dayStem);
  const bIdx = branchIndex(dayBranch);

  // 60갑자에서의 순(旬) 시작 지지 = (지지인덱스 - 천간인덱스 + 12) % 12
  // 이 값에서 공망 지지 계산
  const xunStart = (bIdx - sIdx + 12) % 12;

  // 공망은 순(旬) 시작 지지의 앞 2개
  // 예: 갑자순 시작(자=0) → 공망은 술(10), 해(11)
  const gong1 = (xunStart + 10) % 12;
  const gong2 = (xunStart + 11) % 12;

  return [BRANCHES[gong1], BRANCHES[gong2]];
}

// ============================================================
// 사주 전체 관계 분석
// ============================================================

export interface PillarRelations {
  /** 천간합 */
  stemHarmonies: { pillars: [string, string]; element: FiveElement }[];
  /** 천간충 */
  stemClashes: [string, string][];
  /** 지지육합 */
  branchSixHarmonies: { pillars: [string, string]; element: FiveElement }[];
  /** 지지삼합 */
  branchTripleHarmonies: { pillars: [string, string, string]; element: FiveElement }[];
  /** 지지방합 */
  branchDirectionalHarmonies: { pillars: [string, string, string]; element: FiveElement }[];
  /** 지지충 */
  branchClashes: [string, string][];
  /** 지지형 */
  branchPunishments: [string, string][];
  /** 지지파 */
  branchDestructions: [string, string][];
  /** 지지해(六害) */
  branchHarms: [string, string][];
  /** 원진(怨嗔) */
  branchWonjin: [string, string][];
  /** 공망 */
  gongmang: [string, string];
}

/**
 * 사주 전체의 합충형파해 관계를 분석합니다.
 */
export function analyzeRelations(
  yearStem: string, monthStem: string, dayStem: string, hourStem: string | null,
  yearBranch: string, monthBranch: string, dayBranch: string, hourBranch: string | null
): PillarRelations {
  const stems = hourStem
    ? [yearStem, monthStem, dayStem, hourStem]
    : [yearStem, monthStem, dayStem];
  const branches = hourBranch
    ? [yearBranch, monthBranch, dayBranch, hourBranch]
    : [yearBranch, monthBranch, dayBranch];

  const pillarNames = ['년', '월', '일', '시'];

  // 천간합/충
  const stemHarmonies: PillarRelations['stemHarmonies'] = [];
  const stemClashes: [string, string][] = [];
  for (let i = 0; i < stems.length; i++) {
    for (let j = i + 1; j < stems.length; j++) {
      const harmony = getStemHarmony(stems[i], stems[j]);
      if (harmony) {
        stemHarmonies.push({ pillars: [pillarNames[i], pillarNames[j]], element: harmony });
      }
      if (isStemClash(stems[i], stems[j])) {
        stemClashes.push([pillarNames[i], pillarNames[j]]);
      }
    }
  }

  // 지지 분석
  const branchSixHarmonies: PillarRelations['branchSixHarmonies'] = [];
  const branchClashes: [string, string][] = [];
  const branchPunishments: [string, string][] = [];
  const branchDestructions: [string, string][] = [];
  const branchHarms: [string, string][] = [];
  const branchWonjin: [string, string][] = [];

  for (let i = 0; i < branches.length; i++) {
    for (let j = i + 1; j < branches.length; j++) {
      const sixH = getBranchSixHarmony(branches[i], branches[j]);
      if (sixH) {
        branchSixHarmonies.push({ pillars: [pillarNames[i], pillarNames[j]], element: sixH });
      }
      if (isBranchClash(branches[i], branches[j])) {
        branchClashes.push([pillarNames[i], pillarNames[j]]);
      }
      if (isBranchPunishment(branches[i], branches[j])) {
        branchPunishments.push([pillarNames[i], pillarNames[j]]);
      }
      if (isBranchDestruction(branches[i], branches[j])) {
        branchDestructions.push([pillarNames[i], pillarNames[j]]);
      }
      if (isBranchHarm(branches[i], branches[j])) {
        branchHarms.push([pillarNames[i], pillarNames[j]]);
      }
      if (isBranchWonjin(branches[i], branches[j])) {
        branchWonjin.push([pillarNames[i], pillarNames[j]]);
      }
    }
  }

  // 삼합/방합 검색
  const branchTripleHarmonies: PillarRelations['branchTripleHarmonies'] = [];
  const branchDirectionalHarmonies: PillarRelations['branchDirectionalHarmonies'] = [];

  for (let i = 0; i < branches.length; i++) {
    for (let j = i + 1; j < branches.length; j++) {
      for (let k = j + 1; k < branches.length; k++) {
        const tripleH = getBranchTripleHarmony(branches[i], branches[j], branches[k]);
        if (tripleH) {
          branchTripleHarmonies.push({
            pillars: [pillarNames[i], pillarNames[j], pillarNames[k]],
            element: tripleH,
          });
        }
        const dirH = getBranchDirectionalHarmony(branches[i], branches[j], branches[k]);
        if (dirH) {
          branchDirectionalHarmonies.push({
            pillars: [pillarNames[i], pillarNames[j], pillarNames[k]],
            element: dirH,
          });
        }
      }
    }
  }

  const gongmang = getGongmang(dayStem, dayBranch);

  return {
    stemHarmonies,
    stemClashes,
    branchSixHarmonies,
    branchTripleHarmonies,
    branchDirectionalHarmonies,
    branchClashes,
    branchPunishments,
    branchDestructions,
    branchHarms,
    branchWonjin,
    gongmang,
  };
}
