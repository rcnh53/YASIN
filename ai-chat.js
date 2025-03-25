/**
 * AI Öğrenim Yolculuğum - AI Sohbet İşlevselliği
 * Bu dosya, AI sohbet kutusu için arayüz ve OpenAI API entegrasyonunu içerir.
 * API anahtarı kullanarak gerçek zamanlı yapay zeka yanıtları sağlar.
 * Thinking+ özelliği ile yapay zekanın düşünme sürecini gösterir.
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elementleri
    const chatIcon = document.getElementById('chat-icon');
    const chatModal = document.getElementById('chat-modal');
    const chatClose = document.getElementById('chat-close');
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');
    const sendButton = document.getElementById('send-button');
    const thinkingToggle = document.getElementById('thinking-toggle');
    const apiStatus = document.getElementById('api-status');
    
    // API durumu
    let apiConnected = false;
    let useThinkingProcess = true; // Varsayılan olarak Thinking+ aktif
    
    // API Konfigürasyonu
    const API_URL = 'api/chat.php'; // PHP proxy üzerinden OpenAI API'ye istek
    
    // Sohbet geçmişi - OpenAI API için bağlam korunmasını sağlar
    let chatHistory = [
        { role: "system", content: "Sen, AI öğrenimi konusunda uzmanlaşmış bir yapay zeka asistanısın. 'AI Öğrenim Yolculuğum' adlı web sitesinin bir parçası olarak hizmet veriyorsun. Makine öğrenmesi, derin öğrenme, doğal dil işleme, bilgisayarlı görü ve pekiştirmeli öğrenme gibi yapay zeka konularında bilgi sahibisin. Yanıtların doğru, özgün ve Türkçe dil kurallarına uygun olmalı. Düşünme sürecini açık bir şekilde göstermelisin, özellikle adım adım akıl yürütme gerektiren konularda." }
    ];
    
    // API bağlantısını kontrol et
    function checkApiConnection() {
        // Server durumunu kontrol etmek için basit bir istek yapabiliriz
        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                messages: [{ role: "system", content: "ping" }],
                model: "gpt-3.5-turbo"
            })
        })
        .then(response => {
            if (response.ok) {
                setApiStatus(true, "API bağlantısı kuruldu");
                return true;
            } else {
                setApiStatus(false, "API bağlantısı hatası");
                return false;
            }
        })
        .catch(error => {
            console.error('API check failed:', error);
            setApiStatus(false, "API bağlantısı başarısız");
            return false;
        });
        
        // Varsayılan olarak mevcut durumu döndür
        return apiConnected;
    }
    
    // API durumunu görsel olarak güncelle
    function setApiStatus(connected, message) {
        apiConnected = connected;
        
        if (apiStatus) {
            apiStatus.className = connected ? 'text-success' : 'text-danger';
            apiStatus.innerHTML = `<i class="fas ${connected ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;
        }
        
        // Demo sürümünde API yoksa, bir uyarı göstermek yerine modal footer'ı güncelle
        const modalFooter = document.querySelector('#chat-modal .modal-footer small.text-muted');
        if (modalFooter) {
            if (!connected) {
                modalFooter.textContent = "Demo Sürüm - API bağlantısı yok";
                modalFooter.className = "text-warning";
            } else {
                modalFooter.textContent = "OpenAI API ile çalışıyor";
                modalFooter.className = "text-success";
            }
        }
    }
    
    // AI Chat butonunu aktif et
    if (chatIcon && chatModal) {
        // Bootstrap modal nesnesini al
        const modal = new bootstrap.Modal(chatModal);
        
        // Sohbet butonuna tıklanınca modalı aç
        chatIcon.addEventListener('click', function() {
            modal.show();
            
            // API durumunu kontrol et
            checkApiConnection();
            
            // Mesaj kutusu boşsa ve henüz bir karşılama mesajı eklenmemişse
            if (chatMessages.children.length === 0) {
                // Karşılama mesajı ekle (kısa bir gecikme ile)
                setTimeout(() => {
                    addMessageToChat('ai', 'Merhaba! AI öğrenimi hakkında sorularınızı yanıtlamaktan memnuniyet duyarım. Nasıl yardımcı olabilirim?');
                }, 600);
            }
            
            // Input alanına odaklan
            setTimeout(() => {
                userInput.focus();
            }, 500);
        });
    }
    
    // Thinking+ özelliğini aç/kapat
    if (thinkingToggle) {
        thinkingToggle.addEventListener('change', function() {
            useThinkingProcess = this.checked;
        });
    }
    
    // Kapatma butonunu dinle
    if (chatClose) {
        chatClose.addEventListener('click', function() {
            const modal = bootstrap.Modal.getInstance(chatModal);
            if (modal) {
                modal.hide();
            }
        });
    }
    
    // Sohbet formunu dinle
    if (chatForm) {
        chatForm.addEventListener('submit', function(e) {
            e.preventDefault();
            sendMessage();
        });
    }
    
    // Enter tuşu ile gönderme ve Shift+Enter ile yeni satır
    if (userInput) {
        userInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                sendMessage();
            }
        });
        
        // Textarea'yı otomatik büyütme
        userInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight < 150 ? this.scrollHeight : 150) + 'px';
        });
    }
    
    // Mesaj gönderme fonksiyonu
    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;
        
        // Input alanını temizle
        userInput.value = '';
        userInput.style.height = 'auto';
        
        // Kullanıcı mesajını ekrana ekle
        addMessageToChat('user', message);
        
        // Sohbet geçmişine ekle
        chatHistory.push({ role: "user", content: message });
        
        // Yükleniyor göstergesi
        const loadingElement = document.createElement('div');
        loadingElement.className = 'message ai-message loading';
        loadingElement.innerHTML = '<div class="loading-indicator"><span></span><span></span><span></span></div>';
        chatMessages.appendChild(loadingElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Butonları devre dışı bırak
        sendButton.disabled = true;
        userInput.disabled = true;
        
        try {
            let responseText;
            
            // API durumunu kontrol et
            if (apiConnected) {
                // OpenAI API'ye istek gönder
                try {
                    const response = await callOpenAI(message);
                    responseText = response;
                } catch (error) {
                    console.error('API call failed, falling back to demo mode:', error);
                    responseText = getDemoResponse(message);
                }
            } else {
                // API yoksa demo yanıtlar kullan
                await new Promise(resolve => setTimeout(resolve, 1000)); // Gerçekçi gecikme
                responseText = getDemoResponse(message);
            }
            
            // Yükleniyor göstergesini kaldır
            chatMessages.removeChild(loadingElement);
            
            // Eğer thinking+ aktifse
            if (useThinkingProcess) {
                // Düşünme sürecini ve yanıtı ayrıştır
                const { thinking, answer } = parseThinkingProcess(responseText);
                
                // Düşünme süreci varsa ekle
                if (thinking) {
                    addThinkingProcessToChat(thinking);
                    // Kısa bir duraklama ekleyelim
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
                
                // Ana yanıtı ekle
                addMessageToChat('ai', answer);
                
                // Sohbet geçmişine sadece ana yanıtı ekle
                chatHistory.push({ role: "assistant", content: answer });
            } else {
                // Thinking+ aktif değilse direkt yanıtı göster
                addMessageToChat('ai', responseText);
                
                // Sohbet geçmişine ekleme
                chatHistory.push({ role: "assistant", content: responseText });
            }
            
        } catch (error) {
            console.error('Error:', error);
            chatMessages.removeChild(loadingElement);
            
            // Hata mesajı göster
            addMessageToChat('ai', 'Üzgünüm, bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        } finally {
            // Butonları tekrar aktif et
            sendButton.disabled = false;
            userInput.disabled = false;
            userInput.focus();
        }
    }
    
    // OpenAI API çağrısı
    async function callOpenAI(message) {
        // API isteği için prompt hazırlığı
        let promptMessages = [...chatHistory];
        
        // Eğer thinking+ aktifse, düşünme sürecini içerecek özel talimatlar ekle
        if (useThinkingProcess) {
            // Önceki sistem talimatını güncelle
            const systemPrompt = promptMessages[0].content;
            if (!systemPrompt.includes("Düşünme Süreci")) {
                promptMessages[0].content += " Yanıtını iki bölümde yapılandır: önce '### Düşünme Süreci:' başlığı altında sorunu adım adım analiz et, sonra '### Yanıt:' başlığı altında net ve özlü bir cevap ver.";
            }
        }
        
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: promptMessages,
                    temperature: 0.7,
                    max_tokens: 1000
                })
            });
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            const data = await response.json();
            return data.choices[0].message.content;
            
        } catch (error) {
            console.error('API call failed:', error);
            throw error;
        }
    }
    
    // Düşünme sürecini ayrıştırma
    function parseThinkingProcess(text) {
        // Düşünme süreci ve yanıtı ayırma
        const thinkingMatch = text.match(/### Düşünme Süreci:([\s\S]*?)(?=### Yanıt:|$)/i);
        const answerMatch = text.match(/### Yanıt:([\s\S]*?)$/i);
        
        let thinking = null;
        let answer = text; // Varsayılan olarak tüm metni kullan
        
        if (thinkingMatch && thinkingMatch[1]) {
            thinking = thinkingMatch[1].trim();
        }
        
        if (answerMatch && answerMatch[1]) {
            answer = answerMatch[1].trim();
        } else if (thinking) {
            // Eğer yanıt bölümü yoksa ama düşünme bölümü varsa,
            // tüm metnin düşünme bölümü olmayan kısmını yanıt olarak kabul et
            answer = text.replace(/### Düşünme Süreci:([\s\S]*?)$/i, '').trim();
        }
        
        return { thinking, answer };
    }
    
    // Düşünme sürecini sohbete ekleme
    function addThinkingProcessToChat(thinking) {
        const thinkingElement = document.createElement('div');
        thinkingElement.className = 'message thinking-process';
        
        const headerElement = document.createElement('div');
        headerElement.className = 'thinking-header';
        headerElement.innerHTML = '<i class="fas fa-brain me-2"></i> Düşünme Süreci';
        
        const contentElement = document.createElement('div');
        contentElement.className = 'thinking-content';
        
        // Markdown dönüşümü yapabiliriz (gerekirse bir kütüphane eklenebilir)
        // Şimdilik basit satır sonlarını koruma
        contentElement.innerHTML = thinking.replace(/\n/g, '<br>');
        
        thinkingElement.appendChild(headerElement);
        thinkingElement.appendChild(contentElement);
        
        chatMessages.appendChild(thinkingElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Sohbete mesaj ekleme fonksiyonu
    function addMessageToChat(sender, message) {
        // Mesaj elementi oluştur
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}-message`;
        
        // Mesaj içeriği
        const contentElement = document.createElement('div');
        contentElement.className = 'message-content';
        
        // Markdown formatı için basit dönüşüm (gerekirse bir kütüphane eklenebilir)
        contentElement.innerHTML = formatMessage(message);
        
        // Zaman damgası
        const timeElement = document.createElement('div');
        timeElement.className = 'message-time';
        const now = new Date();
        timeElement.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        
        // Mesaj elementine ekle
        messageElement.appendChild(contentElement);
        messageElement.appendChild(timeElement);
        
        // Sohbet geçmişine ekle
        chatMessages.appendChild(messageElement);
        
        // Kod bloklarını vurgula
        if (window.Prism) {
            Prism.highlightAllUnder(contentElement);
        }
        
        // Otomatik kaydırma
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Mesaj formatı için basit çevirici
    function formatMessage(text) {
        // Satır sonlarını HTML'e dönüştür
        let formatted = text.replace(/\n/g, '<br>');
        
        // Kod bloklarını vurgula
        formatted = formatted.replace(/```([\s\S]*?)```/g, function(match, code) {
            // İlk satırı dil adı olarak kabul et (varsa)
            const firstLineMatch = code.match(/^([a-zA-Z]+)\n/);
            let language = '';
            
            if (firstLineMatch) {
                language = firstLineMatch[1];
                code = code.substring(firstLineMatch[0].length);
            }
            
            return `<pre><code class="language-${language}">${code}</code></pre>`;
        });
        
        // Inline kod bloklarını vurgula
        formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // Kalın metin
        formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        
        // İtalik metin
        formatted = formatted.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        
        return formatted;
    }
    
    // Demo yanıt veritabanı (API bağlantısı yoksa kullanılır)
    const demoResponses = {
        "yapay zeka": "Yapay zeka (AI), insan zekasını taklit eden ve öğrenebilen, akıl yürütebilen ve kendi kendine problem çözebilen bilgisayar sistemlerini ifade eder. Makine öğrenmesi, derin öğrenme, doğal dil işleme ve bilgisayarlı görü gibi alanları içerir.",
        "makine öğrenmesi": "Makine öğrenmesi, bilgisayarların açıkça programlanmadan veri üzerinden öğrenmesini sağlayan yapay zeka alt dalıdır. Denetimli, denetimsiz ve pekiştirmeli öğrenme olmak üzere temel kategorilere ayrılır.",
        "derin öğrenme": "Derin öğrenme, çok katmanlı yapay sinir ağları kullanan bir makine öğrenmesi tekniğidir. Görüntü ve ses tanıma gibi karmaşık görevlerde oldukça başarılıdır. CNN, RNN, ve Transformer gibi mimariler bu alanın temel taşlarıdır.",
        "nlp": "Doğal Dil İşleme (NLP), bilgisayarların insan dilini anlama, yorumlama ve üretmesini sağlayan yapay zeka alanıdır. Metin sınıflandırma, duygu analizi, makine çevirisi ve soru cevaplama gibi uygulamaları vardır.",
        "opencv": "OpenCV (Open Source Computer Vision Library), gerçek zamanlı bilgisayarlı görü uygulamaları için açık kaynaklı bir kütüphanedir. Görüntü işleme, nesne tanıma ve video analizi gibi işlevler sunar.",
        "tensorflow": "TensorFlow, Google tarafından geliştirilen açık kaynaklı bir makine öğrenmesi ve derin öğrenme kütüphanesidir. Esnek mimarisi ve kapsamlı ekosistemi sayesinde araştırma ve üretim için yaygın olarak kullanılır.",
        "pytorch": "PyTorch, Facebook AI Research Lab tarafından geliştirilen açık kaynaklı bir derin öğrenme kütüphanesidir. Dinamik hesaplama grafiği ve Python entegrasyonu ile özellikle araştırmacılar arasında popülerdir.",
        "cnn": "Evrişimli Sinir Ağları (CNN), özellikle görüntü işleme görevleri için tasarlanmış derin öğrenme mimarisidir. Evrişim katmanları, havuzlama katmanları ve tam bağlantılı katmanları içerir ve görsel özellikleri hiyerarşik olarak öğrenir.",
        "rnn": "Yinelemeli Sinir Ağları (RNN), sıralı ve zamansal verileri işlemek için tasarlanmış nöral ağ mimarisidir. Dil modelleme, makine çevirisi ve konuşma tanıma gibi uygulamalarda kullanılır.",
        "lstm": "Uzun-Kısa Vadeli Bellek (LSTM), RNN'lerin uzun mesafeli bağımlılıkları öğrenmede yaşadığı kaybolan gradyan sorununu çözen özel bir yinelemeli sinir ağı türüdür.",
        "gan": "Üretici Çekişmeli Ağlar (GAN), iki sinir ağının (üretici ve ayırıcı) birbirine karşı eğitildiği derin öğrenme mimarisidir. Gerçekçi görüntüler, sesler ve metinler üretmek için kullanılır.",
        "transformers": "Transformer mimarisi, dikkat mekanizması kullanan ve sıralı verileri paralel olarak işleyebilen bir sinir ağı tasarımıdır. BERT, GPT ve T5 gibi modern dil modelleri bu mimariyi temel alır.",
        "reinforcement learning": "Pekiştirmeli öğrenme, bir ajanın çevresiyle etkileşime girerek, ödül ve ceza mekanizması yoluyla optimal davranışı öğrendiği makine öğrenmesi yöntemidir.",
        "python": "Python, yapay zeka ve veri bilimi alanındaki en popüler programlama dilidir. Zengin kütüphane ekosistemi, okunabilir sözdizimi ve güçlü topluluk desteği sayesinde AI geliştirmede tercih edilir.",
        "jupyter": "Jupyter Notebook, interaktif kodlama, veri görselleştirme ve dokümantasyon için web tabanlı bir ortamdır. Veri bilimi ve makine öğrenmesi projeleri için mükemmel bir araçtır.",
        "scikit-learn": "Scikit-learn, Python programlama dili için makine öğrenmesi kütüphanesidir. Sınıflandırma, regresyon, kümeleme ve boyut indirgeme gibi çeşitli algoritmaları içerir.",
        "keras": "Keras, kullanımı kolay ve modüler bir derin öğrenme API'sidir. TensorFlow, CNTK veya Theano üzerinde çalışabilir ve hızlı prototipleme için tasarlanmıştır.",
        "api": "API (Uygulama Programlama Arayüzü), bir yazılımın başka bir yazılımla iletişim kurmasını sağlayan arabirimdir. OpenAI API gibi AI API'leri, geliştiricilerin uygulamalarına yapay zeka yetenekleri eklemelerine olanak tanır.",
        "computer vision": "Bilgisayarlı görü, bilgisayarların görüntüleri ve videoları anlama ve işleme yeteneğidir. Nesne algılama, yüz tanıma, görüntü segmentasyonu gibi uygulamaları içerir.",
        "ethics": "AI etiği, yapay zekanın geliştirilmesi ve kullanılmasında dikkate alınması gereken ahlaki ilkeler ve değerleri inceler. Adalet, şeffaflık, gizlilik ve güvenlik gibi konuları ele alır."
    };
    
    // Varsayılan yanıtlar (eşleşme bulunamadığında)
    const defaultResponses = [
        "Bu konuda daha fazla bilgi edinmek için kaynaklar bölümünü ziyaret edebilirsiniz.",
        "Bu ilginç bir soru. AI öğrenme yolculuğunuzda daha detaylı incelemenizi öneririm.",
        "Bu konu hakkında daha fazla bilgi için çevrimiçi kurslar ve makaleler bulabilirsiniz.",
        "Bu alanla ilgili projeler geliştirmek, konuyu daha iyi anlamanıza yardımcı olacaktır.",
        "Bu konudaki gelişmeleri takip etmek için akademik makaleleri ve blog yazılarını öneririm.",
        "Bu soruya kapsamlı bir yanıt verebilmek için daha fazla ayrıntıya ihtiyacım var.",
        "Yapay zeka öğrenirken pratik yapmak teorik bilgi kadar önemlidir.",
        "Bu, AI alanında aktif olarak araştırılan ilginç bir konu.",
        "Öğrenim yolculuğunuzda bu konuyu derinlemesine keşfetmenizi tavsiye ederim."
    ];
    
    // Anahtar kelime eşleştirme ile demo yanıt üretme
    function getDemoResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Thinking+ aktifse, demoda düşünme süreci ekle
        if (useThinkingProcess && message.length > 10) {
            const demoThinking = `### Düşünme Süreci:
Kullanıcının sorusunu analiz ediyorum. Bu sorunun yanıtı için bilgi tabanımda ne var diye kontrol ediyorum. Anahtar kelimeler üzerinden eşleşme arıyorum.

Sorunun bağlamını anlamaya çalışıyorum ve en uygun yanıtı formüle ediyorum.

### Yanıt:`;

            // Normal yanıt bulma mantığını çalıştır
            let answer = findDemoAnswer(message);
            
            // Düşünme sürecini ve yanıtı birleştir
            return demoThinking + "\n\n" + answer;
        } else {
            // Thinking+ kapalıysa sadece yanıtı döndür
            return findDemoAnswer(message);
        }
    }
    
    // Demo yanıt bulma
    function findDemoAnswer(message) {
        // Anahtar kelimeleri kontrol et
        for (const keyword in demoResponses) {
            if (message.includes(keyword)) {
                return demoResponses[keyword];
            }
        }
        
        // Basit giriş/çıkış mesajları
        if (message.includes('merhaba') || message.includes('selam') || message.includes('hey')) {
            return 'Merhaba! Yapay zeka öğreniminiz hakkında size nasıl yardımcı olabilirim?';
        }
        
        if (message.includes('teşekkür') || message.includes('sağol')) {
            return 'Rica ederim! Başka bir sorunuz olursa yardımcı olmaktan memnuniyet duyarım.';
        }
        
        if (message.includes('hoşça kal') || message.includes('görüşürüz')) {
            return 'Görüşmek üzere! Yapay zeka öğrenim yolculuğunuzda başarılar dilerim.';
        }
        
        // Eşleşme yoksa rastgele bir varsayılan yanıt döndür
        const randomIndex = Math.floor(Math.random() * defaultResponses.length);
        return defaultResponses[randomIndex];
    }
    
    // İlk API bağlantı kontrolü
    checkApiConnection();
});
