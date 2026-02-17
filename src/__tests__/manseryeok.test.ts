/**
 * 통합 만세력 테스트
 *
 * PDF 데이터 기준: 신승욱 양력 1984/10/12 12:05 남 부산(129°)
 *
 * PDF 정답:
 * - 사주: 갑자(甲子) 갑술(甲戌) 기묘(己卯) 경오(庚午)
 * - 십성(천간): 정관, 정관, (비견), 상관
 * - 십성(지지): 편재, 겁재(→편관?), 편관, 편인
 *   주의: PDF 표기 순서는 시/일/월/년 (오른쪽→왼쪽)
 * - 지장간: 오→병기정, 묘→갑을, 술→신정무, 자→임계
 * - 12운성: 건록, 병, 양, 절
 *   (PDF 순서: 시/일/월/년 → 우리: 년/월/일/시)
 * - 12신살: 재살, 육해살, 월살, 년살
 *   (PDF 순서: 시/일/월/년)
 */

import { calculateManseryeok } from '../core/manseryeok';
import { getTenGodByStem, getTenGodByBranch } from '../core/ten-gods';
import { getHiddenStemsString } from '../core/hidden-stems';
import { getTwelveState } from '../core/twelve-states';
import { getTwelveSpirit } from '../core/twelve-spirits';
import { getGongmang } from '../core/relations';

