import logoImg from '../assets/logo.png';

/**
 * 공통 헤더 컴포넌트
 * - 왼쪽: logo.png (아이콘 + "WON PUNCH" 텍스트 포함)
 * - 오른쪽: "원펀치 채용 라운지" 텍스트
 * - 모바일에서 로고/폰트 축소
 */
function Header() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 'clamp(16px, 4vw, 28px)',
    }}>
      <img
        src={logoImg}
        alt="WON PUNCH"
        style={{ height: 'clamp(40px, 10vw, 72px)', width: 'auto' }}
      />
      <span style={{
        fontSize: 'clamp(10px, 2.5vw, 12px)',
        color: '#888888',
        whiteSpace: 'nowrap',
        letterSpacing: '0.01em',
      }}>
        원펀치 채용 라운지
      </span>
    </div>
  );
}

export default Header;
