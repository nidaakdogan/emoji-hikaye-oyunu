import React, { useState, useEffect } from 'react';
import Menu from './components/Menu';
import Game from './components/Game';
import DailyChallenge from './components/DailyChallenge';
import Leaderboard from './components/Leaderboard';
import { getAllUsers, saveUserScore, syncUserBestScore } from './utils/scoreManager';

function App() {
  const [step, setStep] = useState('auth'); // 'auth', 'profile', 'game', 'result', 'daily', 'leaderboard'
  const [user, setUser] = useState({ name: 'Nida Akdoğan', email: 'nidaakdogan1994@gmail.com', avatar: '🧑' });
  const [difficulty, setDifficulty] = useState('medium');
  const [finalScore, setFinalScore] = useState(null);
  const [lastScore, setLastScore] = useState(0);
  const [bestScore, setBestScore] = useState(10);
  const [darkMode, setDarkMode] = useState(false);
  const [userRank, setUserRank] = useState(null);

  // localStorage'dan skorları oku ve sıralamayı kontrol et
  useEffect(() => {
    if (user.email) {
      const savedLastScore = localStorage.getItem(`lastScore_${user.email}`);
      const savedBestScore = localStorage.getItem(`bestScore_${user.email}`);
      
      if (savedLastScore) {
        const lastScore = parseInt(savedLastScore);
        setLastScore(lastScore);
      }
      
      if (savedBestScore) {
        const bestScore = parseInt(savedBestScore);
        setBestScore(bestScore);
        
        // En iyi skoru liderlik tablosuna senkronize et
        syncUserBestScore(user.email, user.name);
      }
      
      // Kullanıcının sıralamasını kontrol et
      const allUsers = getAllUsers();
      const userIndex = allUsers.findIndex(u => u.email === user.email);
      setUserRank(userIndex >= 0 ? userIndex + 1 : null);
    }
  }, [user.email, user.name]);

  const getBestScore = () => {
    if (user.email) {
      const saved = localStorage.getItem(`bestScore_${user.email}`);
      return saved ? parseInt(saved) : 0;
    }
    return 0;
  };

  // Kayıt/Giriş sonrası kullanıcı adı sadece kayıt sırasında güncellenir
  const handleAuth = (name, email) => {
    setUser(prev => ({
      name: name ? name : prev.name,
      email: email || 'nidaakdogan1994@gmail.com', // Varsayılan email
      avatar: '🧑‍💻'
    }));
    setStep('profile');
  };

  const handleStartGame = () => {
    setStep('game');
  };

  const handleGameFinish = (score) => {
    setFinalScore(score);
    setLastScore(score); // Son skor güncellenir
    setBestScore(prev => Math.max(prev, score)); // En iyi skor sadece daha yüksekse güncellenir
    
    // localStorage'a kaydet
    if (user.email && score > 0) {
      localStorage.setItem(`lastScore_${user.email}`, score.toString()); // Son skor
      localStorage.setItem(`bestScore_${user.email}`, Math.max(getBestScore(), score).toString()); // En iyi skor
      
      // Skor kaydetme işlemi
      const saved = saveUserScore(user.email, user.name || 'Kullanıcı', score);
      console.log('Skor kaydedildi:', saved);
      
      // Liderlik tablosunu güncelle
      if (saved) {
        // Custom event dispatch
        window.dispatchEvent(new CustomEvent('leaderboardUpdate', {
          detail: { email: user.email, name: user.name, score }
        }));
        
        // Kullanıcının sıralamasını güncelle
        setTimeout(() => {
          const allUsers = getAllUsers();
          const userIndex = allUsers.findIndex(u => u.email === user.email);
          setUserRank(userIndex >= 0 ? userIndex + 1 : null);
        }, 100);
      }
    }
    setStep('profile');
  };

  const handleLogout = () => {
    setStep('auth');
    setFinalScore(null);
    setUser({ name: 'Nida Akdoğan', email: 'nidaakdogan1994@gmail.com', avatar: '🧑' });
  };

  // EKLENENLER:
  const handleDailyChallenge = () => {
    // Günlük görev için otomatik zorluk seçimi
    const today = new Date().getDate();
    const autoDifficulty = today % 3 === 0 ? 'hard' : today % 2 === 0 ? 'medium' : 'easy';
    setDifficulty(autoDifficulty);
    setStep('daily');
  };
  const handleLeaderboard = () => {
    setStep('leaderboard');
  };

  // Günlük görevden döndüğünde skorları güncelle
  const handleBackFromDaily = (score) => {
    setFinalScore(score);
    setLastScore(score); // Son skor güncellenir
    setBestScore(prev => Math.max(prev, score)); // En iyi skor sadece daha yüksekse güncellenir
    
    // localStorage'a kaydet
    if (user.email && score > 0) {
      localStorage.setItem(`lastScore_${user.email}`, score.toString()); // Son skor
      localStorage.setItem(`bestScore_${user.email}`, Math.max(getBestScore(), score).toString()); // En iyi skor
    }
    setStep('profile');
  };

  // Dark Mode Toggle
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  };

  return (
    <div className="app-container">
      {step === 'auth' && (
        <Menu onStart={handleAuth} />
      )}
      {step === 'profile' && (
        <div className="menu-card" style={{ 
          position: 'relative', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: 'var(--spacing-lg)',
          background: 'var(--surface)', 
          borderRadius: 'var(--radius-lg)', 
          width: '100%',
          maxWidth: '1280px',
          margin: '0 auto',
          boxSizing: 'border-box',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border)',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: 24, right: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ 
              width: 36, 
              height: 36, 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              fontWeight: 600,
              color: '#fff',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              flexShrink: 0
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(99, 102, 241, 0.4)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
            }}
            >
              {user.name ? user.name.charAt(0) : 'N'}
            </div>
            <button 
              className="button-primary"
              onClick={handleLogout}
              style={{ 
                background: 'rgba(255, 255, 255, 0.9)', 
                color: '#2d3a4a',
                padding: '8px 16px',
                height: '36px',
                fontSize: '14px'
              }}
            >
              Çıkış Yap
            </button>
          </div>

          {/* Başlık Bölümü - Tek Container */}
          <div style={{
            position: 'absolute',
            top: 30,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 20,
            textAlign: 'center',
            maxWidth: '600px'
          }}>
            {/* Ana Başlık */}
            <h2 style={{
              fontSize: '28px',
              fontWeight: 700,
              margin: 0, 
              marginBottom: '12px',
              letterSpacing: 0.5, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: 10, 
              color: 'var(--primary)',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <span style={{ fontSize: '28px' }}>👋</span> Hoşgeldin, {user.name}!
          </h2>
            
            {/* Alt Açıklama */}
            <div style={{
              fontSize: '16px',
              color: 'var(--text-secondary)', 
              fontWeight: 400,
              lineHeight: 1.6,
              fontStyle: 'italic',
              margin: 0
            }}>
              "Bugünkü hedefini seç ve eğlenmeye başla!" 🎯
            </div>
          </div>

          {/* Oyun Maskotu */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '120px',
            opacity: 0.05,
            pointerEvents: 'none',
            zIndex: -1,
            animation: 'floatMaskot 6s ease-in-out infinite'
          }}>
            🎮
          </div>
          
          {/* Modern Kart Tasarımı - Yan Yana */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'row',
            gap: 'var(--spacing-xl)', 
            width: '100%',
            maxWidth: '100%',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'stretch',
            flex: 1,
            marginTop: '120px',
            marginBottom: 'var(--spacing-xl)',
            boxSizing: 'border-box',
            padding: 'var(--spacing-lg)'
          }}>
            {/* Günlük Görev Kartı */}
            <div style={{ 
              background: '#ffffff', 
              borderRadius: 'var(--radius-lg)', 
              padding: 'var(--spacing-xl)', 
              width: '45%',
              minWidth: '300px',
              maxWidth: '450px',
              maxHeight: '450px',
              boxSizing: 'border-box',
              margin: 'var(--spacing-md)',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(0, 0, 0, 0.05)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              overflow: 'hidden',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.15)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(0, 0, 0, 0.05)';
            }}
            onClick={handleDailyChallenge}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: 'var(--spacing-lg)', 
                marginBottom: 'var(--spacing-lg)',
                lineHeight: 1.4
              }}>
                <div style={{ 
                  width: 56, 
                  height: 56, 
                  borderRadius: 'var(--radius-md)', 
                  background: 'linear-gradient(135deg, var(--secondary), var(--accent-alt))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  flexShrink: 0,
                  marginTop: '-4px',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                  border: '2px solid rgba(255, 255, 255, 0.2)'
                }}>
                  📅
                </div>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center',
                  minHeight: 56
                }}>
                  <div style={{ 
                    fontSize: 'var(--font-size-lg)', 
                    color: 'var(--text-primary)', 
                    fontWeight: 600, 
                    marginBottom: 'var(--spacing-xs)',
                    lineHeight: 1.4
                  }}>
                    Günlük Görev
                  </div>
                  <div style={{ 
                    fontSize: 'var(--font-size-sm)', 
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                    fontStyle: 'italic'
                  }}>
                    Bugünkü 3 sabit hikaye seni bekliyor
                  </div>
                </div>
              </div>
              
              <div style={{ 
                background: '#f8f9fa', 
                padding: 'var(--spacing-md)', 
                borderRadius: 'var(--radius-sm)', 
                marginBottom: 'var(--spacing-md)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', fontSize: '16px', color: 'var(--text-secondary)' }}>
                  <span>🎯</span>
                  <span>3 sabit hikaye</span>
                </div>
                <span style={{ 
                  fontSize: '12px', 
                  color: '#fff', 
                      fontWeight: 600,
                  padding: '4px 8px',
                  borderRadius: '12px',
                  background: 'linear-gradient(90deg, var(--secondary), var(--secondary-dark))',
                  boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)'
                }}>Otomatik</span>
          </div>
              
              <button className="button-primary">
                📅 BUGÜNKÜ MÜCADELE
          </button>
            </div>
            
            {/* Hızlı Başla Kartı */}
            <div style={{ 
              background: '#ffffff', 
              borderRadius: 'var(--radius-lg)', 
              padding: 'var(--spacing-xl)', 
              width: '45%',
              minWidth: '300px',
              maxWidth: '450px',
              maxHeight: '450px',
              boxSizing: 'border-box',
              margin: 'var(--spacing-md)',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(0, 0, 0, 0.05)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              overflow: 'hidden',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.15)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(0, 0, 0, 0.05)';
            }}
            onClick={handleStartGame}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: 'var(--spacing-lg)', 
                marginBottom: 'var(--spacing-lg)',
                lineHeight: 1.4
              }}>
                <div style={{ 
                  width: 56, 
                  height: 56, 
                  borderRadius: 'var(--radius-md)', 
                  background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  flexShrink: 0,
                  marginTop: '-4px',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                  border: '2px solid rgba(255, 255, 255, 0.2)'
                }}>
                  🚀
                </div>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center',
                  minHeight: 56
                }}>
                  <div style={{ 
                    fontSize: 'var(--font-size-lg)', 
                    color: 'var(--text-primary)', 
                    fontWeight: 600, 
                    marginBottom: 'var(--spacing-xs)',
                    lineHeight: 1.4
                  }}>
                    Hızlı Başla
                  </div>
                  <div style={{ 
                    fontSize: 'var(--font-size-sm)', 
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                    fontStyle: 'italic'
                  }}>
                    Becerini test et: Zorluk seç
                  </div>
                </div>
              </div>
              
              {/* Zorluk Seçimi */}
              <div style={{ 
                display: 'flex', 
                gap: 'var(--spacing-md)', 
                marginBottom: 'var(--spacing-lg)',
                width: '100%',
                justifyContent: 'space-between'
              }}>
            {['easy', 'medium', 'hard'].map(level => (
              <button 
                key={level}
                className={`difficulty-button ${difficulty === level ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setDifficulty(level);
                }}
                style={{ 
                  flex: 1,
                  minWidth: 0,
                  whiteSpace: 'nowrap'
                }}
              >
                {level === 'easy' && 'KOLAY'}
                {level === 'medium' && 'ORTA'}
                {level === 'hard' && 'ZOR'}
              </button>
            ))}
          </div>
              
              <button className="button-primary">
                🚀 HEMEN OYNA
          </button>
            </div>
          </div>
          {/* Gelişmiş Alt Bilgi - Kartların Altında */}
          <div style={{ 
            width: '100%', 
            maxWidth: 800,
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-lg)',
            marginTop: 'var(--spacing-lg)'
          }}>
            {/* Skor Bilgisi - Ayrı Kutular */}
            <div className="score-info-container" style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'stretch',
              gap: 'var(--spacing-lg)',
              width: '100%'
            }}>
              <div className="score-item" style={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                gap: 'var(--spacing-md)',
                background: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--spacing-xl)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                flex: 1,
                textAlign: 'center',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.15)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
              }}
              >
                <div style={{ 
                  width: 64, 
                  height: 64, 
                  borderRadius: 'var(--radius-lg)', 
                  background: 'linear-gradient(135deg, var(--secondary), var(--secondary-dark))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  border: '3px solid rgba(255, 255, 255, 0.4)',
                  boxShadow: '0 6px 16px rgba(59, 130, 246, 0.4), 0 0 20px rgba(59, 130, 246, 0.2)',
                  animation: 'scoreIconPulse 2s ease-in-out infinite'
                }}>
                  🏅
                </div>
                <div>
                  <div style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>Son Skor</div>
                  <div style={{ fontSize: '32px', color: 'var(--text-primary)', fontWeight: 800, marginBottom: '8px', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>{lastScore}</div>
                  <div style={{ fontSize: '14px', color: '#666', fontStyle: 'italic' }}>Bu haftaki skorun</div>
                </div>
              </div>
              
              <div className="score-item" style={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                gap: 'var(--spacing-md)',
                background: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--spacing-xl)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                flex: 1,
                textAlign: 'center',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.15)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
              }}
              >
                <div style={{ 
                  width: 64, 
                  height: 64, 
                  borderRadius: 'var(--radius-lg)', 
                  background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  border: '3px solid rgba(255, 255, 255, 0.4)',
                  boxShadow: '0 6px 16px rgba(99, 102, 241, 0.4), 0 0 20px rgba(99, 102, 241, 0.2)',
                  animation: 'scoreIconPulse 2s ease-in-out infinite'
                }}>
                  🏆
                </div>
                <div>
                  <div style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>En İyi</div>
                  <div style={{ fontSize: '32px', color: 'var(--text-primary)', fontWeight: 800, marginBottom: '8px', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>{bestScore}</div>
                  <div style={{ fontSize: '14px', color: '#666', fontStyle: 'italic' }}>Genel ortalaman</div>
                </div>
                
                <div style={{ 
                  width: 1, 
                  height: 36, 
                  background: 'var(--border)' 
                }}></div>
            </div>
            
              {/* Dinamik Liderlik Kartı */}
              <div className="score-item" style={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                gap: 'var(--spacing-md)',
                background: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--spacing-xl)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                flex: 1,
                textAlign: 'center',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.15)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
              }}
              onClick={handleLeaderboard}
            >
                <div style={{ 
                  width: 64, 
                  height: 64, 
                  borderRadius: 'var(--radius-lg)', 
                  background: 'linear-gradient(135deg, var(--accent), var(--accent-alt))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  border: '3px solid rgba(255, 255, 255, 0.4)',
                  boxShadow: '0 6px 16px rgba(244, 114, 182, 0.4), 0 0 20px rgba(244, 114, 182, 0.2)',
                  animation: 'scoreIconPulse 2s ease-in-out infinite'
                }}>
                  📊
                </div>
                <div>
                  <div style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>Liderlik</div>
                  <div style={{ fontSize: '18px', color: 'var(--primary)', fontWeight: 700, marginBottom: '8px', fontStyle: 'italic' }}>
                    {lastScore > 0 ? 
                      (userRank && userRank <= 5 ? `İlk 5'te ${userRank}. sıradasın! 🎉` : `Sıralamada ${userRank || '?'}. sıradasın`) 
                      : 'İlk skorunu yap! 🚀'}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
                    {lastScore > 0 ? `Sıralamada yerini gör` : 'Liderlik tablosunu keşfet'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {step === 'game' && (
        <Game key={difficulty} currentUserEmail={user.email} currentUserName={user.name} onFinish={handleGameFinish} difficulty={difficulty} />
      )}
      {step === 'game' && finalScore !== null && false && (
        <div className="result-card">
          <h2>Oyun Bitti!</h2>
          <p>Toplam Skorun: <b>{finalScore}</b></p>
          <button className="button-primary" onClick={() => setStep('profile')}>Ana Menü</button>
        </div>
      )}
      {step === 'daily' && (
        <DailyChallenge currentUserEmail={user.email} currentUserName={user.name} onFinish={handleBackFromDaily} difficulty={difficulty} />
      )}
      {step === 'leaderboard' && (
        <Leaderboard currentUserEmail={user.email} onBack={() => setStep('profile')} />
      )}
    </div>
  );
}

export default App; 