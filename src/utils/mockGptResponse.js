// 종목별 가짜 GPT 응답 생성 함수
const generateMockGptResponse = (ticker, stockData) => {
    console.log("GPT 요청:", ticker);
    
    if (!stockData) {
      return {
        summary: "해당 종목에 대한 정보를 찾을 수 없습니다.",
        financial: "재무 데이터를 분석할 수 없습니다.",
        industry: "산업 분석을 수행할 수 없습니다.",
        timing: {
          movingAvg: "데이터 없음",
          macd: "데이터 없음",
          rsi: "데이터 없음"
        },
        recommendation: "투자 판단을 내릴 수 없습니다."
      };
    }
    
    // 종목 섹터에 따라 다른 분석 내용 제공
    const responses = {
      "Technology": {
        summary: `${stockData.companyName}(${ticker})는 기술 부문 대형주로, 높은 ROE와 안정적인 성장세를 보이고 있습니다. 최근 AI 및 클라우드 사업 확장으로 시장에서 주목받고 있으며, 지속적인 연구개발 투자로 경쟁우위를 유지하고 있습니다.`,
        financial: `PER ${stockData.per.toFixed(1)}배, ROE ${stockData.roe.toFixed(1)}%로 기술 섹터 내에서 상위권에 속합니다. 배당률은 ${stockData.dividendYield.toFixed(1)}%로 섹터 평균보다 ${stockData.dividendYield > 0.8 ? '높은' : '낮은'} 수준입니다. 부채비율은 낮은 편이며 현금흐름이 양호합니다.`,
        industry: "기술 섹터는 AI, 클라우드, 디지털 전환 가속화로 높은 성장세를 유지하고 있습니다. 반도체 공급망 이슈가 점차 해소되는 추세이며, 하드웨어보다 소프트웨어와 서비스 부문의 마진이 확대되고 있습니다.",
        timing: {
          movingAvg: "현재가가 20일 이동평균선 위에 위치하고 있어 단기적으로 강세를 보이고 있습니다.",
          macd: "MACD 지표가 시그널선을 상향 돌파하여 골든크로스가 형성되었습니다.",
          rsi: "RSI 지수는 62로, 과매수 구간에 진입하기 직전입니다."
        },
        recommendation: "기술 섹터의 장기적 성장성과 해당 기업의 탄탄한 재무구조를 고려할 때, 장기 투자자에게 매수 추천합니다. 단, 최근의 주가 상승으로 단기적으로는 중립적 관점이 적절합니다."
      },
      "Healthcare": {
        summary: `${stockData.companyName}(${ticker})는 헬스케어 부문의 안정적인 대형주로, 다양한 의약품 포트폴리오와 탄탄한 R&D 파이프라인을 보유하고 있습니다. 인구 고령화 추세와 함께 성장 잠재력이 큰 기업입니다.`,
        financial: `PER ${stockData.per.toFixed(1)}배, ROE ${stockData.roe.toFixed(1)}%로 방어적 성격이 강한 헬스케어 섹터 내에서 양호한 지표를 보입니다. 특히 배당률 ${stockData.dividendYield.toFixed(1)}%는 안정적인 현금흐름을 반영합니다.`,
        industry: "헬스케어 섹터는 경기 사이클에 덜 민감한 방어적 성격을 가지고 있으며, 인구 고령화와 신약 개발 기술 발전으로 장기적 성장세가 예상됩니다. 다만 규제 환경 변화와 약가 인하 압력은 위험 요소입니다.",
        timing: {
          movingAvg: "현재가가 50일 이동평균선 부근에서 횡보하고 있어 추세 전환점에 있습니다.",
          macd: "MACD가 시그널선 아래에 위치하고 있으나, 상향 움직임을 보이기 시작했습니다.",
          rsi: "RSI 지수는 45로, 중립적인 수준입니다."
        },
        recommendation: "헬스케어 섹터의 방어적 특성과 안정적인 배당을 고려할 때, 시장 불확실성이 높은 현 시점에서 포트폴리오 분산용으로 적합합니다. 장기 매수 의견을 제시합니다."
      },
      "Financial Services": {
        summary: `${stockData.companyName}(${ticker})는 금융 서비스 부문의 주요 기업으로, 다양한 금융 상품과 서비스를 제공하고 있습니다. 금리 환경과 경제 상황에 민감하게 반응하는 특성을 가지고 있습니다.`,
        financial: `PER ${stockData.per.toFixed(1)}배로 금융 섹터 내에서 ${stockData.per < 15 ? '저평가' : '적정 수준'}에 있으며, ROE ${stockData.roe.toFixed(1)}%는 자본 효율성이 양호함을 보여줍니다. 배당률 ${stockData.dividendYield.toFixed(1)}%는 안정적인 수익을 제공합니다.`,
        industry: "금융 서비스 섹터는 금리 사이클에 영향을 많이 받으며, 현재 금리 안정화 국면에서 수익성이 개선되고 있습니다. 디지털 금융 전환이 가속화되면서 기술 투자의 중요성이 커지고 있습니다.",
        timing: {
          movingAvg: "현재가가 100일 이동평균선을 상향 돌파했으며, 상승 추세가 형성되고 있습니다.",
          macd: "MACD가 시그널선을 상향 돌파했으나, 과매수 신호에 주의가 필요합니다.",
          rsi: "RSI 지수는 68로, 과매수 구간에 근접해 있습니다."
        },
        recommendation: "금리 환경 개선과 함께 금융주의 실적 개선이 예상되나, 현재 주가는 이러한 기대감이 상당 부분 반영된 상태입니다. 단기 중립, 주가 조정 시 매수 전략이 적절해 보입니다."
      },
      "Consumer Cyclical": {
        summary: `${stockData.companyName}(${ticker})는 소비자 경기민감 섹터에 속한 기업으로, 경제 상황과 소비자 지출 패턴에 영향을 받습니다. 브랜드 가치와 시장 점유율이 핵심 경쟁력입니다.`,
        financial: `PER ${stockData.per.toFixed(1)}배로 다소 고평가 측면이 있으나, ROE ${stockData.roe.toFixed(1)}%는 높은 자본 효율성을 보여줍니다. 배당률은 ${stockData.dividendYield.toFixed(1)}%로 성장주 특성을 반영합니다.`,
        industry: "소비자 경기민감 섹터는 경기 변동에 민감하게 반응하며, 현재 소비 심리 위축이 우려 요소입니다. 다만, 디지털 채널 강화와 프리미엄 시장 확대가 긍정적 요인으로 작용하고 있습니다.",
        timing: {
          movingAvg: "현재가가 주요 이동평균선 아래에 위치하여 약세 신호를 보이고 있습니다.",
          macd: "MACD가 시그널선 아래에서 횡보하고 있어 당분간 방향성 부재가 예상됩니다.",
          rsi: "RSI 지수는 35로, 과매도 구간에 근접해 있습니다."
        },
        recommendation: "단기적으로 소비 심리 위축과 인플레이션 우려가 부담 요인이나, 현재 주가 레벨은 이러한 우려가 상당 부분 반영된 상태입니다. 장기적 관점에서 분할 매수 전략을 고려해볼 만합니다."
      },
      "Consumer Defensive": {
        summary: `${stockData.companyName}(${ticker})는 소비자 필수품 섹터의 대표 기업으로, 경기 변동에 상대적으로 덜 민감한 방어적 특성을 가지고 있습니다. 안정적인 현금흐름과 배당이 강점입니다.`,
        financial: `PER ${stockData.per.toFixed(1)}배로 방어주 특성을 반영하여 프리미엄이 있으며, ROE ${stockData.roe.toFixed(1)}%는 안정적인 수익성을 보여줍니다. 배당률 ${stockData.dividendYield.toFixed(1)}%는 섹터 내에서 ${stockData.dividendYield > 2 ? '양호한' : '평균적인'} 수준입니다.`,
        industry: "소비자 필수품 섹터는 경기 침체기에도 안정적인 성과를 보이는 방어적 특성이 있으나, 최근 원자재 가격 상승과 공급망 이슈로 마진 압박을 받고 있습니다.",
        timing: {
          movingAvg: "현재가가 200일 이동평균선 위에서 안정적인 흐름을 보이고 있습니다.",
          macd: "MACD가 중립적인 위치에 있어 뚜렷한 방향성을 보이지 않고 있습니다.",
          rsi: "RSI 지수는 50 부근으로, 중립적인 상태입니다."
        },
        recommendation: "시장 변동성이 큰 현 시점에서 포트폴리오 안정성을 높이기 위한 방어주로 적합합니다. 배당 수익률을 고려할 때 장기 투자자에게 매수 추천합니다."
      },
      "Energy": {
        summary: `${stockData.companyName}(${ticker})는 에너지 섹터의 주요 기업으로, 유가 변동에 민감하게 반응합니다. 최근 에너지 전환 추세에 맞춰 친환경 에너지 사업 확대를 모색하고 있습니다.`,
        financial: `PER ${stockData.per.toFixed(1)}배로 에너지 섹터 내에서 ${stockData.per < 12 ? '저평가' : '적정 수준'}에 있으며, ROE ${stockData.roe.toFixed(1)}%는 ${stockData.roe > 15 ? '양호한' : '평균적인'} 자본 효율성을 보여줍니다. 높은 배당률 ${stockData.dividendYield.toFixed(1)}%가 특징입니다.`,
        industry: "에너지 섹터는 글로벌 수급 상황과 지정학적 리스크에 영향을 받으며, 장기적으로는 친환경 에너지로의 전환이 주요 과제입니다. 단기적으로는 공급 제약으로 인한 에너지 가격 상승이 예상됩니다.",
        timing: {
          movingAvg: "현재가가 50일 이동평균선을 상향 돌파하여 단기적으로 상승 모멘텀이 형성되고 있습니다.",
          macd: "MACD가 시그널선 위에 위치하며 상승 추세를 확인해주고 있습니다.",
          rsi: "RSI 지수는 58로, 상승 여력이 아직 남아있습니다."
        },
        recommendation: "에너지 가격 강세와 높은 배당수익률을 고려할 때, 인컴형 투자자에게 적합한 종목입니다. 단, 장기적으로는 에너지 전환 리스크를 고려해야 합니다."
      },
      "Communication Services": {
        summary: `${stockData.companyName}(${ticker})는 통신 서비스 섹터에 속한 기업으로, 안정적인 구독 기반 수익 모델을 가지고 있습니다. 5G 및 디지털 콘텐츠 영역으로 사업 확장을 추진 중입니다.`,
        financial: `PER ${stockData.per.toFixed(1)}배로 통신 섹터 내에서 ${stockData.per < 20 ? '저평가' : '적정 수준'}에 있으며, ROE ${stockData.roe.toFixed(1)}%는 안정적인 수익성을 보여줍니다. 배당률 ${stockData.dividendYield.toFixed(1)}%는 인컴형 투자자에게 매력적입니다.`,
        industry: "통신 서비스 섹터는 필수 인프라 성격으로 안정적이나, 경쟁 심화와 네트워크 투자 부담이 위험 요소입니다. 5G, 클라우드, 디지털 콘텐츠 확대가 성장 동력으로 작용하고 있습니다.",
        timing: {
          movingAvg: "현재가가 주요 이동평균선 근처에서 횡보하는 중립적인 흐름을 보이고 있습니다.",
          macd: "MACD가 시그널선과 교차하려는 초기 단계로, 추세 전환 가능성이 있습니다.",
          rsi: "RSI 지수는 42로, 약세에서 중립으로 전환되는 구간에 있습니다."
        },
        recommendation: "높은 배당수익률과 방어적 성격을 고려할 때 포트폴리오 안정성을 높이는 종목으로 적합합니다. 장기 투자자에게 매수 추천합니다."
      }
    };
    
    // 해당 섹터의 응답이 있으면 반환, 없으면 기본 응답 생성
    return responses[stockData.sector] || {
      summary: `${stockData.companyName}(${ticker})는 ${stockData.sector} 섹터에 속한 기업으로, PER ${stockData.per.toFixed(1)}배, ROE ${stockData.roe.toFixed(1)}%, 배당률 ${stockData.dividendYield.toFixed(1)}%의 지표를 보이고 있습니다.`,
      financial: `PER(주가수익비율)은 ${stockData.per.toFixed(1)}로 ${stockData.per < 20 ? '상대적으로 저평가되어 있습니다.' : '다소 고평가 측면이 있습니다.'}. ROE(자기자본이익률)은 ${stockData.roe.toFixed(1)}%로 ${stockData.roe > 15 ? '자본 효율성이 양호합니다.' : '평균적인 수준입니다.'}`,
      industry: `${stockData.sector} 섹터는 현재 전반적으로 안정적인 흐름을 보이고 있으며, 해당 기업은 섹터 내에서 ${stockData.marketCap > 300 ? '대형주' : '중소형주'}에 속합니다.`,
      timing: {
        movingAvg: "현재 이동평균선 분석에서는 중립적인 신호가 나타나고 있습니다.",
        macd: "MACD 지표는 현재 뚜렷한 방향성을 보이지 않고 있습니다.",
        rsi: "RSI는 중립적인 구간에 위치해 있습니다."
      },
      recommendation: "해당 종목에 대한 투자는 투자 목적과 위험 성향에 따라 신중하게 판단하시기 바랍니다. 추가적인 실적 및 산업 동향 모니터링이 필요합니다."
    };
  };
  
  export default generateMockGptResponse;