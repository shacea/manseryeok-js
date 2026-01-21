# @urstory/manseryeok

Korean Lunar Calendar (만세력) JavaScript Library

한국 음력(만세력) 데이터를 제공하는 순수 JavaScript/TypeScript 라이브러리입니다.

## 왜 이 라이브러리인가?

이 라이브러리는 **한국천문연구원(KASI)**의 [음양력변환계산](https://astro.kasi.re.kr/life/pageView/8) 데이터를 기반으로 구축된 데이터베이스를 사용합니다.

기존에 중국에서 개발된 음력 라이브러리들을 사용할 수 있지만, **한국 음력과 중국 음력은 차이가 있습니다**:

- **윤달(閏月) 위치가 다릅니다**: 한국과 중국은 같은 음력 체계를 사용하지만, 윤달이 들어가는 위치가 서로 다른 경우가 많습니다.
- **시간대 차이**: 한국 표준시(KST)를 기준으로 계산합니다.
- **절기 계산 방식**: 한국천문연구원의 정확한 천문 계산법을 사용합니다.

따라서 정확한 한국 사주팔자/운세 계산을 위해서는 한국 음력 데이터를 사용하는 것이 필수적입니다.

이 라이브러리는 데이터베이스에 의존하지 않고 모든 데이터를 JavaScript 코드에 내장하여 **빠른 성능**과 **간편한 사용**을 제공합니다.

## 특징

- ✅ **1900년 ~ 2050년 지원** - 150년 이상의 한국 음력 데이터
- ✅ **DB 없는 순수 JavaScript** - 별도의 데이터베이스 설치 불필요
- ✅ **TypeScript 완전 지원** - 타입 안전성과 자동완성
- ✅ **빠른 조회 성능** - 월별 인덱싱으로 최적화된 조회
- ✅ **트리 쉐이킹 지원** - 필요한 기능만 가져가기 가능
- ✅ **KASI 데이터 기반** - 한국천문연구원 정확한 데이터

## 설치

```bash
npm install @urstory/manseryeok
```

## 사용법

### 양력 → 음력 변환

```ts
import { solarToLunar } from '@urstory/manseryeok';

const result = solarToLunar(2024, 2, 10);
console.log(result);
// {
//   solar: { year: 2024, month: 2, day: 10 },
//   lunar: { year: 2024, month: 1, day: 1, isLeapMonth: false },
//   gapja: {
//     yearPillar: '갑진',
//     yearPillarHanja: '甲辰',
//     monthPillar: '병인',
//     monthPillarHanja: '丙寅',
//     dayPillar: '갑진',
//     dayPillarHanja: '甲辰'
//   },
//   julianDay: 2460310
// }
```

### 음력 → 양력 변환

```ts
import { lunarToSolar } from '@urstory/manseryeok';

const result = lunarToSolar(2024, 1, 1, false);
console.log(result.solar);
// { year: 2024, month: 2, day: 10 }
```

### 갑자 계산

```ts
import { getGapja } from '@urstory/manseryeok';

const gapja = getGapja(1984, 2, 2);
console.log(gapja.yearPillar);      // '갑자'
console.log(gapja.yearPillarHanja); // '甲子'
```

## API 문서

### `solarToLunar(solarYear, solarMonth, solarDay)`

양력을 음력으로 변환합니다.

**매개변수:**
- `solarYear`: 양력 년 (1000~2050)
- `solarMonth`: 양력 월 (1~12)
- `solarDay`: 양력 일 (1~31)

**반환값:** `SolarToLunarResult`

**예외:**
- `OutOfRangeError`: 지원 범위 밖 연도
- `InvalidDateError`: 유효하지 않은 날짜

### `lunarToSolar(lunarYear, lunarMonth, lunarDay, isLeapMonth?)`

음력을 양력으로 변환합니다.

**매개변수:**
- `lunarYear`: 음력 년 (1000~2050)
- `lunarMonth`: 음력 월 (1~12)
- `lunarDay`: 음력 일 (1~30)
- `isLeapMonth`: 윤달 여부 (기본값: false)

**반환값:** `LunarToSolarResult`

### `getGapja(solarYear, solarMonth, solarDay)`

특정 날짜의 60갑자를 계산합니다.

**매개변수:**
- `solarYear`: 양력 년
- `solarMonth`: 양력 월
- `solarDay`: 양력 일

**반환값:** `GapjaResult`

## 지원 범위

| 항목 | 범위 |
|------|------|
| 연도 | 1900년 ~ 2050년 |
| 양력 | 1900-01-01 ~ 2050-12-31 |
| 음력 | 1900-01-01 ~ 2050-12-31 (윤달 포함) |

## 번들 크기

모든 만세력 데이터를 코드에 내장하고 있어 번들 크기가 큽니다:

| 포맷 | 크기 |
|------|------|
| ESM | ~16 MB |
| CJS | ~16 MB |
| Gzip | ~4 MB |

번들 크기가 큰 이유는 1900년~2050년의 모든 음력 데이터와 60갑자 정보를 포함하고 있기 때문입니다.

## 성능

| 작업 | 시간 |
|------|------|
| 양력→음력 변환 | < 0.1ms |
| 음력→양력 변환 | < 0.1ms |
| 갑자 계산 | < 0.1ms |
| 절기 조회 (연도) | < 1ms |

## 라이선스

MIT © [urstory](https://github.com/urstory)

## 관련 프로젝트

- [즐거운 사주](https://www.enjoysaju.com) - 한국 사주/운세 서비스

## 기여

이 프로젝트에 기여하고 싶으시다면 [CONTRIBUTING.md](CONTRIBUTING.md)를 참고해 주세요.
