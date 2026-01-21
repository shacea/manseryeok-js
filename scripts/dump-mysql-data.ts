/**
 * MySQL 만세력 데이터 추출 스크립트
 *
 * backend의 MySQL 데이터베이스에서 모든 만세력 데이터를 추출하여 JSON 파일로 저장합니다.
 * 실행 방법: npm run dump-data
 */

import { query } from '../../backend/src/config/database';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM에서 __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 출력 디렉토리
const OUTPUT_DIR = path.join(__dirname, '../raw-data');

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

interface SolarTermRow {
  id: number;
  solar_year: number;
  term_name: string;
  term_index: number;
  solar_longitude: number;
  term_datetime: Date;
  term_type: string;
  saju_month: number;
}

interface LunarMonthRow {
  id: number;
  lunar_year: number;
  leap_month: number;
  leap_month_size: number;
  month_sizes: number;
  raw_data: number;
  total_days: number;
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
// 데이터 덤프 함수
// ============================================

/**
 * 만세력 날짜 데이터 추출
 */
async function dumpManseryeokDates(): Promise<ManseryeokDateRow[]> {
  console.log('만세력 날짜 데이터 추출 중...');

  const rows = await query<ManseryeokDateRow>(`
    SELECT
      id,
      lunar_year as lunar_year,
      lunar_month as lunar_month,
      lunar_day as lunar_day,
      is_leap_month as is_leap_month,
      solar_year as solar_year,
      solar_month as solar_month,
      solar_day as solar_day,
      year_pillar_id as year_pillar_id,
      month_pillar_id as month_pillar_id,
      day_pillar_id as day_pillar_id,
      julian_day as julian_day
    FROM manseryeok_dates
    ORDER BY solar_year, solar_month, solar_day
  `);

  console.log(`  ✓ ${rows.length}개 레코드 추출 완료`);
  return rows;
}

/**
 * 절기 데이터 추출
 */
async function dumpSolarTerms(): Promise<SolarTermRow[]> {
  console.log('절기 데이터 추출 중...');

  const rows = await query<SolarTermRow>(`
    SELECT
      id,
      solar_year as solar_year,
      term_name as term_name,
      term_index as term_index,
      solar_longitude as solar_longitude,
      term_datetime as term_datetime,
      term_type as term_type,
      saju_month as saju_month
    FROM solar_terms
    ORDER BY solar_year, term_index
  `);

  console.log(`  ✓ ${rows.length}개 레코드 추출 완료`);
  return rows;
}

/**
 * 음력 월 데이터 추출
 */
async function dumpLunarMonths(): Promise<LunarMonthRow[]> {
  console.log('음력 월 데이터 추출 중...');

  const rows = await query<LunarMonthRow>(`
    SELECT
      id,
      lunar_year as lunar_year,
      leap_month as leap_month,
      leap_month_size as leap_month_size,
      month_sizes as month_sizes,
      raw_data as raw_data,
      total_days as total_days
    FROM lunar_months
    ORDER BY lunar_year
  `);

  console.log(`  ✓ ${rows.length}개 레코드 추출 완료`);
  return rows;
}

/**
 * 60갑자 데이터 추출
 */
async function dumpSixtyPillars(): Promise<SixtyPillarRow[]> {
  console.log('60갑자 데이터 추출 중...');

  const rows = await query<SixtyPillarRow>(`
    SELECT
      id,
      name as name,
      korean_name as korean_name,
      chinese_name as chinese_name,
      element as element,
      nature as nature
    FROM sixty_pillars
    ORDER BY id
  `);

  console.log(`  ✓ ${rows.length}개 레코드 추출 완료`);
  return rows;
}

// ============================================
// 메인 실행 함수
// ============================================

async function main() {
  console.log('========================================');
  console.log('MySQL 만세력 데이터 추출');
  console.log('========================================\n');

  // 출력 디렉토리 생성
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  try {
    // 1. 만세력 날짜 데이터
    const manseryeokDates = await dumpManseryeokDates();
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'manseryeok-dates.json'),
      JSON.stringify(manseryeokDates, null, 2)
    );

    // 2. 절기 데이터
    const solarTerms = await dumpSolarTerms();
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'solar-terms.json'),
      JSON.stringify(solarTerms, null, 2)
    );

    // 3. 음력 월 데이터
    const lunarMonths = await dumpLunarMonths();
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'lunar-months.json'),
      JSON.stringify(lunarMonths, null, 2)
    );

    // 4. 60갑자 데이터
    const sixtyPillars = await dumpSixtyPillars();
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'sixty-pillars.json'),
      JSON.stringify(sixtyPillars, null, 2)
    );

    console.log('\n========================================');
    console.log('데이터 추출 완료');
    console.log('========================================');
    console.log(`출력 위치: ${OUTPUT_DIR}`);
    console.log('파일 목록:');
    console.log('  - manseryeok-dates.json');
    console.log('  - solar-terms.json');
    console.log('  - lunar-months.json');
    console.log('  - sixty-pillars.json');
    console.log('\n다음 단계: npm run convert-data');

  } catch (error) {
    console.error('데이터 추출 실패:', error);
    process.exit(1);
  }
}

// 스크립트로 직접 실행 시
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main as dumpMysqlData };
