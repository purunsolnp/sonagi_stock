// src/lib/gptPromptBuilder.js

/**
 * 종목 분석을 위한 GPT 프롬프트를 생성하는 함수
 * @param {string} ticker - 종목 티커 심볼
 * @param {Object} stockData - 종목 데이터 객체
 * @param {Object} sectorAverage - 해당 섹터의 평균 데이터
 * @param {string} investmentStyle - 투자 성향 (안정형, 성장형, 배당형, 공격형)
 * @returns {string} GPT에 전달할 프롬프트
 */
export const buildStockAnalysisPrompt = (ticker, stockData, sectorAverage, investmentStyle) => {
   if (!ticker || !stockData || !sectorAverage) {
     return '분석에 필요한 데이터가 충분하지 않습니다. 티커, 종목 데이터, 섹터 평균 데이터가 필요합니다.';
   }
 
   // 섹터 평균 대비 백분율 계산 함수
   const calcPercentDiff = (value, average) => {
     if (!value || !average || average === 0) return null;
     return ((value - average) / average * 100).toFixed(1);
   };
 
   // PER, ROE, 배당률의 섹터 평균 대비 차이 계산
   const perDiff = calcPercentDiff(stockData.per, sectorAverage.per);
   const roeDiff = calcPercentDiff(stockData.roe, sectorAverage.roe);
   const dividendDiff = calcPercentDiff(stockData.dividendYield, sectorAverage.dividendYield);
 
   // 섹터 평균 비교 문자열 생성
   const perCompare = perDiff ? `(섹터 평균: ${sectorAverage.per?.toFixed(1)} → ${perDiff > 0 ? '+' : ''}${perDiff}%)` : '';
   const roeCompare = roeDiff ? `(섹터 평균: ${sectorAverage.roe?.toFixed(1)}% → ${roeDiff > 0 ? '+' : ''}${roeDiff}%)` : '';
   const dividendCompare = dividendDiff ? `(섹터 평균: ${sectorAverage.dividendYield?.toFixed(2)}% → ${dividendDiff > 0 ? '+' : ''}${dividendDiff}%)` : '';
 
   // 투자 성향별 분석 지침 생성
   const styleGuidelines = getInvestmentStyleGuidelines(investmentStyle, perDiff, roeDiff, dividendDiff);
 
   // 최종 프롬프트 생성
   const prompt = `
 안녕하세요! 당신은 주식 분석에 전문성을 갖춘 투자 애널리스트입니다. 아래 주어진 종목 정보와 지침에 따라 전문적인 분석 보고서를 작성해주세요.
 
 분석 대상 종목: ${ticker} (${stockData.name || ''})
 -------------------------------------------------------------------
 • 섹터: ${stockData.sector || '정보 없음'}
 • 산업: ${stockData.industry || '정보 없음'}
 • 시가총액: ${stockData.marketCap ? formatMarketCap(stockData.marketCap) : '정보 없음'}
 • 현재가: $${stockData.currentPrice?.toFixed(2) || '정보 없음'}
 • PER: ${stockData.per?.toFixed(1) || '정보 없음'} ${perCompare}
 • ROE: ${stockData.roe?.toFixed(1) || '정보 없음'}% ${roeCompare}
 • 배당률: ${stockData.dividendYield?.toFixed(2) || '정보 없음'}% ${dividendCompare}
 • 베타: ${stockData.beta?.toFixed(2) || '정보 없음'}
 
 투자 성향: ${getInvestmentStyleName(investmentStyle)}
 -------------------------------------------------------------------
 ${styleGuidelines}
 
 분석 보고서는 다음과 같은 구조로 작성해 주세요:
 1. 요약: 종목의 전반적인 특징과 투자 가치를 간략히 설명
 
 2. 재무 분석:
    - PER, ROE 등의 주요 재무지표 해석
    - 해당 지표가 투자 가치에 어떤 의미를 갖는지 설명
 
 3. 섹터 비교 분석:
    - 이 종목의 지표가 섹터 평균과 비교해 어떤 의미를 갖는지
    - 경쟁사 대비 강점과 약점
 
 4. 기술적 분석:
    - 현재 주가의 기술적 패턴 분석
    - 이동평균선 상황 (골든크로스/데드크로스 등)
    - MACD 지표 분석
    - RSI 과매수/과매도 상황
 
 5. 투자 추천:
    - 적정 매수 가격대
    - 매도 고려 시점 또는 가격대
    - ${getInvestmentStyleName(investmentStyle)} 투자자에게 적합한 투자 전략
 
 6. 종합 평가:
    - ${getInvestmentStyleName(investmentStyle)} 투자자에게 이 종목이 적합한지 명확히 평가
    - 잠재적 리스크 요인
    - 중장기 전망
 
 응답 형식은 반드시 아래 JSON 구조를 유지해주세요:
 {
   "summary": "종목 요약",
   "financials": "재무 지표 분석",
   "sectorComparison": "섹터 평균 대비 분석",
   "styleFit": {
     "안정형": boolean,
     "성장형": boolean,
     "배당형": boolean,
     "공격형": boolean
   },
   "technicals": {
     "movingAvg": "이동평균선 분석",
     "macd": "MACD 분석",
     "rsi": "RSI 분석"
   },
   "recommendation": {
     "buyRange": "매수 가격대",
     "sellSuggestion": "매도 고려 시점"
   },
   "conclusion": "종합 평가"
 }
 
 주의: 응답은 반드시 위 JSON 형식을 따라야 하며, 각 필드에는 분석 내용을 자세히 담아주세요. 가능한 많은 수치와 데이터를 포함해서 분석해주세요.
 `;
 
   return prompt;
 };
 
 /**
  * 투자 성향별 분석 지침 생성
  * @param {string} style - 투자 성향
  * @param {number} perDiff - PER 섹터 평균 대비 차이 (%)
  * @param {number} roeDiff - ROE 섹터 평균 대비 차이 (%)
  * @param {number} dividendDiff - 배당률 섹터 평균 대비 차이 (%)
  * @returns {string} 분석 지침
  */
 const getInvestmentStyleGuidelines = (style, perDiff, roeDiff, dividendDiff) => {
   switch (style) {
     case 'stable': // 안정형
       return `성향 기반 분석 지침:
 • 안정형 투자자에게 적합한 종목인지 평가해주세요
 • PER이 섹터 평균보다 ${perDiff > 0 ? '높습니다' : '낮습니다'} - 안정형 투자자에게는 적정 밸류에이션이 중요합니다
 • ROE가 섹터 평균보다 ${roeDiff > 0 ? '높습니다' : '낮습니다'} - 안정적인 수익성이 중요합니다
 • 배당률이 섹터 평균보다 ${dividendDiff > 0 ? '높습니다' : '낮습니다'} - 안정적인 배당 수익도 고려해주세요
 • 변동성과 리스크가 낮은지 특히 강조해서 평가해주세요
 • 베타 수치가 1보다 낮으면 시장 대비 변동성이 낮다는 것을 의미하니 이를 해석해주세요
 • 매수/매도 전략은 안정적인 장기 보유를 전제로 제안해주세요`;
 
     case 'growth': // 성장형
       return `성향 기반 분석 지침:
 • 성장형 투자자에게 적합한 종목인지 평가해주세요
 • PER이 섹터 평균보다 ${perDiff > 0 ? '높습니다' : '낮습니다'} - 성장주는 PER이 높더라도 성장 가능성이 있다면 긍정적으로 평가할 수 있습니다
 • ROE가 섹터 평균보다 ${roeDiff > 0 ? '높습니다' : '낮습니다'} - 높은 자본수익률은 성장 기업의 중요한 지표입니다
 • 배당률이 섹터 평균보다 ${dividendDiff > 0 ? '높습니다' : '낮습니다'} - 성장형 투자자는 배당보다 주가 상승 가능성에 더 관심이 있습니다
 • 회사의 미래 성장 가능성과 혁신성을 강조해서 평가해주세요
 • 현재 주가보다 미래 성장 잠재력에 더 무게를 두어 분석해주세요
 • 시장 트렌드와 미래 산업 전망을 고려해 분석해주세요`;
 
     case 'dividend': // 배당형
       return `성향 기반 분석 지침:
 • 배당형 투자자에게 적합한 종목인지 평가해주세요
 • PER이 섹터 평균보다 ${perDiff > 0 ? '높습니다' : '낮습니다'} - 배당형 투자자는 밸류에이션 대비 배당 수익률이 중요합니다
 • ROE가 섹터 평균보다 ${roeDiff > 0 ? '높습니다' : '낮습니다'} - 안정적인 수익성이 꾸준한 배당의 원천입니다
 • 배당률이 섹터 평균보다 ${dividendDiff > 0 ? '높습니다' : '낮습니다'} - 배당률이 높고 지속가능한지가 핵심입니다
 • 배당 성장률, 배당 지속성, 페이아웃 비율 등을 심층 분석해주세요
 • 배당금이 안정적으로 유지되거나 성장할 가능성이 있는지 평가해주세요
 • 배당금 재투자 관점에서 복리 효과를 고려한 장기 수익률도 계산해주세요`;
 
     case 'aggressive': // 공격형
       return `성향 기반 분석 지침:
 • 공격형 투자자에게 적합한 종목인지 평가해주세요
 • PER이 섹터 평균보다 ${perDiff > 0 ? '높습니다' : '낮습니다'} - 공격형 투자자는 고성장 가능성이 있다면 높은 밸류에이션도 받아들일 수 있습니다
 • ROE가 섹터 평균보다 ${roeDiff > 0 ? '높습니다' : '낮습니다'} - 높은 자본수익률은 주가 상승 가능성을 시사합니다
 • 배당률이 섹터 평균보다 ${dividendDiff > 0 ? '높습니다' : '낮습니다'} - 공격형 투자자는 배당보다 자본이득에 관심이 많습니다
 • 단기적 모멘텀과 기술적 지표를 더 중요하게 다루어주세요
 • 변동성이 크더라도 고수익 가능성이 있는지 평가해주세요
 • 기술적 분석을 통한 단기 매매 전략을 제시해주세요
 • 섹터 내 파괴적 혁신 가능성이나 게임체인저 요소가 있는지 살펴봐주세요`;
 
     default:
       return `성향 기반 분석 지침:
 • 해당 종목의 전반적인 투자 가치를 평가해주세요
 • PER, ROE, 배당률 등의 지표를 종합적으로 분석해주세요
 • 해당 종목이 어떤 유형의 투자자에게 적합한지 알려주세요
 • 현재 주가 대비 매수/매도 타이밍을 제안해주세요`;
   }
 };
 
 /**
  * 투자 성향 코드를 한글 이름으로 변환
  * @param {string} style - 투자 성향 코드
  * @returns {string} 투자 성향 한글 이름
  */
 const getInvestmentStyleName = (style) => {
   switch (style) {
     case 'stable': return '안정형';
     case 'growth': return '성장형';
     case 'dividend': return '배당형';
     case 'aggressive': return '공격형';
     default: return '일반';
   }
 };
 
 /**
  * 시가총액을 읽기 쉬운 형식으로 변환
  * @param {number} marketCap - 시가총액 (달러)
  * @returns {string} 형식화된 시가총액
  */
 const formatMarketCap = (marketCap) => {
   if (!marketCap) return '정보 없음';
   
   if (marketCap >= 1000000000000) {
     return `$${(marketCap / 1000000000000).toFixed(2)}조 달러`;
   } else if (marketCap >= 1000000000) {
     return `$${(marketCap / 1000000000).toFixed(2)}십억 달러`;
   } else if (marketCap >= 1000000) {
     return `$${(marketCap / 1000000).toFixed(2)}백만 달러`;
   } else {
     return `$${marketCap.toLocaleString()} 달러`;
   }
 };

