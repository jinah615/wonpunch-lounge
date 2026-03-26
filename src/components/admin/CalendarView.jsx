import { useState } from 'react';
import { timeToNumber } from '../../utils/dateUtils';

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

/**
 * 캘린더 뷰 컴포넌트
 * - 월별 캘린더 그리드에 날짜별 신청 인원 표시
 * - 인원 뱃지 클릭 시 해당 날짜 지원자 상세 팝업
 * - 이전/다음 월 이동 가능
 */
function CalendarView({ store }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [popupDate, setPopupDate] = useState(null); // 팝업에 표시할 ISO 날짜

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const goPrev = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  };
  const goNext = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  };

  /** ISO 날짜 문자열 생성 */
  const toIso = (dayNum) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;

  const getCountForDay = (dayNum) => {
    const daySlots = store.slots.filter(s => s.isoDate === toIso(dayNum));
    return daySlots.reduce((sum, s) => sum + s.applicants.length, 0);
  };

  const hasSlots = (dayNum) => store.slots.some(s => s.isoDate === toIso(dayNum));

  const getSlotStatus = (dayNum) => {
    const daySlots = store.slots.filter(s => s.isoDate === toIso(dayNum));
    if (daySlots.length === 0) return 'none';
    const totalCap = daySlots.reduce((sum, s) => sum + s.maxCapacity, 0);
    const totalApp = daySlots.reduce((sum, s) => sum + s.applicants.length, 0);
    if (totalApp >= totalCap) return 'full';
    if (totalApp > 0) return 'partial';
    return 'empty';
  };

  /** 팝업에 표시할 지원자 목록 (시간순 정렬) */
  const getApplicantsForDate = (isoDate) => {
    return store.slots
      .filter(s => s.isoDate === isoDate)
      .sort((a, b) => timeToNumber(a.time) - timeToNumber(b.time))
      .flatMap(s => s.applicants.map(a => ({ ...a, time: s.time })));
  };

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  /** 팝업 날짜의 한국어 표시 */
  const popupDisplayDate = popupDate
    ? store.slots.find(s => s.isoDate === popupDate)?.displayDate || popupDate
    : '';

  return (
    <div>
      {/* ── 월 네비게이션 ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '20px', marginBottom: '20px',
      }}>
        <button onClick={goPrev} style={navBtn}>&lt; 이전</button>
        <span style={{ fontSize: '16px', fontWeight: 700, color: '#111', minWidth: '120px', textAlign: 'center' }}>
          {year}년 {month + 1}월
        </span>
        <button onClick={goNext} style={navBtn}>다음 &gt;</button>
      </div>

      {/* ── 요일 헤더 ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', marginBottom: '1px' }}>
        {DAY_LABELS.map((label, i) => (
          <div key={label} style={{
            textAlign: 'center', fontSize: '12px', fontWeight: 600, padding: '8px 0',
            background: '#f5f5f5',
            color: i === 0 ? '#dc2626' : i === 6 ? '#2563eb' : '#555',
          }}>
            {label}
          </div>
        ))}
      </div>

      {/* ── 날짜 그리드 ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px' }}>
        {cells.map((dayNum, idx) => {
          if (dayNum === null) return <div key={`empty-${idx}`} style={emptyCellStyle} />;

          const count = getCountForDay(dayNum);
          const status = getSlotStatus(dayNum);
          const iso = toIso(dayNum);
          const isToday = iso === todayStr;
          const dayOfWeek = (firstDay + dayNum - 1) % 7;

          return (
            <div key={dayNum} style={{
              ...cellStyle,
              background: isToday ? '#111' : status !== 'none' ? '#f8faff' : '#fff',
              border: '1px solid #eee',
            }}>
              <span style={{
                fontSize: '13px', fontWeight: isToday ? 700 : 400,
                color: isToday ? '#fff' :
                  dayOfWeek === 0 ? '#dc2626' :
                  dayOfWeek === 6 ? '#2563eb' : '#333',
              }}>
                {dayNum}
              </span>
              {/* 인원 뱃지 - 클릭 시 팝업 */}
              {hasSlots(dayNum) && (
                <span
                  onClick={() => setPopupDate(iso)}
                  style={{
                    fontSize: '11px', fontWeight: 600, padding: '1px 6px', borderRadius: '8px',
                    cursor: 'pointer',
                    background: status === 'full' ? '#fee2e2' :
                      status === 'partial' ? '#dbeafe' : '#f0f0f0',
                    color: status === 'full' ? '#dc2626' :
                      status === 'partial' ? '#2563eb' : '#888',
                  }}
                >
                  {count}명
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* ── 범례 ── */}
      <div style={{ display: 'flex', gap: '16px', marginTop: '16px', fontSize: '11px', color: '#666' }}>
        <span><span style={{ display: 'inline-block', width: 10, height: 10, background: '#dbeafe', borderRadius: 2, marginRight: 4 }} />접수중</span>
        <span><span style={{ display: 'inline-block', width: 10, height: 10, background: '#fee2e2', borderRadius: 2, marginRight: 4 }} />마감</span>
        <span><span style={{ display: 'inline-block', width: 10, height: 10, background: '#111', borderRadius: 2, marginRight: 4 }} />오늘</span>
      </div>

      {/* ── 지원자 상세 팝업 ── */}
      {popupDate && (
        <div style={overlayStyle} onClick={() => setPopupDate(null)}>
          <div style={popupStyle} onClick={(e) => e.stopPropagation()}>
            {/* 팝업 헤더 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111', margin: 0 }}>
                {popupDisplayDate}
              </h3>
              <button
                onClick={() => setPopupDate(null)}
                style={{
                  background: 'none', border: 'none', fontSize: '18px',
                  color: '#888', cursor: 'pointer', padding: '0 4px', lineHeight: 1,
                }}
              >
                &times;
              </button>
            </div>

            {/* 지원자 목록 */}
            {getApplicantsForDate(popupDate).length === 0 ? (
              <p style={{ fontSize: '13px', color: '#888', textAlign: 'center', padding: '16px 0' }}>
                신청한 지원자가 없습니다.
              </p>
            ) : (
              <div style={{ overflowY: 'auto', maxHeight: '300px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={popupThStyle}>이름</th>
                      <th style={popupThStyle}>연락처</th>
                      <th style={popupThStyle}>면접시간</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getApplicantsForDate(popupDate).map((a, i) => (
                      <tr key={`${a.name}-${a.appliedAt}`}>
                        <td style={popupTdStyle}>{a.name}</td>
                        <td style={popupTdStyle}>{a.phone}</td>
                        <td style={popupTdStyle}>{a.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── 스타일 상수 ─── */
const navBtn = {
  background: 'none', border: '1px solid #ddd', borderRadius: '4px',
  padding: '6px 12px', fontSize: '12px', color: '#555', cursor: 'pointer',
};
const cellStyle = {
  minHeight: '64px', padding: '6px 8px', display: 'flex',
  flexDirection: 'column', alignItems: 'center', gap: '4px', borderRadius: '4px',
};
const emptyCellStyle = {
  minHeight: '64px', background: '#fafafa', borderRadius: '4px',
};
const overlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.4)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 1000,
};
const popupStyle = {
  background: '#fff', borderRadius: '10px', padding: '24px',
  width: '420px', maxWidth: '90%', boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
};
const popupThStyle = {
  padding: '8px 10px', fontSize: '12px', fontWeight: 600, color: '#555',
  textAlign: 'left', borderBottom: '2px solid #e5e5e5',
};
const popupTdStyle = {
  padding: '8px 10px', fontSize: '13px', color: '#333',
  borderBottom: '1px solid #f0f0f0',
};

export default CalendarView;
