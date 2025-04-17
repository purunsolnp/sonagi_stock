// components/PrivateRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = () => {
  const { currentUser, loading } = useAuth();

  // 로딩 중이면 로딩 화면 표시
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // 사용자가 로그인되어 있으면 자식 컴포넌트(Outlet)을 렌더링
  // 그렇지 않으면 로그인 페이지로 리다이렉트
  return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;