/**
 * 날짜 관련 유틸리티 함수 모음
 */

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

/**
 * ISO 날짜(YYYY-MM-DD)를 한국어 형식으로 변환
 * 예: '2026-03-31' → '26년 03월 31일 (화요일)'
 */
export const formatKoreanDate = (isoDate) => {
  const [year, month, day] = isoDate.split('-');
  const d = new Date(`${isoDate}T00:00:00`);
  const dayName = DAY_NAMES[d.getDay()];
  return `${year.slice(2)}년 ${month}월 ${day}일 (${dayName}요일)`;
};

/**
 * ISO 타임스탬프를 간단한 표시용 문자열로 변환
 * 예: '2026-03-25T10:30:00.000Z' → '26.03.25 19:30'
 */
export const formatDateTime = (isoString) => {
  const d = new Date(isoString);
  const yy = String(d.getFullYear()).slice(2);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${yy}.${mm}.${dd} ${hh}:${min}`;
};

/**
 * 한국어 시간 문자열을 24시간 기준 숫자로 변환 (정렬용)
 * 예: '오전 09시 30분' → 930, '오후 01시 00분' → 1300, '오후 12시 30분' → 1230
 */
export const timeToNumber = (timeStr) => {
  const isPM = timeStr.startsWith('오후');
  const match = timeStr.match(/(\d{2})시\s*(\d{2})분/);
  if (!match) return 0;
  let hour = Number(match[1]);
  const min = Number(match[2]);
  if (isPM && hour !== 12) hour += 12;   // 오후 1시~11시 → 13~23
  if (!isPM && hour === 12) hour = 0;    // 오전 12시 → 0 (해당 없지만 안전장치)
  return hour * 100 + min;
};

/** 관리자 시간 드롭다운에 쓰이는 옵션 목록 */
export const TIME_OPTIONS = [
  '오전 09시 00분', '오전 09시 30분',
  '오전 10시 00분', '오전 10시 30분',
  '오전 11시 00분', '오전 11시 30분',
  '오후 12시 00분', '오후 12시 30분',
  '오후 01시 00분', '오후 01시 30분',
  '오후 02시 00분', '오후 02시 30분',
  '오후 03시 00분', '오후 03시 30분',
  '오후 04시 00분', '오후 04시 30분',
  '오후 05시 00분',
];
