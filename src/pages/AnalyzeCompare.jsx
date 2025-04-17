import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getStockByTicker } from '../data/tickers';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

const AnalyzeCompare = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [selectedTickers, setSelectedTickers] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysisRequested, setAnalysisRequested] = useState(false);
  
  // 컴포넌트 마운트 시 URL 파라미터에서 티커 배열 가져오기
  useEffect(() => {
    if (location.state && location.state.tickers) {
      setSelectedTickers(location.state.tickers);
    } else {
      setError('선택된 종목이 없습니다.');
      setLoading(false);
    }
  }, [location]);
  
  // 티커 배열로 종목 정보 로드
  useEffect(() => {
    if (selectedTickers.length === 0) return;
    
    try {
      const stocksData = selectedTickers.map(ticker => {
        const stock = getStockByTicker(ticker);
        if (!stock) throw new Error(`"${ticker}" 종목을 찾을 수 없습니다.`);
        return stock;
      });
      
      setStocks(stocksData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [selectedTickers]);
  
  // 로그인하지 않은 사용자 확인
  useEffect(() => {
    if (!currentUser) {
      navigate('/login', { 
        state: { 
          from: '/analyze/compare',
          message: 'GPT 분석을 이용하려면 로그인이 필요합니다.' 
        } 
      });
    }
  }, [currentUser, navigate]);
  
  // GPT 분석 요청 핸들러
  const handleRequestAnalysis = () => {
    console.log('GPT 요청: 다중 종목 비교 분석', selectedTickers);
    setAnalysisRequested(true);
    
    // 여기서는 실제 GPT API를 호출하지 않습니다
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };
  
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/recommend')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            종목 추천 페이지로 돌아가기
          </button>
        </div>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">종목 비교 분석</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">선택된 종목 ({stocks.length}개)</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">티커</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">회사명</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">섹터</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PER</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ROE</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">배당률</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stocks.map((stock) => (
                <tr key={stock.ticker}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-600">{stock.ticker}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{stock.companyName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{stock.sector}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{stock.per.toFixed(1)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{stock.roe.toFixed(1)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">{stock.dividendYield.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* GPT 분석 요청 버튼 */}
      {!analysisRequested && (
        <div className="flex justify-center mb-8">
          <button
            onClick={handleRequestAnalysis}
            className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            종목 비교 분석 요청
          </button>
        </div>
      )}
      
      {/* 분석 결과 (분석 요청 후 표시) */}
      {analysisRequested && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">GPT 종목 비교 분석</h2>
          
          <div className="space-y-6">
            {/* 섹터 분포 분석 */}
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <h3 className="text-lg font-medium mb-2">섹터 분포</h3>
              <p className="text-gray-700">
                선택하신 {stocks.length}개 종목 중 {Array.from(new Set(stocks.map(s => s.sector))).length}개 섹터가 포함되어 있습니다. 
                {stocks.length > 1 ? '다양한 섹터에 분산 투자하는 것이 포트폴리오 위험을 줄이는 데 도움이 됩니다.' : ''}
              </p>
            </div>
            
            {/* 재무 지표 비교 */}
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <h3 className="text-lg font-medium mb-2">재무 지표 비교</h3>
              <p className="text-gray-700">
                평균 PER: {(stocks.reduce((sum, stock) => sum + stock.per, 0) / stocks.length).toFixed(1)}, 
                평균 ROE: {(stocks.reduce((sum, stock) => sum + stock.roe, 0) / stocks.length).toFixed(1)}%, 
                평균 배당률: {(stocks.reduce((sum, stock) => sum + stock.dividendYield, 0) / stocks.length).toFixed(1)}%
              </p>
              <p className="text-gray-700 mt-2">
                {stocks.length > 1 ? `${stocks[0].ticker}와 ${stocks[1].ticker}의 PER 차이는 ${Math.abs(stocks[0].per - stocks[1].per).toFixed(1)}으로, ` : ''}
                {stocks.some(s => s.per < 15) ? '가치투자 관점에서 고려해볼 만한 종목이 포함되어 있습니다.' : '전반적으로 성장주 특성을 가진 종목들입니다.'}
              </p>
            </div>
            
            {/* 투자 전략 제안 */}
            <div className="border-l-4 border-purple-500 pl-4 py-2">
              <h3 className="text-lg font-medium mb-2">투자 전략 제안</h3>
              <p className="text-gray-700">
                선택하신 종목들은 {stocks.some(s => s.dividendYield > 3) ? '배당 수익을 중시하는' : stocks.some(s => s.per > 30) ? '성장성을 중시하는' : '밸런스형'} 포트폴리오 구성에 적합합니다.
              </p>
              <p className="text-gray-700 mt-2">
                현재 시장 상황을 고려할 때, {stocks.some(s => s.dividendYield > 2.5) ? '배당주를 중심으로 안정적인 포트폴리오를 구성하고' : ''}
                {stocks.some(s => s.sector === 'Technology') ? ' 기술 섹터의 변동성에 주의하며' : ''} 분산 투자하는 것이 좋습니다.
              </p>
            </div>
            
            {/* 상관관계 분석 */}
            <div className="border-l-4 border-yellow-500 pl-4 py-2">
              <h3 className="text-lg font-medium mb-2">상관관계 분석</h3>
              <p className="text-gray-700">
                {stocks.length > 1 ? 
                  `${stocks[0].ticker}와 ${stocks[1].ticker}는 ${stocks[0].sector === stocks[1].sector ? '동일 섹터에 속하여 상관관계가 높을 수 있습니다.' : '다른 섹터에 속하여 상관관계가 낮을 수 있습니다.'}` : 
                  '상관관계 분석을 위해서는 2개 이상의 종목을 선택해주세요.'}
              </p>
              <p className="text-gray-700 mt-2">
                {stocks.length > 1 ? '종목 간 낮은 상관관계는 포트폴리오 변동성을 줄이는 데 도움이 됩니다.' : ''}
              </p>
            </div>
          </div>
          
          <div className="mt-6 text-sm text-gray-500">
            <p>* 이 분석 결과는 참고용으로만 사용하시고, 투자 결정은 본인의 판단에 따라 신중하게 이루어져야 합니다.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyzeCompare;