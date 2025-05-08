<?php
// Prosty skrypt do inicjalizacji API
$url = 'https://www.oze-system.tech/api/initialize';

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo '<h1>Inicjalizacja API</h1>';
echo '<p>Kod odpowiedzi: ' . $httpCode . '</p>';
echo '<pre>' . $response . '</pre>';
echo '<p><a href="https://www.oze-system.tech/api/panels">Sprawdź dane paneli</a></p>';
?>