describe('PDF 검증: 신승욱 1984/10/12 12:05 남 부산(129°)', () => {
  const result = calculateManseryeok(1984, 10, 12, 12, 5, {
    longitude: 129,
    isMale: true,
  });

  describe('사주팔자', () => {
    test('년주 = 갑자', () => {
      expect(result.saju.yearPillar).toBe('갑자');
      expect(result.saju.yearPillarHanja).toBe('甲子');
    });

    test('월주 = 갑술', () => {
      expect(result.saju.monthPillar).toBe('갑술');
      expect(result.saju.monthPillarHanja).toBe('甲戌');
    });

    test('일주 = 기묘', () => {
      expect(result.saju.dayPillar).toBe('기묘');
      expect(result.saju.dayPillarHanja).toBe('己卯');
    });

    test('시주 = 경오', () => {
      expect(result.saju.hourPillar).toBe('경오');
      expect(result.saju.hourPillarHanja).toBe('庚午');
    });
  });

  describe('십성 (일간 기=토 기준)', () => {
    const dayStem = '기';

    test('년간 갑 = 정관', () => {
      expect(getTenGodByStem(dayStem, '갑')).toBe('정관');
    });

    test('월간 갑 = 정관', () => {
      expect(getTenGodByStem(dayStem, '갑')).toBe('정관');
    });

    test('시간 경 = 상관', () => {
      expect(getTenGodByStem(dayStem, '경')).toBe('상관');
    });

    test('천간 십성 일치', () => {
      expect(result.tenGods.stem.year).toBe('정관');
      expect(result.tenGods.stem.month).toBe('정관');
      expect(result.tenGods.stem.day).toBe('비견');
      expect(result.tenGods.stem.hour).toBe('상관');
    });

    test('지지 십성', () => {
      // 년지 자(수) vs 일간 기(토): 토극수 = 편재(같은음양)
      expect(getTenGodByBranch(dayStem, '자')).toBe('편재');
      // 월지 술(토) vs 일간 기(토): 같은오행+다른음양 = 겁재
      expect(getTenGodByBranch(dayStem, '술')).toBe('겁재');
      // 일지 묘(목) vs 일간 기(토): 목극토 = 편관
      expect(getTenGodByBranch(dayStem, '묘')).toBe('편관');
      // 시지 오(화) vs 일간 기(토): 화생토 = 편인(같은음양)
      expect(getTenGodByBranch(dayStem, '오')).toBe('편인');
    });
  });

  describe('지장간', () => {
    test('자 → 임계', () => {
      expect(getHiddenStemsString('자')).toBe('임계');
    });

    test('술 → 신정무', () => {
      expect(getHiddenStemsString('술')).toBe('신정무');
    });

    test('묘 → 갑을', () => {
      expect(getHiddenStemsString('묘')).toBe('갑을');
    });

    test('오 → 병기정', () => {
      expect(getHiddenStemsString('오')).toBe('병기정');
    });
  });

  describe('12운성 (일간 기=음토 기준)', () => {
    const dayStem = '기';

    test('년지 자 = 절', () => {
      expect(getTwelveState(dayStem, '자')).toBe('절');
    });

    test('월지 술 = 양', () => {
      expect(getTwelveState(dayStem, '술')).toBe('양');
    });

    test('일지 묘 = 병', () => {
      expect(getTwelveState(dayStem, '묘')).toBe('병');
    });

    test('시지 오 = 건록', () => {
      expect(getTwelveState(dayStem, '오')).toBe('건록');
    });

    test('통합 결과 일치', () => {
      expect(result.twelveStates.year).toBe('절');
      expect(result.twelveStates.month).toBe('양');
      expect(result.twelveStates.day).toBe('병');
      expect(result.twelveStates.hour).toBe('건록');
    });
  });

  describe('12신살 (년지 자 기준)', () => {
    test('년지(자) → 년지(자) = 장성살', () => {
      // 신자진(수국): 겁살=사, 재살=오, 천살=미, 지살=신, 년살=유, 월살=술,
      //               망신살=해, 장성살=자, 반안살=축, 역마살=인, 육해살=묘, 화개살=진
      expect(getTwelveSpirit('자', '자')).toBe('장성살');
    });

    test('년지(자) → 월지(술) = 월살', () => {
      expect(getTwelveSpirit('자', '술')).toBe('월살');
    });

    test('년지(자) → 일지(묘) = 육해살', () => {
      expect(getTwelveSpirit('자', '묘')).toBe('육해살');
    });

    test('년지(자) → 시지(오) = 재살', () => {
      expect(getTwelveSpirit('자', '오')).toBe('재살');
    });

    test('통합 결과 일치', () => {
      expect(result.twelveSpirits.year).toBe('년살');
      expect(result.twelveSpirits.month).toBe('월살');
      expect(result.twelveSpirits.day).toBe('육해살');
      expect(result.twelveSpirits.hour).toBe('재살');
    });
  });

  describe('공망', () => {
    test('일주 기묘 → 공망 = 신유', () => {
      const gm = getGongmang('기', '묘');
      // 기묘 = 천간5 지지3 → xunStart = (3-5+12)%12 = 10 → 공망: (10+10)%12=8(신), (10+11)%12=9(유)
      expect(gm).toEqual(['신', '유']);
    });

    test('통합 결과 일치', () => {
      expect(result.relations.gongmang).toEqual(['신', '유']);
    });
  });

  describe('오행 비율', () => {
    test('8글자 오행 카운팅', () => {
      // 천간: 갑(목) 갑(목) 기(토) 경(금) = 목2 토1 금1
      // 지지: 자(수) 술(토) 묘(목) 오(화) = 수1 토1 목1 화1
      // 합계: 목3 화1 토2 금1 수1 = 총 8
      const fe = result.fiveElements;
      expect(fe.counts.목).toBe(3);
      expect(fe.counts.화).toBe(1);
      expect(fe.counts.토).toBe(2);
      expect(fe.counts.금).toBe(1);
      expect(fe.counts.수).toBe(1);
      expect(fe.total).toBe(8);
    });

    test('오행 비율', () => {
      expect(result.fiveElements.percentages.목).toBe('37.5%');
      expect(result.fiveElements.percentages.화).toBe('12.5%');
      expect(result.fiveElements.percentages.토).toBe('25.0%');
      expect(result.fiveElements.percentages.금).toBe('12.5%');
      expect(result.fiveElements.percentages.수).toBe('12.5%');
    });

    test('오행 판정', () => {
      expect(result.fiveElements.levels.목).toBe('과다');
      expect(result.fiveElements.levels.토).toBe('발달');
    });
  });

  describe('십성 비율', () => {
    test('십성 카운팅 (8글자, 일간 비견 포함)', () => {
      // 일간 기=비견, 년간 갑=정관, 월간 갑=정관, 시간 경=상관
      // 년지 자(수)=편재, 월지 술(토)=겁재, 일지 묘(목)=편관, 시지 오(화)=편인
      const tga = result.tenGodAnalysis;
      expect(tga.counts.비견).toBe(1);
      expect(tga.counts.정관).toBe(2);
      expect(tga.counts.상관).toBe(1);
      expect(tga.counts.편재).toBe(1);
      expect(tga.counts.겁재).toBe(1);
      expect(tga.counts.편관).toBe(1);
      expect(tga.counts.편인).toBe(1);
      expect(tga.total).toBe(8);
    });
  });

  describe('신강/신약', () => {
    test('신강/신약 판정 존재', () => {
      expect(result.bodyStrength).toBeDefined();
      expect(typeof result.bodyStrength.isStrong).toBe('boolean');
      expect(result.bodyStrength.totalScore).toBeGreaterThan(0);
    });

    test('신강 레벨 = 중화신강', () => {
      expect(result.bodyStrength.level).toBe('중화신강');
    });
  });

  describe('용신', () => {
    test('용신 결과 존재', () => {
      expect(result.usefulGod).toBeDefined();
      expect(result.usefulGod.usefulElement).toBeDefined();
    });

    test('용신 = 목', () => {
      expect(result.usefulGod.usefulElement).toBe('목');
    });
  });

  describe('대운', () => {
    test('남 + 양년생(갑) = 순행', () => {
      expect(result.majorFortune).not.toBeNull();
      expect(result.majorFortune!.isForward).toBe(true);
    });

    test('대운 10개 생성', () => {
      expect(result.majorFortune!.fortunes).toHaveLength(10);
    });

    test('대운 간지 순서 (월주 갑술에서 순행)', () => {
      // 월주: 갑술(甲戌) → 순행: 을해, 병자, 정축, 무인, 기묘, 경진, 신사, 임오, 계미, 갑신
      const fortunes = result.majorFortune!.fortunes;
      expect(fortunes[0].pillar).toBe('을해');
      expect(fortunes[1].pillar).toBe('병자');
      expect(fortunes[2].pillar).toBe('정축');
      expect(fortunes[3].pillar).toBe('무인');
      expect(fortunes[4].pillar).toBe('기묘');
      expect(fortunes[5].pillar).toBe('경진');
      expect(fortunes[6].pillar).toBe('신사');
      expect(fortunes[7].pillar).toBe('임오');
      expect(fortunes[8].pillar).toBe('계미');
      expect(fortunes[9].pillar).toBe('갑신');
    });
  });

  describe('궁성/육친', () => {
    test('궁성 4개 존재', () => {
      expect(result.palaces.year.name).toBe('년주(年柱)');
      expect(result.palaces.month.name).toBe('월주(月柱)');
      expect(result.palaces.day.name).toBe('일주(日柱)');
      expect(result.palaces.hour.name).toBe('시주(時柱)');
    });

    test('육친 매핑 존재 (남성)', () => {
      expect(result.sixRelations).not.toBeNull();
      expect(result.sixRelations!.stem.day).toBe('자기자신');
    });

    test('남성 육친: 정관=딸', () => {
      // 년간/월간 = 정관 → 남성의 정관 = 딸
      expect(result.sixRelations!.stem.year).toBe('딸');
      expect(result.sixRelations!.stem.month).toBe('딸');
    });

    test('남성 육친: 상관=조모', () => {
      expect(result.sixRelations!.stem.hour).toBe('조모');
    });
  });

  describe('통합 구조 검증', () => {
    test('pillars 분해 정확', () => {
      expect(result.pillars.year).toEqual({ stem: '갑', branch: '자' });
      expect(result.pillars.month).toEqual({ stem: '갑', branch: '술' });
      expect(result.pillars.day).toEqual({ stem: '기', branch: '묘' });
      expect(result.pillars.hour).toEqual({ stem: '경', branch: '오' });
    });

    test('지장간 문자열', () => {
      expect(result.hiddenStems.year.string).toBe('임계');
      expect(result.hiddenStems.month.string).toBe('신정무');
      expect(result.hiddenStems.day.string).toBe('갑을');
      expect(result.hiddenStems.hour!.string).toBe('병기정');
    });

    test('신살 배열 존재', () => {
      expect(Array.isArray(result.specialStars)).toBe(true);
    });

    test('관계 분석 존재', () => {
      expect(result.relations).toBeDefined();
      expect(Array.isArray(result.relations.gongmang)).toBe(true);
    });
  });
});

