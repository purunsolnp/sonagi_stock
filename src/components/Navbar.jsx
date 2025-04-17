// components/Navbar.jsx
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const isActive = (path) => {
    return location.pathname === path ? 'bg-blue-700' : '';
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      navigate('/');
    } catch (error) {
      console.error('로그아웃 오류:', error);
      alert('로그아웃 중 오류가 발생했습니다.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-xl font-bold">포트폴리오 매니저</Link>
          
          <div className="hidden md:flex space-x-4">
            <Link to="/" className={`px-3 py-2 rounded hover:bg-blue-700 transition-colors ${isActive('/')}`}>
              홈
            </Link>
            <Link to="/recommend" className={`px-3 py-2 rounded hover:bg-blue-700 transition-colors ${isActive('/recommend')}`}>
              종목 추천
            </Link>
            <Link to="/etf" className={`px-3 py-2 rounded hover:bg-blue-700 transition-colors ${isActive('/etf')}`}>
              ETF 추천
            </Link>
            <Link to="/portfolio" className={`px-3 py-2 rounded hover:bg-blue-700 transition-colors ${isActive('/portfolio')}`}>
              내 포트폴리오
            </Link>
            
            {currentUser ? (
              <>
                {currentUser.email.includes('admin') && (
                  <Link to="/admin" className={`px-3 py-2 rounded hover:bg-blue-700 transition-colors ${isActive('/admin')}`}>
                    관리자
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="px-3 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  {isLoggingOut ? '처리중...' : '로그아웃'}
                </button>
                <span className="px-3 py-2 opacity-80">
                  {currentUser.email}
                </span>
              </>
            ) : (
              <Link to="/login" className={`px-3 py-2 rounded hover:bg-blue-700 transition-colors ${isActive('/login')}`}>
                로그인
              </Link>
            )}
          </div>
          
          {/* 모바일 메뉴 버튼 */}
          <div className="md:hidden">
            <button 
              className="mobile-menu-button p-2 rounded hover:bg-blue-700 transition-colors"
              onClick={toggleMobileMenu}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
        
        {/* 모바일 메뉴 */}
        <div className={`mobile-menu md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="flex flex-col space-y-2 pb-4">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded hover:bg-blue-700 transition-colors ${isActive('/')}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              홈
            </Link>
            <Link 
              to="/recommend" 
              className={`px-3 py-2 rounded hover:bg-blue-700 transition-colors ${isActive('/recommend')}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              종목 추천
            </Link>
            <Link 
              to="/etf" 
              className={`px-3 py-2 rounded hover:bg-blue-700 transition-colors ${isActive('/etf')}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              ETF 추천
            </Link>
            <Link 
              to="/portfolio" 
              className={`px-3 py-2 rounded hover:bg-blue-700 transition-colors ${isActive('/portfolio')}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              내 포트폴리오
            </Link>
            
            {currentUser ? (
              <>
                {currentUser.email.includes('admin') && (
                  <Link 
                    to="/admin" 
                    className={`px-3 py-2 rounded hover:bg-blue-700 transition-colors ${isActive('/admin')}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    관리자
                  </Link>
                )}
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  disabled={isLoggingOut}
                  className="px-3 py-2 rounded hover:bg-blue-700 transition-colors text-left"
                >
                  {isLoggingOut ? '처리중...' : '로그아웃'}
                </button>
                <span className="px-3 py-2 opacity-80">
                  {currentUser.email}
                </span>
              </>
            ) : (
              <Link 
                to="/login" 
                className={`px-3 py-2 rounded hover:bg-blue-700 transition-colors ${isActive('/login')}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                로그인
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;