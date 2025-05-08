/**
 * Utility functions for working with localStorage
 */

// Stałe dla kluczy localStorage
export const STORAGE_KEYS = {
  PANELS: "oze-system-solar-panels-data",
  INVERTERS: "oze-system-inverters-data",
  CONSTRUCTIONS: "oze-system-constructions-data",
  ACCESSORIES: "oze-system-accessories-data",
  LABOR: "oze-system-labor-data",
  RATES: "oze-system-rates-data",
  PRICES: "oze-system-prices-data",
  AUTH_TOKEN: "auth-token",
  USER_DATA: "user-data",
}

// Stare klucze (dla kompatybilności wstecznej)
export const OLD_STORAGE_KEYS = {
  PANELS: "solar-panels-data",
  INVERTERS: "inverters-data",
  CONSTRUCTIONS: "constructions-data",
  ACCESSORIES: "accessories-data",
  LABOR: "labor-data",
  RATES: "rates-data",
  PRICES: "prices-data",
}

// Dane domyślne dla różnych typów danych
export const DEFAULT_DATA = {
  PANELS: [
    {
      id: "1",
      name: "Panel Longi LR4-72HPH-455M",
      power: 455,
      price: 650,
      efficiency: 20.9,
      warranty: 25,
      dimensions: "2094x1038x35",
      weight: 24.5,
      manufacturer: "Longi Solar",
      type: "Monokrystaliczny",
    },
    {
      id: "2",
      name: "Panel JA Solar JAM60S20-380/MR",
      power: 380,
      price: 550,
      efficiency: 20.2,
      warranty: 25,
      dimensions: "1776x1052x35",
      weight: 20.2,
      manufacturer: "JA Solar",
      type: "Monokrystaliczny",
    },
    {
      id: "3",
      name: "Panel Jinko Solar JKM410M-54HL4-V",
      power: 410,
      price: 600,
      efficiency: 20.4,
      warranty: 25,
      dimensions: "1724x1134x30",
      weight: 22.5,
      manufacturer: "Jinko Solar",
      type: "Monokrystaliczny",
    },
  ],
  INVERTERS: [
    {
      id: "1",
      name: "Falownik Fronius Symo 8.2-3-M",
      power: 8.2,
      price: 9500,
      efficiency: 98.1,
      warranty: 5,
      phases: 3,
      manufacturer: "Fronius",
    },
    {
      id: "2",
      name: "Falownik SolarEdge SE5K-RWS",
      power: 5,
      price: 7200,
      efficiency: 97.6,
      warranty: 12,
      phases: 3,
      manufacturer: "SolarEdge",
    },
    {
      id: "3",
      name: "Falownik Huawei SUN2000-10KTL-M1",
      power: 10,
      price: 8900,
      efficiency: 98.6,
      warranty: 10,
      phases: 3,
      manufacturer: "Huawei",
    },
  ],
  CONSTRUCTIONS: [
    {
      id: "1",
      name: "Konstrukcja dachowa skośna",
      price: 250,
      type: "Dach skośny",
    },
    {
      id: "2",
      name: "Konstrukcja dachowa płaska",
      price: 300,
      type: "Dach płaski",
    },
    {
      id: "3",
      name: "Konstrukcja gruntowa",
      price: 350,
      type: "Grunt",
    },
  ],
  ACCESSORIES: [
    {
      id: "1",
      name: "Optymalizator mocy SolarEdge P370",
      price: 350,
      category: "Optymalizatory",
    },
    {
      id: "2",
      name: "Zabezpieczenie AC",
      price: 250,
      category: "Zabezpieczenia",
    },
    {
      id: "3",
      name: "Zabezpieczenie DC",
      price: 200,
      category: "Zabezpieczenia",
    },
    {
      id: "4",
      name: "Kabel solarny 4mm2 (1m)",
      price: 5,
      category: "Okablowanie",
    },
  ],
  LABOR: [
    {
      id: "1",
      name: "Montaż instalacji do 10kW",
      price: 1500,
      category: "Montaż",
    },
    {
      id: "2",
      name: "Montaż instalacji powyżej 10kW",
      price: 2500,
      category: "Montaż",
    },
    {
      id: "3",
      name: "Projekt instalacji",
      price: 1000,
      category: "Dokumentacja",
    },
    {
      id: "4",
      name: "Zgłoszenie do zakładu energetycznego",
      price: 500,
      category: "Dokumentacja",
    },
  ],
  RATES: [
    {
      id: "1",
      name: "Stawka VAT dla osób fizycznych",
      value: 8,
      type: "percentage",
    },
    {
      id: "2",
      name: "Stawka VAT dla firm",
      value: 23,
      type: "percentage",
    },
    {
      id: "3",
      name: "Marża standardowa",
      value: 15,
      type: "percentage",
    },
  ],
  PRICES: [
    {
      id: "1",
      name: "Cena energii",
      value: 0.75,
      unit: "zł/kWh",
    },
    {
      id: "2",
      name: "Opłata dystrybucyjna",
      value: 0.25,
      unit: "zł/kWh",
    },
  ],
}

/**
 * Sprawdza, czy localStorage jest dostępne
 */
export const isLocalStorageAvailable = () => {
  try {
    const testKey = "test-localStorage"
    localStorage.setItem(testKey, testKey)
    localStorage.removeItem(testKey)
    return true
  } catch (e) {
    console.error("localStorage nie jest dostępny:", e)
    return false
  }
}

