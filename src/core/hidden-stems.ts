/**
 * 지장간(地藏干) 모듈
 *
 * 각 지지(地支) 속에 숨어 있는 천간(天干)을 제공합니다.
 * 지장간은 여기(餘氣), 중기(中氣), 본기(本氣)로 구성됩니다.
 *
 * 순서: [여기, 중기, 본기] 또는 [여기, 본기] (중기 없는 경우)
 */

/**
 * 지장간 데이터
 * - 자(子): 임(여기), 계(본기)
 * - 축(丑): 계(여기), 신(중기), 기(본기)
 * - 인(寅): 무(여기), 병(중기), 갑(본기)
 * - 묘(卯): 갑(여기), 을(본기)
 * - 진(辰): 을(여기), 계(중기), 무(본기)
 * - 사(巳): 무(여기), 경(중기), 병(본기)
 * - 오(午): 병(여기), 기(중기), 정(본기)
 * - 미(未): 정(여기), 을(중기), 기(본기)
 * - 신(申): 무(여기), 임(중기), 경(본기)
 * - 유(酉): 경(여기), 신(본기)
 * - 술(戌): 신(여기), 정(중기), 무(본기)
 * - 해(亥): 무(여기), 갑(중기), 임(본기)
 */
export const HIDDEN_STEMS: Record<string, readonly string[]> = {
  자: ['임', '계'],
  축: ['계', '신', '기'],
  인: ['무', '병', '갑'],
  묘: ['갑', '을'],
  진: ['을', '계', '무'],
  사: ['무', '경', '병'],
  오: ['병', '기', '정'],
  미: ['정', '을', '기'],
  신: ['무', '임', '경'],
  유: ['경', '신'],
  술: ['신', '정', '무'],
  해: ['무', '갑', '임'],
} as const;

/**
 * 지장간 한자 데이터
 */
export const HIDDEN_STEMS_HANJA: Record<string, readonly string[]> = {
  자: ['壬', '癸'],
  축: ['癸', '辛', '己'],
  인: ['戊', '丙', '甲'],
  묘: ['甲', '乙'],
  진: ['乙', '癸', '戊'],
  사: ['戊', '庚', '丙'],
  오: ['丙', '己', '丁'],
  미: ['丁', '乙', '己'],
  신: ['戊', '壬', '庚'],
  유: ['庚', '辛'],
  술: ['辛', '丁', '戊'],
  해: ['戊', '甲', '壬'],
} as const;

/**
 * 지지의 지장간을 조회합니다.
 *
 * @param branch 지지 (자, 축, 인, ...)
 * @returns 지장간 배열 [여기, (중기), 본기]
 */
export function getHiddenStems(branch: string): readonly string[] {
  const result = HIDDEN_STEMS[branch];
  if (!result) throw new Error(`Invalid branch for hidden stems: ${branch}`);
  return result;
}

/**
 * 지지의 본기(本氣)를 조회합니다.
 * 본기는 지장간의 마지막 요소입니다.
 *
 * @param branch 지지
 * @returns 본기 천간
 */
export function getMainStem(branch: string): string {
  const stems = getHiddenStems(branch);
  return stems[stems.length - 1];
}

/**
 * 지장간을 한자 문자열로 반환합니다.
 * PDF 형식에 맞춤 (예: "병기정", "갑을")
 */
export function getHiddenStemsString(branch: string): string {
  return getHiddenStems(branch).join('');
}

/**
 * 지장간을 한자 문자열로 반환합니다.
 */
export function getHiddenStemsHanjaString(branch: string): string {
  const result = HIDDEN_STEMS_HANJA[branch];
  if (!result) throw new Error(`Invalid branch for hidden stems: ${branch}`);
  return result.join('');
}
