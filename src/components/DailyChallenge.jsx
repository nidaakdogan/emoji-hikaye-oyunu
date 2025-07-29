import React, { useState, useEffect } from 'react';
import { GunlukGorevIconSmall } from './IconComponents';
import { getUserDailyBestScore, saveDailyScore } from '../utils/scoreManager.js';

const DIFFICULTY_SETTINGS = {
  easy: { timer: 50, tries: 5, hints: 3, points: 100, emojiCount: 3, timePenalty: 5 },
  medium: { timer: 40, tries: 3, hints: 2, points: 150, emojiCount: 4, timePenalty: 10 },
  hard: { timer: 30, tries: 2, hints: 1, points: 200, emojiCount: 5, timePenalty: 15 }
};

const dailyStories = {
  easy: [
    { emojis: '👴🐱📚', answer: 'Yaşlı adam kedisiyle birlikte kitap okudu.', hint: 'Kedi, yaşlı adam, kitap.' },
    { emojis: '🚀🧑🌕', answer: 'İnsan roketle aya gitti.', hint: 'Roket, insan, ay.' },
    { emojis: '🐶🎩🎪', answer: 'Köpek sirkte şapka takarak gösteri yaptı.', hint: 'Köpek, şapka, sirk.' },
    { emojis: '👨‍🍳🍕🔥', answer: 'Aşçı fırında pizza pişirdi.', hint: 'Aşçı, pizza, fırın.' },
    { emojis: '🧙‍♂️✨🐸👑', answer: 'Büyücü kurbağayı sihirle prense dönüştürdü.', hint: 'Büyücü, sihir, kurbağa, prens.' },
    { emojis: '👩‍🎤🎤🎶', answer: 'Şarkıcı sahnede şarkı söyledi.', hint: 'Şarkıcı, sahne, müzik.' },
    { emojis: '🦁👦🌳', answer: 'Çocuk ormanda aslanla karşılaştı.', hint: 'Çocuk, orman, aslan.' },
    { emojis: '👨‍🚒🔥🏠', answer: 'İtfaiyeci evdeki yangını söndürdü.', hint: 'İtfaiyeci, yangın, ev.' },
    { emojis: '🦄🌈👧', answer: 'Küçük kız gökkuşağında unicorn gördü.', hint: 'Kız, gökkuşağı, unicorn.' },
    { emojis: '👨‍🌾🌾🚜', answer: 'Çiftçi traktörle buğday ekti.', hint: 'Çiftçi, buğday, traktör.' },
    { emojis: '👦❄️🎿', answer: 'Çocuk karda kayak yaptı.', hint: 'Çocuk, kar, kayak.' },
    { emojis: '🦊🍇🌲', answer: 'Tilki ormanda üzüm buldu.', hint: 'Tilki, orman, üzüm.' },
    { emojis: '👨‍🎨🎨🖼️', answer: 'Ressam güzel bir tablo yaptı.', hint: 'Ressam, tablo, boya.' },
    { emojis: '👩‍🏫📚📝', answer: 'Öğretmen öğrencilere ders anlattı.', hint: 'Öğretmen, ders, kitap.' }
  ],
  medium: [
    { emojis: '🍕🍅🧀', answer: 'Pizza domates ve peynir ile yapılır.', hint: 'Pizza, domates, peynir.' },
    { emojis: '👨‍💼🚗⛽️🏁', answer: 'Adam arabasına benzin aldı ve yarışa katıldı.', hint: 'Adam, araba, benzin, yarış.' },
    { emojis: '🌧️🌞🌈', answer: 'Yağmur yağdı, güneş açtı, gökkuşağı oluştu.', hint: 'Yağmur, güneş, gökkuşağı.' },
    { emojis: '👸🐉🏰⚔️', answer: 'Prenses ejderhayı yendi ve kaleyi kurtardı.', hint: 'Prenses, ejderha, kale.' },
    { emojis: '👨‍🏫📚👦👧', answer: 'Öğretmen öğrencilere yeni konular anlattı.', hint: 'Öğretmen, ders, öğrenciler.' },
    { emojis: '👩‍🌾🍓🍒🍇', answer: 'Kadın çiftçi meyve topladı.', hint: 'Çiftçi, meyve, toplamak.' },
    { emojis: '👧🏊‍♀️🏅🎉', answer: 'Küçük kız yüzme yarışında ödül kazandı ve çok sevindi.', hint: 'Kız, yüzme, ödül, sevinç.' },
    { emojis: '👦🧩🎲🧠', answer: 'Çocuk zeka oyunları oynayarak beynini geliştirdi.', hint: 'Çocuk, zeka, oyun, beyin.' },
    { emojis: '👩‍🎨🎨🖌️🖼️', answer: 'Kadın ressam tablo yaptı.', hint: 'Ressam, tablo, boya.' },
    { emojis: '👨‍🔧🔩🔧🚗', answer: 'Tamirci arabayı tamir etti.', hint: 'Tamirci, araba, tamir.' },
    { emojis: '👩‍🍳🍳🥘🍽️', answer: 'Aşçı yemek pişirdi ve servis etti.', hint: 'Aşçı, yemek, pişirme, servis.' },
    { emojis: '👨‍⚕️🏥💊👵', answer: 'Doktor hastanede yaşlı kadına ilaç verdi.', hint: 'Doktor, hastane, ilaç, yaşlı.' },
    { emojis: '👨‍🚒🔥🚒🏠', answer: 'İtfaiyeci yangın aracıyla evdeki yangını söndürdü.', hint: 'İtfaiyeci, yangın, araç, ev.' },
    { emojis: '👨‍🌾🌾🌱🚜', answer: 'Çiftçi traktörle buğday ekti.', hint: 'Çiftçi, buğday, ekim, traktör.' }
  ],
  hard: [
    { emojis: '🦸‍♂️🚗💥🏥👨‍⚕️', answer: 'Süper kahraman araba kazasını önledi ve hastaneye götürdü.', hint: 'Kahraman, kaza, hastane.' },
    { emojis: '👸🐉🏰⚔️🏆', answer: 'Prenses ejderhayı yendi, kaleyi kurtardı ve ödül kazandı.', hint: 'Prenses, ejderha, kale, ödül.' },
    { emojis: '👨‍🏫📚👦👧🎓', answer: 'Öğretmen öğrencilere yeni konular anlattı ve mezuniyet yaptı.', hint: 'Öğretmen, ders, öğrenciler, mezuniyet.' },
    { emojis: '👩‍🌾🍓🍒🍇🌱', answer: 'Kadın çiftçi meyve topladı ve yeni bitkiler ekti.', hint: 'Çiftçi, meyve, toplamak, bitki.' },
    { emojis: '👧🏊‍♀️🏅🎉🌟', answer: 'Küçük kız yüzme yarışında ödül kazandı, sevindi ve parladı.', hint: 'Kız, yüzme, ödül, sevinç, parıltı.' },
    { emojis: '👦🧩🎲🧠🤔', answer: 'Çocuk zeka oyunları oynayarak beynini geliştirdi ve düşündü.', hint: 'Çocuk, zeka, oyun, beyin, düşünme.' },
    { emojis: '👩‍🎨🎨🖌️🖼️😌', answer: 'Kadın ressam tablo yaptı ve huzurlu hissetti.', hint: 'Ressam, tablo, boya, huzur.' },
    { emojis: '👨‍🔬🧪🔬🏆🎊', answer: 'Bilim insanı deney yaptı, ödül kazandı ve kutladı.', hint: 'Bilim, deney, ödül, kutlama.' },
    { emojis: '👧🚴‍♀️🌳😄🎯', answer: 'Küçük kız bisikletle parka gitti, güldü ve hedefe ulaştı.', hint: 'Kız, bisiklet, park, gülme, hedef.' },
    { emojis: '👦⚽️🥅🏅🔥', answer: 'Çocuk futbol oynadı, gol atarak ödül kazandı ve heyecanlandı.', hint: 'Çocuk, futbol, gol, ödül, heyecan.' },
    { emojis: '👩‍🚀🚀🌕🏅🌟', answer: 'Kadın astronot aya gitti, ödül aldı ve yıldız gibi parladı.', hint: 'Astronot, ay, ödül, yıldız.' },
    { emojis: '👦🧩🧠🎯🎯', answer: 'Çocuk zeka oyunu oynayarak hedefe ulaştı ve başardı.', hint: 'Çocuk, zeka oyunu, hedef, başarı.' },
    { emojis: '👩‍🌾🍅🥒🥗🌱', answer: 'Kadın çiftçi sebze yetiştirip salata yaptı ve büyüdü.', hint: 'Çiftçi, sebze, salata, büyüme.' }
  ]
};

