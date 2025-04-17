import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { getETFByTicker } from '../utils/etfUtils';
import { useAuth } from '../context/AuthContext';

const AnalyzeETFCompare = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [selectedTickers, setSelectedTickers] = useState([]);
  const [etfs, setEtfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysisRequested, setAnalysisRequested] = useState(false);
  
  // 컴포넌트 마운트 시 URL 파라미터에서 티커 배열 가져오기
  useEffect(() => {
    if (location.state && location.state.tickers) {
      setSelectedTickers(location.state.tickers);
    } else {
      setError('선택된 ETF가 없습니다.');
      setLoading(false);
    }
  }, [location]);
  
  // 티커 배열로 ETF 정보 로드
  useEffect(() => {
    if (selectedTickers.length === 0) return;
    
    try {
      const etfData = selectedTickers.map(ticker => {
        const etf = getETFByTicker(ticker);
        if (!etf) throw new Error(`"${ticker}" ETF를 찾을 수 없습니다.`);
        return etf;
      });
      
      setEtfs(etfData);
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
          from: '/analyze/etf/compare',
          message: 'GPT 분석을 이용하려면 로그인이 필요합니다.' 
        } 
      });
    }
  }, [currentUser, navigate]);
  
  // GPT 분석 요청 핸들러
  const handleRequestAnalysis = () => {
    console.log('GPT 요청: 다중 ETF 비교 분석', selectedTickers);
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
            onClick={() => navigate('/etf')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            ETF 추천 페이지로 돌아가기
          </button>
        </div>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">ETF 비교 분석</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">선택된 ETF ({etfs.length}개)</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">티커</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ETF명</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">테마</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">배당률</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">총보수율</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">레버리지</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {etfs.map((etf) => (
                <tr key={etf.ticker}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-600">{etf.ticker}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{etf.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{etf.theme}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{etf.dividendYield.toFixed(1)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">{etf.expenseRatio.toFixed(2)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {etf.isLeveraged ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        예
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        아니오
                      </span>
                    )}
                  </td>
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
            ETF 비교 분석 요청
          </button>
        </div>
      )}
      
      {/* 분석 결과 (분석 요청 후 표시) */}
      {analysisRequested && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">GPT ETF 비교 분석</h2>
          
          <div className="space-y-6">
            {/* 테마 분포 분석 */}
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <h3 className="text-lg font-medium mb-2">테마 분포</h3>
              <p className="text-gray-700">
                선택하신 {etfs.length}개 ETF 중 {Array.from(new Set(etfs.map(s => s.theme))).length}개 테마가 포함되어 있습니다. 
                {etfs.length > 1 ? '다양한 테마에 분산 투자하는 것이 포트폴리오 위험을 줄이는 데 도움이 됩니다.' : ''}
              </p>
            </div>
            
            {/* 비용 및 수익 분석 */}
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <h3 className="text-lg font-medium mb-2">비용 및 수익 분석</h3>
              <p className="text-gray-700">
                평균 배당률: {(etfs.reduce((sum, etf) => sum + etf.dividendYield, 0) / etfs.length).toFixed(1)}%, 
                평균 총보수율: {(etfs.reduce((sum, etf) => sum + etf.expenseRatio, 0) / etfs.length).toFixed(2)}%
              </p>
              <p className="text-gray-700 mt-2">
                {etfs.length > 1 ? `${etfs[0].ticker}와 ${etfs[1].ticker}의 배당률 차이는 ${Math.abs(etfs[0].dividendYield - etfs[1].dividendYield).toFixed(1)}%로, ` : ''}
                {etfs.some(e => e.dividendYield > 3) ? '인컴 중심 포트폴리오에 적합한 ETF가 포함되어 있습니다.' : '배당 수익보다는 자본 성장에 초점을 맞춘 ETF들입니다.'}
              </p>
            </div>
            
            {/* 투자 전략 제안 */}
            <div className="border-l-4 border-purple-500 pl-4 py-2">
              <h3 className="text-lg font-medium mb-2">투자 전략 제안</h3>
              <p className="text-gray-700">
                선택하신 ETF들은 {etfs.some(e => e.isLeveraged) ? '레버리지 ETF를 포함하고 있어 단기적 매매 전략에 적합할 수 있습니다.' : etfs.some(e => e.dividendYield > 3) ? '높은 배당 수익을 제공하여 인컴형 포트폴리오에 적합합니다.' : '다양한 특성을 가지고 있어 밸런스드 포트폴리오 구성에 도움이 됩니다.'}
              </p>
              <p className="text-gray-700 mt-2">
                {etfs.some(e => e.expenseRatio < 0.1) ? '일부 ETF는 매우 낮은 총보수율을 가지고 있어 장기 투자에 유리합니다.' : ''} 
                {etfs.some(e => e.theme === 'Technology') ? '기술 테마 ETF는 성장 잠재력이 높지만 변동성이 클 수 있습니다.' : ''}
                {etfs.some(e => e.theme === 'Dividend') ? '배당 테마 ETF는 안정적인 인컴 창출에 도움이 됩니다.' : ''}
              </p>
            </div>
            
            {/* 상관관계 분석 */}
            <div className="border-l-4 border-yellow-500 pl-4 py-2">
              <h3 className="text-lg font-medium mb-2">상관관계 분석</h3>
              <p className="text-gray-700">
                {etfs.length > 1 ? 
                  `${etfs[0].ticker}와 ${etfs[1].ticker}는 ${etfs[0].theme === etfs[1].theme ? '동일 테마에 속하여 상관관계가 높을 수 있습니다.' : '다른 테마에 속하여 상관관계가 낮을 수 있습니다.'}` : 
                  '상관관계 분석을 위해서는 2개 이상의 ETF를 선택해주세요.'}
              </p>
              <p className="text-gray-700 mt-2">
                {etfs.length > 1 ? 'ETF 간 낮은 상관관계는 포트폴리오 변동성을 줄이는 데 도움이 됩니다.' : ''}
              </p>
            </div>
          </div>
          
          <div className="mt-6 text-sm text-gray-500">
            <p>* 이 분석 결과는 참고용으로만 사용하시고, 투자 결정은 본인의 판단에 따라 신중하게 이루어져야 합니다.</p>
          </div>
        </div>
      )}
      
      {/* 돌아가기 링크 */}
      <div className="mt-8 flex justify-center">
        <Link 
          to="/etf" 
          className="text-blue-600 hover:text-blue-800"
        >
          ← ETF 추천 페이지로 돌아가기
        </Link>
      </div>
    </div>
  );
};

export default AnalyzeETFCompare;