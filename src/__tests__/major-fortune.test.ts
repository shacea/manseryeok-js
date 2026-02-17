/**
 * 대운수 계산 테스트
 */

import { calculateMajorFortune, getCurrentFortune } from '../core/major-fortune';
import { stemIndex, branchIndex } from '../data/stem-branch-data';

describe('대운수 계산', () => {
  // 1990년 5월 15일 14시 30분생 (남성)
  // 사주: 경오년 신사월 경진일 계미시
  // 년간: 경(庚) = 양금 → 남성 양년생 = 순행
  const monthStemIdx = stemIndex('신');   // 辛 = 7
  const monthBranchIdx = branchIndex('사'); // 巳 = 5

  test('남성 양년생 순행 대운', () => {
    const result = calculateMajorFortune(
      true,   // 남성
      1990, 5, 15, 14, 30,
      monthStemIdx,
      monthBranchIdx,
      '경'    // 년간 경(庚) = 양
    );

    expect(result.isForward).toBe(true); // 양남 = 순행
    expect(result.fortunes).toHaveLength(10);
    expect(result.startAge).toBeGreaterThanOrEqual(0);

    console.log('대운수 결과:', result.description);
    console.log('대운 목록:');
    result.fortunes.forEach(f => {
      console.log(`  ${f.index}대운: ${f.pillar}(${f.pillarHanja}) ${f.startAge}세~${f.endAge}세`);
    });
  });

  test('여성 양년생 역행 대운', () => {
    const result = calculateMajorFortune(
      false,  // 여성
      1990, 5, 15, 14, 30,
      monthStemIdx,
      monthBranchIdx,
      '경'    // 년간 경(庚) = 양
    );

    expect(result.isForward).toBe(false); // 양녀 = 역행
    expect(result.fortunes).toHaveLength(10);
  });

  test('대운 간지 순서 검증 (순행)', () => {
    const result = calculateMajorFortune(
      true, 1990, 5, 15, 14, 30,
      monthStemIdx, monthBranchIdx, '경'
    );

    // 월주: 신사(辛巳) → 순행이면 임오(壬午), 계미(癸未), ...
    expect(result.fortunes[0].pillar).toBe('임오');
    expect(result.fortunes[1].pillar).toBe('계미');
    expect(result.fortunes[2].pillar).toBe('갑신');
  });

  test('현재 대운 조회', () => {
    const result = calculateMajorFortune(
      true, 1990, 5, 15, 14, 30,
      monthStemIdx, monthBranchIdx, '경'
    );

    // 2026년 기준 나이 = 36세
    const currentFortune = getCurrentFortune(result.fortunes, 36);
    expect(currentFortune).not.toBeNull();
    console.log('현재 대운 (36세):', currentFortune?.pillar, currentFortune?.startAge, '~', currentFortune?.endAge);
  });
});
