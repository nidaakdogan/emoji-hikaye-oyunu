import React, { useEffect, useState } from 'react';
import { getAllUsers, saveUserScore, DEMO_USERS } from '../utils/scoreManager';

const Leaderboard = ({ currentUserEmail, onBack }) => {
  const [users, setUsers] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [myScore, setMyScore] = useState(0);
  const [myName, setMyName] = useState('');

  const updateLeaderboard = () => {
    const allUsers = getAllUsers();
    console.log('Liderlik tablosu güncelleniyor:', { allUsers, currentUserEmail });
    
    // Top 5 kullanıcıyı al
    setUsers(allUsers.slice(0, 5));
    
    if (currentUserEmail) {
      const myIndex = allUsers.findIndex(u => u.email === currentUserEmail);
      setMyRank(myIndex + 1);
      const me = allUsers.find(u => u.email === currentUserEmail);
      console.log('Kullanıcı bulundu:', { me, myIndex });
      setMyScore(me ? me.score : 0);
      setMyName(me ? me.name : 'Nida Akdoğan');
    }
  };

  useEffect(() => {
    // İlk yükleme
    updateLeaderboard();

    // localStorage değişikliklerini dinle
    const handleStorageChange = (e) => {
      if (e.key === 'emoji_game_leaderboard') {
        console.log('Liderlik tablosu değişikliği algılandı');
        updateLeaderboard();
      }
    };

    // Event listener ekle
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event listener (aynı sekme için)
    const handleCustomStorageChange = () => {
      console.log('Custom storage event tetiklendi');
      updateLeaderboard();
    };
    
    window.addEventListener('leaderboardUpdate', handleCustomStorageChange);

    // Her 3 saniyede bir güncelle (daha sık)
    const interval = setInterval(updateLeaderboard, 3000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('leaderboardUpdate', handleCustomStorageChange);
    };
  }, [currentUserEmail]);

  return (
    <div className="game-card" style={{ 
      minHeight: 480, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      position: 'relative',
      background: 'linear-gradient(to bottom right, #f0f4ff, #ffffff)',
      borderRadius: 20,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
      padding: 24,
      maxWidth: 600,
      margin: '0 auto',
      border: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
      <div style={{
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 10
      }}>
        <button 
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 16px',
            fontSize: '0.9rem',
            borderRadius: 10,
            background: '#f8fafc',
            color: '#374151',
            fontWeight: 600,
            border: '1px solid #e2e8f0',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <span style={{ fontSize: '0.9rem' }}>🏠</span>
          Ana Menü
        </button>
      </div>
        <div style={{
        background: '#ffffff',
        borderRadius: 20,
        padding: '36px',
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08), 0 12px 32px rgba(0, 0, 0, 0.12)',
        width: '100%',
        maxWidth: 600,
        position: 'relative'
      }}>
      <h2 style={{ 
        fontSize: '28px',
        fontWeight: 700, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 12, 
        marginBottom: 12, 
        background: 'linear-gradient(to right, #ff6a6a, #ffb347)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        justifyContent: 'center',
        textAlign: 'center'
      }}>
        Liderlik Tablosu
      </h2>

      {/* Desktop Tablo */}
      <div className="desktop-table" style={{ width: '100%', maxWidth: 600, margin: '0 auto', display: 'none', '@media (min-width: 768px)': { display: 'block' } }}>
        <table style={{ width: '100%', background: '#ffffff', borderRadius: 12, boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)', color: '#23272f', overflow: 'hidden', textAlign: 'center', border: '1px solid #f1f5f9' }}>
        <thead>
            <tr style={{ 
              background: '#f2f2f2',
              color: '#333',
              fontWeight: 700,
              fontSize: '0.95rem',
              textAlign: 'center',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <th style={{ fontWeight: 700, padding: '16px 8px', textAlign: 'center', letterSpacing: 0.5 }}>Sıra</th>
              <th style={{ fontWeight: 700, padding: '16px 8px', textAlign: 'center', letterSpacing: 0.5 }}>İsim</th>
              <th style={{ fontWeight: 700, padding: '16px 8px', textAlign: 'center', letterSpacing: 0.5 }}>Skor</th>
          </tr>
        </thead>
        <tbody>
            {users.length === 0 && <tr><td colSpan={3} style={{ padding: 16, textAlign: 'center' }}>Henüz skor yok.</td></tr>}
            {users.map((u, i) => {
              // Soft pastel renk paleti
              let bg = i === 0 ? '#FFD700' : i === 1 ? '#EAF2F8' : i === 2 ? '#F5E6D3' : '#FFFFFF';
              let textColor = i === 0 ? '#000000' : '#2d3748';
              let icon = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : null;
              let iconStyle = i < 3 ? { fontSize: i === 0 ? '26px' : '22px', verticalAlign: 'middle' } : {};
              
              // Kullanıcının kendi satırını vurgula
              const isCurrentUser = currentUserEmail && u.email === currentUserEmail;
              if (isCurrentUser) {
                bg = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                textColor = '#fff';
              }
              return (
                <tr 
                  key={u.email} 
                  style={{ 
                    background: bg,
                    transition: 'all 0.2s ease',
                    cursor: 'default',
                    textAlign: 'center',
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = '#f8f9fa';
                    e.currentTarget.style.transform = 'scale(1.01)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = bg;
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <td style={{ padding: '20px 8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, color: textColor, justifyContent: 'center', minWidth: 50 }}>
                    {i < 3 ? (
                      <span style={iconStyle}>{icon}</span>
                    ) : (
                      <span style={{ fontSize: '1.1rem', color: '#b0b3b8', fontWeight: 700 }}>🎖️</span>
                    )}
                  </td>
                  <td style={{ padding: '20px 8px', fontWeight: i < 3 ? 700 : 600, color: textColor, textAlign: 'center', minWidth: 120 }}>{u.name}</td>
                  <td style={{ padding: '20px 8px', textAlign: 'center', fontWeight: i < 3 ? 700 : 600, color: textColor, minWidth: 60 }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>{u.score}</span>
                  </td>
            </tr>
              );
            })}
        </tbody>
      </table>
      
      {/* Kullanıcının kendi skoru */}
      {currentUserEmail && myRank > 5 && myScore > 0 && (
        <div style={{
          marginTop: 20,
          padding: '16px 20px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 12,
          border: '2px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#fff',
          fontWeight: 600
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '1.2rem' }}>👤</span>
            <span>Sen: {myName}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span>Skor: <b>{myScore}</b></span>
            <span>Sıra: <b>{myRank}</b></span>
          </div>
        </div>
      )}
      </div>
      {/* Mobil Tablo */}
      <div className="mobile-table" style={{ width: '100%', maxWidth: 500, margin: '0 auto', display: 'block', '@media (min-width: 768px)': { display: 'none' } }}>
        <div style={{ background: '#ffffff', borderRadius: 12, boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)', padding: 20, border: '1px solid #f1f5f9' }}>
          {users.length === 0 && <div style={{ textAlign: 'center', color: '#475569', padding: 20 }}>Henüz skor yok.</div>}
          {users.map((u, i) => {
            let bg = i === 0 ? '#FFF8DC' : i === 1 ? '#EAF2F8' : i === 2 ? '#F5E6D3' : '#FFFFFF';
            let textColor = '#2d3748';
            let icon = i === 0 ? '🏆' : i === 1 ? '🥈' : i === 2 ? '🥉' : null;
            let iconStyle = i < 3 ? { fontSize: i === 0 ? '28px' : '24px', verticalAlign: 'middle' } : {};
            
            // Kullanıcının kendi satırını vurgula
            const isCurrentUser = currentUserEmail && u.email === currentUserEmail;
            if (isCurrentUser) {
              bg = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
              textColor = '#fff';
            }
            return (
              <div 
                key={u.email}
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '20px 24px',
                  margin: '12px 0',
                  background: bg,
                  borderRadius: 12,
                  transition: 'all 0.2s ease',
                  cursor: 'default',
                  color: textColor
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = '#f8f9fa';
                  e.currentTarget.style.transform = 'scale(1.01)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = bg;
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {i < 3 ? (
                    <span style={iconStyle}>{icon}</span>
                  ) : (
                    <span style={{ fontSize: '1.1rem', color: '#b0b3b8', fontWeight: 700, minWidth: 30 }}>🎖️</span>
                  )}
                  <span style={{ fontWeight: i < 3 ? 700 : 500, color: textColor, textShadow: i < 3 ? '0 1px 2px #fff8' : 'none' }}>{u.name}</span>
                </div>
                <span style={{ fontWeight: i < 3 ? 700 : 600, color: textColor }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>{u.score}</span>
                </span>
              </div>
            );
          })}
          
          {/* Kullanıcının kendi skoru - Mobil */}
          {currentUserEmail && myRank > 5 && myScore > 0 && (
            <div style={{
              marginTop: 20,
              padding: '16px 20px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 12,
              border: '2px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#fff',
              fontWeight: 600
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: '1.2rem' }}>👤</span>
                <span>Sen: {myName}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span>Skor: <b>{myScore}</b></span>
                <span>Sıra: <b>{myRank}</b></span>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @media (min-width: 768px) {
          .mobile-table { display: none !important; }
          .desktop-table { display: block !important; }
        }
        @media (max-width: 767px) {
          .mobile-table { display: block !important; }
          .desktop-table { display: none !important; }
        }
      `}</style>
      </div>
    </div>
  );
};

export default Leaderboard; 