/**
 * ETF 분석을 위한 GPT 프롬프트를 생성하는 함수
 * @param {string} ticker - ETF 티커 심볼
 * @param {Object} etfData - ETF 데이터 객체
 * @param {string} investmentStyle - 투자 성향 (안정형, 성장형, 배당형, 공격형)
 * @returns {string} GPT에 전달할 프롬프트
 */
export const buildEtfPrompt = (ticker, etfData, investmentStyle = 'growth') => {
  if (!ticker || !etfData) {
    return 'ETF 분석에 필요한 데이터가 충분하지 않습니다. 티커와 ETF 데이터가 필요합니다.';
  }

  // 투자 성향 이름 변환
  const investmentStyleKorean = getInvestmentStyleName(investmentStyle);
  
  // 프롬프트 생성
  return `
안녕하세요! 당신은 ETF 분석에 전문성을 갖춘 투자 애널리스트입니다. 아래 주어진 ETF 정보와 지침에 따라 전문적인 분석 보고서를 작성해주세요.

분석 대상 ETF: ${ticker} (${etfData.name || ''})
-------------------------------------------------------------------
• 유형: ETF
• 테마/섹터: ${etfData.sector || etfData.category || '정보 없음'}
• 자산 규모: ${etfData.aum ? `$${(etfData.aum / 1000000000).toFixed(2)}B` : '정보 없음'}
• 현재가: $${etfData.currentPrice?.toFixed(2) || '정보 없음'}
• 비용 비율: ${etfData.expenseRatio ? `${etfData.expenseRatio}%` : '정보 없음'}
• 배당 수익률: ${etfData.dividendYield ? `${etfData.dividendYield}%` : '정보 없음'}
• 상위 종목: ${etfData.topHoldings ? etfData.topHoldings.join(', ') : '정보 없음'}

투자 성향: ${investmentStyleKorean}
-------------------------------------------------------------------
${getEtfStyleGuidelines(investmentStyle)}

분석 보고서는 다음과 같은 구조로 작성해 주세요:
1. 요약: ETF의 전반적인 특징과 투자 가치를 간략히 설명

2. 구성 및 전략 분석:
   - ETF의 투자 전략 및 구성 특징
   - 주요 편입 종목 및 섹터 비중 분석

3. 비용 및 배당 분석:
   - 비용 비율 및 배당 수익률 평가
   - 유사 ETF 대비 비용 효율성

4. 기술적 분석:
   - 현재 가격의 기술적 패턴 분석
   - 이동평균선 상황
   - 모멘텀 및 추세 분석

5. 투자 추천:
   - 적정 매수 가격대
   - 매도 고려 시점
   - ${investmentStyleKorean} 투자자에게 적합한 투자 전략

6. 종합 평가:
   - ${investmentStyleKorean} 투자자에게 이 ETF가 적합한지 명확히 평가
   - 잠재적 리스크 요인
   - 중장기 전망

응답 형식은 반드시 아래 JSON 구조를 유지해주세요:
{
  "summary": "ETF 요약",
  "composition": "구성 및 전략 분석",
  "costs": "비용 및 배당 분석",
  "styleFit": {
    "안정형": boolean,
    "성장형": boolean,
    "배당형": boolean,
    "공격형": boolean
  },
  "technicals": {
    "movingAvg": "이동평균선 분석",
    "momentum": "모멘텀 분석",
    "trend": "추세 분석"
  },
  "recommendation": {
    "buyRange": "매수 가격대",
    "sellSuggestion": "매도 고려 시점"
  },
  "conclusion": "종합 평가"
}

주의: 응답은 반드시 위 JSON 형식을 따라야 하며, 각 필드에는 분석 내용을 자세히 담아주세요.
`;
};

