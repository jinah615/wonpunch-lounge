import { useState } from 'react';
import logoImg from '../assets/logo.png';
import SlotManager from '../components/admin/SlotManager';
import ApplicantTable from '../components/admin/ApplicantTable';
import CalendarView from '../components/admin/CalendarView';

const TABS = [
  { key: 'slots', label: '슬롯 관리' },
  { key: 'applicants', label: '지원자 목록' },
  { key: 'calendar', label: '캘린더' },
];

/**
 * 관리자 페이지
 * - 탭 3개: 슬롯 관리 / 지원자 목록 / 캘린더
 * - 넓은 카드 레이아웃 (max-width 860px)
 */
function AdminPage({ store, onExit }) {
  const [activeTab, setActiveTab] = useState('slots');

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '20px',
    }}>
      {/* ── 관리자 카드 ── */}
      <div style={{
        background: '#fff',
        border: '1px solid #ddd',
        borderRadius: '10px',
        width: '100%',
        maxWidth: '860px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
        overflow: 'hidden',
      }}>
        {/* ── 헤더 영역 (어두운 배경) ── */}
        <div style={{
          background: '#111',
          padding: 'clamp(12px, 3vw, 20px) clamp(16px, 4vw, 28px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src={logoImg} alt="WON PUNCH" style={{ height: '32px', filter: 'brightness(100)' }} />
            <span style={{ color: '#fff', fontSize: '14px', fontWeight: 500, opacity: 0.7 }}>
              관리자 페이지
            </span>
          </div>
          {/* 사용자 페이지로 돌아가기 */}
          <button
            onClick={onExit}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '4px',
              color: '#fff',
              fontSize: '12px',
              padding: '6px 14px',
              cursor: 'pointer',
            }}
          >
            사용자 페이지로
          </button>
        </div>

        {/* ── 탭 네비게이션 ── */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #eee',
          background: '#fafafa',
        }}>
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 24px)',
                fontSize: '13px',
                fontWeight: activeTab === tab.key ? 600 : 400,
                color: activeTab === tab.key ? '#111' : '#888',
                background: activeTab === tab.key ? '#fff' : 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.key ? '2px solid #111' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── 탭 컨텐츠 ── */}
        <div style={{ padding: 'clamp(16px, 3vw, 24px) clamp(16px, 4vw, 28px)' }}>
          {activeTab === 'slots' && <SlotManager store={store} />}
          {activeTab === 'applicants' && <ApplicantTable store={store} />}
          {activeTab === 'calendar' && <CalendarView store={store} />}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
