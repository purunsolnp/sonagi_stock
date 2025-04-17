import React from 'react';

const ETFTable = ({ etfs, selectedETFs, onSelectETF, onRequestAnalysis }) => {
  // ETF 선택 핸들러
  const handleSelect = (ticker) => {
    onSelectETF(ticker);
  };

  // 모든 ETF 선택/선택 해제 핸들러
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      onSelectETF(etfs.map(etf => etf.ticker));
    } else {
      onSelectETF([]);
    }
  };

  // 선택된 모든 ETF 확인
  const allSelected = etfs.length > 0 && etfs.every(etf => 
    selectedETFs.includes(etf.ticker)
  );

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold">필터링된 ETF ({etfs.length}개)</h2>
        
        {etfs.length > 0 && (
          <button
            onClick={() => onRequestAnalysis(selectedETFs)}
            disabled={selectedETFs.length === 0}
            className={`px-4 py-2 rounded transition-colors ${
              selectedETFs.length === 0 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            GPT 분석 요청 ({selectedETFs.length})
          </button>
        )}
      </div>

      {etfs.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          조건에 맞는 ETF가 없습니다. 필터 조건을 조정해보세요.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  티커
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ETF명
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  배당률 (%)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  총보수율 (%)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  섹터/테마
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  레버리지 여부
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {etfs.map((etf) => (
                <tr key={etf.ticker} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedETFs.includes(etf.ticker)}
                      onChange={() => handleSelect(etf.ticker)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-600">
                    {etf.ticker}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {etf.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {etf.dividendYield.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {etf.expenseRatio.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {etf.theme}
                  </td>
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
      )}
    </div>
  );
};

export default ETFTable;