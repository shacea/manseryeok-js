/**
 * 신강/신약 판별 테스트
 *
 * 테스트 케이스: 1990년 5월 15일 14시 30분생
 * 사주: 경오년 신사월 경진일 계미시
 * 일간: 경(庚) = 금(金)
 */

import { calculateBodyStrength, getBodyStrengthLevel, calculateElementScores } from '../core/body-strength';

describe('신강/신약 판별', () => {
  // 1990년 5월 15일 14시 30분생
  // 사주: 경오년 신사월 경진일 계미시
  const yearStem = '경'; // 庚 (금)
  const monthStem = '신'; // 辛 (금)
  const dayStem = '경'; // 庚 (금) - 일간
  const hourStem = '계'; // 癸 (수)
  const yearBranch = '오'; // 午 (화)
  const monthBranch = '사'; // 巳 (화)
  const dayBranch = '진'; // 辰 (토)
  const hourBranch = '미'; // 未 (토)

  test('오행 점수 계산', () => {
    const scores = calculateElementScores(
      yearStem,
      monthStem,
      dayStem,
      hourStem,
      yearBranch,
      monthBranch,
      dayBranch,
      hourBranch,
    );

    // 천간: 경(금)5 + 신(금)5 + 경(금)5 + 계(수)5 = 금15, 수5
    // 지지 지장간 (월지 2배):
    // 오(午): 병3+기3+정4 = 화3+토3+화4 → 화7, 토3
    // 사(巳)×2: (무1+경3+병6)×2 = 토2+금6+화12
    // 진(辰): 을3+계3+무4 = 목3+수3+토4
    // 미(未): 정3+을3+기4 = 화3+목3+토4

    expect(scores).toBeDefined();
    expect(Object.values(scores).reduce((a, b) => a + b, 0)).toBeGreaterThan(0);
    console.log('오행 점수:', scores);
  });

  test('신강/신약 판별 결과', () => {
    const result = calculateBodyStrength(
      yearStem,
      monthStem,
      dayStem,
      hourStem,
      yearBranch,
      monthBranch,
      dayBranch,
      hourBranch,
    );

    expect(result).toBeDefined();
    expect(typeof result.isStrong).toBe('boolean');
    expect(result.selfScore).toBeGreaterThanOrEqual(0);
    expect(result.totalScore).toBeGreaterThan(0);
    expect(result.selfRatio).toBeGreaterThanOrEqual(0);
    expect(result.selfRatio).toBeLessThanOrEqual(1);
    console.log('신강/신약 결과:', result.description);
    console.log('오행 점수:', result.elementScores);
  });

  test('신강/신약 강도 레벨', () => {
    expect(getBodyStrengthLevel(0.95)).toBe('극강');
    expect(getBodyStrengthLevel(0.8)).toBe('태강');
    expect(getBodyStrengthLevel(0.5)).toBe('중화신강');
    expect(getBodyStrengthLevel(0.39)).toBe('중화신약');
    expect(getBodyStrengthLevel(0.3)).toBe('태약');
    expect(getBodyStrengthLevel(0.2)).toBe('극약');
  });

  test('시주 없는 경우', () => {
    const result = calculateBodyStrength(yearStem, monthStem, dayStem, null, yearBranch, monthBranch, dayBranch, null);

    expect(result).toBeDefined();
    expect(result.totalScore).toBeGreaterThan(0);
    console.log('시주 없는 경우:', result.description);
  });
});

describe('신강 케이스 - 갑목 일간', () => {
  // 갑목(甲木) 일간, 봄(인월) 출생 → 신강 예상
  test('봄 출생 갑목은 신강', () => {
    const result = calculateBodyStrength(
      '갑',
      '갑',
      '갑',
      '갑', // 천간 모두 갑(목)
      '인',
      '인',
      '인',
      '인', // 지지 모두 인(목)
    );
    expect(result.isStrong).toBe(true);
    expect(result.selfRatio).toBeGreaterThan(0.5);
  });
});
