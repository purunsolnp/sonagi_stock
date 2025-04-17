import React, { useState } from 'react';

const CashRecommendation = ({ onRequestCashAnalysis, loading }) => {
  const [cashAmount, setCashAmount] = useState('');
  const [investmentStyle, setInvestmentStyle] = useState('balanced'); // balanced, conservative, aggressive
  
  // 예수금 입력 핸들러
  const handleCashAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // 숫자만 허용
    setCashAmount(value);
  };
  
  // 예수금 형식화 (쉼표 추가)
  const formatCashAmount = (value) => {
    if (!value) return '';
    return Number(value).toLocaleString('ko-KR');
  };
  
  // 분석 요청 핸들러
  const handleRequestAnalysis = () => {
    const cashValue = Number(cashAmount);
    
    if (isNaN(cashValue) || cashValue <= 0) {
      alert('유효한 예수금 금액을 입력해주세요.');
      return;
    }
    
    onRequestCashAnalysis(cashValue, investmentStyle);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">예수금 투자 추천</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="cashAmount" className="block text-sm font-medium text-gray-700 mb-1">
            투자 가능 예수금 (원)
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">₩</span>
            </div>
            <input
              type="text"
              id="cashAmount"
              value={formatCashAmount(cashAmount)}
              onChange={handleCashAmountChange}
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 py-2 sm:text-sm border-gray-300 rounded-md"
              placeholder="0"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">원</span>
            </div>
          </div>
        </div>
        
        <div>
          <label htmlFor="investmentStyle" className="block text-sm font-medium text-gray-700 mb-1">
            투자 성향
          </label>
          <select
            id="investmentStyle"
            value={investmentStyle}
            onChange={(e) => setInvestmentStyle(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="conservative">안정형 - 낮은 리스크, 안정적 수익 중시</option>
            <option value="balanced">균형형 - 안정성과 성장성의 균형 추구</option>
            <option value="aggressive">공격형 - 높은 성장 가능성, 리스크 감수</option>
          </select>
        </div>
        
        <div className="pt-2">
          <button
            type="button"
            onClick={handleRequestAnalysis}
            disabled={loading || !cashAmount}
            className={`w-full px-4 py-2 rounded-md text-white font-medium ${
              loading || !cashAmount
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            } transition-colors`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                분석 중...
              </span>
            ) : (
              '예수금 투자 추천 받기'
            )}
          </button>
        </div>
      </div>
      
      <p className="text-xs text-gray-500 mt-3">
        * 현재 보유 중인 포트폴리오와 예수금을 분석하여 최적의 투자 방향을 제안합니다.
      </p>
    </div>
  );
};

export default CashRecommendation;