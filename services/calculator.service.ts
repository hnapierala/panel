// Eksportujemy CalculatorService jako nazwany eksport
export const CalculatorService = {
  calculatePanelCount: (power: number, panelPower: number): number => {
    return Math.ceil(power / panelPower)
  },

  calculateInverterCount: (panelCount: number, panelsPerInverter: number): number => {
    return Math.ceil(panelCount / panelsPerInverter)
  },

  calculateTotalPower: (panelCount: number, panelPower: number): number => {
    return panelCount * panelPower
  },

  calculateMountingSystem: (panelCount: number, roofType: string): number => {
    const basePrice = roofType === "flat" ? 250 : 200
    return panelCount * basePrice
  },

  calculateTotalPrice: (components: any[]): number => {
    return components.reduce((total, component) => total + component.price * component.quantity, 0)
  },
}

// Eksportujemy również każdą funkcję indywidualnie
export const calculatePanelCount = CalculatorService.calculatePanelCount
export const calculateInverterCount = CalculatorService.calculateInverterCount
export const calculateTotalPower = CalculatorService.calculateTotalPower
export const calculateMountingSystem = CalculatorService.calculateMountingSystem
export const calculateTotalPrice = CalculatorService.calculateTotalPrice
