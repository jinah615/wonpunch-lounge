import { useState } from 'react';
import { useStore } from './store/useStore';
import LoginPage from './pages/LoginPage';
import SchedulePage from './pages/SchedulePage';
import CompletePage from './pages/CompletePage';
import AdminPage from './pages/AdminPage';

/**
 * 앱 루트 컴포넌트
 * - useStore 훅으로 슬롯/지원자 데이터를 관리하고 각 페이지에 주입
 * - page 상태로 사용자/관리자 페이지 전환
 */
function App() {
  const store = useStore();
  const [page, setPage] = useState('login');
  const [user, setUser] = useState(null);
  const [schedule, setSchedule] = useState(null);

  /** 로그인 완료 → 일정 선택 페이지로 이동 */
  const handleLogin = (userInfo) => {
    setUser(userInfo);
    setPage('schedule');
  };

  /** 면접 신청 완료 → 슬롯에 지원자 등록 후 완료 페이지로 이동 */
  const handleSubmit = ({ slotId, date, time }) => {
    store.addApplicant(slotId, user);
    setSchedule({ date, time });
    setPage('complete');
  };

  /* 관리자 페이지는 별도 레이아웃 사용 */
  if (page === 'admin') {
    return <AdminPage store={store} onExit={() => setPage('login')} />;
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '16px', width: '100%' }}>
      {page === 'login' && (
        <LoginPage
          onLogin={handleLogin}
          store={store}
          onAdmin={() => setPage('admin')}
        />
      )}
      {page === 'schedule' && (
        <SchedulePage
          user={user}
          store={store}
          onSubmit={handleSubmit}
          onBack={() => setPage('login')}
        />
      )}
      {page === 'complete' && (
        <CompletePage user={user} schedule={schedule} onRestart={() => setPage('login')} />
      )}
    </div>
  );
}

export default App;
