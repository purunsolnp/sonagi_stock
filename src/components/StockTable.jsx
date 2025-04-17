import React from 'react';

const StockTable = ({ stocks, selectedStocks, onSelectStock, onRequestAnalysis }) => {
  // 주식 선택 핸들러
  const handleSelect = (ticker) => {
    onSelectStock(ticker);
  };

  // 모든 주식 선택/선택 해제 핸들러
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      onSelectStock(stocks.map(stock => stock.ticker));
    } else {
      onSelectStock([]);
    }
  };

  // 선택된 모든 주식 확인
  const allSelected = stocks.length > 0 && stocks.every(stock => 
    selectedStocks.includes(stock.ticker)
  );

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold">필터링된 종목 ({stocks.length}개)</h2>
        
        {stocks.length > 0 && (
          <button
            onClick={() => onRequestAnalysis(selectedStocks)}
            disabled={selectedStocks.length === 0}
            className={`px-4 py-2 rounded transition-colors ${
              selectedStocks.length === 0 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            GPT 분석 요청 ({selectedStocks.length})
          </button>
        )}
      </div>

      {stocks.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          조건에 맞는 종목이 없습니다. 필터 조건을 조정해보세요.
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
                  회사명
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PER
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ROE (%)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  배당률 (%)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  섹터
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stocks.map((stock) => (
                <tr key={stock.ticker} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedStocks.includes(stock.ticker)}
                      onChange={() => handleSelect(stock.ticker)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {stock.ticker}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {stock.companyName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {stock.per.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {stock.roe.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {stock.dividendYield.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {stock.sector}
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

export default StockTable;