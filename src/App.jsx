// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Recommend from './pages/Recommend';
import ETF from './pages/ETF';
import Portfolio from './pages/Portfolio';
import Analyze from './pages/Analyze';
import AnalyzeCompare from './pages/AnalyzeCompare';
import AnalyzeETF from './pages/AnalyzeETF';
import AnalyzeETFCompare from './pages/AnalyzeETFCompare';  // 이 부분 추가
import Login from './pages/Login';
import Admin from './pages/Admin';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/recommend" element={<Recommend />} />
              <Route path="/etf" element={<ETF />} />
              <Route path="/login" element={<Login />} />
              <Route path="/analyze/compare" element={<AnalyzeCompare />} />
              <Route path="/analyze/:ticker" element={<Analyze />} />
              <Route path="/analyze/etf/compare" element={<AnalyzeETFCompare />} />
              <Route path="/analyze/etf/:ticker" element={<AnalyzeETF />} />
              
              {/* 보호된 라우트 - 로그인 필요 */}
              <Route element={<PrivateRoute />}>
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/admin" element={<Admin />} />
              </Route>
            </Routes>
          </main>
          <footer className="bg-gray-100 py-4 text-center">
            <p className="text-gray-600">© 2025 주식 포트폴리오 관리 앱</p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;