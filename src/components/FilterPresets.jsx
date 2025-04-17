import React from 'react';

const FilterPresets = ({ onApplyPreset }) => {
  // 공격형 투자자 - PER 낮고 ROE 높은 조건
  const aggressivePreset = {
    perMin: 0,
    perMax: 20,
    roeMin: 20,
    roeMax: 1000,
    marketCapMin: 0,
    marketCapMax: 10000,
    dividendYieldMin: 0,
    dividendYieldMax: 10,
    sector: ''
  };

  // 안정형 투자자 - 배당률 높은 조건
  const stablePreset = {
    perMin: 0,
    perMax: 25,
    roeMin: 10,
    roeMax: 1000,
    marketCapMin: 100,
    marketCapMax: 10000,
    dividendYieldMin: 2.5,
    dividendYieldMax: 10,
    sector: ''
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

export default FilterPresets;