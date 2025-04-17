import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGptLimit } from '../hooks/useGptLimit';
import PortfolioTable from '../components/PortfolioTable';
import GptPortfolioReport from '../components/GptPortfolioReport';
import CashRecommendation from '../components/CashRecommendation';
import { getStockByTicker } from '../data/tickers';
import { getETFByTicker } from '../utils/etfUtils';
import portfolioService from '../lib/portfolioService';
import { callGptApi } from '../lib/gpt';
import { buildPortfolioAnalysisPrompt, buildCashRecommendationPrompt } from '../lib/portfolioPromptBuilder';
import { savePortfolioReport, getPortfolioReport, parsePortfolioGptResponse } from '../lib/portfolioReportService';

const Portfolio = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { canUseGpt, incrementUsage } = useGptLimit();
  
  // 상태 관리
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [newTicker, setNewTicker] = useState('');
  const [gptReport, setGptReport] = useState(null);
  const [savedReport, setSavedReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingCash, setLoadingCash] = useState(false);
  const [cashReport, setCashReport] = useState(null);
  const [error, setError] = useState(null);
  const [totalValue, setTotalValue] = useState(0);
  const [totalReturnAmount, setTotalReturnAmount] = useState(0);
  const [totalReturnRate, setTotalReturnRate] = useState(0);
  
  // 로그인 체크
  useEffect(() => {
    if (!currentUser) {
      navigate('/login', { 
        state: { 
          from: '/portfolio',
          message: '포트폴리오를 관리하려면 로그인이 필요합니다.' 
        } 
      });
    }
  }, [currentUser, navigate]);
  
  // 포트폴리오 데이터 로드
  useEffect(() => {
    const loadPortfolio = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const items = await portfolioService.getPortfolioItems(currentUser.uid);
        
        // 현재가 및 계산 값 추가 (임시 값, 실제로는 API 호출로 대체)
        const itemsWithCalculations = items.map(item => {
          // 임시 현재가 (실제로는 API에서 가져와야 함)
          const currentPrice = item.currentPrice || (item.avgPrice * (1 + (Math.random() * 0.2 - 0.1)));
          
          // 계산값 추가
          const totalValue = currentPrice * item.quantity;
          const returnAmount = (currentPrice - item.avgPrice) * item.quantity;
          const returnRate = ((currentPrice - item.avgPrice) / item.avgPrice) * 100;
          
          return {
            ...item,
            currentPrice,
            totalValue,
            returnAmount,
            returnRate
          };
        });
        
        setPortfolioItems(itemsWithCalculations);
        updateTotals(itemsWithCalculations);
        setError(null);
      } catch (err) {
        console.error('포트폴리오 로드 중 오류:', err);
        setError('포트폴리오 데이터를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    
    // 저장된 보고서 가져오기
    const loadSavedReport = async () => {
      if (!currentUser) return;
      
      try {
        const report = await getPortfolioReport(currentUser.uid);
        if (report) {
          setSavedReport(report);
        }
      } catch (err) {
        console.error('저장된 보고서 로드 중 오류:', err);
      }
    };
    
    loadPortfolio();
    loadSavedReport();
  }, [currentUser]);
  
  // 전체 포트폴리오 합계 업데이트
  const updateTotals = (items) => {
    const totalValue = items.reduce((sum, item) => sum + item.totalValue, 0);
    const totalReturnAmount = items.reduce((sum, item) => sum + item.returnAmount, 0);
    const totalInvestment = items.reduce((sum, item) => sum + (item.avgPrice * item.quantity), 0);
    const totalReturnRate = totalInvestment > 0 ? (totalReturnAmount / totalInvestment) * 100 : 0;
    
    setTotalValue(totalValue);
    setTotalReturnAmount(totalReturnAmount);
    setTotalReturnRate(totalReturnRate);
  };
  
  // 새 종목 추가 핸들러
  const handleAddItem = async () => {
    if (!newTicker.trim()) {
      setError('티커 심볼을 입력해주세요.');
      return;
    }
    
    const ticker = newTicker.trim().toUpperCase();
    
    // 이미 포트폴리오에 있는지 확인
    if (portfolioService.isTickerInPortfolio(portfolioItems, ticker)) {
      setError('이미 포트폴리오에 존재하는 종목입니다.');
      return;
    }
    
    // 종목 또는 ETF 정보 가져오기
    let stockInfo = getStockByTicker(ticker);
    let isETF = false;
    
    if (!stockInfo) {
      // 주식 정보가 없으면 ETF인지 확인
      const etfInfo = getETFByTicker(ticker);
      if (etfInfo) {
        stockInfo = etfInfo;
        isETF = true;
      } else {
        setError(`"${ticker}" 종목을 찾을 수 없습니다.`);
        return;
      }
    }
    
    try {
      // 기본 정보 구성
      const newItem = {
        ticker: ticker,
        name: stockInfo.name || stockInfo.companyName || ticker,
        avgPrice: stockInfo.per ? stockInfo.per * 5 : 100, // 임시 예시 가격
        quantity: 10,
        currentPrice: stockInfo.per ? stockInfo.per * 5.2 : 105, // 임시 예시 현재가
        isETF: isETF,
        hasDividend: (isETF ? stockInfo.dividendYield > 0 : stockInfo.dividendYield > 0.5),
        dividendYield: isETF ? stockInfo.dividendYield : stockInfo.dividendYield || 0,
        sector: isETF ? stockInfo.theme : stockInfo.sector
      };
      
      // 계산값 추가
      newItem.totalValue = newItem.currentPrice * newItem.quantity;
      newItem.returnAmount = (newItem.currentPrice - newItem.avgPrice) * newItem.quantity;
      newItem.returnRate = ((newItem.currentPrice - newItem.avgPrice) / newItem.avgPrice) * 100;
      
      // Firestore에 저장
      const newItemId = await portfolioService.addPortfolioItem(currentUser.uid, newItem);
      
      if (newItemId) {
        // 화면 업데이트
        const updatedItem = { ...newItem, id: newItemId };
        const updatedItems = [...portfolioItems, updatedItem];
        setPortfolioItems(updatedItems);
        updateTotals(updatedItems);
        
        // 입력 필드 초기화
        setNewTicker('');
        setError(null);
      }
    } catch (err) {
      console.error('종목 추가 중 오류:', err);
      setError('종목 추가에 실패했습니다.');
    }
  };
  
  // 종목 업데이트 핸들러
  const handleUpdateItem = async (itemId, updatedItem) => {
    try {
      // 계산값 업데이트
      updatedItem.totalValue = updatedItem.currentPrice * updatedItem.quantity;
      updatedItem.returnAmount = (updatedItem.currentPrice - updatedItem.avgPrice) * updatedItem.quantity;
      updatedItem.returnRate = ((updatedItem.currentPrice - updatedItem.avgPrice) / updatedItem.avgPrice) * 100;
      
      // Firestore 업데이트
      const success = await portfolioService.updatePortfolioItem(currentUser.uid, itemId, updatedItem);
      
      if (success) {
        // 화면 업데이트
        const updatedItems = portfolioItems.map(item => 
          item.id === itemId ? updatedItem : item
        );
        setPortfolioItems(updatedItems);
        updateTotals(updatedItems);
        setError(null);
      }
    } catch (err) {
      console.error('종목 업데이트 중 오류:', err);
      setError('종목 업데이트에 실패했습니다.');
    }
  };
  
  // 종목 삭제 핸들러
  const handleDeleteItem = async (itemId) => {
    if (!confirm('정말로 이 종목을 삭제하시겠습니까?')) return;
    
    try {
      // Firestore에서 삭제
      const success = await portfolioService.deletePortfolioItem(currentUser.uid, itemId);
      
      if (success) {
        // 화면 업데이트
        const updatedItems = portfolioItems.filter(item => item.id !== itemId);
        setPortfolioItems(updatedItems);
        updateTotals(updatedItems);
        
        // 선택된 아이템에서도 제거
        setSelectedItems(prev => prev.filter(id => id !== itemId));
        setError(null);
      }
    } catch (err) {
      console.error('종목 삭제 중 오류:', err);
      setError('종목 삭제에 실패했습니다.');
    }
  };
  
  // 종목 선택 핸들러
  const handleSelectItem = (itemId) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };
  
  // 전체 선택/해제 핸들러
  const handleSelectAll = (isSelect) => {
    if (isSelect) {
      setSelectedItems(portfolioItems.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };
  
  // GPT 분석 요청 핸들러
  const handleRequestAnalysis = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    if (!canUseGpt) {
      setError('GPT 분석 횟수 제한에 도달했습니다.');
      return;
    }
    
    // 선택된 아이템이 없으면 전체 선택
    const itemsToAnalyze = selectedItems.length > 0
      ? portfolioItems.filter(item => selectedItems.includes(item.id))
      : portfolioItems;
    
    if (itemsToAnalyze.length === 0) {
      setError('분석할 종목이 없습니다. 먼저 포트폴리오에 종목을 추가해주세요.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // 프롬프트 생성
      const prompt = buildPortfolioAnalysisPrompt(itemsToAnalyze, 'balanced');
      
      // GPT API 호출
      const responseText = await callGptApi(prompt);
      
      // 응답 파싱
      const parsedResponse = parsePortfolioGptResponse(responseText);
      
      // 결과 설정
      setGptReport(parsedResponse);
      
      // Firestore에 저장
      await savePortfolioReport(currentUser.uid, parsedResponse);
      
      // 사용량 증가
      await incrementUsage();
      
      // 스크롤 이동
      document.getElementById('cash-report').scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.error('예수금 투자 분석 중 오류:', err);
      setError(`예수금 투자 분석 중 오류가 발생했습니다: ${err.message}`);
    } finally {
      setLoadingCash(false);
    }
  };
  
  // 저장된 보고서 로드 핸들러
  const handleLoadSavedReport = () => {
    setGptReport(savedReport);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">내 포트폴리오</h1>
      
      {/* 포트폴리오 요약 */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-1">총 평가금액</h3>
            <p className="text-2xl font-bold">${totalValue.toLocaleString('ko-KR', { maximumFractionDigits: 2 })}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-1">총 손익</h3>
            <p className={`text-2xl font-bold ${totalReturnAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${totalReturnAmount.toLocaleString('ko-KR', { maximumFractionDigits: 2 })}
            </p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-1">평균 수익률</h3>
            <p className={`text-2xl font-bold ${totalReturnRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalReturnRate >= 0 ? '+' : ''}{totalReturnRate.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>
      
      {/* 종목 추가 폼 */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">종목 추가</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <div className="flex gap-2">
          <input
            type="text"
            value={newTicker}
            onChange={(e) => setNewTicker(e.target.value)}
            placeholder="티커 심볼 입력 (예: AAPL)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={handleAddItem}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            종목 추가
          </button>
        </div>
        
        <p className="text-sm text-gray-500 mt-2">
          * 티커 심볼을 입력하시면 기본 데이터가 자동으로 입력됩니다. 평균 매입가와 수량은 직접 수정해주세요.
        </p>
      </div>
      
      {/* 포트폴리오 테이블 */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">포트폴리오 종목</h2>
          
          <div className="flex gap-3">
            {savedReport && !gptReport && (
              <button
                onClick={handleLoadSavedReport}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                저장된 분석 불러오기
              </button>
            )}
            
            <button
              onClick={handleRequestAnalysis}
              disabled={loading || portfolioItems.length === 0}
              className={`px-4 py-2 rounded transition-colors ${
                loading || portfolioItems.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  분석 중...
                </span>
              ) : (
                'GPT 포트폴리오 분석'
              )}
            </button>
          </div>
        </div>
        
        <PortfolioTable
          portfolioItems={portfolioItems}
          onUpdateItem={handleUpdateItem}
          onDeleteItem={handleDeleteItem}
          selectedItems={selectedItems}
          onSelectItem={handleSelectItem}
          onSelectAll={handleSelectAll}
        />
      </div>
      
      {/* 포트폴리오 분석 결과 */}
      <div id="portfolio-report" className="mb-8">
        {gptReport && <GptPortfolioReport report={gptReport} />}
      </div>
      
      {/* 예수금 투자 추천 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <CashRecommendation
            onRequestCashAnalysis={handleRequestCashAnalysis}
            loading={loadingCash}
          />
        </div>
        
        <div id="cash-report" className="md:col-span-2">
          {cashReport && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">예수금 투자 추천</h2>
              <p className="whitespace-pre-line text-gray-700">{cashReport.recommendation}</p>
              <p className="text-xs text-gray-500 mt-4 text-right">
                분석일: {new Date(cashReport.timestamp).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;getElementById('portfolio-report').scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.error('GPT 분석 중 오류:', err);
      setError(`GPT 분석 중 오류가 발생했습니다: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // 예수금 투자 분석 요청 핸들러
  const handleRequestCashAnalysis = async (cashAmount, investmentStyle) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    if (!canUseGpt) {
      setError('GPT 분석 횟수 제한에 도달했습니다.');
      return;
    }
    
    if (portfolioItems.length === 0) {
      setError('포트폴리오에 종목이 없습니다. 먼저 종목을 추가해주세요.');
      return;
    }
    
    setLoadingCash(true);
    setError(null);
    
    try {
      // 프롬프트 생성
      const prompt = buildCashRecommendationPrompt(portfolioItems, cashAmount, investmentStyle);
      
      // GPT API 호출
      const responseText = await callGptApi(prompt);
      
      // 결과 설정 (간단한 텍스트로 저장)
      setCashReport({
        recommendation: responseText,
        timestamp: new Date().toISOString()
      });
      
      // 사용량 증가
      await incrementUsage();
      
      // 스크롤 이동
      document.