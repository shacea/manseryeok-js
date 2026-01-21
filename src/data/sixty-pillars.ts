/**
 * 60갑자 데이터
 *
 * 갑자(Gapja)는 천간(10개)과 지지(12개)의 조합으로 만들어지는 60개의 조합입니다.
 * 60년을 주기로 순환하며, 년주/월주/일주 계산에 사용됩니다.
 */

export interface SixtyPillar {
  id: number;             // 0~59
  tiangan: {
    id: number;           // 0~9
    hangul: string;       // 갑, 을, 병, ...
    hanja: string;        // 甲, 乙, 丙, ...
    element: string;      // 오행
  };
  dizhi: {
    id: number;           // 0~11
    hangul: string;       // 자, 축, 인, ...
    hanja: string;        // 子, 丑, 寅, ...
    animal: string;       // 띠, 소, 호끼, ...
    element: string;      // 오행
  };
  combined: {
    hangul: string;       // 갑자, 을축, ...
    hanja: string;        // 甲子, 乙丑, ...
  };
  element: string;        // 전체 오행 (천간 기준)
  yinYang: string;        // 음/양
}

/**
 * 60갑자 전체 배열
 */
export const SIXTY_PILLARS: readonly SixtyPillar[] = [
  {
    id: 0,
    tiangan: {
      id: 0,
      hangul: '갑',
      hanja: '甲',
      element: '목'
    },
    dizhi: {
      id: 0,
      hangul: '자',
      hanja: '子',
      animal: '쥐',
      element: '수'
    },
    combined: {
      hangul: '갑자',
      hanja: '甲子'
    },
    element: '목',
    yinYang: '양'
  },
  {
    id: 1,
    tiangan: {
      id: 1,
      hangul: '을',
      hanja: '乙',
      element: '목'
    },
    dizhi: {
      id: 1,
      hangul: '축',
      hanja: '丑',
      animal: '소',
      element: '토'
    },
    combined: {
      hangul: '을축',
      hanja: '乙丑'
    },
    element: '목',
    yinYang: '음'
  },
  {
    id: 2,
    tiangan: {
      id: 2,
      hangul: '병',
      hanja: '丙',
      element: '화'
    },
    dizhi: {
      id: 2,
      hangul: '인',
      hanja: '寅',
      animal: '호끼',
      element: '목'
    },
    combined: {
      hangul: '병인',
      hanja: '丙寅'
    },
    element: '화',
    yinYang: '양'
  },
  {
    id: 3,
    tiangan: {
      id: 3,
      hangul: '정',
      hanja: '丁',
      element: '화'
    },
    dizhi: {
      id: 3,
      hangul: '묘',
      hanja: '卯',
      animal: '토끼',
      element: '목'
    },
    combined: {
      hangul: '정묘',
      hanja: '丁卯'
    },
    element: '화',
    yinYang: '음'
  },
  {
    id: 4,
    tiangan: {
      id: 4,
      hangul: '무',
      hanja: '戊',
      element: '토'
    },
    dizhi: {
      id: 4,
      hangul: '진',
      hanja: '辰',
      animal: '용',
      element: '화'
    },
    combined: {
      hangul: '무진',
      hanja: '戊辰'
    },
    element: '토',
    yinYang: '양'
  },
  {
    id: 5,
    tiangan: {
      id: 5,
      hangul: '기',
      hanja: '己',
      element: '토'
    },
    dizhi: {
      id: 5,
      hangul: '사',
      hanja: '巳',
      animal: '뱀',
      element: '화'
    },
    combined: {
      hangul: '기사',
      hanja: '己巳'
    },
    element: '토',
    yinYang: '음'
  },
  {
    id: 6,
    tiangan: {
      id: 6,
      hangul: '경',
      hanja: '庚',
      element: '금'
    },
    dizhi: {
      id: 6,
      hangul: '오',
      hanja: '午',
      animal: '말',
      element: '토'
    },
    combined: {
      hangul: '경오',
      hanja: '庚午'
    },
    element: '금',
    yinYang: '양'
  },
  {
    id: 7,
    tiangan: {
      id: 7,
      hangul: '신',
      hanja: '辛',
      element: '금'
    },
    dizhi: {
      id: 7,
      hangul: '미',
      hanja: '未',
      animal: '양',
      element: '토'
    },
    combined: {
      hangul: '신미',
      hanja: '辛未'
    },
    element: '금',
    yinYang: '음'
  },
  {
    id: 8,
    tiangan: {
      id: 8,
      hangul: '임',
      hanja: '壬',
      element: '수'
    },
    dizhi: {
      id: 8,
      hangul: '신',
      hanja: '申',
      animal: '원숭이',
      element: '금'
    },
    combined: {
      hangul: '임신',
      hanja: '壬申'
    },
    element: '수',
    yinYang: '양'
  },
  {
    id: 9,
    tiangan: {
      id: 9,
      hangul: '계',
      hanja: '癸',
      element: '수'
    },
    dizhi: {
      id: 9,
      hangul: '유',
      hanja: '酉',
      animal: '원숭이',
      element: '금'
    },
    combined: {
      hangul: '계유',
      hanja: '癸酉'
    },
    element: '수',
    yinYang: '음'
  },
  {
    id: 10,
    tiangan: {
      id: 0,
      hangul: '갑',
      hanja: '甲',
      element: '목'
    },
    dizhi: {
      id: 10,
      hangul: '술',
      hanja: '戌',
      animal: '닭',
      element: '금'
    },
    combined: {
      hangul: '갑술',
      hanja: '甲戌'
    },
    element: '목',
    yinYang: '양'
  },
  {
    id: 11,
    tiangan: {
      id: 1,
      hangul: '을',
      hanja: '乙',
      element: '목'
    },
    dizhi: {
      id: 11,
      hangul: '해',
      hanja: '亥',
      animal: '돼지',
      element: '수'
    },
    combined: {
      hangul: '을해',
      hanja: '乙亥'
    },
    element: '목',
    yinYang: '음'
  },
  {
    id: 12,
    tiangan: {
      id: 2,
      hangul: '병',
      hanja: '丙',
      element: '화'
    },
    dizhi: {
      id: 0,
      hangul: '자',
      hanja: '子',
      animal: '쥐',
      element: '수'
    },
    combined: {
      hangul: '병자',
      hanja: '丙子'
    },
    element: '화',
    yinYang: '양'
  },
  {
    id: 13,
    tiangan: {
      id: 3,
      hangul: '정',
      hanja: '丁',
      element: '화'
    },
    dizhi: {
      id: 1,
      hangul: '축',
      hanja: '丑',
      animal: '소',
      element: '토'
    },
    combined: {
      hangul: '정축',
      hanja: '丁丑'
    },
    element: '화',
    yinYang: '음'
  },
  {
    id: 14,
    tiangan: {
      id: 4,
      hangul: '무',
      hanja: '戊',
      element: '토'
    },
    dizhi: {
      id: 2,
      hangul: '인',
      hanja: '寅',
      animal: '호끼',
      element: '목'
    },
    combined: {
      hangul: '무인',
      hanja: '戊寅'
    },
    element: '토',
    yinYang: '양'
  },
  {
    id: 15,
    tiangan: {
      id: 5,
      hangul: '기',
      hanja: '己',
      element: '토'
    },
    dizhi: {
      id: 3,
      hangul: '묘',
      hanja: '卯',
      animal: '토끼',
      element: '목'
    },
    combined: {
      hangul: '기묘',
      hanja: '己卯'
    },
    element: '토',
    yinYang: '음'
  },
  {
    id: 16,
    tiangan: {
      id: 6,
      hangul: '경',
      hanja: '庚',
      element: '금'
    },
    dizhi: {
      id: 4,
      hangul: '진',
      hanja: '辰',
      animal: '용',
      element: '화'
    },
    combined: {
      hangul: '경진',
      hanja: '庚辰'
    },
    element: '금',
    yinYang: '양'
  },
  {
    id: 17,
    tiangan: {
      id: 7,
      hangul: '신',
      hanja: '辛',
      element: '금'
    },
    dizhi: {
      id: 5,
      hangul: '사',
      hanja: '巳',
      animal: '뱀',
      element: '화'
    },
    combined: {
      hangul: '신사',
      hanja: '辛巳'
    },
    element: '금',
    yinYang: '음'
  },
  {
    id: 18,
    tiangan: {
      id: 8,
      hangul: '임',
      hanja: '壬',
      element: '수'
    },
    dizhi: {
      id: 6,
      hangul: '오',
      hanja: '午',
      animal: '말',
      element: '토'
    },
    combined: {
      hangul: '임오',
      hanja: '壬午'
    },
    element: '수',
    yinYang: '양'
  },
  {
    id: 19,
    tiangan: {
      id: 9,
      hangul: '계',
      hanja: '癸',
      element: '수'
    },
    dizhi: {
      id: 7,
      hangul: '미',
      hanja: '未',
      animal: '양',
      element: '토'
    },
    combined: {
      hangul: '계미',
      hanja: '癸未'
    },
    element: '수',
    yinYang: '음'
  },
  {
    id: 20,
    tiangan: {
      id: 0,
      hangul: '갑',
      hanja: '甲',
      element: '목'
    },
    dizhi: {
      id: 8,
      hangul: '신',
      hanja: '申',
      animal: '원숭이',
      element: '금'
    },
    combined: {
      hangul: '갑신',
      hanja: '甲申'
    },
    element: '목',
    yinYang: '양'
  },
  {
    id: 21,
    tiangan: {
      id: 1,
      hangul: '을',
      hanja: '乙',
      element: '목'
    },
    dizhi: {
      id: 9,
      hangul: '유',
      hanja: '酉',
      animal: '원숭이',
      element: '금'
    },
    combined: {
      hangul: '을유',
      hanja: '乙酉'
    },
    element: '목',
    yinYang: '음'
  },
  {
    id: 22,
    tiangan: {
      id: 2,
      hangul: '병',
      hanja: '丙',
      element: '화'
    },
    dizhi: {
      id: 10,
      hangul: '술',
      hanja: '戌',
      animal: '닭',
      element: '금'
    },
    combined: {
      hangul: '병술',
      hanja: '丙戌'
    },
    element: '화',
    yinYang: '양'
  },
  {
    id: 23,
    tiangan: {
      id: 3,
      hangul: '정',
      hanja: '丁',
      element: '화'
    },
    dizhi: {
      id: 11,
      hangul: '해',
      hanja: '亥',
      animal: '돼지',
      element: '수'
    },
    combined: {
      hangul: '정해',
      hanja: '丁亥'
    },
    element: '화',
    yinYang: '음'
  },
  {
    id: 24,
    tiangan: {
      id: 4,
      hangul: '무',
      hanja: '戊',
      element: '토'
    },
    dizhi: {
      id: 0,
      hangul: '자',
      hanja: '子',
      animal: '쥐',
      element: '수'
    },
    combined: {
      hangul: '무자',
      hanja: '戊子'
    },
    element: '토',
    yinYang: '양'
  },
  {
    id: 25,
    tiangan: {
      id: 5,
      hangul: '기',
      hanja: '己',
      element: '토'
    },
    dizhi: {
      id: 1,
      hangul: '축',
      hanja: '丑',
      animal: '소',
      element: '토'
    },
    combined: {
      hangul: '기축',
      hanja: '己丑'
    },
    element: '토',
    yinYang: '음'
  },
  {
    id: 26,
    tiangan: {
      id: 6,
      hangul: '경',
      hanja: '庚',
      element: '금'
    },
    dizhi: {
      id: 2,
      hangul: '인',
      hanja: '寅',
      animal: '호끼',
      element: '목'
    },
    combined: {
      hangul: '경인',
      hanja: '庚寅'
    },
    element: '금',
    yinYang: '양'
  },
  {
    id: 27,
    tiangan: {
      id: 7,
      hangul: '신',
      hanja: '辛',
      element: '금'
    },
    dizhi: {
      id: 3,
      hangul: '묘',
      hanja: '卯',
      animal: '토끼',
      element: '목'
    },
    combined: {
      hangul: '신묘',
      hanja: '辛卯'
    },
    element: '금',
    yinYang: '음'
  },
  {
    id: 28,
    tiangan: {
      id: 8,
      hangul: '임',
      hanja: '壬',
      element: '수'
    },
    dizhi: {
      id: 4,
      hangul: '진',
      hanja: '辰',
      animal: '용',
      element: '화'
    },
    combined: {
      hangul: '임진',
      hanja: '壬辰'
    },
    element: '수',
    yinYang: '양'
  },
  {
    id: 29,
    tiangan: {
      id: 9,
      hangul: '계',
      hanja: '癸',
      element: '수'
    },
    dizhi: {
      id: 5,
      hangul: '사',
      hanja: '巳',
      animal: '뱀',
      element: '화'
    },
    combined: {
      hangul: '계사',
      hanja: '癸巳'
    },
    element: '수',
    yinYang: '음'
  },
  {
    id: 30,
    tiangan: {
      id: 0,
      hangul: '갑',
      hanja: '甲',
      element: '목'
    },
    dizhi: {
      id: 6,
      hangul: '오',
      hanja: '午',
      animal: '말',
      element: '토'
    },
    combined: {
      hangul: '갑오',
      hanja: '甲午'
    },
    element: '목',
    yinYang: '양'
  },
  {
    id: 31,
    tiangan: {
      id: 1,
      hangul: '을',
      hanja: '乙',
      element: '목'
    },
    dizhi: {
      id: 7,
      hangul: '미',
      hanja: '未',
      animal: '양',
      element: '토'
    },
    combined: {
      hangul: '을미',
      hanja: '乙未'
    },
    element: '목',
    yinYang: '음'
  },
  {
    id: 32,
    tiangan: {
      id: 2,
      hangul: '병',
      hanja: '丙',
      element: '화'
    },
    dizhi: {
      id: 8,
      hangul: '신',
      hanja: '申',
      animal: '원숭이',
      element: '금'
    },
    combined: {
      hangul: '병신',
      hanja: '丙申'
    },
    element: '화',
    yinYang: '양'
  },
  {
    id: 33,
    tiangan: {
      id: 3,
      hangul: '정',
      hanja: '丁',
      element: '화'
    },
    dizhi: {
      id: 9,
      hangul: '유',
      hanja: '酉',
      animal: '원숭이',
      element: '금'
    },
    combined: {
      hangul: '정유',
      hanja: '丁酉'
    },
    element: '화',
    yinYang: '음'
  },
  {
    id: 34,
    tiangan: {
      id: 4,
      hangul: '무',
      hanja: '戊',
      element: '토'
    },
    dizhi: {
      id: 10,
      hangul: '술',
      hanja: '戌',
      animal: '닭',
      element: '금'
    },
    combined: {
      hangul: '무술',
      hanja: '戊戌'
    },
    element: '토',
    yinYang: '양'
  },
  {
    id: 35,
    tiangan: {
      id: 5,
      hangul: '기',
      hanja: '己',
      element: '토'
    },
    dizhi: {
      id: 11,
      hangul: '해',
      hanja: '亥',
      animal: '돼지',
      element: '수'
    },
    combined: {
      hangul: '기해',
      hanja: '己亥'
    },
    element: '토',
    yinYang: '음'
  },
  {
    id: 36,
    tiangan: {
      id: 6,
      hangul: '경',
      hanja: '庚',
      element: '금'
    },
    dizhi: {
      id: 0,
      hangul: '자',
      hanja: '子',
      animal: '쥐',
      element: '수'
    },
    combined: {
      hangul: '경자',
      hanja: '庚子'
    },
    element: '금',
    yinYang: '양'
  },
  {
    id: 37,
    tiangan: {
      id: 7,
      hangul: '신',
      hanja: '辛',
      element: '금'
    },
    dizhi: {
      id: 1,
      hangul: '축',
      hanja: '丑',
      animal: '소',
      element: '토'
    },
    combined: {
      hangul: '신축',
      hanja: '辛丑'
    },
    element: '금',
    yinYang: '음'
  },
  {
    id: 38,
    tiangan: {
      id: 8,
      hangul: '임',
      hanja: '壬',
      element: '수'
    },
    dizhi: {
      id: 2,
      hangul: '인',
      hanja: '寅',
      animal: '호끼',
      element: '목'
    },
    combined: {
      hangul: '임인',
      hanja: '壬寅'
    },
    element: '수',
    yinYang: '양'
  },
  {
    id: 39,
    tiangan: {
      id: 9,
      hangul: '계',
      hanja: '癸',
      element: '수'
    },
    dizhi: {
      id: 3,
      hangul: '묘',
      hanja: '卯',
      animal: '토끼',
      element: '목'
    },
    combined: {
      hangul: '계묘',
      hanja: '癸卯'
    },
    element: '수',
    yinYang: '음'
  },
  {
    id: 40,
    tiangan: {
      id: 0,
      hangul: '갑',
      hanja: '甲',
      element: '목'
    },
    dizhi: {
      id: 4,
      hangul: '진',
      hanja: '辰',
      animal: '용',
      element: '화'
    },
    combined: {
      hangul: '갑진',
      hanja: '甲辰'
    },
    element: '목',
    yinYang: '양'
  },
  {
    id: 41,
    tiangan: {
      id: 1,
      hangul: '을',
      hanja: '乙',
      element: '목'
    },
    dizhi: {
      id: 5,
      hangul: '사',
      hanja: '巳',
      animal: '뱀',
      element: '화'
    },
    combined: {
      hangul: '을사',
      hanja: '乙巳'
    },
    element: '목',
    yinYang: '음'
  },
  {
    id: 42,
    tiangan: {
      id: 2,
      hangul: '병',
      hanja: '丙',
      element: '화'
    },
    dizhi: {
      id: 6,
      hangul: '오',
      hanja: '午',
      animal: '말',
      element: '토'
    },
    combined: {
      hangul: '병오',
      hanja: '丙午'
    },
    element: '화',
    yinYang: '양'
  },
  {
    id: 43,
    tiangan: {
      id: 3,
      hangul: '정',
      hanja: '丁',
      element: '화'
    },
    dizhi: {
      id: 7,
      hangul: '미',
      hanja: '未',
      animal: '양',
      element: '토'
    },
    combined: {
      hangul: '정미',
      hanja: '丁未'
    },
    element: '화',
    yinYang: '음'
  },
  {
    id: 44,
    tiangan: {
      id: 4,
      hangul: '무',
      hanja: '戊',
      element: '토'
    },
    dizhi: {
      id: 8,
      hangul: '신',
      hanja: '申',
      animal: '원숭이',
      element: '금'
    },
    combined: {
      hangul: '무신',
      hanja: '戊申'
    },
    element: '토',
    yinYang: '양'
  },
  {
    id: 45,
    tiangan: {
      id: 5,
      hangul: '기',
      hanja: '己',
      element: '토'
    },
    dizhi: {
      id: 9,
      hangul: '유',
      hanja: '酉',
      animal: '원숭이',
      element: '금'
    },
    combined: {
      hangul: '기유',
      hanja: '己酉'
    },
    element: '토',
    yinYang: '음'
  },
  {
    id: 46,
    tiangan: {
      id: 6,
      hangul: '경',
      hanja: '庚',
      element: '금'
    },
    dizhi: {
      id: 10,
      hangul: '술',
      hanja: '戌',
      animal: '닭',
      element: '금'
    },
    combined: {
      hangul: '경술',
      hanja: '庚戌'
    },
    element: '금',
    yinYang: '양'
  },
  {
    id: 47,
    tiangan: {
      id: 7,
      hangul: '신',
      hanja: '辛',
      element: '금'
    },
    dizhi: {
      id: 11,
      hangul: '해',
      hanja: '亥',
      animal: '돼지',
      element: '수'
    },
    combined: {
      hangul: '신해',
      hanja: '辛亥'
    },
    element: '금',
    yinYang: '음'
  },
  {
    id: 48,
    tiangan: {
      id: 8,
      hangul: '임',
      hanja: '壬',
      element: '수'
    },
    dizhi: {
      id: 0,
      hangul: '자',
      hanja: '子',
      animal: '쥐',
      element: '수'
    },
    combined: {
      hangul: '임자',
      hanja: '壬子'
    },
    element: '수',
    yinYang: '양'
  },
  {
    id: 49,
    tiangan: {
      id: 9,
      hangul: '계',
      hanja: '癸',
      element: '수'
    },
    dizhi: {
      id: 1,
      hangul: '축',
      hanja: '丑',
      animal: '소',
      element: '토'
    },
    combined: {
      hangul: '계축',
      hanja: '癸丑'
    },
    element: '수',
    yinYang: '음'
  },
  {
    id: 50,
    tiangan: {
      id: 0,
      hangul: '갑',
      hanja: '甲',
      element: '목'
    },
    dizhi: {
      id: 2,
      hangul: '인',
      hanja: '寅',
      animal: '호끼',
      element: '목'
    },
    combined: {
      hangul: '갑인',
      hanja: '甲寅'
    },
    element: '목',
    yinYang: '양'
  },
  {
    id: 51,
    tiangan: {
      id: 1,
      hangul: '을',
      hanja: '乙',
      element: '목'
    },
    dizhi: {
      id: 3,
      hangul: '묘',
      hanja: '卯',
      animal: '토끼',
      element: '목'
    },
    combined: {
      hangul: '을묘',
      hanja: '乙卯'
    },
    element: '목',
    yinYang: '음'
  },
  {
    id: 52,
    tiangan: {
      id: 2,
      hangul: '병',
      hanja: '丙',
      element: '화'
    },
    dizhi: {
      id: 4,
      hangul: '진',
      hanja: '辰',
      animal: '용',
      element: '화'
    },
    combined: {
      hangul: '병진',
      hanja: '丙辰'
    },
    element: '화',
    yinYang: '양'
  },
  {
    id: 53,
    tiangan: {
      id: 3,
      hangul: '정',
      hanja: '丁',
      element: '화'
    },
    dizhi: {
      id: 5,
      hangul: '사',
      hanja: '巳',
      animal: '뱀',
      element: '화'
    },
    combined: {
      hangul: '정사',
      hanja: '丁巳'
    },
    element: '화',
    yinYang: '음'
  },
  {
    id: 54,
    tiangan: {
      id: 4,
      hangul: '무',
      hanja: '戊',
      element: '토'
    },
    dizhi: {
      id: 6,
      hangul: '오',
      hanja: '午',
      animal: '말',
      element: '토'
    },
    combined: {
      hangul: '무오',
      hanja: '戊午'
    },
    element: '토',
    yinYang: '양'
  },
  {
    id: 55,
    tiangan: {
      id: 5,
      hangul: '기',
      hanja: '己',
      element: '토'
    },
    dizhi: {
      id: 7,
      hangul: '미',
      hanja: '未',
      animal: '양',
      element: '토'
    },
    combined: {
      hangul: '기미',
      hanja: '己未'
    },
    element: '토',
    yinYang: '음'
  },
  {
    id: 56,
    tiangan: {
      id: 6,
      hangul: '경',
      hanja: '庚',
      element: '금'
    },
    dizhi: {
      id: 8,
      hangul: '신',
      hanja: '申',
      animal: '원숭이',
      element: '금'
    },
    combined: {
      hangul: '경신',
      hanja: '庚申'
    },
    element: '금',
    yinYang: '양'
  },
  {
    id: 57,
    tiangan: {
      id: 7,
      hangul: '신',
      hanja: '辛',
      element: '금'
    },
    dizhi: {
      id: 9,
      hangul: '유',
      hanja: '酉',
      animal: '원숭이',
      element: '금'
    },
    combined: {
      hangul: '신유',
      hanja: '辛酉'
    },
    element: '금',
    yinYang: '음'
  },
  {
    id: 58,
    tiangan: {
      id: 8,
      hangul: '임',
      hanja: '壬',
      element: '수'
    },
    dizhi: {
      id: 10,
      hangul: '술',
      hanja: '戌',
      animal: '닭',
      element: '금'
    },
    combined: {
      hangul: '임술',
      hanja: '壬戌'
    },
    element: '수',
    yinYang: '양'
  },
  {
    id: 59,
    tiangan: {
      id: 9,
      hangul: '계',
      hanja: '癸',
      element: '수'
    },
    dizhi: {
      id: 11,
      hangul: '해',
      hanja: '亥',
      animal: '돼지',
      element: '수'
    },
    combined: {
      hangul: '계해',
      hanja: '癸亥'
    },
    element: '수',
    yinYang: '음'
  }
] as const;

/**
 * ID로 60갑자 조회
 * @param id 0~59
 * @returns 60갑자 정보
 */
export function getPillarById(id: number): SixtyPillar {
  if (id < 0 || id >= 60) {
    throw new RangeError(`Pillar ID must be 0~59, got ${id}`);
  }
  return SIXTY_PILLARS[id];
}

/**
 * 한글 갑자로 60갑자 조회
 * @param hangul 갑자 (예: "갑자", "을축")
 * @returns 60갑자 정보 또는 undefined
 */
export function getPillarByHangul(hangul: string): SixtyPillar | undefined {
  return SIXTY_PILLARS.find(p => p.combined.hangul === hangul);
}
