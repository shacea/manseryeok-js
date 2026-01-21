// 사주 계산 기능 테스트
import { calculateSaju, calculateSajuSimple } from './dist/index.esm.js';

console.log('=== 사주 계산 테스트 ===\n');

// 1. 시간이 없는 경우
console.log('1. 시간이 없는 경우:');
const saju1 = calculateSaju(1990, 5, 15);
console.log('  사주:', saju1.yearPillar + '년 ' + saju1.monthPillar + '월 ' + saju1.dayPillar + '일');
console.log('  시주:', saju1.hourPillar || '(없음)');

// 2. 시간 보정 적용
console.log('\n2. 시간 보정 적용 (1990년 5월 15일 14시 30분):');
const saju2 = calculateSaju(1990, 5, 15, 14, 30);
console.log('  사주:', saju2.yearPillar + '년 ' + saju2.monthPillar + '월 ' + saju2.dayPillar + '일 ' + saju2.hourPillar + '시');
console.log('  시간 보정:', saju2.isTimeCorrected ? '적용됨' : '미적용');
if (saju2.isTimeCorrected) {
  console.log('  보정된 시간:', saju2.correctedTime.hour + '시 ' + saju2.correctedTime.minute + '분');
}

// 3. 시간 보정 없이 간단 계산
console.log('\n3. 시간 보정 없이 간단 계산:');
const saju3 = calculateSajuSimple(1984, 2, 2, 2);
console.log('  사주:', saju3.yearPillar + '년 ' + saju3.monthPillar + '월 ' + saju3.dayPillar + '일 ' + saju3.hourPillar + '시');
console.log('  시간 보정:', saju3.isTimeCorrected ? '적용됨' : '미적용');

// 4. 다른 경도 (부산)
console.log('\n4. 부산 경도 (129도) 적용:');
const saju4 = calculateSaju(1990, 5, 15, 14, 0, { longitude: 129 });
console.log('  사주:', saju4.yearPillar + '년 ' + saju4.monthPillar + '월 ' + saju4.dayPillar + '일 ' + saju4.hourPillar + '시');
if (saju4.isTimeCorrected) {
  console.log('  보정된 시간:', saju4.correctedTime.hour + '시 ' + saju4.correctedTime.minute + '분');
}

// 5. 1976년 12월 24일 1시생 (경일, 시간 보정 확인)
console.log('\n5. 1976년 12월 24일 1시생 (경일):');
const saju5 = calculateSaju(1976, 12, 24, 1, 0);
console.log('  사주:', saju5.yearPillar + '년 ' + saju5.monthPillar + '월 ' + saju5.dayPillar + '일 ' + saju5.hourPillar + '시');
console.log('  시간 보정:', saju5.isTimeCorrected ? '적용됨' : '미적용');
if (saju5.isTimeCorrected) {
  console.log('  보정된 시간:', saju5.correctedTime.hour + '시 ' + saju5.correctedTime.minute + '분');
}

console.log('\n=== 테스트 완료 ===');
