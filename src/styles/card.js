/**
 * 모든 페이지가 공유하는 카드 스타일
 * - 데스크톱: 420px 고정 / 모바일: 화면 너비에 맞게 축소
 * - display:flex + flexDirection:column → 하단 버튼을 marginTop:auto로 밀어내기
 */
export const cardStyle = {
  background: '#ffffff',
  border: '1px solid #dddddd',
  borderRadius: '10px',
  padding: 'clamp(20px, 5vw, 32px)',  /* 모바일 20px ~ 데스크톱 32px */
  width: '100%',
  maxWidth: '420px',
  minHeight: '520px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
  display: 'flex',
  flexDirection: 'column',
};
