import { useState } from 'react';
import { formatKoreanDate, TIME_OPTIONS, timeToNumber } from '../../utils/dateUtils';

/* ─── 공통 인라인 스타일 ─── */
const inputStyle = {
  height: '38px',
  border: '1px solid #d1d5db',
  borderRadius: '4px',
  padding: '0 10px',
  fontSize: '13px',
  outline: 'none',
};

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
 * 슬롯 관리 컴포넌트
 * - 면접 날짜/시간/최대 인원 추가 폼
 * - 기존 슬롯 목록 (인원 수정, 삭제 가능)
 */
function SlotManager({ store }) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState(TIME_OPTIONS[0]);
  const [capacity, setCapacity] = useState(1);

  const [adding, setAdding] = useState(false);

  /** 슬롯 추가 핸들러 */
  const handleAdd = async () => {
    if (!date) {
      alert('날짜를 선택해 주세요.');
      return;
    }
    /* 동일 날짜+시간 중복 방지 */
    const displayDate = formatKoreanDate(date);
    const exists = store.slots.some(s => s.displayDate === displayDate && s.time === time);
    if (exists) {
      alert('이미 동일한 날짜/시간 슬롯이 존재합니다.');
      return;
    }
    setAdding(true);
    try {
      const ok = await store.addSlot({ isoDate: date, displayDate, time, maxCapacity: capacity });
      if (ok) {
        setDate('');
        setCapacity(1);
      } else {
        alert('슬롯 추가에 실패했습니다. 다시 시도해 주세요.');
      }
    } catch (err) {
      console.error(err);
      alert('슬롯 추가 중 오류가 발생했습니다.');
    } finally {
      setAdding(false);
    }
  };

  /** 슬롯을 날짜 → 시간 순으로 정렬 */
  /** 날짜 오름차순 → 같은 날짜면 24시간 기준 시간 오름차순 */
  const sortedSlots = [...store.slots].sort((a, b) => {
    if (a.isoDate !== b.isoDate) return a.isoDate.localeCompare(b.isoDate);
    return timeToNumber(a.time) - timeToNumber(b.time);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '60vh' }}>
      {/* ── 슬롯 추가 폼 (상단 고정) ── */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        alignItems: 'center',
        padding: '16px',
        background: '#f9f9f9',
        borderRadius: '8px',
        border: '1px solid #eee',
        flexShrink: 0,
        marginBottom: '16px',
      }}>
        {/* 날짜 선택 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: 500, color: '#333' }}>날짜</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ ...inputStyle, width: '160px' }}
          />
        </div>
        {/* 시간 선택 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: 500, color: '#333' }}>시간</label>
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            style={{ ...inputStyle, width: '150px', background: '#fff' }}
          >
            {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        {/* 최대 인원 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: 500, color: '#333' }}>최대 인원</label>
          <input
            type="number"
            min={1}
            max={99}
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            style={{ ...inputStyle, width: '60px', textAlign: 'center' }}
          />
        </div>
        {/* 추가 버튼 */}
        <button
          onClick={handleAdd}
          disabled={adding}
          style={{
            height: '38px',
            padding: '0 20px',
            background: adding ? '#999' : '#111',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '13px',
            fontWeight: 500,
            cursor: adding ? 'not-allowed' : 'pointer',
          }}
        >
          {adding ? '추가 중...' : '추가하기'}
        </button>
      </div>

      {/* ── 슬롯 목록 테이블 (스크롤 영역) ── */}
      <div style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
      {sortedSlots.length === 0 ? (
        <p style={{ fontSize: '13px', color: '#888', textAlign: 'center', padding: '32px 0' }}>
          등록된 면접 슬롯이 없습니다. 위에서 추가해 주세요.
        </p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fafafa' }}>
                <th style={thStyle}>날짜</th>
                <th style={thStyle}>시간</th>
                <th style={thStyle}>최대 인원</th>
                <th style={thStyle}>현재 신청</th>
                <th style={thStyle}>상태</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>마감 관리</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>삭제</th>
              </tr>
            </thead>
            <tbody>
              {sortedSlots.map(slot => {
                const capacityFull = slot.applicants.length >= slot.maxCapacity;
                const isClosed = slot.closed || capacityFull;
                return (
                  <tr key={slot.id} style={{ background: slot.closed ? '#fafafa' : 'transparent' }}>
                    <td style={tdStyle}>{slot.displayDate}</td>
                    <td style={tdStyle}>{slot.time}</td>
                    {/* 최대 인원 - 인라인 수정 */}
                    <td style={tdStyle}>
                      <input
                        type="number"
                        min={1}
                        max={99}
                        value={slot.maxCapacity}
                        onChange={(e) => store.updateSlotCapacity(slot.id, e.target.value)}
                        style={{
                          width: '50px',
                          height: '28px',
                          border: '1px solid #ddd',
                          borderRadius: '3px',
                          textAlign: 'center',
                          fontSize: '13px',
                        }}
                      />
                    </td>
                    <td style={tdStyle}>
                      {slot.applicants.length}명
                    </td>
                    <td style={tdStyle}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '10px',
                        background: slot.closed ? '#e5e5e5' : capacityFull ? '#fee2e2' : '#dcfce7',
                        color: slot.closed ? '#333333' : capacityFull ? '#dc2626' : '#16a34a',
                      }}>
                        {slot.closed ? '수동 마감' : capacityFull ? '정원 마감' : '접수중'}
                      </span>
                    </td>
                    {/* 마감 처리 / 마감 취소 버튼 */}
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      <button
                        onClick={() => store.toggleSlotClosed(slot.id)}
                        style={{
                          background: 'none',
                          border: '1px solid #ddd',
                          borderRadius: '3px',
                          padding: '4px 10px',
                          fontSize: '12px',
                          color: '#666',
                          cursor: 'pointer',
                        }}
                      >
                        {slot.closed ? '마감 취소' : '마감 처리'}
                      </button>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      <button
                        onClick={() => {
                          if (confirm(`${slot.displayDate} ${slot.time} 슬롯을 삭제하시겠습니까?`))
                            store.removeSlot(slot.id);
                        }}
                        style={{
                          background: 'none',
                          border: '1px solid #ddd',
                          borderRadius: '3px',
                          padding: '4px 10px',
                          fontSize: '12px',
                          color: '#666',
                          cursor: 'pointer',
                        }}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      </div>
    </div>
  );
}

export default SlotManager;
