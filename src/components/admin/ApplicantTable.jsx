import { formatDateTime } from '../../utils/dateUtils';

/* ─── 테이블 스타일 ─── */
const thStyle = {
  padding: '10px 12px',
  fontSize: '12px',
  fontWeight: 600,
  color: '#555',
  textAlign: 'left',
  borderBottom: '2px solid #e5e5e5',
  whiteSpace: 'nowrap',
};

const tdStyle = {
  padding: '10px 12px',
  fontSize: '13px',
  color: '#333',
  borderBottom: '1px solid #f0f0f0',
  whiteSpace: 'nowrap',
};

/**
 * 지원자 목록 테이블 컴포넌트
 * 모든 슬롯의 지원자를 한 테이블에 표시
 * (이름, 연락처, 신청일시, 면접날짜, 면접시간, 삭제)
 */
function ApplicantTable({ store }) {
  /* 모든 슬롯에서 지원자 목록을 추출하여 하나의 배열로 합침 (슬롯 ID 포함) */
  const allApplicants = store.slots.flatMap(slot =>
    slot.applicants.map(a => ({
      ...a,
      slotId: slot.id,
      displayDate: slot.displayDate,
      time: slot.time,
    }))
  );

  /* 신청일시 기준 최신순 정렬 */
  const sorted = [...allApplicants].sort(
    (a, b) => new Date(b.appliedAt) - new Date(a.appliedAt)
  );

  /** 지원자 삭제 핸들러 (Supabase UUID id 기반 삭제) */
  const handleDelete = (applicant) => {
    if (confirm(`${applicant.name} (${applicant.phone}) 지원자를 삭제하시겠습니까?`)) {
      store.removeApplicant(applicant.id);
    }
  };

  return (
    <div>
      {/* 요약 정보 */}
      <div style={{
        display: 'flex',
        gap: '20px',
        marginBottom: '16px',
        fontSize: '13px',
        color: '#555',
      }}>
        <span>전체 신청자: <strong style={{ color: '#111' }}>{sorted.length}명</strong></span>
        <span>등록 슬롯: <strong style={{ color: '#111' }}>{store.slots.length}개</strong></span>
      </div>

      {/* 테이블 */}
      {sorted.length === 0 ? (
        <p style={{ fontSize: '13px', color: '#888', textAlign: 'center', padding: '32px 0' }}>
          아직 신청한 지원자가 없습니다.
        </p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fafafa' }}>
                <th style={thStyle}>번호</th>
                <th style={thStyle}>이름</th>
                <th style={thStyle}>연락처</th>
                <th style={thStyle}>신청일시</th>
                <th style={thStyle}>면접날짜</th>
                <th style={thStyle}>면접시간</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>삭제</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((a, idx) => (
                <tr key={`${a.slotId}-${a.appliedAt}`}>
                  <td style={tdStyle}>{idx + 1}</td>
                  <td style={{ ...tdStyle, fontWeight: 500 }}>{a.name}</td>
                  <td style={tdStyle}>{a.phone}</td>
                  <td style={tdStyle}>{formatDateTime(a.appliedAt)}</td>
                  <td style={tdStyle}>{a.displayDate}</td>
                  <td style={tdStyle}>{a.time}</td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <button
                      onClick={() => handleDelete(a)}
                      style={{
                        background: 'none',
                        border: '1px solid #ddd',
                        borderRadius: '3px',
                        padding: '4px 10px',
                        fontSize: '12px',
                        color: '#dc2626',
                        cursor: 'pointer',
                      }}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ApplicantTable;
