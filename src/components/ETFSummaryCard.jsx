import React from 'react';

const ETFSummaryCard = ({ etf }) => {
  if (!etf) return null;
  
  // AUM 포맷팅 (억 달러 단위)
  const formatAUM = (aum) => {
    if (aum >= 10000) {
      return `${(aum / 10000).toFixed(1)}조 달러`;
    }
    return `${aum.toLocaleString()}억 달러`;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">{etf.ticker}</h2>
          <p className="text-lg text-gray-700">{etf.name}</p>
          <p className="text-sm text-blue-600 mt-1">테마: {etf.theme}</p>
        </div>
        
        <div className="text-right">
          <div className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
            운용자산규모: {formatAUM(etf.aum)}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-gray-50 p-4 rounded-md text-center">
          <p className="text-sm text-gray-500">배당률</p>
          <p className="text-xl font-semibold">{etf.dividendYield.toFixed(1)}%</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md text-center">
          <p className="text-sm text-gray-500">총보수율</p>
          <p className="text-xl font-semibold">{etf.expenseRatio.toFixed(2)}%</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md text-center">
          <p className="text-sm text-gray-500">레버리지 여부</p>
          <p className="text-xl font-semibold">
            {etf.isLeveraged ? (
              <span className="text-red-600">Yes</span>
            ) : (
              <span className="text-green-600">No</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ETFSummaryCard;