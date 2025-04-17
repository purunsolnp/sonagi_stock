import React from 'react';

const ETFFilterPresets = ({ onApplyPreset }) => {
  // 공격형 투자자 - 저보수 + 고성장 테마 조건
  const aggressivePreset = {
    dividendYieldMin: 0,
    dividendYieldMax: 5,
    expenseRatioMin: 0,
    expenseRatioMax: 0.5,
    aumMin: 5000,
    aumMax: 1000000,
    theme: 'Technology',
    excludeLeveraged: true
  };

  // 안정형 투자자 - 고배당 + 저변동 ETF 중심 조건
  const stablePreset = {
    dividendYieldMin: 3.0,
    dividendYieldMax: 10,
    expenseRatioMin: 0,
    expenseRatioMax: 0.2,
    aumMin: 10000,
    aumMax: 1000000,
    theme: 'Dividend',
    excludeLeveraged: true
  };

  return (
    <div className="mb-6 flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() => onApplyPreset(aggressivePreset)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        공격형 투자자용
      </button>
      <button
        type="button"
        onClick={() => onApplyPreset(stablePreset)}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
      >
        안정형 투자자용
      </button>
    </div>
  );
};

export default ETFFilterPresets;