import React, { useEffect, useState } from 'react';
import etfsData from '../data/etfs.json';

const ETFFilterForm = ({ filters, onFilterChange, onSubmit }) => {
  const [themes, setThemes] = useState([]);
  
  // 컴포넌트 마운트 시 테마 목록 추출
  useEffect(() => {
    const uniqueThemes = [...new Set(etfsData.map(etf => etf.theme))];
    setThemes(uniqueThemes);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // 체크박스는 checked 값을, 나머지는 value 값을 사용
    const newValue = type === 'checkbox' ? checked : value;
    
    onFilterChange({
      ...filters,
      [name]: newValue
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">ETF 필터링</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {/* 배당률 입력 필드 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">배당률 (%)</label>
            <div className="flex gap-2">
              <input
                type="number"
                name="dividendYieldMin"
                value={filters.dividendYieldMin}
                onChange={handleChange}
                placeholder="최소값"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <span className="self-center">~</span>
              <input
                type="number"
                name="dividendYieldMax"
                value={filters.dividendYieldMax}
                onChange={handleChange}
                placeholder="최대값"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          {/* 총보수율 입력 필드 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">총보수율 (%)</label>
            <div className="flex gap-2">
              <input
                type="number"
                name="expenseRatioMin"
                value={filters.expenseRatioMin}
                onChange={handleChange}
                placeholder="최소값"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <span className="self-center">~</span>
              <input
                type="number"
                name="expenseRatioMax"
                value={filters.expenseRatioMax}
                onChange={handleChange}
                placeholder="최대값"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          {/* 운용자산규모 입력 필드 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">운용자산규모 (억 달러)</label>
            <div className="flex gap-2">
              <input
                type="number"
                name="aumMin"
                value={filters.aumMin}
                onChange={handleChange}
                placeholder="최소값"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <span className="self-center">~</span>
              <input
                type="number"
                name="aumMax"
                value={filters.aumMax}
                onChange={handleChange}
                placeholder="최대값"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          {/* 테마 선택 드롭다운 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">섹터/테마</label>
            <select
              name="theme"
              value={filters.theme}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">전체 테마</option>
              {themes.map(theme => (
                <option key={theme} value={theme}>{theme}</option>
              ))}
            </select>
          </div>
          
          {/* 레버리지 ETF 제외 체크박스 */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="excludeLeveraged"
              name="excludeLeveraged"
              checked={filters.excludeLeveraged}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="excludeLeveraged" className="ml-2 block text-sm text-gray-700">
              레버리지 ETF 제외
            </label>
          </div>
        </div>

        {/* 필터 적용 버튼 */}
        <div className="mt-4">
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            필터 적용
          </button>
        </div>
      </form>
      
      {/* ETF 테마별 간단한 설명 */}
      {filters.theme && (
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h3 className="text-lg font-semibold mb-2">{filters.theme} 테마 ETF</h3>
          <p className="text-gray-700">
            {filters.theme === 'Dividend' && "배당 테마 ETF는 높은 배당수익률을 제공하는 기업들에 투자합니다. 안정적인 인컴을 추구하는 투자자에게 적합합니다."}
            {filters.theme === 'Technology' && "기술 테마 ETF는 IT, 소프트웨어, 하드웨어 등 기술 관련 기업들에 투자합니다. 높은 성장 잠재력을 가지지만 변동성이 클 수 있습니다."}
            {filters.theme === 'ESG' && "ESG 테마 ETF는 환경(Environmental), 사회(Social), 지배구조(Governance) 측면에서 우수한 기업들에 투자합니다."}
            {filters.theme === 'Broad Market' && "광범위한 시장 ETF는 전체 시장을 추종하여 광범위한 분산 투자 효과를 제공합니다."}
            {filters.theme === 'Large Cap' && "대형주 ETF는 시가총액이 큰 대기업들에 투자합니다. 상대적으로 안정적이지만 성장성은 제한적일 수 있습니다."}
            {filters.theme === 'Innovation' && "혁신 테마 ETF는 혁신적인 기술과 비즈니스 모델을 가진 기업들에 투자합니다. 높은 성장 잠재력을 가지지만 변동성이 큽니다."}
            {filters.theme === 'Income' && "인컴 테마 ETF는 정기적인 수익 창출을 목표로 합니다. 배당주, 채권 등 다양한 수익 자산에 투자합니다."}
            {filters.theme === 'Dividend Growth' && "배당 성장 ETF는 배당을 꾸준히 증가시키는 기업들에 투자합니다. 장기적인 배당 성장을 추구하는 투자자에게 적합합니다."}
            {filters.theme === 'Semiconductor' && "반도체 ETF는 반도체 설계 및 제조 기업들에 투자합니다. 기술 발전의 핵심 산업이지만 사이클이 있습니다."}
            {filters.theme === 'Energy' && "에너지 ETF는 석유, 가스, 신재생 에너지 등 에너지 관련 기업들에 투자합니다. 원자재 가격 변동에 민감합니다."}
            {filters.theme === 'Financial' && "금융 ETF는 은행, 보험, 자산운용 등 금융 관련 기업들에 투자합니다. 금리 변동에 민감합니다."}
            {filters.theme === 'Real Estate' && "부동산 ETF는 리츠(REITs)와 부동산 관련 기업들에 투자합니다. 임대 수익과 자본 이득을 동시에 추구합니다."}
            {filters.theme === 'International' && "국제 ETF는 미국 이외 지역의 기업들에 투자합니다. 지역 분산 효과를 제공하지만 환율 리스크가 있습니다."}
            {filters.theme === 'Clean Energy' && "클린 에너지 ETF는 재생 에너지, 에너지 효율화 등 친환경 에너지 관련 기업들에 투자합니다."}
          </p>
        </div>
      )}
    </div>
  );
};

export default ETFFilterForm;