/**
 * Wyświetla zawartość localStorage w konsoli
 */
export const printLocalStorage = () => {
  if (!isLocalStorageAvailable()) {
    console.error("localStorage nie jest dostępny")
    return
  }

  console.log("=== ZAWARTOŚĆ LOCALSTORAGE ===")
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key) {
      try {
        const value = localStorage.getItem(key)
        console.log(`${key}: ${value?.substring(0, 50)}${value && value.length > 50 ? "..." : ""}`)
      } catch (e) {
        console.error(`Błąd odczytu klucza ${key}:`, e)
      }
    }
  }
  console.log("==============================")
}

/**
 * Zapisuje dane do localStorage
 * @param key Klucz w localStorage
 * @param data Dane do zapisania
 * @param oldKey Stary klucz (dla kompatybilności wstecznej)
 */
export const saveToStorage = (key: string, data: any, oldKey?: string) => {
  if (!isLocalStorageAvailable()) {
    console.error(`Nie można zapisać danych pod kluczem ${key} - localStorage nie jest dostępny`)
    return false
  }

  try {
    // Zapisz dane w formacie JSON
    const jsonData = JSON.stringify(data)
    localStorage.setItem(key, jsonData)

    // Jeśli podano stary klucz, zapisz również pod starym kluczem
    if (oldKey) {
      localStorage.setItem(oldKey, jsonData)
    }

    console.log(`Zapisano dane pod kluczem ${key}:`, data)
    return true
  } catch (e) {
    console.error(`Błąd zapisywania danych pod kluczem ${key}:`, e)
    return false
  }
}

/**
 * Wczytuje dane z localStorage
 * @param key Klucz w localStorage
 * @param defaultData Dane domyślne
 * @param oldKey Stary klucz (dla kompatybilności wstecznej)
 */
export const loadFromStorage = (key: string, defaultData: any, oldKey?: string) => {
  if (!isLocalStorageAvailable()) {
    console.warn(`Nie można wczytać danych z klucza ${key} - localStorage nie jest dostępny. Używam danych domyślnych.`)
    return defaultData
  }

  try {
    // Próba wczytania danych z nowego klucza
    let jsonData = localStorage.getItem(key)

    // Jeśli nie znaleziono danych pod nowym kluczem, a podano stary klucz, spróbuj wczytać z starego klucza
    if (!jsonData && oldKey) {
      jsonData = localStorage.getItem(oldKey)

      // Jeśli znaleziono dane pod starym kluczem, zapisz je również pod nowym kluczem
      if (jsonData) {
        localStorage.setItem(key, jsonData)
        console.log(`Zmigrowano dane z klucza ${oldKey} do ${key}`)
      }
    }

    // Jeśli znaleziono dane, sparsuj je i zwróć
    if (jsonData) {
      const parsedData = JSON.parse(jsonData)
      console.log(`Wczytano dane z klucza ${key}:`, parsedData)
      return parsedData
    }

    // Jeśli nie znaleziono danych, zwróć dane domyślne
    console.log(`Nie znaleziono danych pod kluczem ${key}. Używam danych domyślnych:`, defaultData)
    return defaultData
  } catch (e) {
    console.error(`Błąd wczytywania danych z klucza ${key}:`, e)
    return defaultData
  }
}

/**
 * Usuwa dane z localStorage
 * @param key Klucz w localStorage
 * @param oldKey Stary klucz (dla kompatybilności wstecznej)
 */
export const removeFromStorage = (key: string, oldKey?: string) => {
  if (!isLocalStorageAvailable()) {
    console.error(`Nie można usunąć danych pod kluczem ${key} - localStorage nie jest dostępny`)
    return false
  }

  try {
    localStorage.removeItem(key)

    // Jeśli podano stary klucz, usuń również dane pod starym kluczem
    if (oldKey) {
      localStorage.removeItem(oldKey)
    }

    console.log(`Usunięto dane pod kluczem ${key}`)
    return true
  } catch (e) {
    console.error(`Błąd usuwania danych pod kluczem ${key}:`, e)
    return false
  }
}

/**
 * Czyści localStorage z danych aplikacji, zachowując dane uwierzytelniania
 */
export const clearAppData = () => {
  if (!isLocalStorageAvailable()) {
    console.error("Nie można wyczyścić danych aplikacji - localStorage nie jest dostępny")
    return false
  }

  try {
    // Zapisz dane uwierzytelniania
    const authToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA)

    // Wyczyść localStorage
    localStorage.clear()

    // Przywróć dane uwierzytelniania
    if (authToken) localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, authToken)
    if (userData) localStorage.setItem(STORAGE_KEYS.USER_DATA, userData)

    console.log("Wyczyszczono dane aplikacji, zachowując dane uwierzytelniania")
    return true
  } catch (e) {
    console.error("Błąd czyszczenia danych aplikacji:", e)
    return false
  }
}

/**
 * Czyści dane uwierzytelniania z localStorage
 */
export const clearAuthData = () => {
  if (!isLocalStorageAvailable()) {
    console.error("Nie można wyczyścić danych uwierzytelniania - localStorage nie jest dostępny")
    return false
  }

  try {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER_DATA)
    console.log("Wyczyszczono dane uwierzytelniania")
    return true
  } catch (e) {
    console.error("Błąd czyszczenia danych uwierzytelniania:", e)
    return false
  }
}