describe('개별 모듈 단위 테스트', () => {
  describe('십성 계산 정확성', () => {
    test('갑 일간 기준 십성', () => {
      expect(getTenGodByStem('갑', '갑')).toBe('비견');
      expect(getTenGodByStem('갑', '을')).toBe('겁재');
      expect(getTenGodByStem('갑', '병')).toBe('식신');
      expect(getTenGodByStem('갑', '정')).toBe('상관');
      expect(getTenGodByStem('갑', '무')).toBe('편재');
      expect(getTenGodByStem('갑', '기')).toBe('정재');
      expect(getTenGodByStem('갑', '경')).toBe('편관');
      expect(getTenGodByStem('갑', '신')).toBe('정관');
      expect(getTenGodByStem('갑', '임')).toBe('편인');
      expect(getTenGodByStem('갑', '계')).toBe('정인');
    });
  });

  describe('12운성 계산 정확성', () => {
    test('갑(양목) 순행 12운성', () => {
      // 갑 장생 = 해(11)
      expect(getTwelveState('갑', '해')).toBe('장생');
      expect(getTwelveState('갑', '자')).toBe('목욕');
      expect(getTwelveState('갑', '축')).toBe('관대');
      expect(getTwelveState('갑', '인')).toBe('건록');
      expect(getTwelveState('갑', '묘')).toBe('제왕');
      expect(getTwelveState('갑', '진')).toBe('쇠');
      expect(getTwelveState('갑', '사')).toBe('병');
      expect(getTwelveState('갑', '오')).toBe('사');
      expect(getTwelveState('갑', '미')).toBe('묘');
      expect(getTwelveState('갑', '신')).toBe('절');
      expect(getTwelveState('갑', '유')).toBe('태');
      expect(getTwelveState('갑', '술')).toBe('양');
    });
  });

  describe('12신살 기준 확인', () => {
    test('신자진(수국) 기준', () => {
      expect(getTwelveSpirit('자', '사')).toBe('겁살');
      expect(getTwelveSpirit('자', '오')).toBe('재살');
      expect(getTwelveSpirit('자', '미')).toBe('천살');
      expect(getTwelveSpirit('자', '인')).toBe('역마살');
      expect(getTwelveSpirit('자', '진')).toBe('화개살');
    });
  });
});

