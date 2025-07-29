import React, { useState } from 'react';
import ekran from "../ekran.png";

const Menu = ({ onStart }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [name, setName] = useState('');
  const [showRegister, setShowRegister] = useState(false); // Varsayılan: giriş ekranı

  const handleRegister = () => {
    if (!name) return alert('Lütfen adınızı girin!');
    if (!email) return alert('Lütfen e-posta girin!');
    if (localStorage.getItem(`user_${email}`)) {
      alert('Bu e-posta ile zaten bir hesap var! Lütfen giriş yapın.');
      return;
    }
    localStorage.setItem(`user_${email}`, name);
    onStart(name, email);
  };
  const handleLogin = () => {
    if (!email) return alert('Lütfen e-posta girin!');
    const storedName = localStorage.getItem(`user_${email}`) || 'Kullanıcı';
    onStart(storedName, email);
  };

  return (
    <div className="menu-card" style={{ 
      paddingTop: 48,
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(15px)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.3)'
    }}>
      <h1 className="title">
        🧩 Emoji Hikaye Avı 🧩
      </h1>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        marginBottom: 32,
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
        background: 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        padding: '16px'
      }}>
        <img 
          src={ekran} 
          alt="Emoji Hikaye Oyunu" 
          style={{ 
            maxWidth: '100%', 
            height: 'auto',
            borderRadius: 12,
            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))'
          }} 
        />
      </div>
      <div className="info-box" style={{
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        borderRadius: 12,
        padding: '16px 20px',
        marginBottom: 24,
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)'
      }}>
        <span style={{fontSize: '1.3rem'}}>✨</span>
        Çocuklar için eğlenceli ve eğitici emoji tahmin oyunu!
        <span style={{fontSize: '1.3rem'}}>✨</span>
      </div>
      {!showRegister ? (
        <>
          <input
            type="email"
            placeholder="E-posta"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="off"
          />
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <button className="login-btn" onClick={handleLogin}>🚀 Giriş Yap</button>
          <div className="form-link" style={{ 
            fontFamily: 'Montserrat, Nunito, Arial, sans-serif', 
            fontSize: '1rem', 
            fontWeight: 400,
            color: '#6B7280',
            textAlign: 'center',
            marginTop: '8px'
          }}>
            Hesabın yok mu? <span style={{
              color: '#3B82F6',
              cursor: 'pointer',
              fontWeight: 600,
              textDecoration: 'underline',
              textDecorationColor: '#3B82F6'
            }} onClick={() => setShowRegister(true)}>Kayıt Ol</span>
          </div>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Adınız"
            value={name}
            onChange={e => setName(e.target.value)}
            autoComplete="off"
          />
          <input
            type="email"
            placeholder="E-posta"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="off"
          />
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <input
            type="password"
            placeholder="Şifreyi Onayla"
            value={password2}
            onChange={e => setPassword2(e.target.value)}
            autoComplete="new-password"
          />
          <button className="login-btn" onClick={handleRegister}>🚀 Kayıt Ol</button>
          <div className="form-link" style={{ 
            fontFamily: 'Montserrat, Nunito, Arial, sans-serif', 
            fontSize: '1rem', 
            fontWeight: 400,
            color: '#6B7280',
            textAlign: 'center',
            marginTop: '8px'
          }}>
            Zaten hesabın var mı? <span style={{
              color: '#3B82F6',
              cursor: 'pointer',
              fontWeight: 600,
              textDecoration: 'underline',
              textDecorationColor: '#3B82F6'
            }} onClick={() => setShowRegister(false)}>Giriş Yap</span>
          </div>
        </>
      )}
      {/* Profil ekranında bu butonlar gösterilecek, giriş/kayıt ekranında değil */}
      {/* <button className="button-primary" style={{ marginTop: 12 }} onClick={() => window.dailyChallenge()}>Günlük Görev</button>
      <button className="button-primary" style={{ marginTop: 12 }} onClick={() => window.leaderboard()}>Liderlik Tablosu</button> */}
    </div>
  );
};

export default Menu; 