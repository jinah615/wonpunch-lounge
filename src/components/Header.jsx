import logoImg from '../assets/logo.png';

/**
 * 공통 헤더 컴포넌트
 * - 왼쪽: logo.png (아이콘 + "WON PUNCH" 텍스트 포함)
 * - 오른쪽: "원펀치 채용 라운지" 텍스트
 */
function Header() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '28px',
    }}>
      {/* 왼쪽: WON PUNCH 로고 이미지 */}
      <img
        src={logoImg}
        alt="WON PUNCH"
        style={{ height: '72px', width: 'auto' }}
      />

      {/* 오른쪽: 서비스 이름 */}
      <span style={{
        fontSize: '12px',
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
