import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ETFFilterForm from '../components/ETFFilterForm';
import ETFTable from '../components/ETFTable';
import ETFFilterPresets from '../components/ETFFilterPresets';
import etfsData from '../data/etfs.json';

const ETF = () => {
  const navigate = useNavigate();
  
  // 필터 상태 초기화
  const [filters, setFilters] = useState({
    dividendYieldMin: '',
    dividendYieldMax: '',
    expenseRatioMin: '',
    expenseRatioMax: '',
    aumMin: '',
    aumMax: '',
    theme: '',
    excludeLeveraged: false
  });
  
  // ETF 상태 관리
  const [etfs, setEtfs] = useState([]);
  const [filteredEtfs, setFilteredEtfs] = useState([]);
  const [selectedETFs, setSelectedETFs] = useState([]);
  
  // 컴포넌트 마운트 시 ETF 데이터 로드
  useEffect(() => {
    setEtfs(etfsData);
    setFilteredEtfs(etfsData);
  }, []);
  
  // 필터 변경 핸들러
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };
  
  // 필터 적용 핸들러
  const applyFilters = () => {
    // 필터 값 숫자 변환 (빈 문자열은 기본값 사용)
    const {
      dividendYieldMin = 0,
      dividendYieldMax = Infinity,
      expenseRatioMin = 0,
      expenseRatioMax = Infinity,
      aumMin = 0,
      aumMax = Infinity,
      theme,
      excludeLeveraged
    } = filters;
    
    // 필터링 로직 적용
    const filtered = etfs.filter(etf => {
      // 배당률 필터
      if (etf.dividendYield < dividendYieldMin || etf.dividendYield > dividendYieldMax) return false;
      
      // 총보수율 필터
      if (etf.expenseRatio < expenseRatioMin || etf.expenseRatio > expenseRatioMax) return false;
      
      // 운용자산규모 필터
      if (etf.aum < aumMin || etf.aum > aumMax) return false;
      
      // 테마 필터 (비어있으면 모든 테마 포함)
      if (theme && etf.theme !== theme) return false;
      
      // 레버리지 ETF 제외 옵션
      if (excludeLeveraged && etf.isLeveraged) return false;
      
      return true;
    });
    
    setFilteredEtfs(filtered);
    
    // 필터링 후 선택된 ETF 중 필터링된 목록에 없는 것들은 제거
    setSelectedETFs(prevSelected => 
      prevSelected.filter(ticker => 
        filtered.some(etf => etf.ticker === ticker)
      )
    );
  };
  
  // 프리셋 적용 핸들러
  const handleApplyPreset = (presetFilters) => {
    setFilters(presetFilters);
    // 프리셋 적용 즉시 필터링
    
    const {
      dividendYieldMin = 0,
      dividendYieldMax = Infinity,
      expenseRatioMin = 0,
      expenseRatioMax = Infinity,
      aumMin = 0,
      aumMax = Infinity,
      theme,
      excludeLeveraged
    } = presetFilters;
    
    // 필터링 로직 적용
    const filtered = etfs.filter(etf => {
      // 배당률 필터
      if (etf.dividendYield < dividendYieldMin || etf.dividendYield > dividendYieldMax) return false;
      
      // 총보수율 필터
      if (etf.expenseRatio < expenseRatioMin || etf.expenseRatio > expenseRatioMax) return false;
      
      // 운용자산규모 필터
      if (etf.aum < aumMin || etf.aum > aumMax) return false;
      
      // 테마 필터 (비어있으면 모든 테마 포함)
      if (theme && etf.theme !== theme) return false;
      
      // 레버리지 ETF 제외 옵션
      if (excludeLeveraged && etf.isLeveraged) return false;
      
      return true;
    });
    
    setFilteredEtfs(filtered);
  };
  
  // ETF 선택/선택 해제 핸들러
  const handleSelectETF = (tickerOrTickers) => {
    if (Array.isArray(tickerOrTickers)) {
      // 여러 티커 선택/선택 해제 (전체 선택/해제)
      setSelectedETFs(tickerOrTickers);
    } else {
      // 단일 티커 토글
      setSelectedETFs(prev => {
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
    console.log('Selected ETFs for GPT analysis:', selectedTickers);
    
    if (selectedTickers.length === 1) {
      // 단일 ETF 분석
      navigate(`/analyze/etf/${selectedTickers[0]}`);
    } else if (selectedTickers.length > 1) {
      // 여러 ETF 비교 분석
      navigate('/analyze/etf/compare', { 
        state: { tickers: selectedTickers } 
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">ETF 추천 시스템</h1>
      
      {/* 필터 프리셋 버튼 */}
      <ETFFilterPresets onApplyPreset={handleApplyPreset} />
      
      {/* 필터 폼 */}
      <ETFFilterForm 
        filters={filters} 
        onFilterChange={handleFilterChange} 
        onSubmit={applyFilters} 
      />
      
      {/* ETF 테이블 */}
      <ETFTable 
        etfs={filteredEtfs} 
        selectedETFs={selectedETFs}
        onSelectETF={handleSelectETF}
        onRequestAnalysis={handleRequestAnalysis}
      />
    </div>
  );
};

export default ETF;