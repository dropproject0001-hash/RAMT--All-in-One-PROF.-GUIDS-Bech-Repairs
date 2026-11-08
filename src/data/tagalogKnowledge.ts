export interface KnowledgeItem {
  id: string;
  keywords: string[];
  intent: string;
  answerTagalog: string;
  answerEnglish: string;
  actionCommand?: 'OPEN_PINOUT' | 'OPEN_DTC' | 'OPEN_READINGS' | 'OPEN_SCHEMATICS' | 'OPEN_SIMULATOR';
}

export const TAGALOG_KNOWLEDGE: KnowledgeItem[] = [
  {
    id: 'tag_bench_power',
    keywords: ['power up', 'bench power', 'paano i-power', '12v', 'paano mag bench', 'live power'],
    intent: 'BENCH_POWER_INSTRUCTION',
    answerTagalog: 'Para mag-bench power up sa ECU:\n1. Tiyaking gamitin ang stabilized DC bench power supply (13.8V, 3A-5A).\n2. Ikabit ang Ground (GND) leads sa mga Power Ground pins.\n3. Ikabit ang +12V Constant Battery line.\n4. I-switch ON ang +12V Ignition (IGSW / Terminal 15).\n5. Tignan ang Bench Current Draw: Normal idling draw ay nasa 0.15A hanggang 0.35A lamang.',
    answerEnglish: 'To bench power up the ECU: Connect stabilized 13.8V DC power supply, Ground to GND pins, +12V Battery line, and switch ON Ignition key input. Idling bench current should be between 0.15A and 0.35A.',
    actionCommand: 'OPEN_PINOUT',
  },
  {
    id: 'tag_5v_short',
    keywords: ['5v short', 'bumagsak 5v', 'walang 5v', 'vc short', '0v 5v', 'p0641', 'p0651'],
    intent: '5V_RAIL_TROUBLESHOOTING',
    answerTagalog: 'Kapag bumagsak sa 0V o mababa sa 4.5V ang 5V Sensor Rail (VC Pin):\n1. Tanggalin ang power supply.\n2. Gamitin ang Digital Multimeter (DMM) sa Diode Mode. Ilagay ang Pulang Probe sa GND pin at Itim na Probe sa 5V VC pin.\n3. Kapag 0.000V o may beeping continuity, may shorted component sa board—kadalasan ay shorted MLCC filter capacitor o sirang TLE4267 5V Regulator IC.',
    answerEnglish: 'If 5V Sensor Rail collapsed: Disconnect power, set DMM to Diode Mode, Red probe to GND, Black probe to 5V VC Pin. A reading of 0.000V indicates a shorted MLCC capacitor or blown TLE4267 regulator IC.',
    actionCommand: 'OPEN_READINGS',
  },
  {
    id: 'tag_can_bus',
    keywords: ['can bus', 'u0100', 'walang comm', 'no scanner', '60 ohms', 'can-h', 'can-l'],
    intent: 'CAN_BUS_DIAGNOSTICS',
    answerTagalog: 'Para sa CAN Bus communication test:\n1. Patayin ang power ng ECU.\n2. Sukatin ang resistance sa pagitan ng CAN-H at CAN-L pins gamit ang Multimeter. Dapat lumabas ay ~60.0 Ohms (dalawang 120Ω internal termination resistors in parallel).\n3. Kapag 120 Ohms, may putol na 120Ω resistor o trace sa board.\n4. Kapag OL o shorted (<10Ω), sira ang TJA1050 / SN65HVD230 CAN Transceiver IC.',
    answerEnglish: 'For CAN Bus diagnostics: Measure resistance between CAN-H and CAN-L with ECU unpowered. Normal reading is ~60 Ohms. 120 Ohms indicates a open resistor/trace; <10 Ohms indicates a shorted CAN Transceiver IC.',
    actionCommand: 'OPEN_SCHEMATICS',
  },
  {
    id: 'tag_component_readings',
    keywords: ['component readings', 'sukat', 'expected value', 'diode mode', 'resistance test', 'pass fail'],
    intent: 'COMPONENT_READING_HELP',
    answerTagalog: 'Sa Component Readings tab, maari mong i-verify ang bawat Pin at PCB Component laban sa verified OEM baseline readings. I-type lang ang iyong totoong sukat mula sa Multimeter at ipapakita ng RAMT kung PASS, FAIL, o UNVERIFIED ang iyong karga, kasama ang probable cause mula sa board repair database.',
    answerEnglish: 'In Component Readings tab, test each Pin and PCB Component against verified OEM baselines. Enter your multimeter reading to see PASS, FAIL, or UNVERIFIED result along with root cause diagnostics.',
    actionCommand: 'OPEN_READINGS',
  },
  {
    id: 'tag_injector_misfire',
    keywords: ['injector driver', 'p0201', 'p0202', 'misfire', 'mosfet', 'patay silindro', 'flyback diode'],
    intent: 'INJECTOR_HARDWARE_REPAIR',
    answerTagalog: 'Para sa Injector Driver Misfire (DTC P0201-P0204):\n1. Patayin ang power.\n2. Sukatin ang MOSFET body diode (Diode Mode: Red Probe sa GND, Black Probe sa Injector Output Pin). Dapat ay ~0.510V.\n3. Kapag 0.000V, pumutok ang N-Channel MOSFET driver (Q501-Q504).\n4. Suriin din ang katabing Schottky Flyback Diode (D401-D404) kung shorted.',
    answerEnglish: 'For Injector Driver faults (P0201-P0204): Set DMM to Diode Mode, Red to GND, Black to Injector Pin (~0.510V normal). 0.000V indicates blown MOSFET driver (Q501-Q504) or shorted flyback diode.',
    actionCommand: 'OPEN_SCHEMATICS',
  },
];
