import tickersData from './tickers.json';

// 티커 심볼로 종목 조회 함수
export const getStockByTicker = (ticker) => {
  // 티커를 대문자로 변환하여 검색
  const upperTicker = ticker.toUpperCase();
  return tickersData.find(stock => stock.ticker === upperTicker) || null;
};

// 모든 종목 데이터 가져오기
export const getAllStocks = () => {
  return tickersData;
};

// 종목 섹터 목록 가져오기
export const getAllSectors = () => {
  const sectors = new Set();
  tickersData.forEach(stock => {
    sectors.add(stock.sector);
  });
  return Array.from(sectors);
};

export default tickersData;