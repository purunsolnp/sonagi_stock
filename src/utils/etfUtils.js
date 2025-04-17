import etfsData from '../data/etfs.json';

// 티커 심볼로 ETF 정보 조회
export const getETFByTicker = (ticker) => {
  // 티커를 대문자로 변환하여 검색
  const upperTicker = ticker.toUpperCase();
  return etfsData.find(etf => etf.ticker === upperTicker) || null;
};

// 모든 ETF 데이터 가져오기
export const getAllETFs = () => {
  return etfsData;
};

// ETF 테마 목록 가져오기
export const getAllThemes = () => {
  const themes = new Set();
  etfsData.forEach(etf => {
    themes.add(etf.theme);
  });
  return Array.from(themes);
};

export default etfsData;