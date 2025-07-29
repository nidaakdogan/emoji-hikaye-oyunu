import React, { useState, useEffect } from 'react';
import { saveUserScore } from '../utils/scoreManager.js';

const DIFFICULTY_SETTINGS = {
  easy: { timer: 60, tries: 5, hints: 3 },
  medium: { timer: 40, tries: 3, hints: 2 },
  hard: { timer: 25, tries: 2, hints: 1 }
};

const stories = {
  easy: [
    { emojis: '👴🐱📚', answer: 'Yaşlı adam kedisiyle birlikte kitap okudu.', hint: 'Kedi, yaşlı adam, kitap.' },
    { emojis: '🚀🧑🌕', answer: 'İnsan roketle aya gitti.', hint: 'Roket, insan, ay.' },
    { emojis: '🐶🎩🎪', answer: 'Köpek sirkte şapka takarak gösteri yaptı.', hint: 'Köpek, şapka, sirk.' },
    { emojis: '👨‍🍳🍕🔥', answer: 'Aşçı fırında pizza pişirdi.', hint: 'Aşçı, pizza, fırın.' },
    { emojis: '🧙‍♂️✨🐸👑', answer: 'Büyücü kurbağayı sihirle prense dönüştürdü.', hint: 'Büyücü, sihir, kurbağa, prens.' },cd emoji-hikaye-oyunu

    { emojis: '👦❄️🎿', answer: 'Çocuk karda kayak yaptı.', hint: 'Çocuk, kar, kayak.' },
    { emojis: '🦊🍇🌲', answer: 'Tilki ormanda üzüm buldu.', hint: 'Tilki, orman, üzüm.' },
    { emojis: '👨‍🎨🎨🖼️', answer: 'Ressam güzel bir tablo yaptı.', hint: 'Ressam, tablo, boya.' }
  ],
  medium: [
    { emojis: '🍕🍅🧀', answer: 'Pizza domates ve peynir ile yapılır.', hint: 'Pizza, domates, peynir.' },
    { emojis: '👨‍💼🚗⛽️🏁', answer: 'Adam arabasına benzin aldı ve yarışa katıldı.', hint: 'Adam, araba, benzin, yarış.' },
    { emojis: '🌧️🌞🌈', answer: 'Yağmur yağdı, güneş açtı, gökkuşağı oluştu.', hint: 'Yağmur, güneş, gökkuşağı.' },
    { emojis: '👨‍🏫📚👦👧', answer: 'Öğretmen öğrencilere yeni konular anlattı.', hint: 'Öğretmen, ders, öğrenciler.' },
    { emojis: '👩‍🌾🍓🍒🍇', answer: 'Kadın çiftçi meyve topladı.', hint: 'Çiftçi, meyve, toplamak.' },
    { emojis: '👧🏊‍♀️🏅🎉', answer: 'Küçük kız yüzme yarışında ödül kazandı ve çok sevindi.', hint: 'Kız, yüzme, ödül, sevinç.' },
    { emojis: '👦🧩🎲🧠', answer: 'Çocuk zeka oyunları oynayarak beynini geliştirdi.', hint: 'Çocuk, zeka, oyun, beyin.' },
    { emojis: '👩‍🎨🎨🖌️🖼️', answer: 'Kadın ressam tablo yaptı.', hint: 'Ressam, tablo, boya, huzur.' }
  ],
  hard: [
    { emojis: '🦸‍♂️🚗💥🏥👨‍⚕️', answer: 'Süper kahraman araba kazasını önledi ve hastaneye götürdü.', hint: 'Kahraman, kaza, hastane.' },
    { emojis: '👸🐉🏰⚔️🏆', answer: 'Prenses ejderhayı yendi, kaleyi kurtardı ve ödül kazandı.', hint: 'Prenses, ejderha, kale, ödül.' },
    { emojis: '👨‍🏫📚👦👧🎓', answer: 'Öğretmen öğrencilere yeni konular anlattı ve mezuniyet yaptı.', hint: 'Öğretmen, ders, öğrenciler, mezuniyet.' },
    { emojis: '👩‍🌾🍓🍒🍇🌱', answer: 'Kadın çiftçi meyve topladı ve yeni bitkiler ekti.', hint: 'Çiftçi, meyve, toplamak, bitki.' },
    { emojis: '👧🏊‍♀️🏅🎉🌟', answer: 'Küçük kız yüzme yarışında ödül kazandı, sevindi ve parladı.', hint: 'Kız, yüzme, ödül, sevinç, parıltı.' },
    { emojis: '👦🧩🎲🧠🤔', answer: 'Çocuk zeka oyunları oynayarak beynini geliştirdi ve düşündü.', hint: 'Çocuk, zeka, oyun, beyin, düşünme.' },
    { emojis: '👨‍🔬🧪🔬🏆🎊', answer: 'Bilim insanı deney yaptı, ödül kazandı ve kutladı.', hint: 'Bilim, deney, ödül, kutlama.' },
    { emojis: '👧🚴‍♀️🌳😄', answer: 'Küçük kız bisikletle parka gitti ve mutlu oldu.', hint: 'Kız, bisiklet, park, gülme, hedef.' }
  ]
};