function getTodayKey() {
  return new Date().toISOString().split('T')[0];
}

function DailyChallenge({ currentUserEmail, currentUserName, onFinish, difficulty = 'easy' }) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [currentStory, setCurrentStory] = useState(null);
  const [guess, setGuess] = useState('');
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(() => DIFFICULTY_SETTINGS[difficulty].timer);
  const [tries, setTries] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0); // Doğru cevap sayısı
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('correct');
  const [usedStories, setUsedStories] = useState([]);
  const settings = DIFFICULTY_SETTINGS[difficulty];
  const MAX_HINTS = settings.hints;

  // Difficulty değiştiğinde currentStory'yi güncelle
  useEffect(() => {
    console.log('Difficulty changed useEffect:', { difficulty, dailyStories: dailyStories[difficulty] });
    
    // Kullanılmamış hikayeleri filtrele
    const availableStories = dailyStories[difficulty].filter(story => 
      !usedStories.some(used => used.emojis === story.emojis)
    );
    
    // Eğer tüm hikayeler kullanıldıysa, listeyi sıfırla
    if (availableStories.length === 0) {
      setUsedStories([]);
      const randomIndex = Math.floor(Math.random() * dailyStories[difficulty].length);
      const newStory = dailyStories[difficulty][randomIndex];
      setCurrentStory(newStory);
      setUsedStories([newStory]);
    } else {
      // Kullanılmamış hikayelerden rastgele seç
      const randomIndex = Math.floor(Math.random() * availableStories.length);
      const newStory = availableStories[randomIndex];
      setCurrentStory(newStory);
      setUsedStories(prev => [...prev, newStory]);
    }
    
    setTimer(DIFFICULTY_SETTINGS[difficulty].timer);
    setTries(0);
    setFinished(false);
    setShowHint(false);
    setHintLevel(0);
    setScore(0);
    setGuess('');
  }, [difficulty]);

  useEffect(() => {
    console.log('Timer useEffect:', { timer, finished, currentStory });
    if (timer > 0 && !finished) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && !finished) {
      console.log('Timer 0, checking if next round or game over');
      // Timer 0 - sonraki tura geç veya oyun bitti
      if (currentStoryIndex < 2) { // 3 tur var (0, 1, 2)
        console.log('Moving to next round');
        setCurrentStoryIndex(prev => prev + 1);
        
        // Kullanılmamış hikayeleri filtrele
        const availableStories = dailyStories[difficulty].filter(story => 
          !usedStories.some(used => used.emojis === story.emojis)
        );
        
        // Eğer tüm hikayeler kullanıldıysa, listeyi sıfırla
        if (availableStories.length === 0) {
          setUsedStories([]);
          const randomIndex = Math.floor(Math.random() * dailyStories[difficulty].length);
          const nextStory = dailyStories[difficulty][randomIndex];
          setCurrentStory(nextStory);
          setUsedStories([nextStory]);
        } else {
          // Kullanılmamış hikayelerden rastgele seç
          const randomIndex = Math.floor(Math.random() * availableStories.length);
          const nextStory = availableStories[randomIndex];
          setCurrentStory(nextStory);
          setUsedStories(prev => [...prev, nextStory]);
        }
        setTimer(DIFFICULTY_SETTINGS[difficulty].timer);
        setTries(0);
        setShowHint(false);
        setHintLevel(0);
        setGuess('');
      } else {
        // Son turda süre bitti - oyun bitti
        console.log('Last round, calling handleGameOver');
        handleGameOver();
      }
    }
  }, [timer, finished, currentStory]);

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
    if (!guess.trim() || !currentStory) return;

    const storyToCheck = currentStory;
    const isCorrect = checkGuess(guess, storyToCheck);
    
    if (isCorrect) {
      // Doğru cevap sayısını artır
      setCorrectAnswers(prev => prev + 1);
      
      // Günlük Görev Puanlama Sistemi
      let basePoints = 0;
      if (difficulty === 'easy') basePoints = 5;
      else if (difficulty === 'medium') basePoints = 10;
      else if (difficulty === 'hard') basePoints = 15;
      
      // Süre bonusu
      let timeBonus = 0;
      if (timer >= 20) timeBonus = 2; // 20+ saniye kaldıysa +2
      else if (timer >= 10) timeBonus = 1; // 10+ saniye kaldıysa +1
      
      // Kalan hak bonusu
      const remainingTriesBonus = (settings.tries - tries) * 1; // Her kalan hak +1
      
      const roundScore = basePoints + timeBonus + remainingTriesBonus;
      
      setScore(prev => prev + roundScore);
      
      // Popup mesajı göster
      setPopupMessage(`Doğru! +${roundScore} puan 🎉`);
      setPopupType('correct');
      setShowPopup(true);
      
      // 1.5 saniye sonra popup'ı kapat ve sonraki soruya geç
      setTimeout(() => {
        setShowPopup(false);
        
        // Doğru tahmin - sonraki tura geç
        if (currentStoryIndex < 2) { // 3 tur var (0, 1, 2)
          setCurrentStoryIndex(prev => prev + 1);
          
          // Rastgele yeni hikaye seç
          const availableStories = dailyStories[difficulty];
          const randomIndex = Math.floor(Math.random() * availableStories.length);
          const nextStory = availableStories[randomIndex];
          
          setCurrentStory(nextStory);
          setTimer(DIFFICULTY_SETTINGS[difficulty].timer);
          setTries(0);
          setShowHint(false);
          setHintLevel(0);
          setGuess('');
        } else {
          // Son tur tamamlandı
          setFinished(true);
        }
      }, 2000);
    } else {
      setTries(prev => prev + 1); // Kullanılan deneme sayısını artır
      
      // Yanlış cevap popup mesajı
      const remainingTries = DIFFICULTY_SETTINGS[difficulty].tries - tries - 1;
      if (remainingTries > 0) {
        setPopupMessage(`Yanlış! Kalan: ${remainingTries}`);
        setPopupType('warning');
        setShowPopup(true);
        
        setTimeout(() => {
          setShowPopup(false);
        }, 1500);
      } else {
        // Hak bitti popup mesajı
        setPopupMessage('Hak bitti! 🔄');
        setPopupType('warning');
        setShowPopup(true);
        
        setTimeout(() => {
          setShowPopup(false);
          
          // Hak bitti - sonraki tura geç veya oyun bitti
          if (currentStoryIndex < 2) { // 3 tur var (0, 1, 2)
            setCurrentStoryIndex(prev => prev + 1);
            
            // Rastgele yeni hikaye seç
            const availableStories = dailyStories[difficulty];
            const randomIndex = Math.floor(Math.random() * availableStories.length);
            const nextStory = availableStories[randomIndex];
            
            setCurrentStory(nextStory);
            setTimer(DIFFICULTY_SETTINGS[difficulty].timer);
            setTries(0);
            setShowHint(false);
            setHintLevel(0);
            setGuess('');
          } else {
            // Son turda hak bitti - oyun bitti
            handleGameOver();
          }
        }, 1500);
      }
    }
    setGuess('');
  };

  const handleGameOver = () => {
    setFinished(true);
    setTimer(0);
  };

  const handleRestart = () => {
    function getDiverseStories(count = 3) {
      const availableStories = dailyStories[difficulty];
      const shuffled = [...availableStories].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, count);
    }
    
    // İlk hikayeyi rastgele seç
    const randomIndex = Math.floor(Math.random() * dailyStories[difficulty].length);
    const selectedStory = dailyStories[difficulty][randomIndex];
    
    setCurrentStory(selectedStory);
    setCurrentStoryIndex(0);
    setGuess('');
    setScore(0);
    setTimer(settings.timer);
    setTries(0);
    setFinished(false);
    setShowHint(false);
    setHintLevel(0);
    setCorrectAnswers(0); // Doğru cevap sayısını sıfırla
    setShowPopup(false);
    setPopupMessage('');
    setPopupType('correct');
    setUsedStories([]);
  };

  const handleFinish = () => {
    if (finished && score > 0) {
      // Tüm görevleri bitirme bonusu
      let finalScore = score;
      if (correctAnswers === 3) {
        finalScore += 5; // Tüm görevleri bitirirse +5 bonus
        console.log('Tüm görevler tamamlandı! +5 bonus puan');
      }
      
      const todayKey = getTodayKey();
      saveDailyScore(currentUserEmail, currentUserName || 'Kullanıcı', finalScore);
      onFinish(finalScore);
    } else {
      onFinish(score);
    }
  };

  const getSmartHint = (level) => {
    if (!currentStory) return '';
    
    const hints = currentStory.hint.split(', ');
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

  const handleHint = () => {
    if (hintLevel < MAX_HINTS) {
      setHintLevel(prev => prev + 1);
      setShowHint(true);
    }
  };

  if (finished) {
    const successRate = Math.round((correctAnswers / 3) * 100);
    const averageScore = Math.round(score / 3);
    // Yeni mantıklı yıldız sistemi
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

        {/* Game Over Kartı */}
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
          {/* Ana Menü Butonu - Kartın içinde sağ üst köşe */}
          <div style={{
            position: 'absolute',
            top: 20,
            right: 20,
            zIndex: 10
          }}>
            <button 
              onClick={handleFinish}
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
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                maxWidth: 'fit-content',
                whiteSpace: 'nowrap'
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.borderColor = '#cbd5e1';
                e.currentTarget.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.08)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = '#f8fafc';
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.04)';
              }}
            >
              <span style={{ fontSize: '0.9rem' }}>🏠</span>
              Ana Menü
            </button>
          </div>
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
            margin: '0 0 24px 0' 
          }}>
            Harika bir deneme! Bir kez daha şansını denemek ister misin?
          </p>
          
          {/* Skor Kartı */}
          <div style={{
            background: '#fff',
            borderRadius: 16,
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06), 0 8px 24px rgba(0, 0, 0, 0.1)',
            marginBottom: 24,
            border: '1px solid rgba(0, 0, 0, 0.08)'
          }}>
            {/* Toplam Skor */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: '3rem', marginBottom: 8 }}>🏆</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1f2937', marginBottom: 4 }}>
                {score}
              </div>
              <div style={{ fontSize: '1rem', color: '#6b7280', fontWeight: 600 }}>
                TOPLAM SKOR
            </div>
            </div>
            
            {/* Performans Metrikleri */}
                <div style={{ 
                  display: 'flex', 
              justifyContent: 'space-around', 
              marginBottom: 16,
              fontSize: '0.9rem'
            }}>
              <div>
                <div style={{ color: '#6b7280', marginBottom: 4 }}>Doğru Cevap</div>
                <div style={{ fontWeight: 700, color: '#1f2937' }}>{correctAnswers}/3</div>
              </div>
              <div>
                <div style={{ color: '#6b7280', marginBottom: 4 }}>Başarı Oranı</div>
                <div style={{ fontWeight: 700, color: '#1f2937' }}>{successRate}%</div>
              </div>
            </div>
            
            {/* Ortalama Skor */}
                  <div style={{ 
              fontSize: '0.8rem', 
              color: '#9ca3af', 
              marginBottom: 12 
            }}>
              Ortalama: {averageScore} puan/tur
                  </div>
            
            {/* Motivasyon Mesajı */}
                  <div style={{ 
                    fontSize: '1.1rem', 
              fontWeight: 600, 
              color: correctAnswers === 3 ? '#10b981' : '#f59e0b',
              padding: '8px 16px',
              background: correctAnswers === 3 ? '#d1fae5' : '#fef3c7',
              borderRadius: 8,
              display: 'inline-block'
            }}>
              {correctAnswers === 3 ? 'Mükemmel! Tüm soruları doğru bildin! 🎉' : 
               correctAnswers === 2 ? 'Çok iyi! Neredeyse tamamladın! 💪' :
               correctAnswers === 1 ? 'İyi deneme! Biraz daha çalış! 💪' : 
               'Daha iyisini yapabilirsin! 💪'}
                  </div>
          </div>
          
          {/* Yıldızlar - Sadece doğru cevap varsa göster */}
          {stars > 0 ? (
              <div style={{ 
                display: 'flex', 
              justifyContent: 'center', 
              gap: 8, 
              marginBottom: 24 
            }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} style={{ 
                  fontSize: '1.5rem',
                  color: star <= stars ? '#fbbf24' : '#d1d5db'
                }}>
                  {star <= stars ? '⭐' : '☆'}
                </span>
              ))}
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              marginBottom: 24,
              padding: '12px 20px',
              background: '#fef3c7',
              borderRadius: 12,
                                border: '2px solid var(--secondary)'
            }}>
              <div style={{ 
                fontSize: '1.1rem', 
                fontWeight: 600, 
                color: '#92400e',
                marginBottom: 4
              }}>
                ⭐ Yıldız Kazanamadın
              </div>
              <div style={{ 
                fontSize: '0.9rem', 
                color: '#a16207'
              }}>
                Bu oyunda yıldız kazanamadın, tekrar dene!
              </div>
            </div>
          )}
          
          {/* Tekrar Oyna Butonu */}
            <button 
              onClick={handleRestart} 
              style={{ 
              background: 'linear-gradient(to right, #ff6a6a, #ffb347)',
                color: '#fff', 
                border: 'none',
              borderRadius: 12,
              padding: '12px 20px',
              fontSize: '1.1rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              margin: '0 auto',
              boxShadow: '0 4px 12px rgba(255, 106, 106, 0.3)',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>🔄</span>
            Tekrar Oyna
          </button>
        </div>
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
      {/* Ana Oyun Kartı */}
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
        {/* Ana Menü Butonu - Kartın içinde sağ üst köşe */}
        <div style={{
          position: 'absolute',
          top: 20,
          right: 20,
          zIndex: 10
        }}>
          <button 
            onClick={handleFinish}
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
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
              maxWidth: 'fit-content',
              whiteSpace: 'nowrap'
              }}
              onMouseOver={e => {
                              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.borderColor = '#cbd5e1';
              e.currentTarget.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.08)';
              }}
              onMouseOut={e => {
              e.currentTarget.style.background = '#f8fafc';
                              e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.04)';
              }}
            >
            <span style={{ fontSize: '0.9rem' }}>🏠</span>
            Ana Menü
            </button>
          </div>

        {/* Başlık */}
          <div style={{ 
          textAlign: 'center',
          marginBottom: 24,
          marginTop: 20
        }}>
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
            Günlük Görev
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
    <span className="ikon" style={{color:'#0277bd', fontSize: '1rem'}}>🔒</span>
    <span style={{fontWeight: 600, color: '#374151'}}>Otomatik</span>
  </div>
