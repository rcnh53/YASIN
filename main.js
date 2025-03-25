/**
 * AI Öğrenim Yolculuğum - Ana JavaScript Dosyası
 * Bu dosya, site genelinde kullanılan JavaScript işlevlerini içerir.
 */

document.addEventListener('DOMContentLoaded', function() {
    // AOS Animasyon Kütüphanesi başlatma
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
    }

    // Tarih ve saat güncelleme
    updateDateTime();
    setInterval(updateDateTime, 60000); // Her dakika güncelle

    // Form gönderim işleyicileri
    setupFormHandlers();

    // Filtreleme işlevleri
    setupFilters();
});

/**
 * Tarih ve saat bilgisini güncelleme
 */
function updateDateTime() {
    const now = new Date();
    
    // Tarih güncelleme - Kısa Türkçe format (DD.MM.YYYY)
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        
        dateElement.textContent = `${day}.${month}.${year}`;
    }
    
    // Saat güncelleme - 24 saat formatında (HH:MM)
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        
        timeElement.textContent = `${hours}:${minutes}`;
    }
}

/**
 * Form işleyicileri
 */
function setupFormHandlers() {
    // İletişim formu
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Form verilerini al
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Normalde burada AJAX ile form verilerini gönderirdik
            // Ancak bu demo sürümünde sadece başarılı bir gönderim simüle ediyoruz
            
            // SweetAlert2 ile başarılı mesajı göster
            Swal.fire({
                icon: 'success',
                title: 'Mesajınız Gönderildi!',
                text: 'En kısa sürede size dönüş yapacağız.',
                confirmButtonColor: '#4361ee'
            });
            
            // Formu temizle
            contactForm.reset();
        });
    }
    
    // Kaynak önerisi formu
    const resourceForm = document.getElementById('resource-suggestion-form');
    if (resourceForm) {
        resourceForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Form verilerini al
            const resourceName = document.getElementById('resource-name').value;
            const resourceUrl = document.getElementById('resource-url').value;
            const resourceType = document.getElementById('resource-type').value;
            const resourceDescription = document.getElementById('resource-description').value;
            
            // Başarılı mesajı göster
            Swal.fire({
                icon: 'success',
                title: 'Kaynak Öneriniz Alındı!',
                text: 'Önerdiğiniz kaynak en kısa sürede incelenecek.',
                confirmButtonColor: '#4361ee'
            });
            
            // Formu temizle
            resourceForm.reset();
        });
    }
}

/**
 * Filtreleme işlevleri
 */
function setupFilters() {
    // Konu filtreleme (konular.html)
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Aktif filtreyi kaldır
                filterButtons.forEach(btn => btn.classList.remove('active'));
                filterButtons.forEach(btn => {
                    if (btn.classList.contains('btn-primary')) {
                        btn.classList.remove('btn-primary');
                        btn.classList.add('btn-outline-primary');
                    }
                });
                
                // Tıklanan butonu aktif yap
                this.classList.add('active');
                this.classList.remove('btn-outline-primary');
                this.classList.add('btn-primary');
                
                const filter = this.getAttribute('data-filter');
                const cards = document.querySelectorAll('.topic-card');
                
                cards.forEach(card => {
                    if (filter === 'all') {
                        card.style.display = 'block';
                    } else if (card.getAttribute('data-category') === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // Kaynak arama ve filtreleme (kaynaklar.html)
    const resourceSearch = document.getElementById('resource-search');
    const resourceFilter = document.getElementById('resource-filter');
    
    if (resourceSearch && resourceFilter) {
        // Arama işlevi
        resourceSearch.addEventListener('input', filterResources);
        
        // Seçim değişikliği işlevi
        resourceFilter.addEventListener('change', filterResources);
        
        function filterResources() {
            const searchTerm = resourceSearch.value.toLowerCase();
            const filterValue = resourceFilter.value;
            
            const resources = document.querySelectorAll('.resource-card');
            
            resources.forEach(resource => {
                const title = resource.querySelector('.card-title').textContent.toLowerCase();
                const description = resource.querySelector('.card-text').textContent.toLowerCase();
                const category = resource.getAttribute('data-category');
                
                const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
                const matchesFilter = filterValue === 'all' || category === filterValue;
                
                if (matchesSearch && matchesFilter) {
                    resource.style.display = 'block';
                } else {
                    resource.style.display = 'none';
                }
            });
        }
    }
}
