import React from 'react';

const StockSummaryCard = ({ stock }) => {
  if (!stock) return null;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">{stock.ticker}</h2>
          <p className="text-lg text-gray-700">{stock.companyName}</p>
          <p className="text-sm text-blue-600 mt-1">섹터: {stock.sector}</p>
        </div>
        
        <div className="text-right">
          <div className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
            시가총액: ${stock.marketCap}억
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-gray-50 p-4 rounded-md text-center">
          <p className="text-sm text-gray-500">PER</p>
          <p className="text-xl font-semibold">{stock.per.toFixed(1)}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md text-center">
          <p className="text-sm text-gray-500">ROE</p>
          <p className="text-xl font-semibold">{stock.roe.toFixed(1)}%</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md text-center">
          <p className="text-sm text-gray-500">배당률</p>
          <p className="text-xl font-semibold">{stock.dividendYield.toFixed(1)}%</p>
        </div>
      </div>
    </div>
  );
};

export default StockSummaryCard;