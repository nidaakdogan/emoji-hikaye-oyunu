// Merkezi skor yönetimi
const LEADERBOARD_KEY = 'emoji_game_leaderboard';
const DAILY_SCORES_KEY = 'emoji_game_daily_scores';

// Demo kullanıcılar (Nida'nın puanına göre ayarlandı)
export const DEMO_USERS = [
  { name: 'Elif Yılmaz', score: 95, email: 'demo1@demo.com' },
  { name: 'Ahmet Kaya', score: 87, email: 'demo2@demo.com' },
  { name: 'Zeynep Demir', score: 82, email: 'demo3@demo.com' },
  { name: 'Mert Can', score: 78, email: 'demo4@demo.com' },
  { name: 'Selin Özkan', score: 73, email: 'demo5@demo.com' }
];

// Tüm kullanıcıları al (gerçek + demo)
export function getAllUsers() {
  try {
    const stored = localStorage.getItem(LEADERBOARD_KEY);
    const realUsers = stored ? JSON.parse(stored) : [];
    console.log('LocalStorage\'dan alınan kullanıcılar:', realUsers);
    
    // Gerçek kullanıcıları al
    const allUsers = [...realUsers];
    
    // Demo kullanıcıları ekle
    allUsers.push(...DEMO_USERS);
    console.log('Tüm kullanıcılar (demo dahil):', allUsers);
    
    // Skora göre sırala
    allUsers.sort((a, b) => b.score - a.score);
    
    return allUsers;
  } catch (error) {
    console.error('Skor yükleme hatası:', error);
    return DEMO_USERS;
  }
}

// Kullanıcı skorunu kaydet
export function saveUserScore(email, name, score) {
  try {
    console.log('saveUserScore çağrıldı:', { email, name, score });
    const stored = localStorage.getItem(LEADERBOARD_KEY);
    const users = stored ? JSON.parse(stored) : [];
    console.log('Mevcut kullanıcılar:', users);
    
    // Kullanıcının en iyi skorunu al
    const bestScoreKey = `bestScore_${email}`;
    const currentBestScore = localStorage.getItem(bestScoreKey);
    const bestScore = currentBestScore ? parseInt(currentBestScore) : 0;
    
    // Liderlik tablosu için en iyi skoru kullan
    const scoreForLeaderboard = Math.max(score, bestScore);
    
    // Mevcut kullanıcıyı bul ve güncelle
    const existingIndex = users.findIndex(u => u.email === email);
    console.log('Mevcut kullanıcı indeksi:', existingIndex);
    
    if (existingIndex >= 0) {
      // En iyi skoru güncelle (sadece daha yüksekse)
      if (scoreForLeaderboard > users[existingIndex].score) {
        users[existingIndex].score = scoreForLeaderboard;
        users[existingIndex].name = name;
        users[existingIndex].lastUpdated = new Date().toISOString();
        console.log('Kullanıcı skoru güncellendi:', scoreForLeaderboard);
      } else {
        console.log('Skor daha düşük, güncellenmedi');
      }
    } else {
      // Yeni kullanıcı ekle
      users.push({
        email,
        name,
        score: scoreForLeaderboard,
        lastUpdated: new Date().toISOString()
      });
      console.log('Yeni kullanıcı eklendi:', scoreForLeaderboard);
    }
    
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(users));
    console.log('Skor başarıyla kaydedildi');
    
    // Custom event dispatch (aynı sekme için)
    window.dispatchEvent(new CustomEvent('leaderboardUpdate', {
      detail: { email, name, score: scoreForLeaderboard }
    }));
    
    return true;
  } catch (error) {
    console.error('Skor kaydetme hatası:', error);
    return false;
  }
}

// Günlük skorları kaydet
export function saveDailyScore(email, name, score) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const key = `${DAILY_SCORES_KEY}_${today}`;
    
    const stored = localStorage.getItem(key);
    const dailyScores = stored ? JSON.parse(stored) : [];
    
    // Mevcut kullanıcının günlük skorunu güncelle
    const existingIndex = dailyScores.findIndex(u => u.email === email);
    
    if (existingIndex >= 0) {
      if (score > dailyScores[existingIndex].score) {
        dailyScores[existingIndex].score = score;
        dailyScores[existingIndex].name = name;
      }
    } else {
      dailyScores.push({ email, name, score });
    }
    
    localStorage.setItem(key, JSON.stringify(dailyScores));
    return true;
  } catch (error) {
    console.error('Günlük skor kaydetme hatası:', error);
    return false;
  }
}

