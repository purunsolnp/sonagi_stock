// src/lib/gpt.js
// OpenAI GPT API 호출 관련 함수들

/**
 * OpenAI API를 호출하여 GPT-3.5-turbo로 응답을 생성합니다.
 * @param {string} prompt - GPT에게 전달할 프롬프트
 * @returns {Promise<object>} - GPT의 응답 결과
 */
export const callGptApi = async (prompt) => {
    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      
      if (!apiKey) {
        throw new Error('OpenAI API 키가 설정되지 않았습니다. .env 파일을 확인해주세요.');
      }
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: '당신은 주식과 ETF 분석에 전문적인 투자 애널리스트입니다. 주어진 정보를 바탕으로 상세하고 전문적인 투자 분석 보고서를 작성하세요.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(`API 호출 실패: ${error.error.message}`);
      }
      
      const data = await response.json();
      return data.choices[0].message.content;
      
    } catch (error) {
      console.error('GPT API 호출 중 오류 발생:', error);
      throw error;
    }
  };
  
  /**
   * GPT API 응답을 구조화된 객체로 파싱합니다.
   * @param {string} responseText - GPT로부터 받은 텍스트 응답
   * @param {string} ticker - 분석 대상 티커
   * @param {string} type - 분석 대상 타입 (stock 또는 etf)
   * @returns {object} - 구조화된 응답 객체
   */
  export const parseGptResponse = (responseText, ticker, type) => {
    try {
      // 가장 기본적인 정보 설정
      const result = {
        ticker,
        type,
        timestamp: new Date().toISOString(),
        summary: "",
        financials: "",
        industry: "",
        styleFit: {
          안정형: false,
          성장형: false,
          단타형: false
        },
        technical: {
          movingAvg: "",
          macd: "",
          rsi: ""
        },
        recommendation: {
          buyRange: "",
          sellSuggestion: ""
        },
        conclusion: ""
      };
      
      // 전체 텍스트 응답 저장
      result.fullResponse = responseText;
      
      // 텍스트를 줄 단위로 나누어 분석
      const lines = responseText.split('\n');
      
      // 현재 처리 중인 섹션
      let currentSection = null;
      
      for (let line of lines) {
        line = line.trim();
        
        // 섹션 제목 확인
        if (line.includes('요약') || line.includes('종목 요약') || line.includes('ETF 요약') || line.includes('개요')) {
          currentSection = 'summary';
          continue;
        } else if (line.includes('재무 분석') || line.includes('배당 분석') || line.includes('총보수율')) {
          currentSection = 'financials';
          continue;
        } else if (line.includes('산업 분석') || line.includes('섹터 분석') || line.includes('테마 분석')) {
          currentSection = 'industry';
          continue;
        } else if (line.includes('투자 스타일') || line.includes('적합한 투자자')) {
          currentSection = 'styleFit';
          continue;
        } else if (line.includes('기술적 분석') || line.includes('차트 분석')) {
          currentSection = 'technical';
          continue;
        } else if (line.includes('매수 구간') || line.includes('매수 타이밍') || line.includes('매수 포인트')) {
          currentSection = 'buyRecommendation';
          continue;
        } else if (line.includes('매도 타이밍') || line.includes('매도 포인트')) {
          currentSection = 'sellRecommendation';
          continue;
        } else if (line.includes('종합 의견') || line.includes('결론') || line.includes('투자 제안')) {
          currentSection = 'conclusion';
          continue;
        }
        
        // 현재 섹션에 내용 추가
        if (currentSection === 'summary' && line) {
          result.summary += line + ' ';
        } else if (currentSection === 'financials' && line) {
          result.financials += line + ' ';
        } else if (currentSection === 'industry' && line) {
          result.industry += line + ' ';
        } else if (currentSection === 'styleFit') {
          if (line.includes('안정형') && (line.includes('적합') || line.includes('추천'))) {
            result.styleFit.안정형 = true;
          }
          if (line.includes('성장형') && (line.includes('적합') || line.includes('추천'))) {
            result.styleFit.성장형 = true;
          }
          if (line.includes('단타형') && (line.includes('적합') || line.includes('추천'))) {
            result.styleFit.단타형 = true;
          }
        } else if (currentSection === 'technical') {
          if (line.includes('이동평균') || line.includes('MA')) {
            result.technical.movingAvg = line;
          } else if (line.includes('MACD')) {
            result.technical.macd = line;
          } else if (line.includes('RSI')) {
            result.technical.rsi = line;
          }
        } else if (currentSection === 'buyRecommendation' && line) {
          // 금액 범위 추출 (예: $170~$175)
          const priceMatch = line.match(/\$[0-9]+(?:\.[0-9]+)?(?:\s*[~-]\s*\$[0-9]+(?:\.[0-9]+)?)?/);
          if (priceMatch) {
            result.recommendation.buyRange = priceMatch[0];
          } else {
            result.recommendation.buyRange += line + ' ';
          }
        } else if (currentSection === 'sellRecommendation' && line) {
          result.recommendation.sellSuggestion += line + ' ';
        } else if (currentSection === 'conclusion' && line) {
          result.conclusion += line + ' ';
        }
      }
      
      // 섹션이 못 찾아진 경우를 위한 폴백 파싱
      if (!result.summary) {
        const summaryMatch = responseText.match(/(?:요약|개요)[^\n]*\n+([^#]+)/i);
        if (summaryMatch) result.summary = summaryMatch[1].trim();
      }
      
      if (!result.conclusion) {
        const conclusionMatch = responseText.match(/(?:결론|종합 의견)[^\n]*\n+([^#]+)/i);
        if (conclusionMatch) result.conclusion = conclusionMatch[1].trim();
      }
      
      // 문자열 정리
      for (let key of ['summary', 'financials', 'industry', 'conclusion']) {
        if (result[key]) {
          result[key] = result[key].trim();
        }
      }
      
      return result;
    } catch (error) {
      console.error('GPT 응답 파싱 중 오류 발생:', error);
      // 기본 응답 반환
      return {
        ticker,
        type,
        timestamp: new Date().toISOString(),
        summary: "GPT 응답을 분석하는 중 오류가 발생했습니다.",
        fullResponse: responseText,
        error: error.message
      };
    }
  };
  
  export default { callGptApi, parseGptResponse };