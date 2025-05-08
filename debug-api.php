<?php
// Skrypt do debugowania API
echo '<h1>Debugowanie API</h1>';

// Sprawdź katalog data
$dataDir = __DIR__ . '/api/data';
echo '<h2>Katalog data</h2>';
echo '<p>Ścieżka: ' . $dataDir . '</p>';

if (!file_exists($dataDir)) {
    echo '<p style="color: red;">Katalog nie istnieje!</p>';
    echo '<p>Próbuję utworzyć katalog...</p>';
    
    if (mkdir($dataDir, 0755, true)) {
        echo '<p style="color: green;">Katalog został utworzony.</p>';
    } else {
        echo '<p style="color: red;">Nie udało się utworzyć katalogu!</p>';
    }
} else {
    echo '<p style="color: green;">Katalog istnieje.</p>';
    
    // Sprawdź uprawnienia
    $perms = substr(sprintf('%o', fileperms($dataDir)), -4);
    echo '<p>Uprawnienia: ' . $perms . '</p>';
    
    // Sprawdź, czy katalog jest zapisywalny
    if (is_writable($dataDir)) {
        echo '<p style="color: green;">Katalog jest zapisywalny.</p>';
    } else {
        echo '<p style="color: red;">Katalog nie jest zapisywalny!</p>';
    }
}

// Sprawdź plik panels.json
$panelsFile = $dataDir . '/panels.json';
echo '<h2>Plik panels.json</h2>';
echo '<p>Ścieżka: ' . $panelsFile . '</p>';

if (!file_exists($panelsFile)) {
    echo '<p style="color: red;">Plik nie istnieje!</p>';
    
    // Utwórz przykładowy plik
    $defaultPanels = [
        [
            'id' => '1',
            'name' => 'Panel Longi LR4-72HPH-455M',
            'power' => 455,
            'price' => 650,
            'efficiency' => 20.9,
            'warranty' => 25,
            'dimensions' => '2094x1038x35',
            'weight' => 24.5,
            'manufacturer' => 'Longi Solar',
            'type' => 'Monokrystaliczny',
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s'),
        ],
        [
            'id' => '2',
            'name' => 'Panel JA Solar JAM60S20-380/MR',
            'power' => 380,
            'price' => 550,
            'efficiency' => 20.2,
            'warranty' => 25,
            'dimensions' => '1776x1052x35',
            'weight' => 20.2,
            'manufacturer' => 'JA Solar',
            'type' => 'Monokrystaliczny',
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s'),
        ],
        [
            'id' => '3',
            'name' => 'Panel Jinko Solar JKM410M-54HL4-V',
            'power' => 410,
            'price' => 600,
            'efficiency' => 20.4,
            'warranty' => 25,
            'dimensions' => '1724x1134x30',
            'weight' => 22.5,
            'manufacturer' => 'Jinko Solar',
            'type' => 'Monokrystaliczny',
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s'),
        ],
        [
            'id' => '4',
            'name' => 'Skichała Trina',
            'power' => 400,
            'price' => 580,
            'efficiency' => 20.1,
            'warranty' => 25,
            'dimensions' => '1700x1000x35',
            'weight' => 21.0,
            'manufacturer' => 'Trina Solar',
            'type' => 'Monokrystaliczny',
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s'),
        ],
    ];
    
    $jsonData = json_encode($defaultPanels, JSON_PRETTY_PRINT);
    
    if (file_put_contents($panelsFile, $jsonData)) {
        echo '<p style="color: green;">Utworzono przykładowy plik panels.json.</p>';
    } else {
        echo '<p style="color: red;">Nie udało się utworzyć pliku panels.json!</p>';
    }
} else {
    echo '<p style="color: green;">Plik istnieje.</p>';
    
    // Sprawdź uprawnienia
    $perms = substr(sprintf('%o', fileperms($panelsFile)), -4);
    echo '<p>Uprawnienia: ' . $perms . '</p>';
    
    // Sprawdź, czy plik jest zapisywalny
    if (is_writable($panelsFile)) {
        echo '<p style="color: green;">Plik jest zapisywalny.</p>';
    } else {
        echo '<p style="color: red;">Plik nie jest zapisywalny!</p>';
    }
    
    // Sprawdź zawartość pliku
    $content = file_get_contents($panelsFile);
    $panels = json_decode($content, true);
    
    if ($panels === null) {
        echo '<p style="color: red;">Plik zawiera nieprawidłowy format JSON!</p>';
        echo '<pre>' . htmlspecialchars($content) . '</pre>';
    } else {
        echo '<p style="color: green;">Plik zawiera prawidłowy format JSON.</p>';
        echo '<p>Liczba paneli: ' . count($panels) . '</p>';
        
        // Wyświetl panele
        echo '<h3>Lista paneli:</h3>';
        echo '<ul>';
        foreach ($panels as $panel) {
            echo '<li>' . htmlspecialchars($panel['name']) . ' (' . $panel['manufacturer'] . ')</li>';
        }
        echo '</ul>';
        
        // Dodaj panel Skichała Trina, jeśli nie istnieje
        $found = false;
        foreach ($panels as $panel) {
            if (stripos($panel['name'], 'skichała') !== false || stripos($panel['name'], 'trina') !== false) {
                $found = true;
                break;
            }
        }
        
        if (!$found) {
            echo '<p>Dodaję panel "Skichała Trina"...</p>';
            
            $panels[] = [
                'id' => uniqid(),
                'name' => 'Skichała Trina',
                'power' => 400,
                'price' => 580,
                'efficiency' => 20.1,
                'warranty' => 25,
                'dimensions' => '1700x1000x35',
                'weight' => 21.0,
                'manufacturer' => 'Trina Solar',
                'type' => 'Monokrystaliczny',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ];
            
            $jsonData = json_encode($panels, JSON_PRETTY_PRINT);
            
            if (file_put_contents($panelsFile, $jsonData)) {
                echo '<p style="color: green;">Panel "Skichała Trina" został dodany.</p>';
            } else {
                echo '<p style="color: red;">Nie udało się dodać panelu "Skichała Trina"!</p>';
            }
        } else {
            echo '<p>Panel "Skichała Trina" już istnieje.</p>';
        }
    }
}