// Günlük skorları al
export function getDailyScores() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const key = `${DAILY_SCORES_KEY}_${today}`;
    
    const stored = localStorage.getItem(key);
    const dailyScores = stored ? JSON.parse(stored) : [];
    
    // Demo kullanıcıları da ekle
    const allDailyScores = [...dailyScores, ...DEMO_USERS];
    
    // Skora göre sırala
    allDailyScores.sort((a, b) => b.score - a.score);
    
    return allDailyScores.slice(0, 5); // Top 5
  } catch (error) {
    console.error('Günlük skor yükleme hatası:', error);
    return DEMO_USERS.slice(0, 5);
  }
}

// Kullanıcının en iyi skorunu al
export function getUserBestScore(email) {
  try {
    const stored = localStorage.getItem(LEADERBOARD_KEY);
    const users = stored ? JSON.parse(stored) : [];
    
    const user = users.find(u => u.email === email);
    return user ? user.score : 0;
  } catch (error) {
    console.error('En iyi skor yükleme hatası:', error);
    return 0;
  }
}

// Kullanıcının en iyi skorunu liderlik tablosuna senkronize et
export function syncUserBestScore(email, name) {
  try {
    const bestScoreKey = `bestScore_${email}`;
    const bestScore = localStorage.getItem(bestScoreKey);
    
    if (bestScore) {
      const score = parseInt(bestScore);
      console.log('En iyi skor senkronize ediliyor:', { email, name, score });
      
      // Liderlik tablosunu güncelle
      const stored = localStorage.getItem(LEADERBOARD_KEY);
      const users = stored ? JSON.parse(stored) : [];
      
      const existingIndex = users.findIndex(u => u.email === email);
      
      if (existingIndex >= 0) {
        // Mevcut kullanıcının skorunu güncelle
        if (score > users[existingIndex].score) {
          users[existingIndex].score = score;
          users[existingIndex].name = name;
          users[existingIndex].lastUpdated = new Date().toISOString();
          console.log('Kullanıcı skoru senkronize edildi:', score);
        }
      } else {
        // Yeni kullanıcı ekle
        users.push({
          email,
          name,
          score,
          lastUpdated: new Date().toISOString()
        });
        console.log('Yeni kullanıcı senkronize edildi:', score);
      }
      
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(users));
      
      // Custom event dispatch
      window.dispatchEvent(new CustomEvent('leaderboardUpdate', {
        detail: { email, name, score }
      }));
      
      return true;
    }
    return false;
  } catch (error) {
    console.error('Skor senkronizasyon hatası:', error);
    return false;
  }
}

// Kullanıcının günlük en iyi skorunu al
export function getUserDailyBestScore(email) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const key = `${DAILY_SCORES_KEY}_${today}`;
    
    const stored = localStorage.getItem(key);
    const dailyScores = stored ? JSON.parse(stored) : [];
    
    const user = dailyScores.find(u => u.email === email);
    return user ? user.score : 0;
  } catch (error) {
    console.error('Günlük en iyi skor yükleme hatası:', error);
    return 0;
  }
}

// Belirli bir emaili sil
export function deleteUserByEmail(emailToDelete) {
  try {
    // Genel liderlik tablosundan sil
    const stored = localStorage.getItem(LEADERBOARD_KEY);
    const users = stored ? JSON.parse(stored) : [];
    const filteredUsers = users.filter(u => u.email !== emailToDelete);
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(filteredUsers));
    
    // Günlük skorlardan da sil
    const today = new Date().toISOString().split('T')[0];
    const dailyKey = `${DAILY_SCORES_KEY}_${today}`;
    const dailyStored = localStorage.getItem(dailyKey);
    const dailyScores = dailyStored ? JSON.parse(dailyStored) : [];
    const filteredDailyScores = dailyScores.filter(u => u.email !== emailToDelete);
    localStorage.setItem(dailyKey, JSON.stringify(filteredDailyScores));
    
    console.log(`${emailToDelete} emaili başarıyla silindi.`);
    return true;
  } catch (error) {
    console.error('Email silme hatası:', error);
    return false;
  }
} 