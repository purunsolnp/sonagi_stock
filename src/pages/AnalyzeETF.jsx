// src/pages/AnalyzeETF.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getETFByTicker } from '../utils/etfUtils';
import { useAuth } from '../context/AuthContext';
import ETFSummaryCard from '../components/ETFSummaryCard';
import GptReportCard from '../components/GptReportCard';
import { callGptApi, parseGptResponse } from '../lib/gpt';
import { buildEtfPrompt } from '../lib/gptPromptBuilder';
import { saveReport, getReport } from '../lib/reportService';
import { useGptLimit } from '../hooks/useGptLimit';

const AnalyzeETF = () => {
  const { ticker } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { canUseGpt, usageCount, usageLimit, isLimitEnabled, incrementUsage } = useGptLimit();
  
  const [etf, setEtf] = useState(null);
  const [gptReport, setGptReport] = useState(null);
  const [savedReport, setSavedReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // 컴포넌트 마운트 시 티커에 해당하는 ETF 정보 로드
  useEffect(() => {
    if (!ticker) {
      setError('ETF 티커가 제공되지 않았습니다.');
      return;
    }
    
    const etfData = getETFByTicker(ticker);
    if (!etfData) {
      setError(`"${ticker}" ETF를 찾을 수 없습니다.`);
    } else {
      setEtf(etfData);
      setError(null);
    }
  }, [ticker]);
  
  // 로그인하지 않은 사용자 확인
  useEffect(() => {
    if (!currentUser) {
      navigate('/login', { 
        state: { 
          from: `/analyze/etf/${ticker}`,
          message: 'GPT 분석을 이용하려면 로그인이 필요합니다.' 
        } 
      });
    }
  }, [currentUser, navigate, ticker]);
  
  // 저장된 보고서가 있는지 확인
  useEffect(() => {
    const checkSavedReport = async () => {
      if (!currentUser || !ticker) return;
      
      try {
        const report = await getReport(currentUser.uid, 'etf', ticker);
        if (report) {
          setSavedReport(report);
        }
      } catch (err) {
        console.error('저장된 보고서 조회 중 오류:', err);
      }
    };
    
    checkSavedReport();
  }, [currentUser, ticker]);
  
  // GPT 분석 요청 핸들러
  const handleRequestAnalysis = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    if (!canUseGpt) {
      setError(`GPT 분석 횟수 제한에 도달했습니다. (${usageCount}/${usageLimit})`);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // 프롬프트 생성
      const prompt = buildEtfPrompt(etf);
      
      // GPT API 호출
      const responseText = await callGptApi(prompt);
      
      // 응답 파싱
      const parsedResponse = parseGptResponse(responseText, ticker, 'etf');
      
      // 결과 설정
      setGptReport(parsedResponse);
      
      // Firestore에 저장
      await saveReport(currentUser.uid, 'etf', ticker, parsedResponse);
      
      // 사용량 증가
      await incrementUsage();
      
    } catch (err) {
      console.error('GPT 분석 중 오류:', err);
      setError(`GPT 분석 중 오류가 발생했습니다: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // 저장된 보고서 로드 핸들러
  const handleLoadSavedReport = () => {
    setGptReport(savedReport);
  };
  
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/etf')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            ETF 추천 페이지로 돌아가기
          </button>
        </div>
      </div>
    );
  }
  
  if (!etf) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">ETF GPT 분석</h1>
      
      {/* ETF 정보 요약 */}
      <ETFSummaryCard etf={etf} />
      
      {/* GPT 분석 요청 및 제한 정보 */}
      <div className="mt-8">
        <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm mb-4">
          <div>
            {isLimitEnabled && (
              <p className="text-sm text-gray-600 mb-2 sm:mb-0">
                GPT 분석 사용량: <span className="font-medium">{usageCount}/{usageLimit}</span>
              </p>
            )}
          </div>
          
          <div className="flex space-x-3">
            {savedReport && !gptReport && (
              <button
                onClick={handleLoadSavedReport}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                저장된 분석 불러오기
              </button>
            )}
            
            <button
              onClick={handleRequestAnalysis}
              disabled={loading || !canUseGpt}
              className={`px-6 py-2 rounded-lg transition-colors flex items-center ${
                loading || !canUseGpt 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  분석 중...
                </>
              ) : !canUseGpt ? (
                '분석 횟수 제한 도달'
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                  GPT 분석 요청
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* GPT 분석 결과 */}
      {gptReport && <GptReportCard report={gptReport} />}
    </div>
  );
};

export default AnalyzeETF;