// Sprawdź API
echo '<h2>Test API</h2>';
echo '<p>Endpoint: <a href="https://www.oze-system.tech/api/panels" target="_blank">https://www.oze-system.tech/api/panels</a></p>';

$ch = curl_init('https://www.oze-system.tech/api/panels');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo '<p>Kod odpowiedzi: ' . $httpCode . '</p>';

if ($httpCode == 200) {
    echo '<p style="color: green;">API działa poprawnie.</p>';
    
    $apiPanels = json_decode($response, true);
    
    if ($apiPanels === null) {
        echo '<p style="color: red;">API zwróciło nieprawidłowy format JSON!</p>';
    } else {
        echo '<p>Liczba paneli zwróconych przez API: ' . count($apiPanels) . '</p>';
        
        // Sprawdź, czy panel Skichała Trina jest w odpowiedzi API
        $found = false;
        foreach ($apiPanels as $panel) {
            if (stripos($panel['name'], 'skichała') !== false || stripos($panel['name'], 'trina') !== false) {
                $found = true;
                break;
            }
        }
        
        if ($found) {
            echo '<p style="color: green;">Panel "Skichała Trina" jest widoczny w API.</p>';
        } else {
            echo '<p style="color: red;">Panel "Skichała Trina" NIE jest widoczny w API!</p>';
        }
    }
} else {
    echo '<p style="color: red;">API nie działa poprawnie!</p>';
}

// Wyświetl zawartość katalogu data
echo '<h2>Zawartość katalogu data</h2>';
if (is_dir($dataDir)) {
    $files = scandir($dataDir);
    echo '<ul>';
    foreach ($files as $file) {
        if ($file != '.' && $file != '..') {
            echo '<li>' . $file . ' (' . filesize($dataDir . '/' . $file) . ' bajtów)</li>';
        }
    }
    echo '</ul>';
} else {
    echo '<p>Katalog nie istnieje.</p>';
}

// Wyświetl informacje o PHP
echo '<h2>Informacje o PHP</h2>';
echo '<p>Wersja PHP: ' . phpversion() . '</p>';
echo '<p>Katalog tymczasowy: ' . sys_get_temp_dir() . '</p>';
echo '<p>Limit czasu wykonania: ' . ini_get('max_execution_time') . ' sekund</p>';
echo '<p>Limit pamięci: ' . ini_get('memory_limit') . '</p>';
echo '<p>Katalog bieżący: ' . getcwd() . '</p>';
?>
