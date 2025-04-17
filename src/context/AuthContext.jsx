// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '../firebase';

// Context 생성
const AuthContext = createContext();

// Context Provider 생성
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 회원가입 함수
  async function signup(email, password) {
   
    
    try {
      setError('');
      return await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('회원가입 오류:', error);
      
      // Firebase 오류 메시지 변환
      let errorMessage = '회원가입 중 오류가 발생했습니다.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = '이미 사용 중인 이메일입니다.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = '유효하지 않은 이메일 형식입니다.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = '비밀번호는 최소 6자 이상이어야 합니다.';
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }

  // 로그인 함수
  async function login(email, password) {
    try {
      setError('');
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('로그인 오류:', error);
      
      // Firebase 오류 메시지 변환
      let errorMessage = '로그인 중 오류가 발생했습니다.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = '이메일 또는 비밀번호가 올바르지 않습니다.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = '유효하지 않은 이메일 형식입니다.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = '너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.';
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }

  // 로그아웃 함수
  async function logout() {
    try {
      setError('');
      return await signOut(auth);
    } catch (error) {
      console.error('로그아웃 오류:', error);
      setError('로그아웃 중 오류가 발생했습니다.');
      throw error;
    }
  }

  // 인증 상태 변경 감지
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Context에 제공할 값
  const value = {
    currentUser,
    signup,
    login,
    logout,
    error,
    setError,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// 커스텀 훅 생성
export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;