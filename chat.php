<?php
/**
 * AI Öğrenim Yolculuğum - OpenAI API Proxy
 * 
 * Bu dosya, OpenAI API'ye istemci tarafından gelen istekleri güvenli bir şekilde yönlendirir.
 * API anahtarını istemciden gizler ve istek/yanıt işlemlerini yönetir.
 */

// CORS ayarları
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// OPTIONS isteklerini hızlıca yanıtla (preflight istekleri için)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Sadece POST isteklerini kabul et
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed. Only POST requests are accepted.']);
    exit();
}

// API anahtarı - Gerçek uygulamada bu değeri .env dosyasında saklayın
// veya güvenli bir ortam değişkeni olarak yapılandırın
$apiKey = 'YOUR_OPENAI_API_KEY';

// İstek gövdesini oku
$requestData = json_decode(file_get_contents('php://input'), true);

// İstek verilerini doğrula
if (!$requestData || !isset($requestData['messages'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Bad Request. Messages field is required.']);
    exit();
}

// API isteği için yapılandırma
$url = 'https://api.openai.com/v1/chat/completions';
$headers = [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $apiKey
];

// İstek parametreleri
$data = [
    'model' => $requestData['model'] ?? 'gpt-3.5-turbo',
    'messages' => $requestData['messages'],
    'temperature' => $requestData['temperature'] ?? 0.7,
    'max_tokens' => $requestData['max_tokens'] ?? 1000,
];

// cURL ayarları
$curl = curl_init();
curl_setopt_array($curl, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($data),
    CURLOPT_HTTPHEADER => $headers,
    CURLOPT_TIMEOUT => 30,
]);

// İsteği gönder ve yanıtı al
$response = curl_exec($curl);
$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
$error = curl_error($curl);
curl_close($curl);

// Hata durumunu kontrol et
if (!$response) {
    http_response_code(500);
    echo json_encode(['error' => 'API request failed: ' . $error]);
    exit();
}

// İstek yanıtını istemciye gönder
http_response_code($status);
echo $response;
