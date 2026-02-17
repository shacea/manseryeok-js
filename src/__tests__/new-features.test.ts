import { getAllTenGodsByBranch } from '../core/ten-gods';
import { calculateGeobeop12States } from '../core/twelve-states';
import { getBranchHalfHarmony, getBranchHiddenHarmony, isBranchGwimun } from '../core/relations';
import { calculateAnnualFortune, getAnnualFortune } from '../core/annual-fortune';
import { calculateMonthlyFortune } from '../core/monthly-fortune';
import {
  isCheondeokGwiin,
  isWoldeokGwiin,
  isJangseong,
  isGwimunGwansal,
  isCheonbokGwiin,
  isCheonuiSeong,
  isGosin,
  isJimang,
  isGwanGwiHakGwan,
  isGanYeoJiDong,
} from '../core/special-stars';
import { calculateManseryeok } from '../core/manseryeok';

describe('getAllTenGodsByBranch', () => {
  test('정(음화) vs 해 지장간 [무,갑,임]', () => {
    const result = getAllTenGodsByBranch('정', '해');
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(3);
    expect(result).toContain('상관');
    expect(result).toContain('정인');
    expect(result).toContain('정관');
  });

  test('정(음화) vs 자 지장간 [임,계]', () => {
    const result = getAllTenGodsByBranch('정', '자');
    expect(result.length).toBe(2);
    expect(result).toContain('정관');
    expect(result).toContain('편관');
  });
});

describe('calculateGeobeop12States', () => {
  test('거법 12운성: 각 기둥 천간 vs 자기 지지', () => {
    const result = calculateGeobeop12States('계', '해', '갑', '자', '정', '해', '경', '자');

    expect(result.year).toBeDefined();
    expect(result.month).toBeDefined();
    expect(result.day).toBeDefined();
    expect(result.hour).toBeDefined();
  });

  test('시주 없으면 hour=null', () => {
    const result = calculateGeobeop12States('계', '해', '갑', '자', '정', '해', null, null);
    expect(result.hour).toBeNull();
  });
});

describe('getBranchHalfHarmony (반합)', () => {
  test('해+묘 = 목 (해묘미 반합)', () => {
    expect(getBranchHalfHarmony('해', '묘')).toBe('목');
  });

  test('묘+해 = 목 (순서 무관)', () => {
    expect(getBranchHalfHarmony('묘', '해')).toBe('목');
  });

  test('신+자 = 수 (신자진 반합)', () => {
    expect(getBranchHalfHarmony('신', '자')).toBe('수');
  });

  test('인+오 = 화 (인오술 반합)', () => {
    expect(getBranchHalfHarmony('인', '오')).toBe('화');
  });

  test('사+유 = 금 (사유축 반합)', () => {
    expect(getBranchHalfHarmony('사', '유')).toBe('금');
  });

  test('자+해 = null (반합 아님)', () => {
    expect(getBranchHalfHarmony('자', '해')).toBeNull();
  });
});

describe('getBranchHiddenHarmony (암합)', () => {
  test('returns array', () => {
    const result = getBranchHiddenHarmony('인', '축');
    expect(Array.isArray(result)).toBe(true);
  });

  test('인+축: 갑기합 포함', () => {
    const result = getBranchHiddenHarmony('인', '축');
    expect(result).toContain('甲己');
  });

  test('자+해: 계무합 (戊癸)', () => {
    const result = getBranchHiddenHarmony('자', '해');
    expect(result).toContain('癸戊');
  });

  test('자+묘: no hidden harmony', () => {
    const result = getBranchHiddenHarmony('자', '묘');
    expect(result.length).toBe(0);
  });
});

describe('isBranchGwimun (귀문)', () => {
  test('자+유 = 귀문', () => {
    expect(isBranchGwimun('자', '유')).toBe(true);
  });

  test('술+묘 = 귀문', () => {
    expect(isBranchGwimun('술', '묘')).toBe(true);
  });

  test('인+미 = 귀문', () => {
    expect(isBranchGwimun('인', '미')).toBe(true);
  });

  test('자+인 = 귀문 아님', () => {
    expect(isBranchGwimun('자', '인')).toBe(false);
  });
});