describe('성별 없이 만세력 계산', () => {
  test('성별 미지정 시 대운/육친 null', () => {
    const result = calculateManseryeok(1984, 10, 12, 12, 5, {
      longitude: 129,
    });

    expect(result.majorFortune).toBeNull();
    expect(result.sixRelations).toBeNull();
    expect(result.saju.yearPillar).toBe('갑자');
  });
});

describe('시주 없이 만세력 계산', () => {
  test('시간 미입력', () => {
    const result = calculateManseryeok(1984, 10, 12);

    expect(result.saju.hourPillar).toBeNull();
    expect(result.pillars.hour).toBeNull();
    expect(result.hiddenStems.hour).toBeNull();
    expect(result.twelveStates.hour).toBeNull();
    expect(result.twelveSpirits.hour).toBeNull();
  });
});

describe('PDF 검증: 박정은 1981/08/23 16:00 여 인천(126.5°)', () => {
  const result = calculateManseryeok(1981, 8, 23, 16, 0, {
    longitude: 126.5,
    isMale: false,
  });

  test('사주팔자', () => {
    expect(result.saju.yearPillar).toBe('신유');
    expect(result.saju.monthPillar).toBe('병신');
    expect(result.saju.dayPillar).toBe('계유');
    expect(result.saju.hourPillar).toBe('경신');
  });

  test('천간 십성 (시/일/월/년: 정인/비견/정재/편인)', () => {
    expect(result.tenGods.stem.hour).toBe('정인');
    expect(result.tenGods.stem.day).toBe('비견');
    expect(result.tenGods.stem.month).toBe('정재');
    expect(result.tenGods.stem.year).toBe('편인');
  });

  test('지지 십성 (시/일/월/년: 정인/편인/정인/편인)', () => {
    expect(result.tenGods.branch.hour).toBe('정인');
    expect(result.tenGods.branch.day).toBe('편인');
    expect(result.tenGods.branch.month).toBe('정인');
    expect(result.tenGods.branch.year).toBe('편인');
  });

  test('12운성 (시/일/월/년: 사/병/사/병)', () => {
    expect(result.twelveStates.hour).toBe('사');
    expect(result.twelveStates.day).toBe('병');
    expect(result.twelveStates.month).toBe('사');
    expect(result.twelveStates.year).toBe('병');
  });

  test('12신살 (시/일/월/년: 망신살/장성살/망신살/장성살)', () => {
    expect(result.twelveSpirits.hour).toBe('망신살');
    expect(result.twelveSpirits.day).toBe('장성살');
    expect(result.twelveSpirits.month).toBe('망신살');
    expect(result.twelveSpirits.year).toBe('장성살');
  });

  test('오행 비율', () => {
    expect(result.fiveElements.percentages.목).toBe('0.0%');
    expect(result.fiveElements.percentages.화).toBe('12.5%');
    expect(result.fiveElements.percentages.토).toBe('0.0%');
    expect(result.fiveElements.percentages.금).toBe('75.0%');
    expect(result.fiveElements.percentages.수).toBe('12.5%');
  });

  test('신강 레벨/용신', () => {
    expect(result.bodyStrength.level).toBe('태강');
    expect(result.usefulGod.usefulElement).toBe('목');
  });

  test('대운 순행 (여+음간 신)', () => {
    expect(result.majorFortune).not.toBeNull();
    expect(result.majorFortune!.isForward).toBe(true);
  });

  test('대운 간지', () => {
    const pillars = result.majorFortune!.fortunes.map((f) => f.pillar);
    expect(pillars).toEqual(['정유', '무술', '기해', '경자', '신축', '임인', '계묘', '갑진', '을사', '병오']);
  });
});

