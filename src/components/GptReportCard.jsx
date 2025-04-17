// src/components/GptReportCard.jsx
import React from 'react';

const GptReportCard = ({ report }) => {
  if (!report) return null;
  
  // 파싱된 GPT 응답에서 필요한 데이터 추출
  const { 
    summary, 
    financials, 
    industry, 
    styleFit = {}, 
    technical = {}, 
    recommendation = {}, 
    conclusion,
    ticker,
    type
  } = report;

  return (
    <div className="mt-8 space-y-6">
      <h2 className="text-2xl font-bold mb-4">GPT 분석 보고서</h2>
      
      {/* 종목/ETF 요약 */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <span className="mr-2">🔍</span> {type === 'etf' ? 'ETF' : '종목'} 요약
        </h3>
        <p className="text-gray-700">{summary}</p>
      </div>
      
      {/* 재무 분석 */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <span className="mr-2">💰</span> {type === 'etf' ? '배당 및 비용 분석' : '재무 분석'}
        </h3>
        <p className="text-gray-700">{financials}</p>
      </div>
      
      {/* 산업/테마 분석 */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <span className="mr-2">🧠</span> {type === 'etf' ? '테마' : '산업'} 분석
        </h3>
        <p className="text-gray-700">{industry}</p>
      </div>
      
      {/* 투자 스타일 적합도 */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <span className="mr-2">👤</span> 투자 스타일 적합도
        </h3>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className={`p-4 rounded-md ${styleFit.안정형 ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${styleFit.안정형 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <h4 className="font-medium">안정형</h4>
            </div>
            <p className="text-sm mt-2">
              {styleFit.안정형 
                ? '안정적인 수익과 낮은 변동성을 추구하는 투자자에게 적합합니다.' 
                : '안정적인 수익을 추구하는 투자자에게는 다소 부적합할 수 있습니다.'}
            </p>
          </div>
          
          <div className={`p-4 rounded-md ${styleFit.성장형 ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-200'}`}>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${styleFit.성장형 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
              <h4 className="font-medium">성장형</h4>
            </div>
            <p className="text-sm mt-2">
              {styleFit.성장형 
                ? '자본 성장과 장기적 수익을 추구하는 투자자에게 적합합니다.' 
                : '성장을 추구하는 투자자에게는 다소 부적합할 수 있습니다.'}
            </p>
          </div>
          
          <div className={`p-4 rounded-md ${styleFit.단타형 ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50 border border-gray-200'}`}>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${styleFit.단타형 ? 'bg-yellow-500' : 'bg-gray-300'}`}></div>
              <h4 className="font-medium">단타형</h4>
            </div>
            <p className="text-sm mt-2">
              {styleFit.단타형 
                ? '단기적 모멘텀과 변동성을 활용하는 트레이더에게 적합합니다.' 
                : '단기 트레이딩보다는 중장기 투자가 더 적합합니다.'}
            </p>
          </div>
        </div>
      </div>
      
      {/* 기술적 분석 */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <span className="mr-2">📊</span> 기술적 분석
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="font-medium text-gray-800 mb-1">이동평균선</h4>
            <p className="text-gray-700">{technical.movingAvg || '데이터 없음'}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="font-medium text-gray-800 mb-1">MACD</h4>
            <p className="text-gray-700">{technical.macd || '데이터 없음'}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="font-medium text-gray-800 mb-1">RSI</h4>
            <p className="text-gray-700">{technical.rsi || '데이터 없음'}</p>
          </div>
        </div>
      </div>
      
      {/* 매수/매도 추천 */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <span className="mr-2">🎯</span> 매수/매도 추천
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-green-50 p-4 rounded-md border border-green-200">
            <h4 className="font-medium text-gray-800 mb-1">추천 매수 구간</h4>
            <p className="text-gray-700 font-semibold">{recommendation.buyRange || '구체적인 매수 구간 없음'}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-md border border-red-200">
            <h4 className="font-medium text-gray-800 mb-1">매도 타이밍</h4>
            <p className="text-gray-700">{recommendation.sellSuggestion || '구체적인 매도 타이밍 없음'}</p>
          </div>
        </div>
      </div>
      
      {/* 종합 의견 */}
      <div className="bg-blue-50 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <span className="mr-2">✅</span> 종합 의견
        </h3>
        <p className="text-gray-700">{conclusion}</p>
      </div>
      
      <div className="text-sm text-gray-500 mt-4">
        <p className="mb-1">* 이 분석 결과는 참고용으로만 사용하시고, 투자 결정은 본인의 판단에 따라 신중하게 이루어져야 합니다.</p>
        <p>* 과거 실적이 미래 수익을 보장하지 않으며, 투자에는 원금 손실의 위험이 있습니다.</p>
        <p className="mt-3 text-xs text-right text-gray-400">분석일: {new Date(report.timestamp || Date.now()).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default GptReportCard;