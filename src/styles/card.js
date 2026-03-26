/**
 * 모든 페이지가 공유하는 카드 스타일
 * - width/height 이 파일 하나에서 관리 → 3페이지 항상 동일한 크기 보장
 * - display:flex + flexDirection:column → 각 페이지에서 하단 버튼을 marginTop:auto로 밀어내기 가능
 */
export const cardStyle = {
  background: '#ffffff',
  border: '1px solid #dddddd',
  borderRadius: '10px',
  padding: '32px',
  width: '420px',       /* 고정 너비 */
  maxWidth: '100%',     /* 모바일 대응 */
  minHeight: '563px',   /* 1페이지 기준 고정 높이 */
  boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
  display: 'flex',
  flexDirection: 'column',
};