describe('PDF 검증: 쿠미 1993/09/24 시간모름 여 도쿄', () => {
  const result = calculateManseryeok(1993, 9, 24, undefined, undefined, {
    isMale: false,
  });

  test('사주팔자 (시주 null)', () => {
    expect(result.saju.yearPillar).toBe('계유');
    expect(result.saju.monthPillar).toBe('신유');
    expect(result.saju.dayPillar).toBe('무신');
    expect(result.saju.hourPillar).toBeNull();
  });

  test('천간 십성 (일/월/년: 비견/상관/정재)', () => {
    expect(result.tenGods.stem.day).toBe('비견');
    expect(result.tenGods.stem.month).toBe('상관');
    expect(result.tenGods.stem.year).toBe('정재');
    expect(result.tenGods.stem.hour).toBeNull();
  });

  test('지지 십성 (일/월/년: 식신/상관/상관)', () => {
    expect(result.tenGods.branch.day).toBe('식신');
    expect(result.tenGods.branch.month).toBe('상관');
    expect(result.tenGods.branch.year).toBe('상관');
    expect(result.tenGods.branch.hour).toBeNull();
  });

  test('12운성 (일/월/년: 병/사/사)', () => {
    expect(result.twelveStates.day).toBe('병');
    expect(result.twelveStates.month).toBe('사');
    expect(result.twelveStates.year).toBe('사');
    expect(result.twelveStates.hour).toBeNull();
  });

  test('12신살 월/일 (월=장성살, 일=망신살)', () => {
    expect(result.twelveSpirits.month).toBe('장성살');
    expect(result.twelveSpirits.day).toBe('망신살');
    expect(result.twelveSpirits.hour).toBeNull();
  });

  test('오행 비율', () => {
    expect(result.fiveElements.percentages.목).toBe('0.0%');
    expect(result.fiveElements.percentages.화).toBe('0.0%');
    expect(result.fiveElements.percentages.토).toBe('16.7%');
    expect(result.fiveElements.percentages.금).toBe('66.7%');
    expect(result.fiveElements.percentages.수).toBe('16.7%');
  });

  test('신강 레벨/용신/종용신', () => {
    expect(result.bodyStrength.level).toBe('극약');
    expect(result.usefulGod.usefulElement).toBe('화');
    expect(result.usefulGod.followElement).toBe('금');
  });
});

describe('PDF 검증: 김은지 1996/01/07 10:40 여 서울(127°)', () => {
  const result = calculateManseryeok(1996, 1, 7, 10, 40, {
    longitude: 127,
    isMale: false,
  });

  test('년주/일주/시주', () => {
    expect(result.saju.yearPillar).toBe('을해');
    expect(result.saju.dayPillar).toBe('계묘');
    expect(result.saju.hourPillar).toBe('정사');
  });

  test('월주 = 기축', () => {
    expect(result.saju.monthPillar).toBe('기축');
  });

  test('신강 레벨/용신', () => {
    expect(result.bodyStrength.level).toBe('태약');
    expect(result.usefulGod.usefulElement).toBe('수');
  });

  test('년/일/시 천간 십성', () => {
    expect(result.tenGods.stem.year).toBe('식신');
    expect(result.tenGods.stem.day).toBe('비견');
    expect(result.tenGods.stem.hour).toBe('편재');
  });

  test('년/일/시 지지 십성', () => {
    expect(result.tenGods.branch.year).toBe('겁재');
    expect(result.tenGods.branch.day).toBe('식신');
    expect(result.tenGods.branch.hour).toBe('정재');
  });

  test('년/일/시 12운성', () => {
    expect(result.twelveStates.year).toBe('제왕');
    expect(result.twelveStates.day).toBe('장생');
    expect(result.twelveStates.hour).toBe('태');
  });

  test('년/일/시 12신살', () => {
    expect(result.twelveSpirits.year).toBe('지살');
    expect(result.twelveSpirits.day).toBe('장성살');
    expect(result.twelveSpirits.hour).toBe('역마살');
  });

  test('대운 순행 (여+음간 을)', () => {
    expect(result.majorFortune).not.toBeNull();
    expect(result.majorFortune!.isForward).toBe(true);
  });
});
