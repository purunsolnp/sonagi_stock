// src/pages/Admin.jsx - GPT 사용량 관리 기능 추가
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';

const Admin = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [adminCheck, setAdminCheck] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 사용자별 GPT 제한 수정을 위한 상태
  const [editingUser, setEditingUser] = useState(null);
  const [newGptLimit, setNewGptLimit] = useState(5);
  const [limitEnabled, setLimitEnabled] = useState(true);

  // 관리자 권한 확인 (이메일에 'admin'이 포함되어 있는지 확인)
  useEffect(() => {
    if (currentUser) {
      const isAdmin = currentUser.email.includes('admin');
      setAdminCheck(true);
      
      if (!isAdmin) {
        // 관리자가 아니면 홈으로 리다이렉트
        alert('관리자 권한이 필요합니다.');
        navigate('/');
      } else {
        // 관리자면 사용자 목록 로드
        loadUsers();
      }
    }
  }, [currentUser, navigate]);

  // 사용자 목록 및 GPT 사용량 불러오기
  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      
      const usersData = [];
      
      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        
        // auth 사용자 정보 가져오기 (이메일 등)
        let userEmail = "알 수 없음";
        try {
          // Firebase Auth 데이터는 직접 접근 불가능하므로 별도 필드로 저장된 이메일을 사용
          userEmail = userData.email || "이메일 없음";
        } catch (error) {
          console.error("사용자 데이터 로드 중 오류:", error);
        }
        
        // 사용자 데이터 준비
        usersData.push({
          id: userDoc.id,
          email: userEmail,
          gptUsage: userData.gpt_usage_this_month || 0,
          gptLimit: userData.gpt_limit || 5,
          gptLimitEnabled: userData.gpt_limit_enabled === undefined ? true : userData.gpt_limit_enabled,
          createdAt: userData.created_at ? new Date(userData.created_at.seconds * 1000).toLocaleDateString() : '알 수 없음'
        });
      }
      
      setUsers(usersData);
      setError(null);
    } catch (err) {
      console.error("사용자 목록 로드 중 오류:", err);
      setError("사용자 목록을 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 모든 사용자의 GPT 사용량 초기화
  const resetAllUsersGptUsage = async () => {
    if (!confirm('모든 사용자의 GPT 사용량을 초기화하시겠습니까?')) return;
    
    try {
      setLoading(true);
      
      for (const user of users) {
        const userRef = doc(db, 'users', user.id);
        await updateDoc(userRef, {
          gpt_usage_this_month: 0
        });
      }
      
      alert('모든 사용자의 GPT 사용량이 초기화되었습니다.');
      loadUsers(); // 목록 새로고침
    } catch (err) {
      console.error("GPT 사용량 초기화 중 오류:", err);
      setError("GPT 사용량 초기화에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 특정 사용자의 GPT 사용량 초기화
  const resetUserGptUsage = async (userId) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        gpt_usage_this_month: 0
      });
      
      // 목록 갱신
      setUsers(users.map(user => 
        user.id === userId ? {...user, gptUsage: 0} : user
      ));
      
      alert('사용자의 GPT 사용량이 초기화되었습니다.');
    } catch (err) {
      console.error("사용자 GPT 사용량 초기화 중 오류:", err);
      alert("초기화에 실패했습니다.");
    }
  };

  // 사용자 제한 설정 저장
  const saveUserLimit = async () => {
    if (!editingUser) return;
    
    try {
      const userRef = doc(db, 'users', editingUser.id);
      await updateDoc(userRef, {
        gpt_limit: Number(newGptLimit),
        gpt_limit_enabled: limitEnabled
      });
      
      // 목록 갱신
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? {...user, gptLimit: Number(newGptLimit), gptLimitEnabled: limitEnabled} 
          : user
      ));
      
      setEditingUser(null);
      alert('사용자의 GPT 제한 설정이 업데이트되었습니다.');
    } catch (err) {
      console.error("제한 설정 업데이트 중 오류:", err);
      alert("설정 저장에 실패했습니다.");
    }
  };

  // 사용자 제한 설정 모달
  const openLimitModal = (user) => {
    setEditingUser(user);
    setNewGptLimit(user.gptLimit);
    setLimitEnabled(user.gptLimitEnabled);
  };

  if (!adminCheck || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">관리자 페이지</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">관리자 정보</h2>
          <p className="text-gray-700">
            관리자 이메일: {currentUser.email}
          </p>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">GPT 사용량 관리</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-medium">사용자 목록</h3>
            <button
              onClick={resetAllUsersGptUsage}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
            >
              모든 사용자 사용량 초기화
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이메일</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GPT 사용량</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제한 설정</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">가입일</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.gptUsage >= user.gptLimit && user.gptLimitEnabled 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.gptUsage} / {user.gptLimit}
                      </span>
                      {!user.gptLimitEnabled && (
                        <span className="ml-2 text-xs text-gray-500">(제한 없음)</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => openLimitModal(user)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        설정 변경
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.createdAt}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => resetUserGptUsage(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        사용량 초기화
                      </button>
                    </td>
                  </tr>
                ))}
                
                {users.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      사용자가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* 제한 설정 모달 */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">GPT 제한 설정</h3>
            <p className="mb-4 text-gray-600">사용자: {editingUser.email}</p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">GPT 사용 제한 활성화</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={limitEnabled}
                  onChange={(e) => setLimitEnabled(e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {limitEnabled ? '제한 활성화됨' : '제한 없음 (무제한)'}
                </span>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">월간 GPT 사용 횟수 제한</label>
              <input
                type="number"
                min="1"
                max="100"
                value={newGptLimit}
                onChange={(e) => setNewGptLimit(e.target.value)}
                disabled={!limitEnabled}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${!limitEnabled ? 'bg-gray-100' : ''}`}
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                취소
              </button>
              <button
                onClick={saveUserLimit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;