import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StockFilterForm from '../components/StockFilterForm';
import StockTable from '../components/StockTable';
import FilterPresets from '../components/FilterPresets';
import stocksData from '../data/tickers.json';

const Recommend = () => {
  const navigate = useNavigate();
  
  // 필터 상태 초기화
  const [filters, setFilters] = useState({
    perMin: '',
    perMax: '',
    roeMin: '',
    roeMax: '',
    marketCapMin: '',
    marketCapMax: '',
    dividendYieldMin: '',
    dividendYieldMax: '',
    sector: ''
  });
  
  // 종목 상태 관리
  const [stocks, setStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [selectedStocks, setSelectedStocks] = useState([]);
  
  // 컴포넌트 마운트 시 종목 데이터 로드
  useEffect(() => {
    setStocks(stocksData);
    setFilteredStocks(stocksData);
  }, []);
  
  // 필터 변경 핸들러
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };
  
  // 필터 적용 핸들러
  const applyFilters = () => {
    // 필터 값 숫자 변환 (빈 문자열은 기본값 사용)
    const {
      perMin = 0,
      perMax = Infinity,
      roeMin = 0,
      roeMax = Infinity,
      marketCapMin = 0,
      marketCapMax = Infinity,
      dividendYieldMin = 0,
      dividendYieldMax = Infinity,
      sector
    } = filters;
    
    // 필터링 로직 적용
    const filtered = stocks.filter(stock => {
      // PER 필터
      if (stock.per < perMin || stock.per > perMax) return false;
      
      // ROE 필터
      if (stock.roe < roeMin || stock.roe > roeMax) return false;
      
      // 시가총액 필터
      if (stock.marketCap < marketCapMin || stock.marketCap > marketCapMax) return false;
      
      // 배당률 필터
      if (stock.dividendYield < dividendYieldMin || stock.dividendYield > dividendYieldMax) return false;
      
      // 섹터 필터 (비어있으면 모든 섹터 포함)
      if (sector && stock.sector !== sector) return false;
      
      return true;
    });
    
    setFilteredStocks(filtered);
    
    // 필터링 후 선택된 종목 중 필터링된 목록에 없는 것들은 제거
    setSelectedStocks(prevSelected => 
      prevSelected.filter(ticker => 
        filtered.some(stock => stock.ticker === ticker)
      )
    );
  };
  
  // 프리셋 적용 핸들러
  const handleApplyPreset = (presetFilters) => {
    setFilters(presetFilters);
    // 프리셋 적용 즉시 필터링
    
    const {
      perMin = 0,
      perMax = Infinity,
      roeMin = 0,
      roeMax = Infinity,
      marketCapMin = 0,
      marketCapMax = Infinity,
      dividendYieldMin = 0,
      dividendYieldMax = Infinity,
      sector
    } = presetFilters;
    
    // 필터링 로직 적용
    const filtered = stocks.filter(stock => {
      // PER 필터
      if (stock.per < perMin || stock.per > perMax) return false;
      
      // ROE 필터
      if (stock.roe < roeMin || stock.roe > roeMax) return false;
      
      // 시가총액 필터
      if (stock.marketCap < marketCapMin || stock.marketCap > marketCapMax) return false;
      
      // 배당률 필터
      if (stock.dividendYield < dividendYieldMin || stock.dividendYield > dividendYieldMax) return false;
      
      // 섹터 필터 (비어있으면 모든 섹터 포함)
      if (sector && stock.sector !== sector) return false;
      
      return true;
    });
    
    setFilteredStocks(filtered);
  };
  
  // 종목 선택/선택 해제 핸들러
  const handleSelectStock = (tickerOrTickers) => {
    if (Array.isArray(tickerOrTickers)) {
      // 여러 티커 선택/선택 해제 (전체 선택/해제)
      setSelectedStocks(tickerOrTickers);
    } else {
      // 단일 티커 토글
      setSelectedStocks(prev => {
        if (prev.includes(tickerOrTickers)) {
          return prev.filter(ticker => ticker !== tickerOrTickers);
        } else {
          return [...prev, tickerOrTickers];
        }
      });
    }
  };
  
  // GPT 분석 요청 핸들러
  const handleRequestAnalysis = (selectedTickers) => {
    console.log('Selected tickers for GPT analysis:', selectedTickers);
    
    if (selectedTickers.length === 1) {
      // 단일 종목 분석
      navigate(`/analyze/${selectedTickers[0]}`);
    } else if (selectedTickers.length > 1) {
      // 여러 종목 비교 분석
      navigate('/analyze/compare', { 
        state: { tickers: selectedTickers } 
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">종목 추천 시스템</h1>
      
      {/* 필터 프리셋 버튼 */}
      <FilterPresets onApplyPreset={handleApplyPreset} />
      
      {/* 필터 폼 */}
      <StockFilterForm 
        filters={filters} 
        onFilterChange={handleFilterChange} 
        onSubmit={applyFilters} 
      />
      
      {/* 종목 테이블 */}
      <StockTable 
        stocks={filteredStocks} 
        selectedStocks={selectedStocks}
        onSelectStock={handleSelectStock}
        onRequestAnalysis={handleRequestAnalysis}
      />
    </div>
  );
};

export default Recommend;