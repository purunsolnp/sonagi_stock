import React, { useState, useEffect } from 'react';
import { getStockByTicker } from '../data/tickers';
import { getETFByTicker } from '../utils/etfUtils';

const PortfolioTable = ({ 
  portfolioItems, 
  onUpdateItem, 
  onDeleteItem, 
  selectedItems, 
  onSelectItem, 
  onSelectAll
}) => {
  // 모든 아이템 선택 여부 확인
  const allSelected = portfolioItems.length > 0 && 
    portfolioItems.every(item => selectedItems.includes(item.id));
  
  // 인라인 편집 상태 관리
  const [editingItem, setEditingItem] = useState(null);
  const [editValues, setEditValues] = useState({
    avgPrice: '',
    quantity: ''
  });
  
  // 인라인 편집 시작
  const startEditing = (item) => {
    setEditingItem(item.id);
    setEditValues({
      avgPrice: item.avgPrice,
      quantity: item.quantity
    });
  };
  
  // 인라인 편집 저장
  const saveEditing = () => {
    if (!editingItem) return;
    
    const item = portfolioItems.find(item => item.id === editingItem);
    if (!item) return;
    
    // 값 변환 및 유효성 검사
    const avgPrice = parseFloat(editValues.avgPrice);
    const quantity = parseInt(editValues.quantity);
    
    if (isNaN(avgPrice) || avgPrice <= 0) {
      alert('유효한 평균 단가를 입력해주세요.');
      return;
    }
    
    if (isNaN(quantity) || quantity <= 0) {
      alert('유효한 수량을 입력해주세요.');
      return;
    }
    
    // 업데이트 호출
    onUpdateItem(editingItem, {
      ...item,
      avgPrice,
      quantity
    });
    
    // 편집 상태 종료
    setEditingItem(null);
  };
  
  // 인라인 편집 취소
  const cancelEditing = () => {
    setEditingItem(null);
  };
  
  // 숫자 포맷팅 (천 단위 콤마)
  const formatNumber = (num) => {
    if (num === undefined || num === null) return '';
    return num.toLocaleString('ko-KR');
  };
  
  // 수익률 색상 결정
  const getReturnColor = (returnRate) => {
    if (returnRate > 0) return 'text-green-600';
    if (returnRate < 0) return 'text-red-600';
    return 'text-gray-600';
  };
  
  // 수익률 포맷팅 (+/- 기호 포함)
  const formatReturnRate = (returnRate) => {
    if (returnRate === undefined || returnRate === null) return '';
    const sign = returnRate > 0 ? '+' : '';
    return `${sign}${returnRate.toFixed(2)}%`;
  };
  
  // Enter 키 핸들러
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      saveEditing();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">티커</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">종목명</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">평균 단가</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">보유 수량</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">현재가</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">평가금액</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">수익률</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ETF</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">배당</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">삭제</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {portfolioItems.length === 0 ? (
            <tr>
              <td colSpan="11" className="px-4 py-4 text-center text-gray-500">
                포트폴리오에 종목이 없습니다. 종목을 추가해주세요.
              </td>
            </tr>
          ) : (
            portfolioItems.map((item) => (
              <tr 
                key={item.id}
                className={`${selectedItems.includes(item.id) ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
              >
                {/* 체크박스 */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => onSelectItem(item.id)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </td>
                
                {/* 티커 */}
                <td className="px-4 py-4 whitespace-nowrap font-medium text-blue-600">
                  {item.ticker}
                </td>
                
                {/* 종목명 */}
                <td className="px-4 py-4 whitespace-nowrap">
                  {item.name}
                </td>
                
                {/* 평균 단가 (인라인 편집 가능) */}
                <td className="px-4 py-4 whitespace-nowrap">
                  {editingItem === item.id ? (
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={editValues.avgPrice}
                      onChange={(e) => setEditValues({...editValues, avgPrice: e.target.value})}
                      onKeyDown={handleKeyDown}
                      onBlur={saveEditing}
                      autoFocus
                      className="w-24 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <div
                      onClick={() => startEditing(item)}
                      className="cursor-pointer hover:text-blue-600"
                    >
                      ${formatNumber(item.avgPrice)}
                    </div>
                  )}
                </td>
                
                {/* 보유 수량 (인라인 편집 가능) */}
                <td className="px-4 py-4 whitespace-nowrap">
                  {editingItem === item.id ? (
                    <input
                      type="number"
                      min="1"
                      value={editValues.quantity}
                      onChange={(e) => setEditValues({...editValues, quantity: e.target.value})}
                      onKeyDown={handleKeyDown}
                      onBlur={saveEditing}
                      className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <div
                      onClick={() => startEditing(item)}
                      className="cursor-pointer hover:text-blue-600"
                    >
                      {formatNumber(item.quantity)}
                    </div>
                  )}
                </td>
                
                {/* 현재가 */}
                <td className="px-4 py-4 whitespace-nowrap">
                  ${formatNumber(item.currentPrice)}
                </td>
                
                {/* 평가금액 */}
                <td className="px-4 py-4 whitespace-nowrap font-medium">
                  ${formatNumber(item.totalValue)}
                </td>
                
                {/* 수익률 */}
                <td className={`px-4 py-4 whitespace-nowrap font-medium ${getReturnColor(item.returnRate)}`}>
                  {formatReturnRate(item.returnRate)}
                </td>
                
                {/* ETF 여부 */}
                <td className="px-4 py-4 whitespace-nowrap">
                  {item.isETF ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      ETF
                    </span>
                  ) : ''}
                </td>
                
                {/* 배당주 여부 */}
                <td className="px-4 py-4 whitespace-nowrap">
                  {item.hasDividend ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      배당
                    </span>
                  ) : ''}
                </td>
                
                {/* 삭제 버튼 */}
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PortfolioTable;