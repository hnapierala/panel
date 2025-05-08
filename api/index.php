<?php
/**
 * Główny plik API dla aplikacji OZE System
 * 
 * Ten plik obsługuje wszystkie żądania API i kieruje je do odpowiednich funkcji.
 */

// Ustawienia nagłówków
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Obsługa żądania OPTIONS (preflight dla CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Ścieżka do katalogu z danymi
$dataDir = __DIR__ . '/data';

// Upewnij się, że katalog istnieje
if (!file_exists($dataDir)) {
    mkdir($dataDir, 0755, true);
}

// Pobierz ścieżkę z URL
$path = isset($_GET['path']) ? $_GET['path'] : '';
$pathParts = explode('/', trim($path, '/'));

// Pobierz metodę HTTP
$method = $_SERVER['REQUEST_METHOD'];

// Pobierz dane z żądania
$requestData = json_decode(file_get_contents('php://input'), true);

// Obsługa różnych ścieżek API
try {
    // Inicjalizacja danych
    if ($path === 'initialize' && $method === 'POST') {
        initializeData();
        sendResponse(['success' => true, 'message' => 'Dane zostały pomyślnie zainicjalizowane']);
    }
    
    // Obsługa żądań dla konkretnych typów danych
    if (count($pathParts) > 0) {
        $dataType = $pathParts[0];
        
        // Sprawdź, czy typ danych jest prawidłowy
        if (!isValidDataType($dataType)) {
            sendError('Nieprawidłowy typ danych', 400);
        }
        
        // Pobieranie wszystkich elementów
        if (count($pathParts) === 1 && $method === 'GET') {
            $data = getData($dataType);
            sendResponse($data);
        }
        
        // Dodawanie nowego elementu
        if (count($pathParts) === 1 && $method === 'POST') {
            $newItem = addItem($dataType, $requestData);
            sendResponse($newItem, 201);
        }
        
        // Aktualizacja wszystkich elementów
        if (count($pathParts) === 1 && $method === 'PUT') {
            $success = updateAllItems($dataType, $requestData);
            sendResponse(['success' => $success]);
        }
        
        // Operacje na pojedynczym elemencie
        if (count($pathParts) === 2) {
            $id = $pathParts[1];
            
            // Pobieranie pojedynczego elementu
            if ($method === 'GET') {
                $item = getItem($dataType, $id);
                
                if ($item === null) {
                    sendError('Element nie został znaleziony', 404);
                }
                
                sendResponse($item);
            }
            
            // Aktualizacja pojedynczego elementu
            if ($method === 'PUT') {
                $success = updateItem($dataType, $id, $requestData);
                
                if (!$success) {
                    sendError('Element nie został znaleziony', 404);
                }
                
                sendResponse(['success' => true]);
            }
            
            // Usuwanie pojedynczego elementu
            if ($method === 'DELETE') {
                $success = deleteItem($dataType, $id);
                
                if (!$success) {
                    sendError('Element nie został znaleziony', 404);
                }
                
                sendResponse(['success' => true]);
            }
        }
    }
    
    // Jeśli doszliśmy tutaj, to znaczy, że nie znaleziono pasującej ścieżki
    sendError('Nie znaleziono zasobu', 404);
} catch (Exception $e) {
    sendError('Wystąpił błąd: ' . $e->getMessage(), 500);
}

/**
 * Sprawdza, czy typ danych jest prawidłowy
 */
function isValidDataType($dataType) {
    $validTypes = ['panels', 'inverters', 'constructions', 'accessories', 'labor', 'rates', 'prices'];
    return in_array($dataType, $validTypes);
}

/**
 * Pobiera ścieżkę do pliku JSON dla danego typu danych
 */
function getDataFilePath($dataType) {
    global $dataDir;
    return $dataDir . '/' . $dataType . '.json';
}

/**
 * Pobiera dane z pliku JSON
 */
function getData($dataType) {
    $filePath = getDataFilePath($dataType);
    
    if (!file_exists($filePath)) {
        return [];
    }
    
    $jsonData = file_get_contents($filePath);
    return json_decode($jsonData, true) ?: [];
}

/**
 * Zapisuje dane do pliku JSON
 */
function saveData($dataType, $data) {
    $filePath = getDataFilePath($dataType);
    return file_put_contents($filePath, json_encode($data, JSON_PRETTY_PRINT));
}

/**
 * Pobiera pojedynczy element
 */
function getItem($dataType, $id) {
    $data = getData($dataType);
    
    foreach ($data as $item) {
        if (isset($item['id']) && $item['id'] === $id) {
            return $item;
        }
    }
    
    return null;
}

/**
 * Dodaje nowy element
 */
function addItem($dataType, $item) {
    $data = getData($dataType);
    
    // Dodaj ID, jeśli nie istnieje
    if (!isset($item['id'])) {
        $item['id'] = uniqid();
    }
    
    // Dodaj daty utworzenia i aktualizacji
    $now = date('Y-m-d H:i:s');
    $item['created_at'] = $now;
    $item['updated_at'] = $now;
    
    // Dodaj element do danych
    $data[] = $item;
    
    // Zapisz dane
    saveData($dataType, $data);
    
    return $item;
}

/**
 * Aktualizuje pojedynczy element
 */
function updateItem($dataType, $id, $updatedItem) {
    $data = getData($dataType);
    $found = false;
    
    foreach ($data as $key => $item) {
        if (isset($item['id']) && $item['id'] === $id) {
            // Zachowaj ID i datę utworzenia
            $updatedItem['id'] = $id;
            
            if (isset($item['created_at'])) {
                $updatedItem['created_at'] = $item['created_at'];
            }
            
            // Aktualizuj datę aktualizacji
            $updatedItem['updated_at'] = date('Y-m-d H:i:s');
            
            // Aktualizuj element
            $data[$key] = array_merge($item, $updatedItem);
            $found = true;
            break;
        }
    }
    
    if (!$found) {
        return false;
    }
    
    // Zapisz dane
    saveData($dataType, $data);
    
    return true;
}

/**
 * Usuwa pojedynczy element
 */
function deleteItem($dataType, $id) {
    $data = getData($dataType);
    $found = false;
    
    foreach ($data as $key => $item) {
        if (isset($item['id']) && $item['id'] === $id) {
            // Usuń element
            unset($data[$key]);
            $found = true;
            break;
        }
    }
    
    if (!$found) {
        return false;
    }
    
    // Przeindeksuj tablicę
    $data = array_values($data);
    
    // Zapisz dane
    saveData($dataType, $data);
    
    return true;
}

/**
 * Aktualizuje wszystkie elementy
 */
function updateAllItems($dataType, $items) {
    // Zapisz dane
    saveData($dataType, $items);
    
    return true;
}

/**
 * Inicjalizuje dane domyślne
 */
function initializeData() {
    // Dane domyślne
    $defaultData = [
        'panels' => [
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
        ],
        'inverters' => [
            [
                'id' => '1',
                'name' => 'Falownik Fronius Symo 8.2-3-M',
                'power' => 8.2,
                'price' => 9500,
                'efficiency' => 98.1,
                'warranty' => 5,
                'phases' => 3,
                'manufacturer' => 'Fronius',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'id' => '2',
                'name' => 'Falownik SolarEdge SE5K-RWS',
                'power' => 5,
                'price' => 7200,
                'efficiency' => 97.6,
                'warranty' => 12,
                'phases' => 3,
                'manufacturer' => 'SolarEdge',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'id' => '3',
                'name' => 'Falownik Huawei SUN2000-10KTL-M1',
                'power' => 10,
                'price' => 8900,
                'efficiency' => 98.6,
                'warranty' => 10,
                'phases' => 3,
                'manufacturer' => 'Huawei',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
        ],
        'constructions' => [
            [
                'id' => '1',
                'name' => 'Konstrukcja dachowa skośna',
                'price' => 250,
                'type' => 'Dach skośny',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'id' => '2',
                'name' => 'Konstrukcja dachowa płaska',
                'price' => 300,
                'type' => 'Dach płaski',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'id' => '3',
                'name' => 'Konstrukcja gruntowa',
                'price' => 350,
                'type' => 'Grunt',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
        ],
        'accessories' => [
            [
                'id' => '1',
                'name' => 'Optymalizator mocy SolarEdge P370',
                'price' => 350,
                'category' => 'Optymalizatory',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'id' => '2',
                'name' => 'Zabezpieczenie AC',
                'price' => 250,
                'category' => 'Zabezpieczenia',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'id' => '3',
                'name' => 'Zabezpieczenie DC',
                'price' => 200,
                'category' => 'Zabezpieczenia',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'id' => '4',
                'name' => 'Kabel solarny 4mm2 (1m)',
                'price' => 5,
                'category' => 'Okablowanie',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
        ],
        'labor' => [
            [
                'id' => '1',
                'name' => 'Montaż instalacji do 10kW',
                'price' => 1500,
                'category' => 'Montaż',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'id' => '2',
                'name' => 'Montaż instalacji powyżej 10kW',
                'price' => 2500,
                'category' => 'Montaż',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'id' => '3',
                'name' => 'Projekt instalacji',
                'price' => 1000,
                'category' => 'Dokumentacja',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'id' => '4',
                'name' => 'Zgłoszenie do zakładu energetycznego',
                'price' => 500,
                'category' => 'Dokumentacja',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
        ],
        'rates' => [
            [
                'id' => '1',
                'name' => 'Stawka VAT dla osób fizycznych',
                'value' => 8,
                'type' => 'percentage',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'id' => '2',
                'name' => 'Stawka VAT dla firm',
                'value' => 23,
                'type' => 'percentage',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'id' => '3',
                'name' => 'Marża standardowa',
                'value' => 15,
                'type' => 'percentage',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
        ],
        'prices' => [
            [
                'id' => '1',
                'name' => 'Cena energii',
                'value' => 0.75,
                'unit' => 'zł/kWh',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'id' => '2',
                'name' => 'Opłata dystrybucyjna',
                'value' => 0.25,
                'unit' => 'zł/kWh',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
        ],
    ];
    
    // Zapisz dane domyślne
    foreach ($defaultData as $dataType => $data) {
        saveData($dataType, $data);
    }
    
    return true;
}

/**
 * Wysyła odpowiedź JSON
 */
function sendResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data);
    exit;
}

/**
 * Wysyła błąd JSON
 */
function sendError($message, $statusCode = 500) {
    http_response_code($statusCode);
    echo json_encode(['error' => $message]);
    exit;
}
