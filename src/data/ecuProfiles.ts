import { EcuProfile } from '../types/ecu';

export const ECU_PROFILES: Record<string, EcuProfile> = {
  denso_1gd_hilux: {
    id: 'denso_1gd_hilux',
    name: 'Denso 96-Pin 1GD-FTV / 2GD-FTV Engine ECU',
    make: 'Toyota',
    model: 'Hilux / Fortuner / Innova 2.8L & 2.4L Diesel',
    engine: '1GD-FTV / 2GD-FTV Common Rail Turbo Diesel',
    microcontroller: 'Renesas RH850 / SH72544',
    connectorId: 'denso_96pin_1gd',
    connectorMatch: 'exact',
    benchInstructions: {
      powerUp: [
        'Ikabit ang GND Bench Lead sa Pin 3 (E01) at Pin 4 (E02).',
        'Ikabit ang +12V Constant Power Supply sa Pin 1 (+B).',
        'I-switch ON ang Bench Power (+12V) sa Pin 2 (IGSW).',
        'I-verify ang kasalukuyang bench current draw: 0.15A hanggang 0.28A (Normal Standby).',
      ],
      testPoints: [
        'Test Point VC (Pin 41): Dapat eksaktong 5.00V ±0.05V ang lalabas.',
        'Test Point CAN-H (Pin 25) vs CAN-L (Pin 26): Transceiver bus resistance dapat 60 Ohms (dalawang 120Ω resistors sa CAN network).',
        'Test Point Injector High-Side Drivers (Pins 60-63): Diode mode reading to GND dapat ~0.520V.',
      ],
      benchNotes: [
        'Siguraduhing naka-ground nang maayos ang ECU metal housing bago mag-bench power up.',
        'Kapag ang 5V VC line sa Pin 41 ay pumalo ng 0V o 1.2V lamang, may internal short sa TLE4267 5V Regulator IC o may shorted flyback diode.',
      ],
    },
  },

  denso_1kd_prado: {
    id: 'denso_1kd_prado',
    name: 'Denso 64-Pin 1KD-FTV / 2KD-FTV Engine ECU',
    make: 'Toyota',
    model: 'Hilux Vigo / Fortuner / Prado 3.0L D-4D',
    engine: '1KD-FTV / 2KD-FTV Direct Injection Diesel',
    microcontroller: 'Renesas SH7058 / SH7055',
    connectorId: 'denso_64pin',
    connectorMatch: 'exact',
    benchInstructions: {
      powerUp: [
        'Ikabit ang GND Ground Leads sa Pin 1 (E01) at Pin 4 (E02).',
        'Ikabit ang +12V Constant Power sa Pin 2 (+B).',
        'I-apply ang +12V Ignition Power sa Pin 3 (IGSW).',
        'I-verify ang bench idle current: ~0.18A.',
      ],
      testPoints: [
        'Pin 5 (VC 5V Sensor Rail): Suriin kung 4.95V-5.05V.',
        'Pin 21 (K-Line SIL): Normal pullup voltage 12V kapag idle.',
        'Pin 11 (CAN-H) at Pin 12 (CAN-L): Differential voltage check (CAN-H = 2.7V, CAN-L = 2.3V).',
      ],
      benchNotes: [
        'Iwasan ang pag-short ng Pin 5 (VC) sa Pin 1/4 (GND) upang hindi masira ang internal 5V regulator.',
      ],
    },
  },

  continental_simos18: {
    id: 'continental_simos18',
    name: 'Continental Simos 18.1 / 18.2 Engine ECU',
    make: 'Volkswagen / Audi / Skoda',
    model: 'Golf Mk7 GTI / R, Audi S3 2.0 TSI',
    engine: '2.0L TFSI / TSI Gen 3 EA888',
    microcontroller: 'Infineon Tricore SAK-TC1791',
    connectorId: 'continental_96pin',
    connectorMatch: 'exact',
    benchInstructions: {
      powerUp: [
        'Ikabit ang GND Power Leads sa Pin 3 at Pin 5 (Terminal 31).',
        'Ikabit ang +12V Permanent Battery Power sa Pin 1 (Terminal 30).',
        'I-apply ang +12V Ignition Control sa Pin 2 (Terminal 15).',
        'Bench current consumption: ~0.35A hanggang 0.42A.',
      ],
      testPoints: [
        'Sensor Rail 1 (Pin 87) at Rail 2 (Pin 88): Siguraduhing parehong 5.00V ±0.02V.',
        'Drive CAN-H (Pin 6) & CAN-L (Pin 7): 60Ω resistance check sa pagitan ng CAN-H at CAN-L.',
      ],
      benchNotes: [
        'Kapag sumobra sa 0.60A ang bench current, may umiinit na high-side MOSFET o main processor fault.',
      ],
    },
  },

  delphi_dcm37: {
    id: 'delphi_dcm37',
    name: 'Delphi DCM3.7 Engine ECU',
    make: 'Hyundai / Kia / Chevrolet',
    model: 'Porter II / Bongo III / H100 2.5 CRDi',
    engine: '2.5L D4CB CRDi Diesel',
    microcontroller: 'Renesas SH72544 / NXP MPC562',
    connectorId: 'delphi_64pin',
    connectorMatch: 'exact',
    benchInstructions: {
      powerUp: [
        'Ikabit ang GND Power Leads sa Pin 3 at Pin 4.',
        'Ikabit ang +12V Main Relay Input sa Pin 1.',
        'I-apply ang +12V Key Ignition Input sa Pin 5.',
        'Normal bench current draw: 0.20A - 0.30A.',
      ],
      testPoints: [
        'Pin 22 (5V Sensor Output): Sukatin kung 5.00V.',
        'CAN-H (Pin 15) & CAN-L (Pin 16): Verify CAN transceiver communication waveform.',
      ],
      benchNotes: [
        'Gamitin ang DMM diode mode sa Pin 22 to GND (~0.480V) para i-check kung shorted ang 5V rail.',
      ],
    },
  },

  bosch_md1_euro6: {
    id: 'bosch_md1_euro6',
    name: 'Bosch MD1CS018 / MD1CS003 Euro6 Engine ECU',
    make: 'Isuzu / Ford / Peugeot',
    model: 'D-Max 1.9 Ddi / Ford Ranger 2.0 EcoBlue',
    engine: '4JJ3-TCX 3.0 / RZ4E 1.9 / Panther 2.0',
    microcontroller: 'Infineon Aurix TC298 / TC397',
    connectorId: 'bosch_md1_112pin',
    connectorMatch: 'exact',
    benchInstructions: {
      powerUp: [
        'Ikabit ang GND Leads sa Pin 3 (Terminal 31).',
        'Ikabit ang +12V Constant Power sa Pin 1 (Terminal 30).',
        'Ikabit ang +12V Switched Ignition sa Pin 5 (Terminal 15).',
        'Bench current consumption: ~0.45A.',
      ],
      testPoints: [
        'Pin 54 (5V Sensor Rail A) at Pin 55 (5V Sensor Rail B): Sukatin ang 5.00V reference.',
        'Pin 12 (CAN-H) at Pin 13 (CAN-L): Check CAN bus resistance (60Ω).',
      ],
      benchNotes: [
        'Ang MD1 ECU ay may multi-channel power management IC (PMIC). Siguraduhing stabilized 13.8V ang bench power supply.',
      ],
    },
  },

  bosch_med17_5: {
    id: 'bosch_med17_5',
    name: 'Bosch MED17.5 Engine ECU',
    make: 'Volkswagen / Audi',
    model: 'Golf Mk6 GTI / Passat B7 1.8T & 2.0T',
    engine: '1.8L / 2.0L TSI EA888 Gen2',
    microcontroller: 'Infineon Tricore TC1766 / TC1767',
    connectorId: 'edc17_connector',
    connectorMatch: 'similar',
    matchWarning: 'Shared Bosch 94-Pin EDC17/MED17 architecture. Confirm OEM harness pin layout.',
    benchInstructions: {
      powerUp: [
        'Ikabit ang GND sa Pin 1.',
        'Ikabit ang +12V Constant sa Pin 3.',
        'Ikabit ang +12V Ignition sa Pin 5.',
        'Bench current: 0.22A.',
      ],
      testPoints: [
        'Pin 83 (5V Sensor Output): Must be 5.00V.',
        'Pin 6 (CAN-H) at Pin 7 (CAN-L): CAN bus signal check.',
      ],
      benchNotes: [
        'Pareho ang connector physical housing sa EDC17, suriin ang schematic bago i-power up.',
      ],
    },
  },

  bosch_edc16c39: {
    id: 'bosch_edc16c39',
    name: 'Bosch EDC16C39 Engine ECU',
    make: 'Isuzu / Hyundai / Kia / Nissan',
    model: 'D-Max 3.0 4JJ1 / Starex 2.5 CRDi / Navara D22',
    engine: '4JJ1-TC / D4CB CRDi / YD25DDTi',
    microcontroller: 'Motorola MPC562 / MPC564',
    connectorId: 'edc17_connector',
    connectorMatch: 'similar',
    matchWarning: 'Shares Bosch multi-plug housing. Verify Ground offsets (Pin 1 vs Pin 4/5).',
    benchInstructions: {
      powerUp: [
        'Ikabit ang GND sa Pin 1.',
        'Ikabit ang +12V Power sa Pin 3 at Pin 5.',
        'Bench current: 0.25A.',
      ],
      testPoints: [
        'Pin 43: K-Line diagnostic line (12V pullup).',
        'Pin 83: 5V Sensor supply.',
      ],
      benchNotes: [
        'Ang EDC16C39 ay naggagamit din ng K-Line sa Pin 43 para sa lumang diagnostic scanners.',
      ],
    },
  },

  bosch_me7_5: {
    id: 'bosch_me7_5',
    name: 'Bosch ME7.5 Engine ECU',
    make: 'Volkswagen / Audi',
    model: 'Golf Mk4 1.8T / Audi A4 B6 1.8T',
    engine: '1.8T 20V Turbo (AUM / AUQ / BAM)',
    microcontroller: 'Infineon C167 / ST10F275',
    connectorId: 'edc17_connector',
    connectorMatch: 'similar',
    matchWarning: 'Shares Bosch 94-Pin physical housing layout. K-Line diagnostic active on Pin 43.',
    benchInstructions: {
      powerUp: [
        'Ikabit ang GND sa Pin 1.',
        'Ikabit ang +12V Power sa Pin 3.',
        'Ikabit ang +12V Ignition sa Pin 5.',
        'Bench current: 0.18A.',
      ],
      testPoints: [
        'Pin 43 (K-Line): Diagnostic communication line.',
        'Pin 83 (5V Sensor Supply): 5.0V reference.',
      ],
      benchNotes: [
        'Gamitin ang K-Line scanner kung walang CAN response sa bench test.',
      ],
    },
  },

  marelli_iaw_9gf: {
    id: 'marelli_iaw_9gf',
    name: 'Magneti Marelli IAW 9GF Engine ECU',
    make: 'Fiat / Jeep',
    model: 'Fiat Uno / Palio / Grand Siena 1.4L',
    engine: '1.4L FIRE Evo / E.torQ',
    microcontroller: 'SPC564A80 / NXP MPC564',
    connectorId: 'marelli_iaw_9gf',
    connectorMatch: 'exact',
    benchInstructions: {
      powerUp: [
        'Ikabit ang GND sa Pin 2.',
        'Ikabit ang +12V Constant Power sa Pin 1.',
        'Ikabit ang +12V Ignition sa Pin 4.',
        'Bench current: ~0.20A.',
      ],
      testPoints: [
        'Pin 45 (5V Sensor Output): Verify 5.0V rail voltage.',
        'Pin 18 (CAN-H) at Pin 19 (CAN-L): Check CAN transceiver lines.',
      ],
      benchNotes: [
        'Tiyaking eksaktong 80-pin Marelli connector ang nakakabit, huwag gumamit ng Delphi adapter.',
      ],
    },
  },

  keihin_pgm_fi: {
    id: 'keihin_pgm_fi',
    name: 'Keihin PGM-FI 66-Pin Engine ECU',
    make: 'Honda',
    model: 'Civic FD 1.8 / City GM2 / Fit GE8',
    engine: 'R18A / L15A i-VTEC',
    microcontroller: 'Renesas SH7058 / OKI',
    connectorId: 'keihin_pgm_fi',
    connectorMatch: 'exact',
    benchInstructions: {
      powerUp: [
        'Ikabit ang GND Leads sa Pin 2 (PG1) at Pin 3 (PG2).',
        'Ikabit ang +12V Battery Power sa Pin 1 (IGP).',
        'I-switch ON ang +12V Ignition Signal sa Pin 9 (IG1).',
        'Bench current draw: ~0.19A.',
      ],
      testPoints: [
        'Pin 30 (VCC1 5V Sensor Supply): Test for 5.0V stability.',
        'Pin 14 (CAN-H) at Pin 15 (CAN-L): Measure 60Ω bus impedance.',
      ],
      benchNotes: [
        'Generic connector image ang ipinapakita para sa Keihin 66-Pin layout. Tiyakin ang pin numbering sa plug.',
      ],
    },
  },

  nissan_mec_f42: {
    id: 'nissan_mec_f42',
    name: 'Nissan Hitachi MEC-F42 40-Pin Engine ECU',
    make: 'Nissan',
    model: 'Navara D40 / X-Trail T30 / Teana J31',
    engine: 'QR25DE / YD25DDTi',
    microcontroller: 'Renesas SH7055 / SH7058',
    connectorId: 'nissan_f42',
    connectorMatch: 'exact',
    benchInstructions: {
      powerUp: [
        'Ikabit ang GND sa Pin 2 (ECM Ground).',
        'Ikabit ang +12V ECM Power Relay Output sa Pin 1.',
        'I-switch ON ang +12V Ignition Input sa Pin 10.',
        'Bench current consumption: ~0.22A.',
      ],
      testPoints: [
        'Pin 24 (VCC 5V Output): Check 5.0V sensor reference.',
        'Pin 11 (CAN-H) at Pin 12 (CAN-L): Diagnostic CAN lines.',
      ],
      benchNotes: [
        'Exact 40-pin grid (4 rows x 10 columns).',
      ],
    },
  },
};
