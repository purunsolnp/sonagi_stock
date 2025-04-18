// src/lib/portfolioPromptBuilder.js

/**
 * 포트폴리오 분석을 위한 GPT 프롬프트를 생성합니다.
 * @param {Array} portfolioItems - 포트폴리오 항목 배열
 * @param {string} investmentStyle - 투자 성향 (conservative, balanced, aggressive)
 * @param {number|null} cashAmount - 예수금 금액 (원, 없으면 null)
 * @returns {string} - GPT에 전달할 프롬프트
 */
export const buildPortfolioAnalysisPrompt = (portfolioItems, investmentStyle, cashAmount = null) => {
  if (!portfolioItems || portfolioItems.length === 0) {
    return '포트폴리오 항목이 없습니다.';
  }
  
  // 투자 성향 한글 변환
  const styleMap = {
    conservative: '안정형',
    balanced: '균형형',
    aggressive: '공격형'
  };
  
  const investmentStyleKorean = styleMap[investmentStyle] || '균형형';
  
  // 포트폴리오 항목 문자열 생성
  const portfolioItemsText = portfolioItems.map(item => {
    const etfText = item.isETF ? ' (ETF)' : '';
    const dividendText = item.hasDividend ? `, 배당률 ${item.dividendYield?.toFixed(1) || '?'}%` : '';
    
    return `${item.ticker}${etfText}: 평균단가 $${item.avgPrice.toFixed(2)}, 현재가 $${item.currentPrice.toFixed(2)}, 수익률 ${item.returnRate > 0 ? '+' : ''}${item.returnRate.toFixed(2)}%${dividendText}, 보유 수량 ${item.quantity}주`;
  }).join('\n');
  
  // 예수금 텍스트 생성
  const cashText = cashAmount ? `예수금: ${cashAmount.toLocaleString('ko-KR')}원` : '';
  
  // 프롬프트 생성
  return `
사용자의 포트폴리오는 다음과 같습니다:

${portfolioItemsText}

사용자 투자성향: ${investmentStyleKorean}
${cashText}

위 데이터를 바탕으로 아래 항목을 분석해주세요:

1. 포트폴리오 종합 분석:
   - 전체 구성 평가 (업종/섹터 비중, 수익률, 리스크 등)
   - 종목간 분산 정도와 시너지 효과 분석
   - 투자 성향과의 적합도 평가

2. 투자 비중 분석:
   - 과대 비중 종목 (ticker 형식으로 나열)
   - 과소 비중 종목 (ticker 형식으로 나열)

3. 리밸런싱 전략:
   - 포트폴리오 최적화를 위한 리밸런싱 제안
   - 비중 조정이 필요한 종목과 목표 비중

4. 리스크 분석:
   - 현재 포트폴리오의 주요 리스크 요인
   - 시장 상황별 대응 전략

${cashAmount ? `5. 예수금 투자 제안:
   - 추가 매수 추천 종목 (기존 보유 종목 중)
   - 신규 추천 종목 (다양성 향상을 위한 제안)
   - 투자 성향에 맞는 자산 배분 비율` : ''}

분석 결과를 다음 형식으로 구조화하여 제시해주세요:
- 요약 분석 (전체 포트폴리오에 대한 종합적인 평가)
- 과대 비중 종목 목록 (ticker만 쉼표로 구분)
- 과소 비중 종목 목록 (ticker만 쉼표로 구분)
- 리밸런싱 전략 (구체적인 제안)
- 리스크 분석 (주요 리스크와 대응 방안)
${cashAmount ? '- 예수금 투자 제안 (구체적인 종목 추천과 비율)' : ''}

투자 성향(${investmentStyleKorean})을 고려하여 맞춤형 분석을 제공해주세요.
`;
};

/**
 * 예수금 투자 추천을 위한 GPT 프롬프트를 생성합니다.
 * @param {Array} portfolioItems - 포트폴리오 항목 배열
 * @param {number} cashAmount - 예수금 금액 (원)
 * @param {string} investmentStyle - 투자 성향 (conservative, balanced, aggressive)
 * @returns {string} - GPT에 전달할 프롬프트
 */
export const buildCashRecommendationPrompt = (portfolioItems, cashAmount, investmentStyle) => {
  if (!portfolioItems || portfolioItems.length === 0) {
    return '포트폴리오 항목이 없습니다.';
  }
  
  // 투자 성향 한글 변환
  const styleMap = {
    conservative: '안정형',
    balanced: '균형형',
    aggressive: '공격형'
  };
  
  const investmentStyleKorean = styleMap[investmentStyle] || '균형형';
  
  // 포트폴리오 항목 문자열 생성
  const portfolioItemsText = portfolioItems.map(item => {
    const etfText = item.isETF ? ' (ETF)' : '';
    const dividendText = item.hasDividend ? `, 배당률 ${item.dividendYield?.toFixed(1) || '?'}%` : '';
    
    return `${item.ticker}${etfText}: 평균단가 $${item.avgPrice.toFixed(2)}, 현재가 $${item.currentPrice.toFixed(2)}, 수익률 ${item.returnRate > 0 ? '+' : ''}${item.returnRate.toFixed(2)}%${dividendText}, 보유 수량 ${item.quantity}주`;
  }).join('\n');
  
  // 예수금 텍스트 생성
  const cashText = `예수금: ${cashAmount.toLocaleString('ko-KR')}원`;
  
  // 프롬프트 생성
  return `
사용자의 포트폴리오는 다음과 같습니다:

${portfolioItemsText}

사용자 투자성향: ${investmentStyleKorean}
${cashText}

위 데이터를 바탕으로 다음 항목을 분석해주세요:

1. 예수금 투자 추천:
   - 추가 매수하면 좋을 기존 보유 종목과 각각의 비중(%)
   - 다양성 향상을 위한 신규 종목 추천과 각각의 비중(%)
   - 투자 성향에 맞는 자산 배분 제안 (주식/ETF/채권 등)

2. 투자 제안의 근거:
   - 각 추천 종목에 대한 간략한 선정 이유
   - 현재 포트폴리오와의 시너지 효과
   - 추천 종목의 예상 리스크와 수익 가능성

투자 성향(${investmentStyleKorean})을 고려하여 맞춤형 제안을 제공해주세요.
특히 안정형 투자자는 리스크 관리를, 공격형 투자자는 성장 가능성을 중시하여 추천해주세요.

예수금 투자 제안 결과는 다음과 같은 형식으로 구조화하여 제시해주세요:
- 추가 매수 추천 종목 (ticker + 비중 %)
- 신규 추천 종목 (ticker + 비중 %)
- 추천 이유와 예상 효과
`;
};

export default {
  buildPortfolioAnalysisPrompt,
  buildCashRecommendationPrompt
};