</div>
        {/* Emoji + soru alanı */}
        <div className="emoji-box" style={{marginBottom: 28}}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 28, marginBottom: 28, minHeight: 80 }}>
            {currentStory && currentStory.emojis ? (
              <span style={{ fontSize: '3.7rem', letterSpacing: '8px' }}>{currentStory.emojis}</span>
            ) : (
              <span style={{ fontSize: '1.5rem', color: '#666' }}>
                {currentStory ? 'Emoji yükleniyor...' : 'Hikaye yükleniyor...'}
              </span>
            )}
          </div>
                      <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', textAlign: 'center', margin: 0, lineHeight: 1.4 }}>Bu emojiler hangi hikayeyi anlatıyor?</p>
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
    İpucu {hintLevel}: {getSmartHint(hintLevel)}
              </div>
            )}

{/* Popup Mesajı */}
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
{/* Alt istatistik paneli ve ilerleme çubuğu */}
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
    <span role="img" aria-label="repeat" style={{ fontSize: '1.1rem' }}>🔁</span> 
    <span>Tur:</span> <b>{currentStoryIndex + 1} / 3</b>
  </div>
  
  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
    <span role="img" aria-label="heart" style={{ fontSize: '1.1rem' }}>💪</span> 
    <span>Hak</span> <b>{Math.max(0, DIFFICULTY_SETTINGS[difficulty].tries - tries)}</b>
          </div>
          </div>

          </div>
    </div>
  );
}

export default DailyChallenge; 