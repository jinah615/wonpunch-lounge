import { useState, useMemo } from 'react';
import Header from '../components/Header';
import { cardStyle as card } from '../styles/card';
import { timeToNumber } from '../utils/dateUtils';

/* ─── 드롭다운 셀렉트 기본 스타일 ─── */
const selectStyle = {
  width: '100%',
  height: '44px',
  border: '1px solid #d1d5db',
  borderRadius: '4px',
  paddingLeft: '10px',
  paddingRight: '32px',
  fontSize: 'clamp(12px, 3vw, 14px)',
  color: '#111111',
  background: '#ffffff',
  cursor: 'pointer',
  textAlign: 'center',
  textAlignLast: 'center',
  outline: 'none',
};

const linkStyle = {
  background: 'none', border: 'none', fontSize: '12px',
  color: '#888888', textDecoration: 'underline', cursor: 'pointer', padding: 0,
};

/**
 * 드롭다운 행 컴포넌트
 * label + select + 커스텀 화살표
 */
function SelectRow({ label, value, onChange, children }) {
  return (
    <div>
      <span style={{
        display: 'block', fontSize: '14px',
        color: '#111111', fontWeight: 500, marginBottom: '6px',
      }}>
        {label}
      </span>
      <div style={{ position: 'relative' }}>
        <select value={value} onChange={(e) => onChange(e.target.value)} style={selectStyle}>
          {children}
        </select>
        <span style={{
          position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
          fontSize: '11px', color: '#555555', pointerEvents: 'none', lineHeight: 1,
        }}>▼</span>
      </div>
    </div>
  );
}

/**
 * 면접 일정 선택 페이지 (22.png)
 * - store에서 관리자가 등록한 슬롯만 표시
 * - 마감된 슬롯은 "(마감)" 표시 + 비활성화
 * - 날짜를 먼저 선택하면 해당 날짜의 시간 옵션만 노출
 */
function SchedulePage({ user, store, onSubmit, onBack }) {
  /* 사용 가능한 날짜 목록 추출 (중복 제거, 정렬) */
  const uniqueDates = useMemo(() => {
    const dateMap = new Map();
    store.slots.forEach(s => {
      if (!dateMap.has(s.displayDate)) {
        dateMap.set(s.displayDate, s.isoDate);
      }
    });
    return [...dateMap.entries()]
      .sort((a, b) => a[1].localeCompare(b[1]))  // isoDate 순 정렬
      .map(([display, iso]) => ({ display, iso }));
  }, [store.slots]);

  const [selectedDate, setSelectedDate] = useState('');

  /* 선택한 날짜에 해당하는 시간 슬롯 목록 */
  const timeSlots = useMemo(() => {
    return store.slots
      .filter(s => s.displayDate === selectedDate)
      .sort((a, b) => timeToNumber(a.time) - timeToNumber(b.time))
      .map(s => ({
        id: s.id,
        time: s.time,
        isFull: s.closed || s.applicants.length >= s.maxCapacity,
      }));
  }, [store.slots, selectedDate]);

  const [selectedTime, setSelectedTime] = useState('');

  /* 날짜 변경 시 시간 초기화 */
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    setSelectedTime('');
  };

  /* 해당 날짜의 모든 슬롯이 마감인지 확인 */
  const isDateFullyBooked = (displayDate) => {
    const dateSlots = store.slots.filter(s => s.displayDate === displayDate);
    return dateSlots.length > 0 && dateSlots.every(s => s.closed || s.applicants.length >= s.maxCapacity);
  };

  /** 신청하기 클릭 */
  const handleSubmit = () => {
    if (!selectedDate) {
      alert('날짜를 선택해 주세요.');
      return;
    }
    const slot = timeSlots.find(s => s.time === selectedTime);
    if (!slot) {
      alert('시간을 선택해 주세요.');
      return;
    }
    if (slot.isFull) {
      alert('선택한 시간은 이미 마감되었습니다. 다른 시간을 선택해 주세요.');
      return;
    }
    onSubmit({ slotId: slot.id, date: selectedDate, time: selectedTime });
  };

  /* 슬롯이 하나도 없는 경우 */
  const noSlots = store.slots.length === 0;

  return (
    <div style={card}>
      <Header />

      {/* ── 사용자 인사 ── */}
      <p style={{ fontSize: '15px', color: '#111111', marginBottom: '14px', lineHeight: 1.5 }}>
        <strong style={{ fontWeight: 700 }}>{user.name}님</strong>{' '}
        반갑습니다! ({user.phone})
      </p>

      {noSlots ? (
        /* 슬롯 없을 때 안내 */
        <p style={{
          fontSize: '13px', color: '#888', lineHeight: 1.7,
          textAlign: 'center', padding: '40px 0',
        }}>
          현재 신청 가능한 면접 일정이 없습니다.<br />
          관리자가 일정을 등록한 후 다시 시도해 주세요.
        </p>
      ) : (
        <>
          {/* ── 안내 문구 ── */}
          <p style={{ fontSize: '13px', color: '#555555', lineHeight: 1.7, marginBottom: '14px', letterSpacing: '0.01em' }}>
            1차 화상 면접 일정을 선택해 주시기 바랍니다.<br />
            화상 면접은 Zoom으로 진행되며,<br />
            약 30분간 인사담당자와 온라인으로 진행될 예정입니다.
          </p>
          <p style={{ fontSize: '13px', color: '#555555', lineHeight: 1.7, marginBottom: '28px', letterSpacing: '0.01em' }}>
            일정 확정 시, 24시간 이내에 Zoom 화상 면접<br />
            링크와 함께 확정 안내 문자를 발송해드립니다.
          </p>

          {/* ── 날짜 / 시간 선택 ── */}
          <div style={{ marginBottom: '28px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* 날짜 드롭다운 */}
            <SelectRow label="날짜" value={selectedDate} onChange={handleDateChange}>
              <option value="">날짜를 선택해 주세요</option>
              {uniqueDates.map(({ display }) => {
                const fullyBooked = isDateFullyBooked(display);
                return (
                  <option key={display} value={display} disabled={fullyBooked}>
                    {display}{fullyBooked ? ' (마감)' : ''}
                  </option>
                );
              })}
            </SelectRow>

            {/* 시간 드롭다운 */}
            <SelectRow label="시간" value={selectedTime} onChange={setSelectedTime}>
              <option value="">시간을 선택해 주세요</option>
              {timeSlots.map(s => (
                <option key={s.id} value={s.time} disabled={s.isFull}>
                  {s.time}{s.isFull ? ' (마감)' : ''}
                </option>
              ))}
            </SelectRow>
          </div>
        </>
      )}

      {/* ── 버튼 + 링크 영역: marginTop:auto로 카드 하단 고정 ── */}
      <div style={{ marginTop: 'auto' }}>
        {!noSlots && (
          <button
            onClick={handleSubmit}
            style={{
              display: 'block', width: '100%', height: '50px',
              background: '#111111', color: '#ffffff', border: 'none', borderRadius: '4px',
              fontSize: '15px', fontWeight: 500, cursor: 'pointer',
              letterSpacing: '0.02em', marginBottom: '10px',
            }}
          >
            신청하기
          </button>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={onBack} style={linkStyle}>이전으로</button>
          <a href="https://open.kakao.com/o/seuI1oni" target="_blank" rel="noopener noreferrer" style={linkStyle}>문의하기</a>
        </div>
      </div>
    </div>
  );
}

export default SchedulePage;
