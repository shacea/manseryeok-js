/**
 * JSON 데이터를 TypeScript 코드로 변환하는 스크립트
 *
 * raw-data/ 폴더의 JSON 파일을 읽어서 src/data/ 폴더에 TypeScript 파일로 생성합니다.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM에서 __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 경로 설정
const RAW_DATA_DIR = path.join(__dirname, '../raw-data');
const OUTPUT_DATA_DIR = path.join(__dirname, '../src/data');

// ============================================
// 타입 정의
// ============================================

interface ManseryeokDateRow {
  id: number;
  lunar_year: number;
  lunar_month: number;
  lunar_day: number;
  is_leap_month: number;
  solar_year: number;
  solar_month: number;
  solar_day: number;
  year_pillar_id: number;
  month_pillar_id: number;
  day_pillar_id: number;
  julian_day: number;
}

interface SixtyPillarRow {
  id: number;
  name: string;
  korean_name: string;
  chinese_name: string;
  element: string;
  nature: string;
}

// ============================================
// 60갑자 데이터 생성
// ============================================

/**
 * sixty-pillars.ts 생성
 */
function generateSixtyPillarsTS(): string {
  const filePath = path.join(RAW_DATA_DIR, 'sixty-pillars.json');
  const data: SixtyPillarRow[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  const animals = ['쥐', '소', '호끼', '토끼', '용', '뱀', '말', '양', '원숭이', '원숭이', '닭', '돼지'];
  const dizhiElements = ['수', '토', '목', '목', '화', '화', '토', '토', '금', '금', '금', '수'];

  function getAnimal(dizhiId: number): string {
    return animals[dizhiId];
  }

  function getDizhiElement(dizhiId: number): string {
    return dizhiElements[dizhiId];
  }

  const pillars = data.map((p, idx) => {
    // ID로 천간/지지 계산
    const tianganId = p.id % 10;
    const dizhiId = p.id % 12;

    // 한글 한자 분리
    const korean = p.korean_name;
    const hanja = p.chinese_name;

    return `  {
    id: ${p.id},
    tiangan: {
      id: ${tianganId},
      hangul: '${korean[0]}',
      hanja: '${hanja[0]}',
      element: '${p.element}'
    },
    dizhi: {
      id: ${dizhiId},
      hangul: '${korean[1]}',
      hanja: '${hanja[1]}',
      animal: '${getAnimal(dizhiId)}',
      element: '${getDizhiElement(dizhiId)}'
    },
    combined: {
      hangul: '${p.korean_name}',
      hanja: '${p.chinese_name}'
    },
    element: '${p.element}',
    yinYang: '${p.nature}'
  }`;
  });

  return `/**
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
${pillars.join(',\n')}
] as const;

/**
 * ID로 60갑자 조회
 * @param id 0~59
 * @returns 60갑자 정보
 */
export function getPillarById(id: number): SixtyPillar {
  if (id < 0 || id >= 60) {
    throw new RangeError(\`Pillar ID must be 0~59, got \${id}\`);
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
`;
}

// ============================================
// 날짜 인덱스 데이터 생성
// ============================================

/**
 * date-index.ts 생성 (manseryeok-dates.json)
 */
function generateDateIndexTS(): string {
  const filePath = path.join(RAW_DATA_DIR, 'manseryeok-dates.json');
  const data: ManseryeokDateRow[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  // 월별 인덱스 생성
  const monthlyIndex = new Map<string, {
    year: number;
    month: number;
    entries: {
      jd: number;
      solar: { year: number; month: number; day: number };
      lunar: { year: number; month: number; day: number; isLeap: boolean };
      gapja: { yearPillarId: number; monthPillarId: number; dayPillarId: number };
    }[];
    startJD: number;
    endJD: number;
  }>();

  // 데이터를 월별로 그룹화
  for (const row of data) {
    const key = `${row.solar_year}-${String(row.solar_month).padStart(2, '0')}`;

    if (!monthlyIndex.has(key)) {
      monthlyIndex.set(key, {
        year: row.solar_year,
        month: row.solar_month,
        entries: [],
        startJD: row.julian_day,
        endJD: row.julian_day,
      });
    }

    const monthData = monthlyIndex.get(key)!;
    monthData.entries.push({
      jd: row.julian_day,
      solar: { year: row.solar_year, month: row.solar_month, day: row.solar_day },
      lunar: { year: row.lunar_year, month: row.lunar_month, day: row.lunar_day, isLeap: row.is_leap_month === 1 },
      gapja: {
        yearPillarId: row.year_pillar_id,
        monthPillarId: row.month_pillar_id,
        dayPillarId: row.day_pillar_id,
      },
    });
    monthData.endJD = row.julian_day;
  }

  // TypeScript 코드 생성
  const entries = Array.from(monthlyIndex.entries()).map(([key, value]) => {
    const entriesCode = value.entries.map(e =>
      `    {
      jd: ${e.jd},
      solar: { year: ${e.solar.year}, month: ${e.solar.month}, day: ${e.solar.day} },
      lunar: { year: ${e.lunar.year}, month: ${e.lunar.month}, day: ${e.lunar.day}, isLeap: ${e.lunar.isLeap} },
      gapja: { yearPillarId: ${e.gapja.yearPillarId}, monthPillarId: ${e.gapja.monthPillarId}, dayPillarId: ${e.gapja.dayPillarId} }
    }`
    ).join(',\n');

    return `  ['${key}', {
    year: ${value.year},
    month: ${value.month},
    entries: [
${entriesCode}
    ],
    startJD: ${value.startJD},
    endJD: ${value.endJD}
  }]`;
  });

  return `/**
 * 양력 → 음력 변환 인덱스
 *
 * 월별로 분할된 인덱스 구조로 빠른 조회 성능을 제공합니다.
 * 원본 데이터: manseryeok_dates 테이블
 * 레코드 수: ${data.length.toLocaleString()}
 */

import type { SolarToLunarEntry } from '../types';

/**
 * 월별 인덱스 엔트리
 */
export interface MonthlyIndex {
  year: number;
  month: number;
  entries: SolarToLunarEntry[];
  startJD: number;
  endJD: number;
}

/**
 * 양력 → 음력 변환 인덱스 (월별 분할)
 *
 * 사용법:
 * \`\`\`ts
 * const key = '2024-01';
 * const monthIndex = SOLAR_TO_LUNAR_INDEX.get(key);
 * const entry = monthIndex.entries.find(e =>
 *   e.solar.year === 2024 && e.solar.month === 1 && e.solar.day === 1
 * );
 * \`\`\`
 */
export const SOLAR_TO_LUNAR_INDEX: Map<string, MonthlyIndex> = new Map([
${entries.join(',\n')}
]);

/**
 * 특정 월의 인덱스 조회
 * @param year 양력 년
 * @param month 양력 월
 * @returns 월별 인덱스 또는 undefined
 */
export function getMonthlyIndex(year: number, month: number): MonthlyIndex | undefined {
  const key = \`\${year}-\${String(month).padStart(2, '0')}\`;
  return SOLAR_TO_LUNAR_INDEX.get(key);
}
`;
}

// ============================================
// 메인 실행 함수
// ============================================

async function main() {
  console.log('========================================');
  console.log('JSON → TypeScript 변환');
  console.log('========================================\n');

  // 출력 디렉토리 생성
  if (!fs.existsSync(OUTPUT_DATA_DIR)) {
    fs.mkdirSync(OUTPUT_DATA_DIR, { recursive: true });
  }

  try {
    // 1. 60갑자 데이터
    console.log('1. sixty-pillars.ts 생성 중...');
    const sixtyPillarsTS = generateSixtyPillarsTS();
    fs.writeFileSync(path.join(OUTPUT_DATA_DIR, 'sixty-pillars.ts'), sixtyPillarsTS);
    console.log('  ✓ 완료');

    // 2. 날짜 인덱스 데이터
    console.log('2. date-index.ts 생성 중...');
    const dateIndexTS = generateDateIndexTS();
    fs.writeFileSync(path.join(OUTPUT_DATA_DIR, 'date-index.ts'), dateIndexTS);
    console.log('  ✓ 완료');

    console.log('\n========================================');
    console.log('변환 완료');
    console.log('========================================');
    console.log(`출력 위치: ${OUTPUT_DATA_DIR}`);
    console.log('생성된 파일:');
    console.log('  - sixty-pillars.ts');
    console.log('  - date-index.ts');

  } catch (error) {
    console.error('변환 실패:', error);
    process.exit(1);
  }
}

// 스크립트로 직접 실행 시
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main as convertToJsonData };
