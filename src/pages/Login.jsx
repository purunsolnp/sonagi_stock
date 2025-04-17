// pages/Login.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  
  const { currentUser, login, signup, error, setError } = useAuth();
  const navigate = useNavigate();

  // 이미 로그인된 사용자는 홈으로 리다이렉트
  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
    // 컴포넌트 언마운트 시 에러 초기화
    return () => {
      setError('');
    };
  }, [currentUser, navigate, setError]);

  const validateForm = () => {
    setFormError('');
    
    // 이메일 검증
    if (!email) {
      setFormError('이메일을 입력해주세요.');
      return false;
    }
    
    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormError('유효한 이메일 형식이 아닙니다.');
      return false;
    }
    
    // 회원가입 시 네이버 이메일 검증
    if (!isLogin && !email.endsWith('@naver.com')) {
      setFormError('네이버 이메일(@naver.com)만 가입이 가능합니다.');
      return false;
    }
    
    // 비밀번호 검증
    if (!password) {
      setFormError('비밀번호를 입력해주세요.');
      return false;
    }
    
    if (!isLogin && password.length < 6) {
      setFormError('비밀번호는 최소 6자 이상이어야 합니다.');
      return false;
    }
    
    // 회원가입 시 비밀번호 확인 검증
    if (!isLogin && password !== confirmPassword) {
      setFormError('비밀번호가 일치하지 않습니다.');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      if (isLogin) {
        await login(email, password);
        navigate('/');
      } else {
        await signup(email, password);
        navigate('/');
      }
    } catch (err) {
      // AuthContext에서 발생한 에러는 이미 상태에 설정되어 있음
      console.error('인증 처리 중 오류:', err);
      setFormError(err.message || '인증 처리 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">
        {isLogin ? '로그인' : '회원가입'}
      </h1>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex mb-6">
          <button
            type="button"
            className={`flex-1 py-2 ${isLogin ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-500'}`}
            onClick={() => {
              setIsLogin(true);
              setError('');
              setFormError('');
            }}
          >
            로그인
          </button>
          <button
            type="button"
            className={`flex-1 py-2 ${!isLogin ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-500'}`}
            onClick={() => {
              setIsLogin(false);
              setError('');
              setFormError('');
            }}
          >
            회원가입
          </button>
        </div>
        
        {/* 에러 메시지 표시 */}
        {(error || formError) && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">
            {formError || error}
          </div>
        )}
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="이메일을 입력하세요"
            />
            {!isLogin && (
              <p className="mt-1 text-sm text-gray-500">
                네이버 이메일(@naver.com)만 가입 가능합니다.
              </p>
            )}
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="비밀번호를 입력하세요"
            />
            {!isLogin && (
              <p className="mt-1 text-sm text-gray-500">
                비밀번호는 최소 6자 이상이어야 합니다.
              </p>
            )}
          </div>
          
          {!isLogin && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">비밀번호 확인</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="비밀번호를 다시 입력하세요"
              />
            </div>
          )}
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                처리 중...
              </span>
            ) : (
              isLogin ? '로그인' : '회원가입'
            )}
          </button>
        </form>
        
        {isLogin && (
          <p className="mt-4 text-center text-sm text-gray-600">
            계정이 없으신가요?{' '}
            <button 
              type="button"
              onClick={() => {
                setIsLogin(false);
                setError('');
                setFormError('');
              }} 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              회원가입
            </button>
          </p>
        )}
        
        <div className="flex justify-center mt-6">
          <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
            ← 홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;