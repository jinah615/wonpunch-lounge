import Header from '../components/Header';
import { cardStyle as card } from '../styles/card';

/**
 * 신청 완료 페이지 (33.png)
 * 모든 내용이 가운데 정렬 - 완료 아이콘, 신청 정보, 안내 문구, 문의하기 링크
 */
function CompletePage({ user, schedule, onRestart }) {
  return (
    <div style={card}>
      <Header />

      {/* ── 완료 아이콘 + 이름 ── */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        {/* 초록 체크 이모지 */}
        <div style={{ fontSize: '24px', lineHeight: 1, marginBottom: '10px' }}>✅</div>
        {/* 이름 + 전화번호 */}
        <p style={{
          fontSize: '15px',
          fontWeight: 700,
          color: '#111111',
          letterSpacing: '0.01em',
        }}>
          {user.name}님 ({user.phone})
        </p>
      </div>

      {/* ── 신청 정보 블록 ── */}
      <div style={{
        textAlign: 'center',
        marginBottom: '20px',
        lineHeight: 1.7,
      }}>
        <p style={{ fontSize: 'clamp(12px, 3.5vw, 14px)', fontWeight: 700, color: '#111111' }}>[신청정보]</p>
        <p style={{ fontSize: 'clamp(12px, 3.5vw, 14px)', fontWeight: 700, color: '#111111' }}>{schedule.date}</p>
        <p style={{ fontSize: 'clamp(12px, 3.5vw, 14px)', fontWeight: 700, color: '#111111' }}>{schedule.time}</p>
      </div>

      {/* ── 완료 안내 문구 1 ── */}
      <p style={{
        textAlign: 'center',
        fontSize: '13px',
        color: '#555555',
        lineHeight: 1.75,
        marginBottom: '16px',
        letterSpacing: '0.01em',
      }}>
        1차 화상면접 신청이 완료되었습니다.<br />
        24시간 이내 확정 문자를 보내드릴 예정입니다.<br />
        잠시만 기다려 주세요.
      </p>

      {/* ── 완료 안내 문구 2 ── */}
      <p style={{
        textAlign: 'center',
        fontSize: '13px',
        color: '#555555',
        lineHeight: 1.75,
        marginBottom: '24px',
        letterSpacing: '0.01em',
      }}>
        24시간이 지나도 확정 문자를 받지 못하신 경우,<br />
        아래 '문의하기'를 통해 문의해 주시기 바랍니다.
      </p>

      {/* ── 처음으로(왼쪽) + 문의하기(오른쪽): marginTop:auto로 카드 하단에 고정 ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto' }}>
        <button
          onClick={onRestart}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '12px',
            color: '#888888',
            textDecoration: 'underline',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          처음으로
        </button>
        <a href="https://open.kakao.com/o/seuI1oni" target="_blank" rel="noopener noreferrer" style={{
          background: 'none',
          border: 'none',
          fontSize: '12px',
          color: '#888888',
          textDecoration: 'underline',
          cursor: 'pointer',
          padding: 0,
        }}>
          문의하기
        </a>
      </div>
    </div>
  );
}

export default CompletePage;
