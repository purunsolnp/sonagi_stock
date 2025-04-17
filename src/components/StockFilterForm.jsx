import React, { useEffect, useState } from 'react';
import sectorAverages from '../data/sectorAverages.json';

const StockFilterForm = ({ filters, onFilterChange, onSubmit }) => {
  const [sectors, setSectors] = useState([]);
  const [sectorAverage, setSectorAverage] = useState(null);

  // 컴포넌트 마운트 시 섹터 목록 추출
  useEffect(() => {
    const sectorList = Object.keys(sectorAverages);
    setSectors(sectorList);
  }, []);

  // 섹터 선택 시 평균값 업데이트
  useEffect(() => {
    if (filters.sector && sectorAverages[filters.sector]) {
      setSectorAverage(sectorAverages[filters.sector]);
    } else {
      setSectorAverage(null);
    }
  }, [filters.sector]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({
      ...filters,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">종목 필터링</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {/* PER 입력 필드 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PER (주가수익비율)</label>
            <div className="flex gap-2">
              <input
                type="number"
                name="perMin"
                value={filters.perMin}
                onChange={handleChange}
                placeholder="최소값"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <span className="self-center">~</span>
              <input
                type="number"
                name="perMax"
                value={filters.perMax}
                onChange={handleChange}
                placeholder="최대값"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          {/* ROE 입력 필드 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ROE (자기자본이익률) %</label>
            <div className="flex gap-2">
              <input
                type="number"
                name="roeMin"
                value={filters.roeMin}
                onChange={handleChange}
                placeholder="최소값"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <span className="self-center">~</span>
              <input
                type="number"
                name="roeMax"
                value={filters.roeMax}
                onChange={handleChange}
                placeholder="최대값"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          {/* 시가총액 입력 필드 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">시가총액 (억 달러)</label>
            <div className="flex gap-2">
              <input
                type="number"
                name="marketCapMin"
                value={filters.marketCapMin}
                onChange={handleChange}
                placeholder="최소값"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <span className="self-center">~</span>
              <input
                type="number"
                name="marketCapMax"
                value={filters.marketCapMax}
                onChange={handleChange}
                placeholder="최대값"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

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

          {/* 섹터 선택 드롭다운 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">섹터</label>
            <select
              name="sector"
              value={filters.sector}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">전체 섹터</option>
              {sectors.map(sector => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>
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

      {/* 선택한 섹터의 평균 정보 표시 */}
      {sectorAverage && (
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h3 className="text-lg font-medium mb-2">{filters.sector} 섹터 평균</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">평균 PER</p>
              <p className="text-lg font-semibold">{sectorAverage.averagePER.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">평균 ROE (%)</p>
              <p className="text-lg font-semibold">{sectorAverage.averageROE.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">평균 배당률 (%)</p>
              <p className="text-lg font-semibold">{sectorAverage.averageDividendYield.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">평균 시가총액 (억 달러)</p>
              <p className="text-lg font-semibold">{sectorAverage.averageMarketCap.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockFilterForm;