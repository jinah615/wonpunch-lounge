import { useState } from 'react';
import Header from '../components/Header';
import { cardStyle as card } from '../styles/card';

const inputBase = {
  border: '1px solid #d1d5db',
  borderRadius: '4px',
  height: '44px',
  padding: '0 10px',
  fontSize: '14px',
  color: '#111',
  background: '#fff',
  outline: 'none',
  width: '100%',
};

/**
 * 로그인 페이지 (11.png)
 * - 지원자 이름/핸드폰 번호 입력
 * - 중복 지원 시 팝업 표시
 * - 관리자 페이지 접근 링크
 */
function LoginPage({ onLogin, store, onAdmin }) {
  const [name, setName] = useState('');
  const [phone1, setPhone1] = useState('');
  const [phone2, setPhone2] = useState('');
  const [phone3, setPhone3] = useState('');
  const [showDupPopup, setShowDupPopup] = useState(false);

  const onlyNumbers = (setter, maxLen) => (e) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= maxLen) setter(val);
  };

  const handleSubmit = () => {
    if (!name.trim()) { alert('지원자 이름을 입력해 주세요.'); return; }
    if (!phone1 || !phone2 || !phone3) { alert('핸드폰 번호를 모두 입력해 주세요.'); return; }
    const fullPhone = `${phone1}-${phone2}-${phone3}`;
    if (store.isDuplicate(name.trim(), fullPhone)) { setShowDupPopup(true); return; }
    onLogin({ name: name.trim(), phone: fullPhone });
  };

  return (
    <div style={card}>
      <Header />

      {/* ── 인사말 섹션 ── */}
      <div style={{ marginBottom: 'clamp(16px, 4vw, 28px)' }}>
        <div style={{ fontSize: 'clamp(22px, 5vw, 28px)', lineHeight: 1, marginBottom: '6px' }}>👋</div>
        <div style={{
          fontSize: 'clamp(24px, 6vw, 30px)',
          fontWeight: 900, color: '#111111', lineHeight: 1.25,
          marginBottom: '14px', letterSpacing: '-0.01em',
        }}>
          안녕하세요!<br />만나서 반가워요!
        </div>
        <p style={{ fontSize: '13px', color: '#666666', lineHeight: 1.65, letterSpacing: '0.01em' }}>
          지원자 이력서와 동일한 성함과 연락처를<br />
          입력하신 후, '입장하기'를 눌러주세요.
        </p>
      </div>

      {/* ── 입력 폼 ── */}
      <div style={{ marginBottom: 'clamp(16px, 4vw, 28px)' }}>
        {/* 지원자 이름 */}
        <div style={{ marginBottom: '12px' }}>
          <label style={labelStyle}>지원자 이름</label>
          <input
            type="text" value={name} onChange={(e) => setName(e.target.value)}
            style={inputBase}
          />
        </div>
        {/* 핸드폰 번호 */}
        <div>
          <label style={labelStyle}>핸드폰 번호</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <input type="text" inputMode="numeric" value={phone1} onChange={onlyNumbers(setPhone1, 3)}
              style={{ ...inputBase, flex: 3, minWidth: 0, textAlign: 'center' }} />
            <span style={{ color: '#aaa', fontSize: '14px', flexShrink: 0 }}>-</span>
            <input type="text" inputMode="numeric" value={phone2} onChange={onlyNumbers(setPhone2, 4)}
              style={{ ...inputBase, flex: 4, minWidth: 0, textAlign: 'center' }} />
            <span style={{ color: '#aaa', fontSize: '14px', flexShrink: 0 }}>-</span>
            <input type="text" inputMode="numeric" value={phone3} onChange={onlyNumbers(setPhone3, 4)}
              style={{ ...inputBase, flex: 4, minWidth: 0, textAlign: 'center' }} />
          </div>
        </div>
      </div>

      {/* ── 입장하기 버튼 ── */}
      <button onClick={handleSubmit} style={btnStyle}>입장하기</button>

      {/* ── 관리자(왼쪽) + 문의하기(오른쪽) ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={onAdmin} style={linkStyle}>관리자</button>
        <a href="https://open.kakao.com/o/seuI1oni" target="_blank" rel="noopener noreferrer" style={linkStyle}>문의하기</a>
      </div>

      {/* ── 중복 지원 팝업 ── */}
      {showDupPopup && (
        <div style={overlayStyle} onClick={() => setShowDupPopup(false)}>
          <div style={popupStyle} onClick={(e) => e.stopPropagation()}>
            <p style={{ fontSize: '14px', color: '#111', lineHeight: 1.6, textAlign: 'center', fontWeight: 500 }}>
              중복지원할 수 없습니다.<br />아래 문의하기로 문의해주세요.
            </p>
            <button onClick={() => setShowDupPopup(false)} style={{ ...btnStyle, height: '40px', fontSize: '13px', marginTop: '16px' }}>
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── 스타일 상수 ─── */
const labelStyle = {
  display: 'block', fontSize: '14px', color: '#111', fontWeight: 500, marginBottom: '6px',
};
const btnStyle = {
  display: 'block', width: '100%', height: '50px',
  background: '#111', color: '#fff', border: 'none', borderRadius: '4px',
  fontSize: '15px', fontWeight: 500, cursor: 'pointer',
  letterSpacing: '0.02em', marginBottom: '10px',
};
const linkStyle = {
  background: 'none', border: 'none', fontSize: '12px',
  color: '#888', textDecoration: 'underline', cursor: 'pointer', padding: 0,
};
const overlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.4)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
};
const popupStyle = {
  background: '#fff', borderRadius: '10px', padding: '28px 24px',
  width: '320px', maxWidth: '90%', boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
};

export default LoginPage;
