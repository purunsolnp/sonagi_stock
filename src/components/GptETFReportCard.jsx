import React from 'react';

const GptETFReportCard = ({ report }) => {
  if (!report) return null;
  
  const { overview, dividendAnalysis, styleFit, technicals, conclusion } = report;
  
  return (
    <div className="mt-8 space-y-6">
      <h2 className="text-2xl font-bold mb-4">GPT 분석 보고서</h2>
      
      {/* ETF 개요 요약 */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <span className="mr-2">📘</span> ETF 개요 요약
        </h3>
        <p className="text-gray-700">{overview}</p>
      </div>
      
      {/* 배당률 + 총보수율 분석 */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <span className="mr-2">💰</span> 배당률 및 총보수율 분석
        </h3>
        <p className="text-gray-700">{dividendAnalysis}</p>
      </div>
      
      {/* 적합한 투자 스타일 */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <span className="mr-2">🧠</span> 투자 스타일 적합도
        </h3>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className={`p-4 rounded-md ${styleFit.안정형 ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${styleFit.안정형 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <h4 className="font-medium">안정형</h4>
            </div>
            <p className="text-sm mt-2">
              {styleFit.안정형 
                ? '이 ETF는 안정적인 수익을 추구하는 투자자에게 적합합니다.' 
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
                ? '이 ETF는 자본 성장을 추구하는 투자자에게 적합합니다.' 
                : '자본 성장을 추구하는 투자자에게는 다소 부적합할 수 있습니다.'}
            </p>
          </div>
          
          <div className={`p-4 rounded-md ${styleFit.단타형 ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50 border border-gray-200'}`}>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${styleFit.단타형 ? 'bg-yellow-500' : 'bg-gray-300'}`}></div>
              <h4 className="font-medium">단타형</h4>
            </div>
            <p className="text-sm mt-2">
              {styleFit.단타형 
                ? '이 ETF는 단기 매매에 적합한 특성을 가지고 있습니다.' 
                : '단기 매매보다는 중장기 투자가 더 적합합니다.'}
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
            <p className="text-gray-700">{technicals.movingAvg}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="font-medium text-gray-800 mb-1">RSI</h4>
            <p className="text-gray-700">{technicals.rsi}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="font-medium text-gray-800 mb-1">MACD</h4>
            <p className="text-gray-700">{technicals.macd}</p>
          </div>
        </div>
      </div>
      
      {/* GPT 종합 코멘트 */}
      <div className="bg-blue-50 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <span className="mr-2">✅</span> GPT 종합 코멘트
        </h3>
        <p className="text-gray-700">{conclusion}</p>
      </div>
      
      <div className="text-sm text-gray-500 mt-4">
        <p>* 이 분석 결과는 참고용으로만 사용하시고, 투자 결정은 본인의 판단에 따라 신중하게 이루어져야 합니다.</p>
        <p>* 과거 실적이 미래 수익을 보장하지 않으며, ETF 투자에는 원금 손실의 위험이 있습니다.</p>
      </div>
    </div>
  );
};

export default GptETFReportCard;