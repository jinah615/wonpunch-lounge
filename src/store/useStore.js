import { useState, useEffect } from 'react';

const STORAGE_KEY = 'wonpunch_data';

/**
 * localStorage에서 초기 데이터를 읽어오는 함수
 * 저장된 데이터가 없으면 빈 슬롯 배열로 초기화
 */
const getInitialData = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* 파싱 실패 시 기본값 사용 */ }
  return { slots: [] };
};

/**
 * localStorage 기반 전역 상태 관리 훅
 * - 슬롯(면접 일정) CRUD
 * - 지원자 추가 및 중복 확인
 * - 데이터가 변경될 때마다 자동으로 localStorage에 저장
 */
export function useStore() {
  const [data, setData] = useState(getInitialData);

  /* 데이터가 바뀔 때마다 localStorage에 동기화 */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  /** 새 슬롯 추가 */
  const addSlot = ({ isoDate, displayDate, time, maxCapacity }) => {
    const newSlot = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      isoDate,
      displayDate,
      time,
      maxCapacity: Number(maxCapacity),
      applicants: [],
    };
    setData(prev => ({ ...prev, slots: [...prev.slots, newSlot] }));
  };

  /** 슬롯 삭제 */
  const removeSlot = (slotId) => {
    setData(prev => ({ ...prev, slots: prev.slots.filter(s => s.id !== slotId) }));
  };

  /** 슬롯 최대 인원 수정 */
  const updateSlotCapacity = (slotId, maxCapacity) => {
    setData(prev => ({
      ...prev,
      slots: prev.slots.map(s =>
        s.id === slotId ? { ...s, maxCapacity: Number(maxCapacity) } : s
      ),
    }));
  };

  /** 지원자를 특정 슬롯에 추가 */
  const addApplicant = (slotId, { name, phone }) => {
    const applicant = { name, phone, appliedAt: new Date().toISOString() };
    setData(prev => ({
      ...prev,
      slots: prev.slots.map(s =>
        s.id === slotId
          ? { ...s, applicants: [...s.applicants, applicant] }
          : s
      ),
    }));
  };

  /** 특정 슬롯에서 지원자 삭제 (이름+전화번호+신청시간으로 식별) */
  const removeApplicant = (slotId, appliedAt) => {
    setData(prev => ({
      ...prev,
      slots: prev.slots.map(s =>
        s.id === slotId
          ? { ...s, applicants: s.applicants.filter(a => a.appliedAt !== appliedAt) }
          : s
      ),
    }));
  };

  /** 이름+전화번호 조합으로 중복 지원 여부 확인 */
  const isDuplicate = (name, phone) =>
    data.slots.some(s => s.applicants.some(a => a.name === name && a.phone === phone));

  /** 해당 슬롯이 마감인지 확인 (수동 마감 또는 정원 초과) */
  const isSlotFull = (slotId) => {
    const slot = data.slots.find(s => s.id === slotId);
    if (!slot) return true;
    return slot.closed || slot.applicants.length >= slot.maxCapacity;
  };

  /** 슬롯 수동 마감/마감 취소 토글 */
  const toggleSlotClosed = (slotId) => {
    setData(prev => ({
      ...prev,
      slots: prev.slots.map(s =>
        s.id === slotId ? { ...s, closed: !s.closed } : s
      ),
    }));
  };

  return {
    slots: data.slots,
    addSlot,
    removeSlot,
    updateSlotCapacity,
    addApplicant,
    removeApplicant,
    isDuplicate,
    isSlotFull,
    toggleSlotClosed,
  };
}
