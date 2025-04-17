import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8">이 페이지는 홈페이지입니다</h1>
      
      <div className="grid gap-4 md:grid-cols-3 w-full max-w-3xl">
        <Link 
          to="/recommend" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded shadow transition-colors text-center"
        >
          종목 추천으로 가기
        </Link>
        
        <Link 
          to="/etf" 
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded shadow transition-colors text-center"
        >
          ETF 추천으로 가기
        </Link>
        
        <Link 
          to="/portfolio" 
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded shadow transition-colors text-center"
        >
          내 포트폴리오 보기
        </Link>
      </div>
      
      <div className="mt-12 max-w-lg">
        <h2 className="text-xl font-semibold mb-4">환영합니다!</h2>
        <p className="text-gray-700">
          이 애플리케이션은 주식 및 ETF 추천, 포트폴리오 관리를 도와주는 서비스입니다.
          상단 메뉴 또는 위의 버튼을 통해 다양한 서비스를 이용해보세요.
        </p>
      </div>
    </div>
  );
};

export default Home;