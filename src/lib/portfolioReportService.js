// src/lib/portfolioReportService.js
import { db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

/**
 * 포트폴리오 분석 보고서를 Firestore에 저장합니다.
 * @param {string} userId - 사용자 UID
 * @param {object} reportData - 분석 보고서 데이터
 * @returns {Promise<boolean>} - 저장 성공 여부
 */
export const savePortfolioReport = async (userId, reportData) => {
  try {
    const reportRef = doc(db, `users/${userId}/portfolioReport/latest`);
    
    // 저장 시 타임스탬프 추가
    const dataToSave = {
      ...reportData,
      savedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await setDoc(reportRef, dataToSave);
    
    // 히스토리용 보고서도 저장
    const historyRef = doc(db, `users/${userId}/portfolioReport/history/${new Date().toISOString()}`);
    await setDoc(historyRef, dataToSave);
    
    return true;
  } catch (error) {
    console.error('포트폴리오 보고서 저장 중 오류 발생:', error);
    return false;
  }
};

/**
 * 포트폴리오 분석 보고서를 Firestore에서 가져옵니다.
 * @param {string} userId - 사용자 UID
 * @returns {Promise<object|null>} - 보고서 데이터 또는 null
 */
export const getPortfolioReport = async (userId) => {
  try {
    const reportRef = doc(db, `users/${userId}/portfolioReport/latest`);
    const reportDoc = await getDoc(reportRef);
    
    if (reportDoc.exists()) {
      return reportDoc.data();
    }
    
    return null;
  } catch (error) {
    console.error('포트폴리오 보고서 조회 중 오류 발생:', error);
    return null;
  }
};

/**
 * GPT 응답에서 구조화된 포트폴리오 보고서 객체로 파싱합니다.
 * @param {string} responseText - GPT 응답 텍스트
 * @returns {object} - 구조화된 보고서 객체
 */
export const parsePortfolioGptResponse = (responseText) => {
  try {
    // 기본 결과 객체 초기화
    const result = {
      summary: '',
      overweight: [],
      underweight: [],
      rebalanceAdvice: '',
      riskAnalysis: '',
      cashSuggestion: '',
      fullResponse: responseText,
      timestamp: new Date().toISOString()
    };
    
    // 요약 분석 추출
    const summaryMatch = responseText.match(/요약\s*분석[^\n]*\n+([\s\S]+?)(?=(-\s*과대|#|$))/i);
    if (summaryMatch) {
      result.summary = summaryMatch[1].trim();
    }
    
    // 과대 비중 종목 추출
    const overweightMatch = responseText.match(/과대\s*비중\s*종목[^\n]*:?\s*([^,\n]+(?:,\s*[^,\n]+)*)/i);
    if (overweightMatch) {
      const tickers = overweightMatch[1].split(',')
        .map(ticker => ticker.trim().toUpperCase())
        .filter(ticker => ticker && ticker !== 'N/A' && ticker !== '없음');
      result.overweight = tickers;
    }
    
    // 과소 비중 종목 추출
    const underweightMatch = responseText.match(/과소\s*비중\s*종목[^\n]*:?\s*([^,\n]+(?:,\s*[^,\n]+)*)/i);
    if (underweightMatch) {
      const tickers = underweightMatch[1].split(',')
        .map(ticker => ticker.trim().toUpperCase())
        .filter(ticker => ticker && ticker !== 'N/A' && ticker !== '없음');
      result.underweight = tickers;
    }
    
    // 리밸런싱 전략 추출
    const rebalanceMatch = responseText.match(/리밸런싱\s*전략[^\n]*\n+([\s\S]+?)(?=(-\s*리스크|#|$))/i);
    if (rebalanceMatch) {
      result.rebalanceAdvice = rebalanceMatch[1].trim();
    }
    
    // 리스크 분석 추출
    const riskMatch = responseText.match(/리스크\s*분석[^\n]*\n+([\s\S]+?)(?=(-\s*예수금|#|$))/i);
    if (riskMatch) {
      result.riskAnalysis = riskMatch[1].trim();
    }
    
    // 예수금 투자 제안 추출
    const cashMatch = responseText.match(/예수금\s*투자\s*제안[^\n]*\n+([\s\S]+?)(?=(#|$))/i);
    if (cashMatch) {
      result.cashSuggestion = cashMatch[1].trim();
    }
    
    return result;
  } catch (error) {
    console.error('포트폴리오 GPT 응답 파싱 중 오류:', error);
    return {
      summary: '분석 결과 파싱 중 오류가 발생했습니다.',
      fullResponse: responseText,
      timestamp: new Date().toISOString()
    };
  }
};

export default {
  savePortfolioReport,
  getPortfolioReport,
  parsePortfolioGptResponse
};