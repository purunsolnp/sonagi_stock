// src/lib/reportService.js
import { db } from '../firebase';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  orderBy,
  limit
} from 'firebase/firestore';

/**
 * 분석 보고서를 Firestore에 저장합니다.
 * @param {string} userId - 사용자 UID
 * @param {string} type - 분석 타입 (stock 또는 etf)
 * @param {string} ticker - 종목 또는 ETF 티커
 * @param {object} reportData - 분석 보고서 데이터
 * @returns {Promise<boolean>} - 저장 성공 여부
 */
export const saveReport = async (userId, type, ticker, reportData) => {
  try {
    // 상위 컬렉션이 없으면 자동 생성됨
    const reportRef = doc(db, `reports/${userId}/${type}/${ticker}`);
    
    // 저장 시 타임스탬프 추가
    const dataToSave = {
      ...reportData,
      savedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await setDoc(reportRef, dataToSave);
    return true;
  } catch (error) {
    console.error('보고서 저장 중 오류 발생:', error);
    return false;
  }
};

/**
 * 특정 보고서를 Firestore에서 가져옵니다.
 * @param {string} userId - 사용자 UID
 * @param {string} type - 분석 타입 (stock 또는 etf)
 * @param {string} ticker - 종목 또는 ETF 티커
 * @returns {Promise<object|null>} - 보고서 데이터 또는 null
 */
export const getReport = async (userId, type, ticker) => {
  try {
    const reportRef = doc(db, `reports/${userId}/${type}/${ticker}`);
    const reportDoc = await getDoc(reportRef);
    
    if (reportDoc.exists()) {
      return reportDoc.data();
    }
    
    return null;
  } catch (error) {
    console.error('보고서 조회 중 오류 발생:', error);
    return null;
  }
};

/**
 * 사용자의 모든 보고서를 가져옵니다.
 * @param {string} userId - 사용자 UID
 * @param {string} type - 분석 타입 (stock, etf 또는 null로 전체)
 * @returns {Promise<Array>} - 보고서 배열
 */
export const getUserReports = async (userId, type = null) => {
  try {
    let reports = [];
    
    if (type) {
      // 특정 타입의 보고서만 가져오기
      const reportsRef = collection(db, `reports/${userId}/${type}`);
      const q = query(reportsRef, orderBy('updatedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      querySnapshot.forEach(doc => {
        reports.push({
          id: doc.id,
          type: type,
          ...doc.data()
        });
      });
    } else {
      // 모든 타입의 보고서 가져오기 (stock, etf)
      const types = ['stock', 'etf'];
      
      for (const t of types) {
        const reportsRef = collection(db, `reports/${userId}/${t}`);
        const q = query(reportsRef, orderBy('updatedAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        querySnapshot.forEach(doc => {
          reports.push({
            id: doc.id,
            type: t,
            ...doc.data()
          });
        });
      }
      
      // 날짜 기준 정렬
      reports.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }
    
    return reports;
  } catch (error) {
    console.error('사용자 보고서 조회 중 오류 발생:', error);
    return [];
  }
};

/**
 * 가장 최근에 분석한 보고서를 가져옵니다.
 * @param {string} userId - 사용자 UID
 * @param {number} count - 가져올 보고서 수 (기본값 5)
 * @returns {Promise<Array>} - 최근 보고서 배열
 */
export const getRecentReports = async (userId, count = 5) => {
  try {
    const reports = [];
    const types = ['stock', 'etf'];
    
    for (const type of types) {
      const reportsRef = collection(db, `reports/${userId}/${type}`);
      const q = query(reportsRef, orderBy('updatedAt', 'desc'), limit(count));
      const querySnapshot = await getDocs(q);
      
      querySnapshot.forEach(doc => {
        reports.push({
          id: doc.id,
          type,
          ...doc.data()
        });
      });
    }
    
    // 날짜 기준 정렬 후 개수 제한
    return reports
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, count);
  } catch (error) {
    console.error('최근 보고서 조회 중 오류 발생:', error);
    return [];
  }
};

export default {
  saveReport,
  getReport,
  getUserReports,
  getRecentReports
};