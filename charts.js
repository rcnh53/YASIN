/**
 * AI Öğrenim Yolculuğum - Grafikler
 * Bu dosya, Chart.js ile oluşturulan tüm grafikleri içerir.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Ana Sayfa Grafikleri
    createLearningProgressChart();
    createTopicCategoriesChart();
    
    // Proje Sayfası Grafikleri
    createProjectProgressChart();
    createUsedTechnologiesChart();
    
    // Hakkında Sayfası Grafikleri
    createSkillsRadarChart();
    
    // Kaynaklar Sayfası Grafikleri
    createResourceTypesChart();
});

/**
 * Ana Sayfa: Aylık Öğrenme İlerlemesi Grafiği (Line Chart)
 */
function createLearningProgressChart() {
    const ctx = document.getElementById('learningProgressChart');
    if (!ctx) return;
    
    const learningProgressData = {
        labels: ['Ekim', 'Kasım', 'Aralık', 'Ocak', 'Şubat', 'Mart'],
        datasets: [{
            label: 'Tamamlanan Konular',
            data: [2, 5, 8, 10, 14, 18],
            borderColor: '#4361ee',
            backgroundColor: 'rgba(67, 97, 238, 0.1)',
            tension: 0.3,
            fill: true
        }]
    };

    const learningProgressConfig = {
        type: 'line',
        data: learningProgressData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Aylık Öğrenme İlerlemesi'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Tamamlanan Konu Sayısı'
                    }
                }
            }
        }
    };
    
    new Chart(ctx, learningProgressConfig);
}

/**
 * Ana Sayfa: Konu Kategorileri Grafiği (Pie Chart)
 */
function createTopicCategoriesChart() {
    const ctx = document.getElementById('topicCategoriesChart');
    if (!ctx) return;
    
    const topicCategoriesData = {
        labels: [
            'Makine Öğrenmesi',
            'Derin Öğrenme',
            'NLP',
            'Bilgisayarlı Görü',
            'Veri Bilimi',
            'Etik ve Güvenlik'
        ],
        datasets: [{
            data: [30, 25, 15, 10, 15, 5],
            backgroundColor: [
                '#4361ee', // Mavi
                '#3a0ca3', // Koyu Mor
                '#7209b7', // Mor
                '#f72585', // Pembe
                '#4cc9f0', // Açık Mavi
                '#560bad'  // Koyu Mor
            ],
            borderWidth: 1
        }]
    };

    const topicCategoriesConfig = {
        type: 'pie',
        data: topicCategoriesData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Öğrenilen Konu Kategorileri'
                }
            }
        }
    };
    
    new Chart(ctx, topicCategoriesConfig);
}

/**
 * Proje Sayfası: Proje İlerleme Durumu Grafiği (Bar Chart)
 */
function createProjectProgressChart() {
    const ctx = document.getElementById('projectProgressChart');
    if (!ctx) return;
    
    const projectProgressData = {
        labels: [
            'Görüntü Sınıflandırma Uygulaması',
            'NLP ile Duygu Analizi',
            'Film Öneri Sistemi',
            'AI Chatbot',
            'Nesne Tanıma Uygulaması'
        ],
        datasets: [{
            label: 'Tamamlanma Yüzdesi',
            data: [100, 60, 100, 40, 10],
            backgroundColor: [
                '#2ecc71', // Tamamlanan
                '#f39c12', // Devam eden
                '#2ecc71', // Tamamlanan
                '#f39c12', // Devam eden
                '#3498db'  // Planlama
            ]
        }]
    };

    const projectProgressConfig = {
        type: 'bar',
        data: projectProgressData,
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                },
                title: {
                    display: true,
                    text: 'Proje İlerleme Durumu'
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    };
    
    new Chart(ctx, projectProgressConfig);
}

/**
 * Proje Sayfası: Kullanılan Teknolojiler Grafiği (Doughnut Chart)
 */
function createUsedTechnologiesChart() {
    const ctx = document.getElementById('usedTechnologiesChart');
    if (!ctx) return;
    
    const usedTechnologiesData = {
        labels: [
            'Python',
            'TensorFlow/Keras',
            'PyTorch',
            'Flask/Django',
            'JavaScript',
            'Diğer'
        ],
        datasets: [{
            data: [40, 25, 15, 10, 5, 5],
            backgroundColor: [
                '#3498db', // Mavi
                '#e74c3c', // Kırmızı
                '#f39c12', // Turuncu
                '#2ecc71', // Yeşil
                '#9b59b6', // Mor
                '#7f8c8d'  // Gri
            ],
            borderWidth: 1
        }]
    };

    const usedTechnologiesConfig = {
        type: 'doughnut',
        data: usedTechnologiesData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Kullanılan Teknolojiler'
                }
            },
            cutout: '60%'
        }
    };
    
    new Chart(ctx, usedTechnologiesConfig);
}

/**
 * Hakkında Sayfası: AI Becerileri Radar Grafiği (Radar Chart)
 */
function createSkillsRadarChart() {
    const ctx = document.getElementById('skillsRadarChart');
    if (!ctx) return;
    
    const skillsRadarData = {
        labels: [
            'Python Programlama',
            'Veri Analizi',
            'Makine Öğrenmesi',
            'Derin Öğrenme',
            'NLP',
            'Bilgisayarlı Görü',
            'AI Etik'
        ],
        datasets: [{
            label: 'Mevcut Seviye',
            data: [90, 70, 75, 65, 45, 40, 65],
            fill: true,
            backgroundColor: 'rgba(67, 97, 238, 0.2)',
            borderColor: '#4361ee',
            pointBackgroundColor: '#4361ee',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#4361ee'
        }, {
            label: 'Hedef Seviye',
            data: [95, 85, 90, 85, 80, 75, 85],
            fill: true,
            backgroundColor: 'rgba(76, 201, 240, 0.2)',
            borderColor: '#4cc9f0',
            pointBackgroundColor: '#4cc9f0',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#4cc9f0'
        }]
    };

    const skillsRadarConfig = {
        type: 'radar',
        data: skillsRadarData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            elements: {
                line: {
                    borderWidth: 3
                }
            },
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 0,
                    suggestedMax: 100,
                    ticks: {
                        stepSize: 20
                    }
                }
            }
        }
    };
    
    new Chart(ctx, skillsRadarConfig);
}

/**
 * Kaynaklar Sayfası: Kaynak Türleri Dağılımı Grafiği (Doughnut Chart)
 */
function createResourceTypesChart() {
    const ctx = document.getElementById('resourceTypesChart');
    if (!ctx) return;
    
    const resourceTypesData = {
        labels: [
            'Video Eğitimler',
            'Makaleler',
            'Kitaplar',
            'Açık Kaynak Projeler',
            'Kurslar',
            'Araçlar'
        ],
        datasets: [{
            data: [40, 20, 10, 15, 10, 5],
            backgroundColor: [
                '#4361ee',
                '#3a0ca3',
                '#7209b7',
                '#f72585',
                '#4cc9f0',
                '#560bad'
            ],
            borderWidth: 1
        }]
    };

    const resourceTypesConfig = {
        type: 'doughnut',
        data: resourceTypesData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Kaynak Türleri Dağılımı'
                }
            },
            cutout: '70%'
        }
    };
    
    new Chart(ctx, resourceTypesConfig);
}
