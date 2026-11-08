export type SignalType = 
  | 'VCC' 
  | 'GND' 
  | 'CAN_H' 
  | 'CAN_L' 
  | 'K_LINE' 
  | 'BOOT' 
  | 'IGNITION' 
  | 'SENSOR_5V' 
  | 'SENSOR_GND' 
  | 'INJECTOR_DRV' 
  | 'COIL_DRV' 
  | 'NC_RESERVED' 
  | 'UNDEFINED' 
  | 'SIGNAL';

export interface ConnectorPin {
  id: string;
  pinNumber: number;
  label: string;
  signalType: SignalType;
  voltage?: string;
  description?: string;
  color?: string;
  testCondition?: string;
  verified: boolean;
  verificationSource: string;
}

export interface Connector {
  id: string;
  name: string;
  totalPins: number;
  pins: ConnectorPin[];
  gridRows: number;
  gridCols: number;
  genericImage: boolean;
  imagePath?: string;
}

export interface EcuProfile {
  id: string;
  name: string;
  make: string;
  model: string;
  engine: string;
  microcontroller: string;
  connectorId: string;
  connectorMatch: 'exact' | 'similar' | 'unknown';
  matchWarning?: string;
  benchInstructions: {
    powerUp: string[];
    testPoints: string[];
    benchNotes: string[];
  };
  image?: string;
}

export interface ComponentReading {
  id: string;
  ecuId: string;
  targetType: 'pin' | 'pcb_component';
  targetId: string;
  name: string;
  testType: 'voltage' | 'resistance' | 'diode_mode';
  expectedValue: number;
  expectedDisplay: string;
  tolerance: string;
  unit: string;
  testCondition: string;
  verified: boolean;
  source: string;
  likelyCausesIfFailed: string[];
}

export interface MeasuredReading {
  readingId: string;
  measuredValue: number | null;
  status: 'PASS' | 'FAIL' | 'UNVERIFIED';
  measuredAt: string;
  notes?: string;
}

export interface DtcCode {
  code: string;
  system: 'Power Supply' | 'Injector Driver' | 'Sensor 5V Rail' | 'CAN Bus Communication' | 'Microcontroller' | 'Sensor Input';
  title: string;
  descriptionTagalog: string;
  descriptionEnglish: string;
  symptoms: string[];
  benchTestSteps: string[];
  hardwareCauses: string[];
  verified: boolean;
  source: string;
}

export interface PcbComponent {
  id: string;
  designator: string; // e.g. "D402", "IC101", "Q501"
  name: string;
  packageType: string;
  function: string;
  normalReadings: {
    diodeMode?: string;
    resistance?: string;
    voltageKeyOn?: string;
  };
  verified: boolean;
  source: string;
}

export interface BoardFailure {
  id: string;
  title: string;
  affectedEcuIds: string[];
  affectedComponentIds: string[];
  symptomTagalog: string;
  symptomEnglish: string;
  benchDiagnosticStep: string;
  probableCauses: string[];
  recommendedRepair: string;
  verified: boolean;
  source: string;
}
