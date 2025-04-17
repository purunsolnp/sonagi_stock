// ETF 티커 심볼에 따른 가짜 GPT 응답 생성 함수
const generateMockETFResponse = (ticker, etfData) => {
    console.log("GPT 요청:", ticker);
    
    if (!etfData) {
      return {
        overview: "해당 ETF에 대한 정보를 찾을 수 없습니다.",
        dividendAnalysis: "배당 분석을 수행할 수 없습니다.",
        styleFit: {
          안정형: false,
          성장형: false,
          단타형: false
        },
        technicals: {
          movingAvg: "데이터 없음",
          rsi: "데이터 없음",
          macd: "데이터 없음"
        },
        conclusion: "투자 판단을 내릴 수 없습니다."
      };
    }
    
    // ETF 테마별 다른 분석 내용 제공
    const responses = {
      "Dividend": {
        overview: `${etfData.name}(${ticker})는 높은 배당 수익을 제공하는 기업들에 집중 투자하는 ETF입니다. 이 ETF는 주로 재무상태가 안정적이고 지속적인 배당 지급 역사를 가진 대형주들로 구성되어 있으며, 배당률은 ${etfData.dividendYield.toFixed(1)}%로 시장 평균을 상회합니다.`,
        dividendAnalysis: `배당률 ${etfData.dividendYield.toFixed(1)}%는 시장 평균(약 1.5%)보다 높은 수준으로, 정기적인 인컴을 원하는 투자자들에게 적합합니다. 총보수율은 ${etfData.expenseRatio.toFixed(2)}%로 ${etfData.expenseRatio < 0.2 ? '매우 낮은 편이며, 이는 장기 투자 시 복리 효과에 긍정적인 영향을 줍니다.' : '다소 높은 편이며, 이는 장기적으로 실질 수익률을 감소시킬 수 있습니다.'}`,
        styleFit: {
          안정형: true,
          성장형: false,
          단타형: false
        },
        technicals: {
          movingAvg: "현재 ETF 가격은 200일 이동평균선 위에 위치하여 장기적으로 상승 추세에 있습니다.",
          rsi: "RSI 지수는 현재 58로, 과매수/과매도 구간을 벗어난 중립적인 상태입니다.",
          macd: "MACD는 최근 시그널선을 상향 돌파하여 단기적으로 긍정적인 모멘텀을 보이고 있습니다."
        },
        conclusion: "이 ETF는 안정적인 인컴을 추구하는 장기 투자자에게 적합합니다. 특히 은퇴자나 안정적인 현금흐름을 원하는 투자자들의 포트폴리오에 적합하며, 시장 변동성이 큰 시기에 방어적인 포지션으로 활용할 수 있습니다."
      },
      "Technology": {
        overview: `${etfData.name}(${ticker})는 기술 섹터에 집중 투자하는 ETF로, 소프트웨어, 하드웨어, 반도체, 인터넷 서비스 등 다양한 기술 관련 기업들을 포함하고 있습니다. ${etfData.isLeveraged ? '이 ETF는 레버리지를 활용하여 기초지수의 일일 수익률의 배수를 추구합니다.' : ''}`,
        dividendAnalysis: `배당률 ${etfData.dividendYield.toFixed(1)}%는 ${etfData.dividendYield < 1 ? '낮은 편으로, 이는 기술 기업들이 일반적으로 수익을 재투자하고 배당보다는 성장에 집중하기 때문입니다.' : '기술 섹터 평균보다 높은 편이며, 이는 포함된 기업들 중 성숙한 대형 기술주의 비중이 높기 때문입니다.'} 총보수율은 ${etfData.expenseRatio.toFixed(2)}%로, ${etfData.isLeveraged ? '레버리지 ETF 특성상 높은 편이지만 일반적인 레버리지 ETF 대비로는 합리적인 수준입니다.' : etfData.expenseRatio < 0.3 ? '기술 섹터 ETF 중에서는 효율적인 수준입니다.' : '다소 높은 편이므로 장기 투자 시 실질 수익률에 영향을 줄 수 있습니다.'}`,
        styleFit: {
          안정형: false,
          성장형: true,
          단타형: etfData.isLeveraged
        },
        technicals: {
          movingAvg: `현재 ETF 가격은 50일 이동평균선 ${Math.random() > 0.5 ? '위에' : '아래에'} 위치하여 중기적으로 ${Math.random() > 0.5 ? '상승' : '하락'} 추세에 있습니다.`,
          rsi: `RSI 지수는 현재 ${Math.floor(Math.random() * 30) + 40}로, ${Math.random() > 0.5 ? '중립적인 구간에 있습니다.' : '약간의 과매도 징후를 보이고 있습니다.'}`,
          macd: `MACD는 ${Math.random() > 0.5 ? '시그널선 근처에서 횡보하고 있어 명확한 방향성을 제시하지 않고 있습니다.' : '시그널선을 하향 돌파하여 단기적으로 약세 신호를 보이고 있습니다.'}`
        },
        conclusion: `이 ETF는 ${etfData.isLeveraged ? '단기 트레이딩에 적합하며, 장기 투자 시 변동성 감쇠 효과로 인해 예상과 다른 결과가 나올 수 있으므로 주의가 필요합니다.' : '기술 섹터의 성장 잠재력에 투자하고자 하는 성장형 투자자에게 적합합니다. 단, 기술 섹터의 높은 변동성을 감안할 때 중장기적 관점에서 투자하는 것이 바람직합니다.'}`
      },
      "Broad Market": {
        overview: `${etfData.name}(${ticker})는 광범위한 시장 지수를 추종하는 ETF로, 다양한 섹터와 기업 규모에 분산 투자하여 전체 시장의 성과를 대표합니다. 이 ETF는 단일 종목이나 섹터 리스크를 최소화하면서 시장 전체의 성장에 참여할 수 있는 효율적인 투자 수단입니다.`,
        dividendAnalysis: `배당률 ${etfData.dividendYield.toFixed(1)}%는 시장 평균과 유사한 수준으로, 적절한 배당 수익과 함께 자본 성장의 기회를 제공합니다. 총보수율은 ${etfData.expenseRatio.toFixed(2)}%로, ${etfData.expenseRatio < 0.1 ? '매우 낮은 수준이며 장기 투자자에게 큰 이점이 됩니다.' : '시장 평균 수준으로 합리적인 비용 구조를 가지고 있습니다.'}`,
        styleFit: {
          안정형: true,
          성장형: true,
          단타형: false
        },
        technicals: {
          movingAvg: "현재 가격은 주요 이동평균선들 위에 위치하여 전반적인 상승 추세를 보이고 있습니다.",
          rsi: "RSI 지수는 55 정도로 중립적인 상태에 있으며, 특별한 과매수/과매도 신호는 없습니다.",
          macd: "MACD는 약한 상승 신호를 보이고 있으나, 강한 방향성보다는 점진적인 상승 모멘텀을 시사합니다."
        },
        conclusion: "이 ETF는 가장 기본적인 분산 투자 수단으로, 대부분의 투자자 포트폴리오의 핵심 자산으로 적합합니다. 특히 장기 자산 증식을 목표로 하는 투자자들에게 추천되며, 다른 특화 ETF들의 기반 자산으로도 훌륭한 선택입니다."
      },
      "ESG": {
        overview: `${etfData.name}(${ticker})는 환경(Environmental), 사회(Social), 지배구조(Governance) 기준을 충족하는 기업들에 투자하는 ETF입니다. 지속가능한 비즈니스 모델과 책임감 있는 기업 경영을 중시하는 기업들로 구성되어 있으며, 재무적 성과와 함께 사회적 가치도 추구합니다.`,
        dividendAnalysis: `배당률 ${etfData.dividendYield.toFixed(1)}%는 ${etfData.dividendYield > 1.3 ? 'ESG ETF 중에서는 높은 편으로, 지속가능성과 수익성을 동시에 추구합니다.' : '다소 낮은 편이나, ESG 투자는 장기적 가치 성장에 초점을 맞추므로 배당보다는 자본 이득을 기대하는 것이 적합합니다.'} 총보수율 ${etfData.expenseRatio.toFixed(2)}%는 ${etfData.expenseRatio < 0.2 ? '합리적인 수준으로, ESG 심사에 따른 추가 비용을 감안할 때 효율적인 구조입니다.' : 'ESG 심사 과정에 따른 추가 비용이 반영된 것으로, 일반 인덱스 ETF보다는 다소 높은 편입니다.'}`,
        styleFit: {
          안정형: true,
          성장형: true,
          단타형: false
        },
        technicals: {
          movingAvg: "현재 가격은 100일 이동평균선에 근접해 있어, 지지 여부에 따라 향후 추세가 결정될 수 있습니다.",
          rsi: "RSI 지수는 현재 48로, 중립적인 수준에서 소폭 하락 압력이 있는 상태입니다.",
          macd: "MACD는 약세 신호를 보이고 있으나, 하락 모멘텀은 약화되고 있어 반등 가능성도 있습니다."
        },
        conclusion: "이 ETF는 재무적 성과와 함께 환경, 사회적 가치를 중시하는 투자자에게 적합합니다. 점차 중요성이 커지는 지속가능성 트렌드를 고려할 때, 장기 투자자들의 포트폴리오에 좋은 추가 자산이 될 수 있습니다."
      }
    };
    
    // 기본 응답 생성 (특정 테마에 없는 경우)
    const defaultResponse = {
      overview: `${etfData.name}(${ticker})는 ${etfData.theme} 테마에 집중하는 ETF로, ${etfData.isLeveraged ? '레버리지를 활용해 기초지수 대비 배수의 수익률을 추구합니다.' : '해당 분야의 대표적인 기업들에 투자합니다.'} 운용 자산 규모는 ${etfData.aum.toLocaleString()}억 달러입니다.`,
      dividendAnalysis: `배당률 ${etfData.dividendYield.toFixed(1)}%와 총보수율 ${etfData.expenseRatio.toFixed(2)}%를 보이고 있으며, ${etfData.expenseRatio < 0.2 ? '비용 효율성이 높은 편입니다.' : etfData.dividendYield > 3 ? '배당 수익을 중시하는 투자자에게 적합할 수 있습니다.' : '일반적인 수준의 비용 구조와 배당 수익을 제공합니다.'} ${etfData.isLeveraged ? '레버리지 ETF의 특성상 장기 보유 시 변동성 감쇠 효과가 나타날 수 있으므로 주의가 필요합니다.' : ''}`,
      styleFit: {
        안정형: !etfData.isLeveraged && etfData.dividendYield > 2,
        성장형: etfData.theme !== "Dividend" && !etfData.isLeveraged,
        단타형: etfData.isLeveraged
      },
      technicals: {
        movingAvg: `현재 가격은 주요 이동평균선 ${Math.random() > 0.5 ? '위에' : '아래에'} 위치하고 있으며, ${Math.random() > 0.5 ? '상승' : '하락'} 추세를 보이고 있습니다.`,
        rsi: `RSI 지수는 현재 ${Math.floor(Math.random() * 40) + 30}로, ${Math.random() > 0.5 ? '중립적인 수준입니다.' : Math.random() > 0.5 ? '과매도 구간에 근접해 있습니다.' : '과매수 구간에 근접해 있습니다.'}`,
        macd: `MACD는 ${Math.random() > 0.5 ? '시그널선 위에 위치하여 상승 모멘텀을 보이고 있습니다.' : '시그널선 아래에 위치하여 하락 모멘텀을 보이고 있습니다.'}`
      },
      conclusion: `이 ETF는 ${etfData.theme} 섹터에 노출을 원하는 투자자에게 적합합니다. ${etfData.isLeveraged ? '레버리지 특성상 단기 트레이딩에 적합하며, 장기 투자용으로는 권장되지 않습니다.' : etfData.dividendYield > 3 ? '상대적으로 높은 배당률을 고려할 때, 인컴형 포트폴리오에 적합합니다.' : '장기적인 성장 가능성과 적절한 분산 효과를 고려할 때, 성장형 포트폴리오의 일부로 적합합니다.'}`
    };
    
    // 해당 테마의 응답이 있으면 반환, 없으면 기본 응답 생성
    return responses[etfData.theme] || defaultResponse;
  };
  
  export default generateMockETFResponse;