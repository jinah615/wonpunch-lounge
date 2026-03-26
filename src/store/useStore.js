import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Supabase 기반 전역 상태 관리 훅
 * - slots 테이블 + applicants 테이블을 조인해서 조회
 * - 모든 CRUD는 Supabase API → 완료 후 자동 재조회
 * - snake_case(DB) ↔ camelCase(컴포넌트) 매핑 내부 처리
 */
export function useStore() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * 모든 슬롯 + 지원자 데이터를 Supabase에서 조회
   * DB snake_case → 컴포넌트 camelCase로 변환
   */
  const fetchSlots = useCallback(async () => {
    const { data, error } = await supabase
      .from('slots')
      .select('*, applicants(*)')
      .order('iso_date', { ascending: true });

    if (error) {
      console.error('슬롯 조회 실패:', error);
      setLoading(false);
      return;
    }

    const mapped = (data || []).map(s => ({
      id: s.id,
      isoDate: s.iso_date,
      displayDate: s.display_date,
      time: s.time,
      maxCapacity: s.max_capacity,
      closed: s.closed,
      applicants: (s.applicants || []).map(a => ({
        id: a.id,
        name: a.name,
        phone: a.phone,
        appliedAt: a.applied_at,
        slotId: a.slot_id,
      })),
    }));

    setSlots(mapped);
    setLoading(false);
  }, []);

  /* 마운트 시 초기 데이터 로딩 */
  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  /** 새 슬롯 추가 */
  const addSlot = async ({ isoDate, displayDate, time, maxCapacity }) => {
    const { error } = await supabase.from('slots').insert({
      iso_date: isoDate,
      display_date: displayDate,
      time,
      max_capacity: Number(maxCapacity),
      closed: false,
    });
    if (error) console.error('슬롯 추가 실패:', error);
    await fetchSlots();
  };

  /** 슬롯 삭제 (CASCADE로 지원자도 함께 삭제됨) */
  const removeSlot = async (slotId) => {
    const { error } = await supabase.from('slots').delete().eq('id', slotId);
    if (error) console.error('슬롯 삭제 실패:', error);
    await fetchSlots();
  };

  /** 슬롯 최대 인원 수정 */
  const updateSlotCapacity = async (slotId, maxCapacity) => {
    const { error } = await supabase
      .from('slots')
      .update({ max_capacity: Number(maxCapacity) })
      .eq('id', slotId);
    if (error) console.error('인원 수정 실패:', error);
    await fetchSlots();
  };

  /** 슬롯 수동 마감/마감 취소 토글 */
  const toggleSlotClosed = async (slotId) => {
    const slot = slots.find(s => s.id === slotId);
    if (!slot) return;
    const { error } = await supabase
      .from('slots')
      .update({ closed: !slot.closed })
      .eq('id', slotId);
    if (error) console.error('마감 토글 실패:', error);
    await fetchSlots();
  };

  /** 지원자를 특정 슬롯에 추가 */
  const addApplicant = async (slotId, { name, phone }) => {
    const { error } = await supabase.from('applicants').insert({
      slot_id: slotId,
      name,
      phone,
    });
    if (error) console.error('지원자 추가 실패:', error);
    await fetchSlots();
  };

  /** 지원자 삭제 (UUID id 기반) */
  const removeApplicant = async (applicantId) => {
    const { error } = await supabase
      .from('applicants')
      .delete()
      .eq('id', applicantId);
    if (error) console.error('지원자 삭제 실패:', error);
    await fetchSlots();
  };

  /** 이름+전화번호 조합으로 중복 지원 여부 확인 */
  const isDuplicate = (name, phone) =>
    slots.some(s => s.applicants.some(a => a.name === name && a.phone === phone));

  /** 해당 슬롯이 마감인지 확인 (수동 마감 또는 정원 초과) */
  const isSlotFull = (slotId) => {
    const slot = slots.find(s => s.id === slotId);
    if (!slot) return true;
    return slot.closed || slot.applicants.length >= slot.maxCapacity;
  };

  return {
    slots,
    loading,
    addSlot,
    removeSlot,
    updateSlotCapacity,
    addApplicant,
    removeApplicant,
    isDuplicate,
    isSlotFull,
    toggleSlotClosed,
    refresh: fetchSlots,
  };
}