function Game({ currentUserEmail, currentUserName, onFinish, difficulty = 'easy' }) {
  const [story, setStory] = useState(null);
  const [guess, setGuess] = useState('');
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(() => DIFFICULTY_SETTINGS[difficulty].timer);
  const [tries, setTries] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [correctAnswer, setCorrectAnswer] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  
  // 3 soruluk sistem için yeni state'ler
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [totalQuestions] = useState(3);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [questionScores, setQuestionScores] = useState([]);
  const [questionResults, setQuestionResults] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('correct');
  const [usedStories, setUsedStories] = useState([]);
  
  const settings = DIFFICULTY_SETTINGS[difficulty];
  const MAX_HINTS = settings.hints;

  // Story seçimi ve oyun başlatma
  useEffect(() => {
    const currentStories = stories[difficulty];
    
    // Kullanılmamış hikayeleri filtrele
    const availableStories = currentStories.filter(story => 
      !usedStories.some(used => used.emojis === story.emojis)
    );
    
    // Eğer tüm hikayeler kullanıldıysa, listeyi sıfırla
    if (availableStories.length === 0) {
      setUsedStories([]);
      const randomIndex = Math.floor(Math.random() * currentStories.length);
      const selectedStory = currentStories[randomIndex];
      setStory(selectedStory);
      setUsedStories([selectedStory]);
    } else {
      // Kullanılmamış hikayelerden rastgele seç
      const randomIndex = Math.floor(Math.random() * availableStories.length);
      const selectedStory = availableStories[randomIndex];
      setStory(selectedStory);
      setUsedStories(prev => [...prev, selectedStory]);
    }
    
    // Oyun durumunu sıfırla (sadece ilk başlangıçta)
    if (gameKey === 0) {
      setTimer(settings.timer);
      setTries(0);
      setFinished(false);
      setShowHint(false);
      setHintLevel(0);
      setScore(0);
      setGuess('');
      setCorrectAnswer(false);
      setCorrectAnswers(0);
      setQuestionScores([]);
      setQuestionResults([]);
      setUsedStories([]);
    }
  }, [difficulty, settings.timer, gameKey]);

  // Timer
  useEffect(() => {
    if (timer > 0 && !finished) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && !finished) {
      handleGameOver();
    }
  }, [timer, finished]);

  const checkGuess = (userGuess, story) => {
    const cleanGuess = userGuess.toLowerCase().trim();
    const cleanAnswer = story.answer.toLowerCase();
    
    if (cleanGuess === cleanAnswer) return true;
    
    const guessWords = cleanGuess.split(' ');
    const answerWords = cleanAnswer.split(' ');
    
    const matchingWords = guessWords.filter(word => 
      answerWords.some(answerWord => answerWord.includes(word) || word.includes(answerWord))
    );
    
    return matchingWords.length >= Math.max(guessWords.length * 0.7, 2);
  };

  const handleGuess = () => {
    if (!guess.trim() || !story) return;

    const isCorrect = checkGuess(guess, story);
    
    if (isCorrect) {
      // Hızlı Başla Puanlama Sistemi
      const correctAnswerPoints = 10; // Doğru cevap: +10 puan
      
      // Süreye göre bonus
      let timeBonus = 0;
      if (timer >= 20) timeBonus = 2; // 20+ saniye kaldıysa +2
      else if (timer >= 10) timeBonus = 5; // 10+ saniye kaldıysa +5
      
      // Kalan hak bonusu
      const remainingTriesBonus = (settings.tries - tries) * 2; // Her kalan hak +2
      
      const questionScore = correctAnswerPoints + timeBonus + remainingTriesBonus;
      
      console.log('Puan hesaplama:', {
        correctAnswerPoints,
        timeBonus,
        remainingTriesBonus,
        questionScore,
        timer,
        tries,
        settings: settings.tries
      });
      
      // Doğru cevap sayısını artır
      setCorrectAnswers(prev => prev + 1);
      
      // Bu sorunun skorunu ve sonucunu kaydet
      setQuestionScores(prev => [...prev, questionScore]);
      setQuestionResults(prev => [...prev, 'correct']);
      
      // Toplam skoru güncelle
      setScore(prev => prev + questionScore);
      
      // Doğru popup'ını göster
              setPopupMessage('Doğru! 🎉');
      setPopupType('correct');
      setShowPopup(true);
      
      // 1.5 saniye sonra popup'ı kapat ve sonraki soruya geç
      setTimeout(() => {
        setShowPopup(false);
        
        if (currentQuestion < totalQuestions) {
          // Sonraki soruya geç
          setCurrentQuestion(prev => prev + 1);
          setGameKey(prev => prev + 1); // Yeni story seçimi için
          setTimer(settings.timer); // Timer'ı sıfırla
          setTries(0); // Deneme sayısını sıfırla
          setShowHint(false);
          setHintLevel(0);
          setGuess('');
        } else {
          // Tüm sorular bitti, oyunu bitir
          setFinished(true);
        }
      }, 1500);
      
    } else {
      setTries(prev => prev + 1);
      
      // Yanlış cevap: -3 puan
      setScore(prev => {
        const newScore = Math.max(0, prev - 3);
        console.log('Yanlış cevap puan düşürme:', { prev, newScore });
        return newScore;
      });
      
      // Her yanlış cevap için geri bildirim
      const remainingTries = DIFFICULTY_SETTINGS[difficulty].tries - (tries + 1);
      
      if (remainingTries > 0) {
        // Hâlâ hakkı var
        setPopupMessage(`Yanlış! Kalan: ${remainingTries}`);
        setPopupType('warning');
        setShowPopup(true);
        
        // 1 saniye sonra popup'ı kapat
        setTimeout(() => {
          setShowPopup(false);
        }, 1000);
      } else {
        // Hak bitti, bu soruyu kaybettin
        setQuestionScores(prev => [...prev, 0]); // 0 puan
        setQuestionResults(prev => [...prev, 'wrong']);
        
        // Oyun bitti uyarısı
        setPopupMessage('Hak bitti! 🔄');
        setPopupType('gameOver');
        setShowPopup(true);
        
        // 1.5 saniye sonra popup'ı kapat ve sonraki soruya geç
        setTimeout(() => {
          setShowPopup(false);
          
          if (currentQuestion < totalQuestions) {
            // Sonraki soruya geç
            setCurrentQuestion(prev => prev + 1);
            setGameKey(prev => prev + 1);
            setTimer(settings.timer);
            setTries(0);
            setShowHint(false);
            setHintLevel(0);
            setGuess('');
          } else {
            // Tüm sorular bitti
            setFinished(true);
          }
        }, 1500);
      }
    }
    setGuess('');
  };

  const handleGameOver = () => {
    setFinished(true);
    setTimer(0);
    
    // Oyun bittiğinde skor kaydet
    console.log('handleGameOver çağrıldı:', { currentUserEmail, currentUserName, score });
    if (currentUserEmail && score > 0) {
      const saved = saveUserScore(currentUserEmail, currentUserName || 'Kullanıcı', score);
      console.log('GameOver skor kaydedildi:', saved);
      
      // Liderlik tablosunu güncelle
      if (saved) {
        window.dispatchEvent(new CustomEvent('leaderboardUpdate', {
          detail: { email: currentUserEmail, name: currentUserName, score }
        }));
      }
    }
  };

  const handleRestart = () => {
    setGameKey(prev => prev + 1);
    setGuess('');
    setScore(0);
    setTimer(settings.timer);
    setTries(0);
    setFinished(false);
    setShowHint(false);
    setHintLevel(0);
    setCorrectAnswer(false);
    
    // 3 soruluk sistem için state'leri sıfırla
    setCurrentQuestion(1);
    setCorrectAnswers(0);
    setQuestionScores([]);
    setQuestionResults([]);
    setShowPopup(false);
    setPopupMessage('');
    setPopupType('correct');
    setUsedStories([]);
  };

  const handleFinish = () => {
    console.log('handleFinish çağrıldı:', { currentUserEmail, currentUserName, score });
    if (currentUserEmail && score > 0) {
      const saved = saveUserScore(currentUserEmail, currentUserName || 'Kullanıcı', score);
      console.log('Skor kaydedildi:', saved);
      
      // Liderlik tablosunu güncelle
      if (saved) {
        window.dispatchEvent(new CustomEvent('leaderboardUpdate', {
          detail: { email: currentUserEmail, name: currentUserName, score }
        }));
      }
    }
    onFinish(score);
  };

  const getSmartHint = (level) => {
    if (!story) return '';
    
    const hints = story.hint.split(', ');
    if (level <= hints.length) {
      return hints[level - 1];
    }
    return hints[hints.length - 1];
  };

  const getHintText = () => {
    if (hintLevel === 0) return '';
    const hintContent = getSmartHint(hintLevel);
    if (difficulty === 'hard') {
      return `İpucu: ${hintContent}`;
    } else {
      return `İpucu ${hintLevel}: ${hintContent}`;
    }
  };

  const getHintButtonText = () => {
    return `İpucu (${hintLevel}/${settings.hints})`;
  };

  const handleHint = () => {
    if (hintLevel < MAX_HINTS) {
      setHintLevel(prev => prev + 1);
      setShowHint(true);
    }
  };

  if (!story) {
    return <div>Yükleniyor...</div>;
  }

  if (finished) {
    const successRate = Math.round((correctAnswers / totalQuestions) * 100);
    // 3 soruluk yıldız sistemi
    let stars = 0;
    if (correctAnswers === 3) {
      stars = 5; // 3/3 doğru = 5 yıldız
    } else if (correctAnswers === 2) {
      stars = 3; // 2/3 doğru = 3 yıldız
    } else if (correctAnswers === 1) {
      stars = 1; // 1/3 doğru = 1 yıldız
    } else {
      stars = 0; // 0/3 doğru = 0 yıldız
    }
    
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #f0f4ff, #ffffff)',
        padding: '20px',
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{
          background: '#fff',
          borderRadius: 20,
          padding: '32px',
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08), 0 12px 32px rgba(0, 0, 0, 0.12)',
          maxWidth: 500,
          width: '100%',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          position: 'relative'
        }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 700,
              fontFamily: 'Poppins, sans-serif',
              background: 'linear-gradient(to right, #ff6a6a, #ffb347)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: '0 0 8px 0',
              textAlign: 'center'
            }}>
              Oyun Bitti!
            </h1>

            <p style={{ 
              fontSize: '1rem', 
              color: '#6b7280', 
              margin: '0 0 20px 0',
              fontWeight: 500
            }}>
              {correctAnswers === 3 ? 'Mükemmel! Tüm soruları doğru bildin! 🎉' :
         correctAnswers === 2 ? 'Çok iyi! Neredeyse tamamladın! 💪' :
         correctAnswers === 1 ? 'İyi deneme! Biraz daha çalış! 💪' :
         'Tekrar denemek ister misin? 💪'}
            </p>
            
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: 16,
              padding: '24px',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
              marginBottom: 24,
              border: '1px solid rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ marginBottom: 20, textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '3rem', 
                  marginBottom: 8,
                  animation: 'trophyGlow 2s ease-in-out infinite alternate'
                }}>🏆</div>
                <div style={{ 
                  fontSize: '2.8rem', 
                  fontWeight: 900, 
                  background: 'linear-gradient(45deg, #ff6a6a, #ffb347, #ff6a6a)',
                  backgroundSize: '200% 200%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'gradientShift 3s ease infinite',
                  marginBottom: 8
                }}>
                  {score}
                </div>
                <div style={{ 
                  fontSize: '1.1rem', 
                  color: '#6b7280', 
                  fontWeight: 700,
                  marginBottom: 16
                }}>
                  TOPLAM SKOR
                </div>
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: 16,
                padding: '12px 16px',
                background: correctAnswers > 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                borderRadius: 8,
                border: `1px solid ${correctAnswers > 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
              }}>
                <span style={{ fontSize: '1.1rem' }}>
                  {correctAnswers > 0 ? '✅' : '❌'}
                </span>
                <span style={{ fontWeight: 600, color: correctAnswers > 0 ? '#059669' : '#dc2626' }}>
                  Soru 1
                </span>
                <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                  {correctAnswers > 0 ? 'Doğru' : 'Yanlış'}
                </span>
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: 16,
                padding: '12px 16px',
                background: correctAnswers > 1 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                borderRadius: 8,
                border: `1px solid ${correctAnswers > 1 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
              }}>
                <span style={{ fontSize: '1.1rem' }}>
                  {correctAnswers > 1 ? '✅' : '❌'}
                </span>
                <span style={{ fontWeight: 600, color: correctAnswers > 1 ? '#059669' : '#dc2626' }}>
                  Soru 2
                </span>
                <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                  {correctAnswers > 1 ? 'Doğru' : 'Yanlış'}
                </span>
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: 16,
                padding: '12px 16px',
                background: correctAnswers > 2 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                borderRadius: 8,
                border: `1px solid ${correctAnswers > 2 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
              }}>
                <span style={{ fontSize: '1.1rem' }}>
                  {correctAnswers > 2 ? '✅' : '❌'}
                </span>
                <span style={{ fontWeight: 600, color: correctAnswers > 2 ? '#059669' : '#dc2626' }}>
                  Soru 3
                </span>
                <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                  {correctAnswers > 2 ? 'Doğru' : 'Yanlış'}
                </span>
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: 12,
                border: '1px solid rgba(255, 255, 255, 0.3)',
                marginTop: 16
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1f2937' }}>{correctAnswers}/{totalQuestions}</div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Doğru</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1f2937' }}>{successRate}%</div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Başarı</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: '1.2rem', 
                    fontWeight: 700,
                    color: correctAnswers === 3 ? '#10b981' : '#f59e0b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: correctAnswers === 3 ? '#d1fae5' : '#fef3c7',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    margin: '0 auto 4px auto'
                  }}>
                    ⭐
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{stars} Yıldız</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button 
                onClick={handleRestart}
                style={{
                  padding: '12px 24px',
                  fontSize: '1rem',
                  borderRadius: 12,
                  background: 'linear-gradient(to right, #ff6a6a, #ffb347)',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 4px 12px rgba(255, 106, 106, 0.3)',
                  transition: 'all 0.2s ease'
                }}
              >
                <span role="img" aria-label="restart">🔄</span>
                Tekrar Oyna
              </button>
              
              <button 
                onClick={handleFinish}
                style={{
                  padding: '12px 24px',
                  fontSize: '1rem',
                  borderRadius: 12,
                  background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                  transition: 'all 0.2s ease'
                }}
              >
                <span role="img" aria-label="home">🏠</span>
                Ana Menü
              </button>
            </div>
          </div>
        </div>
        
        {/* Popup sistemi */}
        {showPopup && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: popupType === 'correct' ? '#22c55e' : '#f59e0b',
            color: '#fff',
            padding: '8px 16px',
            borderRadius: 8,
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
            zIndex: 1000,
            fontSize: '0.9rem',
            fontWeight: 600,
            textAlign: 'center',
            whiteSpace: 'pre-line',
            border: popupType === 'correct' ? '1px solid #16a34a' : '1px solid #d97706',
            maxWidth: '280px',
            opacity: 0,
            animation: 'popupSlideIn 0.3s ease-out forwards'
          }}>
            {popupMessage}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #f0f4ff, #ffffff)',
      padding: '20px',
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center'
    }}>
      <div style={{ 
        background: '#fff',
        borderRadius: 20,
        padding: '36px',
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08), 0 12px 32px rgba(0, 0, 0, 0.12)',
        maxWidth: 600,
        width: '100%',
        position: 'relative',
        border: '1px solid rgba(255, 255, 255, 0.8)'
      }}>
        {/* Ana Menü Butonu */}
        <div style={{
          position: 'absolute',
          top: 20,
          right: 20,
          zIndex: 10
        }}>
          <button 
            onClick={() => onFinish(score)}
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

        {/* Başlık */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 700,
            fontFamily: 'Poppins, sans-serif',
            background: 'linear-gradient(to right, #ff6a6a, #ffb347)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 20px 0',
            textAlign: 'center'
          }}>
            Hızlı Başla
          </h1>
        </div>

        {/* Üstte zorluk kutusu - Geliştirilmiş */}
        <div className="zorluk-kutusu" style={{
          marginBottom: 28,
          padding: '12px 16px',
          background: 'rgba(248, 250, 252, 0.8)',
          borderRadius: 12,
          border: '1px solid rgba(0, 0, 0, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          fontSize: '0.95rem',
          fontWeight: 500
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="ikon" style={{color: difficulty === 'easy' ? '#22c55e' : difficulty === 'medium' ? '#eab308' : '#ef4444', fontSize: '0.8rem'}}>●</span>
            <span>Zorluk:</span>
            <span style={{fontWeight: 600, color: '#374151'}}>{difficulty === 'easy' ? 'Kolay' : difficulty === 'medium' ? 'Orta' : 'Zor'}</span>
          </div>
          
          <div style={{ 
            width: '1px', 
            height: '20px', 
            background: 'rgba(0, 0, 0, 0.1)',
            margin: '0 8px'
          }}></div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="ikon" style={{color:'#fbbf24', fontSize: '1rem'}}>💡</span>
            <span>İpucu:</span>
            <span style={{fontWeight: 600, color: '#374151'}}>{hintLevel}/{settings.hints}</span>
          </div>
          
          <div style={{ 
            width: '1px', 
            height: '20px', 
            background: 'rgba(0, 0, 0, 0.1)',
            margin: '0 8px'
          }}></div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="ikon" style={{color:'#0277bd', fontSize: '1rem'}}>📝</span>
            <span style={{fontWeight: 600, color: '#374151'}}>Soru: {currentQuestion}/{totalQuestions}</span>
          </div>
        </div>

        {/* Emoji ve Soru */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            background: 'white',
            borderRadius: 20,
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            textAlign: 'center',
            marginBottom: 20
          }}>
            <span style={{ fontSize: '3.7rem', letterSpacing: '8px', display: 'block', userSelect: 'none' }}>
              {story.emojis}
            </span>
          </div>
          <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', textAlign: 'center', margin: 0, lineHeight: 1.4 }}>
            Bu emojiler hangi hikayeyi anlatıyor?
          </p>
        </div>

        {/* Input ve butonlar alt satırda */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
            placeholder="Hikayeyi tahmin et..."
            style={{ width: '100%', padding: '14px 18px', fontSize: '1.08rem', borderRadius: 14, border: '2px solid #e2e8f0', outline: 'none', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.2s' }}
            onFocus={e => { e.target.style.borderColor = 'var(--primary)'; }}
            onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }}
          />
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button 
              className="button-gradient" 
              onClick={handleGuess}
              style={{ flex: 1, maxWidth: 200, padding: '12px 20px', fontSize: '1.08rem', borderRadius: 12, background: 'linear-gradient(to right, #ff6a6a, #ffb347)', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              <span role="img" aria-label="search">🔍</span> Tahmin Et
            </button>
            <button
              className="button-gradient" 
              onClick={handleHint} 
              disabled={hintLevel >= MAX_HINTS} 
              style={{ 
                padding: '12px 20px', 
                fontSize: '1.08rem', 
                borderRadius: 12, 
                background: '#f8fafc', 
                color: hintLevel < MAX_HINTS ? '#374151' : '#9ca3af', 
                border: '2px solid #e2e8f0', 
                fontWeight: 600, 
                cursor: hintLevel < MAX_HINTS ? 'pointer' : 'not-allowed', 
                opacity: hintLevel < MAX_HINTS ? 1 : 0.7, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: 8,
                minWidth: 120,
                maxWidth: 150,
                transition: 'all 0.2s ease'
              }}
            >
              <span role="img" aria-label="bulb" style={{ color: hintLevel < MAX_HINTS ? '#fbbf24' : '#9ca3af', fontSize: '1.1rem' }}>💡</span> İpucu ({hintLevel}/{settings.hints})
            </button>
          </div>
        </div>

        {showHint && hintLevel > 0 && (
          <div style={{ 
            margin: '18px auto 0 auto', 
            background: '#4CAF50', 
            color: '#fff', 
            fontWeight: 600, 
            fontSize: '1rem', 
            borderRadius: 12, 
            boxShadow: '0 3px 12px rgba(76, 175, 80, 0.3)', 
            padding: '12px 16px', 
            width: '100%', 
            maxWidth: 340, 
            textAlign: 'center', 
            border: '1px solid #388E3C',
            backdropFilter: 'blur(10px)'
          }}>
            {getHintText()}
          </div>
        )}

        <div style={{ 
          marginTop: 24, 
          padding: '14px 20px', 
          background: 'rgba(248, 250, 252, 0.9)', 
          borderRadius: 16, 
          border: '1px solid rgba(0, 0, 0, 0.08)', 
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          fontWeight: 600, 
          fontSize: '1rem', 
          color: '#374151', 
          gap: 16,
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span role="img" aria-label="medal" style={{ fontSize: '1.1rem' }}>🏅</span> 
            <span>Skor:</span> <b>{score}</b>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span role="img" aria-label="timer" style={{ fontSize: '1.1rem' }}>⏱️</span> 
            <span>Süre</span> <span style={{color:'#FF9800', fontWeight: 700}}>{timer} sn</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span role="img" aria-label="repeat" style={{ fontSize: '1.1rem' }}>🔄</span> 
            <span>Tur:</span> <b>{currentQuestion}/{totalQuestions}</b>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span role="img" aria-label="heart" style={{ fontSize: '1.1rem' }}>💪</span> 
            <span>Hak</span> <b>{Math.max(0, DIFFICULTY_SETTINGS[difficulty].tries - tries)}</b>
          </div>
        </div>
      </div>
      
      {/* Popup sistemi */}
      {showPopup && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: popupType === 'correct' ? '#22c55e' : '#f59e0b',
          color: '#fff',
          padding: '8px 16px',
          borderRadius: 8,
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
          zIndex: 1000,
          fontSize: '0.9rem',
          fontWeight: 600,
          textAlign: 'center',
          whiteSpace: 'pre-line',
          border: popupType === 'correct' ? '1px solid #16a34a' : '1px solid #d97706',
          maxWidth: '280px',
          opacity: 0,
          animation: 'popupSlideIn 0.3s ease-out forwards'
        }}>
          {popupMessage}
        </div>
      )}
    </div>
  );
}

export default Game; 