describe('calculateAnnualFortune (세운)', () => {
  test('2026 세운: 병오', () => {
    const result = calculateAnnualFortune('정', '해', 2026, 1);
    expect(result.length).toBe(1);
    const fortune2026 = result[0];
    expect(fortune2026.year).toBe(2026);
    expect(fortune2026.pillar).toBe('병오');
    expect(fortune2026.stemTenGod).toBe('겁재');
    expect(fortune2026.twelveState).toBe('건록');
  });

  test('getAnnualFortune 단건 조회', () => {
    const fortune = getAnnualFortune('정', '해', 2026);
    expect(fortune.year).toBe(2026);
    expect(fortune.pillar).toBe('병오');
    expect(fortune.stemTenGod).toBe('겁재');
    expect(fortune.twelveState).toBe('건록');
  });

  test('count=10 기본값', () => {
    const result = calculateAnnualFortune('정', '해', 2026);
    expect(result.length).toBe(10);
    const y2026 = result.find((f) => f.year === 2026);
    expect(y2026).toBeDefined();
    expect(y2026!.pillar).toBe('병오');
  });
});

describe('calculateMonthlyFortune (월운)', () => {
  test('2026년 12개월 반환', () => {
    const result = calculateMonthlyFortune('정', '해', 2026);
    expect(result.length).toBe(12);
    expect(result[0].month).toBe(1);
    expect(result[11].month).toBe(12);
  });

  test('2026/1 = 기축', () => {
    const result = calculateMonthlyFortune('정', '해', 2026);
    const jan = result[0];
    expect(jan.pillar).toBe('기축');
    expect(jan.stemTenGod).toBe('식신');
    expect(jan.branchTenGod).toBe('식신');
    expect(jan.twelveState).toBe('묘');
  });
});

describe('new special stars', () => {
  test('isCheondeokGwiin', () => {
    expect(typeof isCheondeokGwiin('자', '갑')).toBe('boolean');
  });

  test('isWoldeokGwiin', () => {
    expect(typeof isWoldeokGwiin('자', '갑')).toBe('boolean');
  });

  test('isJangseong', () => {
    expect(typeof isJangseong('자', '축')).toBe('boolean');
  });

  test('isGwimunGwansal', () => {
    expect(typeof isGwimunGwansal('자', '유')).toBe('boolean');
  });

  test('isCheonbokGwiin', () => {
    expect(typeof isCheonbokGwiin('갑', '자')).toBe('boolean');
  });

  test('isCheonuiSeong', () => {
    expect(typeof isCheonuiSeong('자', '축')).toBe('boolean');
  });

  test('isGosin', () => {
    expect(typeof isGosin('자', '인')).toBe('boolean');
  });

  test('isJimang', () => {
    expect(typeof isJimang('자', '인')).toBe('boolean');
  });

  test('isGwanGwiHakGwan', () => {
    expect(typeof isGwanGwiHakGwan('갑', '해')).toBe('boolean');
  });

  test('isGanYeoJiDong', () => {
    expect(isGanYeoJiDong('갑', '자')).toBe(false);
    expect(typeof isGanYeoJiDong('갑', '인')).toBe('boolean');
  });
});

describe('calculateManseryeok integration', () => {
  const result = calculateManseryeok(1984, 10, 12, 12, 5, {
    longitude: 129,
    isMale: true,
  });

  test('branchAll 존재', () => {
    expect(result.tenGods.branchAll).toBeDefined();
    expect(Array.isArray(result.tenGods.branchAll.year)).toBe(true);
    expect(Array.isArray(result.tenGods.branchAll.month)).toBe(true);
    expect(Array.isArray(result.tenGods.branchAll.day)).toBe(true);
    expect(result.tenGods.branchAll.year.length).toBeGreaterThan(0);
  });

  test('twelveStatesGeobeop 존재', () => {
    expect(result.twelveStatesGeobeop).toBeDefined();
    expect(result.twelveStatesGeobeop.year).toBeDefined();
    expect(result.twelveStatesGeobeop.month).toBeDefined();
    expect(result.twelveStatesGeobeop.day).toBeDefined();
    expect(result.twelveStatesGeobeop.hour).toBeDefined();
  });

  test('annualFortune 배열', () => {
    expect(Array.isArray(result.annualFortune)).toBe(true);
    expect(result.annualFortune!.length).toBeGreaterThan(0);
    const fortune = result.annualFortune![0];
    expect(fortune.year).toBeDefined();
    expect(fortune.pillar).toBeDefined();
    expect(fortune.stemTenGod).toBeDefined();
    expect(fortune.branchTenGod).toBeDefined();
    expect(fortune.twelveState).toBeDefined();
  });

  test('monthlyFortune 12개월', () => {
    expect(Array.isArray(result.monthlyFortune)).toBe(true);
    expect(result.monthlyFortune!.length).toBe(12);
    const jan = result.monthlyFortune![0];
    expect(jan.month).toBe(1);
    expect(jan.pillar).toBeDefined();
    expect(jan.stemTenGod).toBeDefined();
  });
});
