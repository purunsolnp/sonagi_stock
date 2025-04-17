import React from 'react';

const GptPortfolioReport = ({ report }) => {
  if (!report) return null;
  
  const {
    summary = '',
    overweight = [],
    underweight = [],
    rebalanceAdvice = '',
    cashSuggestion = '',
    riskAnalysis = ''
  } = report;

  return (
    <div className="mt-8 space-y-6">
      <h2 className="text-2xl font-bold mb-4">포트폴리오 GPT 분석 보고서</h2>
      
      {/* 전체 포트폴리오 요약 분석 */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <span className="mr-2">📊</span> 포트폴리오 종합 분석
        </h3>
        <p className="text-gray-700 whitespace-pre-line">{summary}</p>
      </div>
      
      {/* 투자 비중 분석 */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <span className="mr-2">⚖️</span> 투자 비중 분석
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* 과대 비중 종목 */}
          <div>
            <h4 className="font-medium text-gray-800 mb-2">과대 비중 종목</h4>
            {overweight && overweight.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">
                {overweight.map((ticker, idx) => (
                  <li key={idx} className="text-gray-700">{ticker}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">과대 비중 종목이 없습니다.</p>
            )}
          </div>
          
          {/* 과소 비중 종목 */}
          <div>
            <h4 className="font-medium text-gray-800 mb-2">과소 비중 종목</h4>
            {underweight && underweight.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">
                {underweight.map((ticker, idx) => (
                  <li key={idx} className="text-gray-700">{ticker}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">과소 비중 종목이 없습니다.</p>
            )}
          </div>
        </div>
      </div>
      
      {/* 리밸런싱 제안 */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <span className="mr-2">🔄</span> 리밸런싱 전략
        </h3>
        <p className="text-gray-700 whitespace-pre-line">{rebalanceAdvice}</p>
      </div>
      
      {/* 리스크 분석 */}
      {riskAnalysis && (
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <span className="mr-2">⚠️</span> 리스크 분석
          </h3>
          <p className="text-gray-700 whitespace-pre-line">{riskAnalysis}</p>
        </div>
      )}
      
      {/* 예수금 투자 제안 */}
      {cashSuggestion && (
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <span className="mr-2">💰</span> 예수금 투자 제안
          </h3>
          <p className="text-gray-700 whitespace-pre-line">{cashSuggestion}</p>
        </div>
      )}
      
      <div className="text-sm text-gray-500 mt-4">
        <p className="mb-1">* 이 분석 결과는 참고용으로만 사용하시고, 투자 결정은 본인의 판단에 따라 신중하게 이루어져야 합니다.</p>
        <p>* 과거 실적이 미래 수익을 보장하지 않으며, 투자에는 원금 손실의 위험이 있습니다.</p>
        <p className="mt-3 text-xs text-right text-gray-400">분석일: {new Date(report.timestamp || Date.now()).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default GptPortfolioReport;