/**
 * ETF 투자 성향별 분석 지침 생성
 * @param {string} style - 투자 성향
 * @returns {string} 분석 지침
 */
const getEtfStyleGuidelines = (style) => {
  switch (style) {
    case 'stable': // 안정형
      return `성향 기반 분석 지침:
• 안정형 투자자에게 적합한 ETF인지 평가해주세요
• 변동성이 낮고 안정적인 수익을 제공하는지 분석해주세요
• 비용 비율과 장기 보유에 따른 영향을 평가해주세요
• 다른 자산과의 상관관계와 분산효과를 고려해주세요
• 매수/매도 전략은 안정적인 장기 보유를 전제로 제안해주세요`;

    case 'growth': // 성장형
      return `성향 기반 분석 지침:
• 성장형 투자자에게 적합한 ETF인지 평가해주세요
• 성장 가능성이 높은 산업/섹터에 투자하는지 분석해주세요
• 수익률의 과거 트렌드와 미래 전망을 평가해주세요
• 시장 트렌드와 미래 산업 전망을 고려해 분석해주세요
• 매수/매도 전략은 중장기적 성장을 목표로 제안해주세요`;

    case 'dividend': // 배당형
      return `성향 기반 분석 지침:
• 배당형 투자자에게 적합한 ETF인지 평가해주세요
• 배당 수익률, 배당 성장률, 배당 지속성을 심층 분석해주세요
• 배당 지급 주기와 배당금 재투자 효과를 평가해주세요
• 배당 ETF의 비용 대비 수익률을 분석해주세요
• 매수/매도 전략은 장기적인 배당 수익을 목표로 제안해주세요`;

    case 'aggressive': // 공격형
      return `성향 기반 분석 지침:
• 공격형 투자자에게 적합한 ETF인지 평가해주세요
• 초과 수익 가능성과 그에 따른 리스크를 분석해주세요
• 레버리지나 특정 산업에 집중된 ETF인 경우 위험도를 설명해주세요
• 단기적 모멘텀과 기술적 지표를 더 중요하게 다루어주세요
• 매수/매도 전략은 단기~중기 성과를 목표로 제안해주세요`;

    default:
      return `성향 기반 분석 지침:
• 해당 ETF의 전반적인 투자 가치를 평가해주세요
• ETF의 구성, 전략, 비용을 종합적으로 분석해주세요
• 해당 ETF가 어떤 유형의 투자자에게 적합한지 알려주세요
• 현재 가격 대비 매수/매도 타이밍을 제안해주세요`;
  }
};
 
// export 수정 - 복수 함수 내보내기
export default {
  buildStockAnalysisPrompt,
  buildEtfPrompt
};