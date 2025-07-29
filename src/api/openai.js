// OpenAI API ile AI tabanlı emoji hikaye üretimi
const OPENAI_API_KEY = process.env.VITE_OPENAI_API_KEY || 'YOUR_OPENAI_API_KEY_HERE';

// Emoji hikaye üretme fonksiyonu
export async function generateEmojiStory(difficulty = 'easy') {
  try {
    const difficultyPrompts = {
      easy: 'Basit ve kısa bir emoji hikayesi üret (3-4 emoji, çocuklar için uygun)',
      medium: 'Orta zorlukta bir emoji hikayesi üret (4-5 emoji, biraz daha karmaşık)',
      hard: 'Zor bir emoji hikayesi üret (5-6 emoji, karmaşık senaryo)'
    };

    const prompt = `${difficultyPrompts[difficulty]}. 
    
    Format şu şekilde olmalı:
    {
      "emojis": "👴🐱📚",
      "answer": "Yaşlı adam kedisiyle birlikte kitap okudu.",
      "hint": "Kedi, yaşlı adam, kitap."
    }
    
    Sadece JSON formatında cevap ver, başka açıklama ekleme.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Sen bir emoji hikaye üreticisisin. Verilen zorluk seviyesine göre emoji kombinasyonları ve bunların hikayelerini üretirsin.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.8
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API hatası: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // JSON parse et
    const story = JSON.parse(content);
    return story;
  } catch (error) {
    console.error('AI hikaye üretme hatası:', error);
    // Hata durumunda varsayılan hikaye döndür
    return getFallbackStory(difficulty);
  }
}

// AI ipucu üretme fonksiyonu
export async function generateSmartHint(emojis, userGuess, correctAnswer) {
  try {
    const prompt = `Emoji: ${emojis}
    Kullanıcının tahmini: "${userGuess}"
    Doğru cevap: "${correctAnswer}"
    
    Kullanıcıya yardımcı olacak akıllı bir ipucu ver. İpucu çok açık olmasın ama yönlendirici olsun.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Sen bir oyun ipucu üreticisisin. Kullanıcının yanlış tahminine göre yardımcı ipucular verirsin.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 100,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API hatası: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('AI ipucu üretme hatası:', error);
    return 'Daha dikkatli bak!';
  }
}

// Varsayılan hikayeler (AI çalışmadığında)
function getFallbackStory(difficulty) {
  const fallbackStories = {
    easy: [
      { emojis: '👴🐱📚', answer: 'Yaşlı adam kedisiyle birlikte kitap okudu.', hint: 'Kedi, yaşlı adam, kitap.' },
      { emojis: '🚀🧑🌕', answer: 'İnsan roketle aya gitti.', hint: 'Roket, insan, ay.' },
      { emojis: '🧙‍♂️✨🐸👑', answer: 'Büyücü kurbağayı sihirle prense dönüştürdü.', hint: 'Büyücü, sihir, kurbağa, prens.' }
    ],
    medium: [
      { emojis: '🍕🍅🧀', answer: 'Pizza domates ve peynir ile yapılır.', hint: 'Pizza, domates, peynir.' },
      { emojis: '👨‍💼🚗⛽️🏁', answer: 'Adam arabasına benzin aldı ve yarışa katıldı.', hint: 'Adam, araba, benzin, yarış.' }
    ],
    hard: [
      { emojis: '🦸‍♂️🚗💥🏥👨‍⚕️', answer: 'Süper kahraman araba kazasını önledi ve hastaneye götürdü.', hint: 'Kahraman, kaza, hastane.' },
      { emojis: '👸🐉🏰⚔️🏆', answer: 'Prenses ejderhayı yendi, kaleyi kurtardı ve ödül kazandı.', hint: 'Prenses, ejderha, kale, ödül.' }
    ]
  };

  const stories = fallbackStories[difficulty];
  return stories[Math.floor(Math.random() * stories.length)];
}

// AI özelliğinin aktif olup olmadığını kontrol et
export function isAIAvailable() {
  return OPENAI_API_KEY && OPENAI_API_KEY !== 'YOUR_OPENAI_API_KEY_HERE';
} 