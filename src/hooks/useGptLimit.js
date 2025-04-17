// src/hooks/useGptLimit.js
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, setDoc, increment } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

/**
 * 사용자의 GPT 사용 제한을 관리하는 훅
 * @returns {object} - GPT 사용 제한 관련 상태 및 함수
 */
export const useGptLimit = () => {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [canUseGpt, setCanUseGpt] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [usageLimit, setUsageLimit] = useState(5); // 기본 제한값
  const [isLimitEnabled, setIsLimitEnabled] = useState(true);
  const [error, setError] = useState(null);

  // 사용자의 GPT 사용 제한 정보 로드
  useEffect(() => {
    const loadUserLimits = async () => {
      if (!currentUser) {
        setIsLoading(false);
        setCanUseGpt(false);
        return;
      }

      setIsLoading(true);
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          
          // 사용 제한 정보 설정
          const limitEnabled = userData.gpt_limit_enabled ?? true;
          const limit = userData.gpt_limit ?? 5;
          const usage = userData.gpt_usage_this_month ?? 0;
          
          setIsLimitEnabled(limitEnabled);
          setUsageLimit(limit);
          setUsageCount(usage);
          setCanUseGpt(!limitEnabled || usage < limit);
        } else {
          // 사용자 문서가 없으면 기본값으로 생성
          await setDoc(userRef, {
            gpt_limit_enabled: true,
            gpt_limit: 5,
            gpt_usage_this_month: 0,
            created_at: new Date()
          });
          
          setIsLimitEnabled(true);
          setUsageLimit(5);
          setUsageCount(0);
          setCanUseGpt(true);
        }
        
        setError(null);
      } catch (err) {
        console.error('GPT 사용 제한 정보 로드 중 오류:', err);
        setError('사용 제한 정보를 불러오는 데 실패했습니다.');
        setCanUseGpt(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserLimits();
    
    // 매월 1일에 사용량 초기화를 위한 날짜 확인
    const checkMonthlyReset = () => {
      const now = new Date();
      if (now.getDate() === 1 && now.getHours() === 0 && now.getMinutes() < 10) {
        // 매월 1일 자정~10분 사이에 접속한 경우, 사용량 초기화
        resetMonthlyUsage();
      }
    };
    
    checkMonthlyReset();
    
  }, [currentUser]);

  // GPT 사용 시 카운트 증가
  const incrementUsage = async () => {
    if (!currentUser) return false;

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      
      // 사용량 증가
      await updateDoc(userRef, {
        gpt_usage_this_month: increment(1)
      });
      
      // 로컬 상태 업데이트
      setUsageCount(prev => {
        const newCount = prev + 1;
        setCanUseGpt(!isLimitEnabled || newCount < usageLimit);
        return newCount;
      });
      
      return true;
    } catch (err) {
      console.error('GPT 사용량 증가 중 오류:', err);
      setError('사용량 업데이트에 실패했습니다.');
      return false;
    }
  };

  // 관리자가 사용자의 월간 사용량 초기화
  const resetMonthlyUsage = async (userId = currentUser?.uid) => {
    if (!userId) return false;

    try {
      const userRef = doc(db, 'users', userId);
      
      await updateDoc(userRef, {
        gpt_usage_this_month: 0
      });
      
      if (userId === currentUser?.uid) {
        setUsageCount(0);
        setCanUseGpt(true);
      }
      
      return true;
    } catch (err) {
      console.error('GPT 사용량 초기화 중 오류:', err);
      setError('사용량 초기화에 실패했습니다.');
      return false;
    }
  };

  // 관리자가 사용자의 제한 설정 변경
  const updateUserLimit = async (userId, newLimit, limitEnabled = true) => {
    if (!userId) return false;

    try {
      const userRef = doc(db, 'users', userId);
      
      await updateDoc(userRef, {
        gpt_limit: newLimit,
        gpt_limit_enabled: limitEnabled
      });
      
      if (userId === currentUser?.uid) {
        setUsageLimit(newLimit);
        setIsLimitEnabled(limitEnabled);
        setCanUseGpt(!limitEnabled || usageCount < newLimit);
      }
      
      return true;
    } catch (err) {
      console.error('GPT 제한 설정 변경 중 오류:', err);
      setError('제한 설정 변경에 실패했습니다.');
      return false;
    }
  };

  return {
    isLoading,
    canUseGpt,
    usageCount,
    usageLimit,
    isLimitEnabled,
    error,
    incrementUsage,
    resetMonthlyUsage,
    updateUserLimit
  };
};

export default useGptLimit;