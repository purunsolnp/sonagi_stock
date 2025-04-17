// src/lib/portfolioService.js
import { db } from '../firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  addDoc,
  deleteDoc, 
  getDocs, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid'; // uuid 패키지 필요

/**
 * 사용자의 포트폴리오 아이템 목록을 가져옵니다.
 * @param {string} userId - 사용자 UID
 * @returns {Promise<Array>} - 포트폴리오 아이템 배열
 */
export const getPortfolioItems = async (userId) => {
  try {
    const portfolioRef = collection(db, `users/${userId}/portfolio`);
    const q = query(portfolioRef, orderBy('createdAt', 'asc'));
    const snapshot = await getDocs(q);
    
    const items = [];
    snapshot.forEach(doc => {
      items.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return items;
  } catch (error) {
    console.error('포트폴리오 아이템 조회 중 오류:', error);
    return [];
  }
};

/**
 * 포트폴리오에 새 아이템을 추가합니다.
 * @param {string} userId - 사용자 UID
 * @param {object} item - 추가할 아이템 데이터
 * @returns {Promise<string|null>} - 생성된 아이템 ID 또는 null
 */
export const addPortfolioItem = async (userId, item) => {
  try {
    const portfolioRef = collection(db, `users/${userId}/portfolio`);
    
    // 현재 날짜 추가
    const itemWithDate = {
      ...item,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // ID를 직접 설정하기 위해 setDoc 사용
    const newId = item.id || uuidv4();
    const docRef = doc(portfolioRef, newId);
    await setDoc(docRef, { ...itemWithDate, id: newId });
    
    return newId;
  } catch (error) {
    console.error('포트폴리오 아이템 추가 중 오류:', error);
    return null;
  }
};

/**
 * 포트폴리오 아이템을 업데이트합니다.
 * @param {string} userId - 사용자 UID
 * @param {string} itemId - 업데이트할 아이템 ID
 * @param {object} data - 업데이트할 데이터
 * @returns {Promise<boolean>} - 업데이트 성공 여부
 */
export const updatePortfolioItem = async (userId, itemId, data) => {
  try {
    const itemRef = doc(db, `users/${userId}/portfolio/${itemId}`);
    
    // 업데이트 시간 추가
    const updatedData = {
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    await setDoc(itemRef, updatedData, { merge: true });
    return true;
  } catch (error) {
    console.error('포트폴리오 아이템 업데이트 중 오류:', error);
    return false;
  }
};

/**
 * 포트폴리오 아이템을 삭제합니다.
 * @param {string} userId - 사용자 UID
 * @param {string} itemId - 삭제할 아이템 ID
 * @returns {Promise<boolean>} - 삭제 성공 여부
 */
export const deletePortfolioItem = async (userId, itemId) => {
  try {
    const itemRef = doc(db, `users/${userId}/portfolio/${itemId}`);
    await deleteDoc(itemRef);
    return true;
  } catch (error) {
    console.error('포트폴리오 아이템 삭제 중 오류:', error);
    return false;
  }
};

/**
 * 티커 심볼로 포트폴리오 아이템 존재 여부를 확인합니다.
 * @param {Array} portfolioItems - 포트폴리오 아이템 배열
 * @param {string} ticker - 확인할 티커 심볼
 * @returns {boolean} - 아이템 존재 여부
 */
export const isTickerInPortfolio = (portfolioItems, ticker) => {
  return portfolioItems.some(item => item.ticker.toUpperCase() === ticker.toUpperCase());
};

export default {
  getPortfolioItems,
  addPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  isTickerInPortfolio
};