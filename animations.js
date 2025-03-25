/**
 * AI Öğrenim Yolculuğum - Animasyonlar
 * Bu dosya, sayfa animasyonları ve etkileşimli öğeler için JavaScript kodlarını içerir.
 */

document.addEventListener('DOMContentLoaded', function() {
    // AOS Animasyon Kütüphanesi başlatma (main.js içinde de var, burada daha detaylı konfigürasyon için)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,           // Animasyon süresi (milisaniye)
            easing: 'ease-in-out',   // Easing fonksiyonu
            once: true,              // Animasyonlar sadece bir kez mi çalışsın?
            mirror: false,           // Elementler scroll-out olurken de animate edilsin mi?
            offset: 120,             // Tetikleme offset değeri (px)
            delay: 0                 // Varsayılan gecikme (ms)
        });
    }
    
    // Sayfa geçiş animasyonları
    setupPageTransitions();
    
    // Hover animasyonları
    setupHoverAnimations();
});

/**
 * Sayfa geçiş animasyonları
 * Sayfalar arası geçişlerde yumuşak bir deneyim sağlar
 */
function setupPageTransitions() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Aynı sayfada değilse animasyon yapılır
            if (link.getAttribute('href') !== window.location.pathname.split('/').pop()) {
                // Link tıklamasına devam etmeden önce sayfa fade-out animasyonu
                e.preventDefault();
                const href = this.getAttribute('href');
                
                // Sayfa içeriğini fade-out animasyonuna tabi tut
                document.body.classList.add('page-transition');
                
                // Animasyon tamamlandıktan sonra yeni sayfaya git
                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            }
        });
    });
    
    // Sayfa yüklendiğinde fade-in animasyonu
    document.body.classList.add('page-loaded');
}

/**
 * Hover animasyonları
 * Fare ile üzerine gelindiğinde kartlar ve butonlar için interaktif efektler
 */
function setupHoverAnimations() {
    // Kart hover efektleri
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
            this.style.transition = 'all 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
        });
    });
    
    // Button hover efektleri
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'all 0.2s ease';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

/**
 * Hero bölümünde başlık animasyonu için Typed.js entegrasyonu
 * (Opsiyonel - Typed.js kütüphanesi yüklüyse çalışır)
 */
if (document.querySelector('.hero-section')) {
    // Typed.js kütüphanesi yüklüyse çalıştır
    if (typeof Typed !== 'undefined') {
        const typedElement = document.querySelector('.hero-typed');
        
        if (typedElement) {
            new Typed(typedElement, {
                strings: [
                    'Yapay Zeka',
                    'Makine Öğrenmesi',
                    'Derin Öğrenme',
                    'Doğal Dil İşleme',
                    'Bilgisayarlı Görü'
                ],
                typeSpeed: 80,
                backSpeed: 40,
                backDelay: 1500,
                startDelay: 1000,
                loop: true
            });
        }
    }
}

/**
 * Sayfa scroll butonu
 * Ana sayfada aşağı kaydırma için yumuşak geçiş sağlar
 */
const scrollButtons = document.querySelectorAll('.scroll-btn');

if (scrollButtons.length > 0) {
    scrollButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Hedef elemana yumuşak kaydırma
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Proje sayfası için modal animasyonları
 */
const projectModals = document.querySelectorAll('.modal');

if (projectModals.length > 0) {
    projectModals.forEach(modal => {
        modal.addEventListener('show.bs.modal', function(event) {
            // Modal açılırken animasyon ekle
            this.querySelector('.modal-dialog').classList.add('animate__animated', 'animate__fadeInUp');
        });
        
        modal.addEventListener('hide.bs.modal', function(event) {
            // Modal kapanırken animasyon ekle
            this.querySelector('.modal-dialog').classList.add('animate__animated', 'animate__fadeOutDown');
        });
    });
}
