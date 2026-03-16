// HCS12 Fan Controller Build Guide — data constants
// AUTOTECH 4EC3 · McMaster · Mina + Jerry Zhang
// Hardware: 2× EVALH1 Trainer Boards (Controller + Receiver) over CAN bus

export interface Register {
  name: string;
  address: string;
  value: string;
  purpose: string;
}

export interface Phase {
  id: string;
  number: number;
  title: string;
  module: string;
  objectives: string[];
  registers: Register[];
  code: string;
  wiring: string[];
  testSteps: string[];
}

export interface PinMapping {
  pin: string;
  function: string;
  direction: string;
  notes: string;
}

export interface QuickRef {
  pinMap: PinMapping[];
  keyRegisters: { name: string; address: string; description: string }[];
  memoryMap: { region: string; range: string; usage: string }[];
}

export const QUICK_REFERENCE: QuickRef = {
  pinMap: [
    { pin: 'PAD05 (AN5)', function: 'Potentiometer Input', direction: 'Input', notes: 'ATD Ch5 — EVALH1 onboard POT1 wired to AN05 as voltage divider (Receiver board)' },
    { pin: 'PAD07 (AN7)', function: 'Temperature Sensor', direction: 'Input', notes: 'EVALH1 onboard MCP9701A (U3) → 19.5mV/°C, ~4 counts per °C on 10-bit ADC (not used in project, but available)' },
    { pin: 'PP4 (H1 pin 17)', function: 'PWM Ch4 / MENA1', direction: 'Output', notes: 'EVALH1: L293D H-bridge Enable A → Motor Channel A speed via PWM (Receiver board)' },
    { pin: 'PP7 (H1 pin 14)', function: 'PWM Ch7 / Speaker', direction: 'Output', notes: 'EVALH1: normally speaker (LS1) — repurposed as PWM Ch7 for Motor B (Receiver board)' },
    { pin: 'PP5 (H1 pin 16)', function: 'MDIRB1 — Motor B Dir', direction: 'Output', notes: 'EVALH1: L293D IN4 → Motor B direction. Code: PTP_PTP5 = 1 (fwd) / 0 (rev) (Receiver board)' },
    { pin: 'PP6 (H1 pin 15)', function: 'MENB1 — Motor B Enable', direction: 'Output', notes: 'EVALH1: L293D EN34 → Motor B enable pulse. Code: PTP_PTP6 toggled high→low to step (Receiver board)' },
    { pin: 'PP3 (H1 pin 18)', function: 'MDIRA1 — Motor A Dir', direction: 'Output', notes: 'EVALH1: L293D IN2 → Motor A direction. Code: PTP_PTP3 set in cmd 0x02 (Receiver board)' },
    { pin: 'PS4–PS7 (H1 pins 1–4)', function: 'LCD DB4–DB7 / 74C922 DOA–DOD', direction: 'Bidir', notes: 'EVALH1: shared bus — LCD data (DDRS=$FF) + keypad encoder output (DDRS=$0F) — DDR swapped per use (Controller board)' },
    { pin: 'PE4 (H1 pin 33)', function: 'LCD Enable / ECLK', direction: 'Output', notes: 'EVALH1: LCD1 pin 6 (Enable). Code: PORTE_BIT4 toggled high→low to latch nibble (Controller board)' },
    { pin: 'PE7 (H1 pin 43)', function: 'LCD RS', direction: 'Output', notes: 'EVALH1: LCD1 pin 4 (Register Select). Code: PORTE_BIT7 — 0=command, 1=data (Controller board)' },
    { pin: 'PE1/IRQ* (H1 pin 46)', function: 'Keypad Data Available', direction: 'Input', notes: 'EVALH1: 74C922 DA* output → IRQ* pin → triggers interrupt 6 when key pressed (Controller board)' },
    { pin: 'PM0 (RxCAN0)', function: 'CAN Receive', direction: 'Input', notes: 'MCU pin 105 → PCA82C250 transceiver RXD on Adapt9S12D module (Both boards)' },
    { pin: 'PM1 (TxCAN0)', function: 'CAN Transmit', direction: 'Output', notes: 'MCU pin 104 → PCA82C250 transceiver TXD on Adapt9S12D module (Both boards)' },
    { pin: 'PTH[0:7] (H1 pins 35–42)', function: 'LED Bargraph (LED1)', direction: 'Output', notes: 'EVALH1: 10-segment LED bargraph, 8 center segments on Port H — used for debug on both boards' },
  ],
  keyRegisters: [
    { name: 'ATD0CTL2', address: '$0082', description: 'ATD power-up (0x80 = ADPU on, no fast flag clear)' },
    { name: 'ATD0CTL3', address: '$0083', description: 'Conversion length (0x20 = 4 conversions)' },
    { name: 'ATD0CTL4', address: '$0084', description: 'Clock prescaler & resolution (0x85 = 10-bit, PRS=5)' },
    { name: 'ATD0CTL5', address: '$0085', description: 'Channel select & scan (0xA5 = AN5, right-justified, continuous, multi-ch)' },
    { name: 'ATD0DR0L', address: '$0091', description: 'Result register low byte — 8-bit ADC value from AN5' },
    { name: 'PWME', address: '$00A0', description: 'PWM channel enable (Ch4 + Ch7 via bitfield)' },
    { name: 'PWMPOL', address: '$00A1', description: 'PWM polarity (PPOL4=1, PPOL7=1 start-high)' },
    { name: 'PWMPRCLK', address: '$00A3', description: 'Prescaler for Clock B (PCKB1|PCKB2 masks)' },
    { name: 'PWMPER4', address: '$00B8', description: 'PWM Ch4 period register (0xFA = 250)' },
    { name: 'PWMPER7', address: '$00BB', description: 'PWM Ch7 period register (0xFA = 250)' },
    { name: 'PWMDTY4', address: '$00C0', description: 'PWM Ch4 duty — loaded from ATD0DR0L' },
    { name: 'PWMDTY7', address: '$00C3', description: 'PWM Ch7 duty — loaded from ATD0DR0L' },
    { name: 'CAN0CTL0', address: '$0140', description: 'CAN control 0 — INITRQ bitfield for init mode' },
    { name: 'CAN0CTL1', address: '$0141', description: 'CAN control 1 — CANE + CLKSRC masks, LISTEN=0' },
    { name: 'CAN0BTR0', address: '$0142', description: 'Bus timing 0 (0x03 = prescaler÷4, SJW default)' },
    { name: 'CAN0BTR1', address: '$0143', description: 'Bus timing 1 (0x67 = TSEG2=7, TSEG1=8)' },
    { name: 'CAN0IDAC', address: '$014B', description: 'ID acceptance control (0x20 = 8-bit filters)' },
    { name: 'CAN0IDAR0–3', address: '$0150–$0153', description: 'Acceptance IDs bank 0 — all set to 0xFF' },
    { name: 'CAN0IDMR0–3', address: '$0154–$0157', description: 'Acceptance masks bank 0 — all 0x00 (exact match)' },
    { name: 'CAN0IDAR4–7', address: '$0158–$015B', description: 'Acceptance IDs bank 1 — all set to 0xFF' },
    { name: 'CAN0IDMR4–7', address: '$015C–$015F', description: 'Acceptance masks bank 1 — all 0x00 (exact match)' },
    { name: 'CAN0RIER', address: '$0145', description: 'Receiver interrupt enable (RXFIE mask)' },
  ],
  memoryMap: [
    { region: 'Registers', range: '$0000–$03FF', usage: 'I/O registers (ATD, PWM, CAN, ports)' },
    { region: 'RAM', range: '$1000–$3FFF', usage: 'Variables, stack' },
    { region: 'EEPROM', range: '$0400–$0FFF', usage: 'Non-volatile storage (calibration)' },
    { region: 'Flash', range: '$4000–$FFFF', usage: 'Program code' },
    { region: 'Vectors', range: '$FF00–$FFFF', usage: 'Interrupt & reset vectors' },
  ],
};

export const PHASES: Phase[] = [
  // ──────────────────────────────────────────────
  // PHASE 1 — ATD Setup (Receiver Board)
  // ──────────────────────────────────────────────
  {
    id: 'atd-setup',
    number: 1,
    title: 'ATD Setup — Potentiometer Reading',
    module: 'ATD0CTL2–5, ATD0DR0L (Receiver Board)',
    objectives: [
      'Power on the ATD module on the receiver board',
      'Configure 4-conversion sequence on channel AN5',
      'Read 8-bit result from ATD0DR0L (low byte, right-justified)',
      'Verify potentiometer input drives PWM duty in later phases',
    ],
    registers: [
      { name: 'ATD0CTL2', address: '$0082', value: '$80', purpose: 'ADPU=1 (power on ATD) — no fast flag clear' },
      { name: 'ATD0CTL3', address: '$0083', value: '$20', purpose: 'S4C=1 → 4 conversions per sequence' },
      { name: 'ATD0CTL4', address: '$0084', value: '$85', purpose: 'SRES8=1 (10-bit), PRS=5 (prescaler ÷12 → ~2MHz ATD clk)' },
      { name: 'ATD0CTL5', address: '$0085', value: '$A5', purpose: 'DJM=1 (right-justified), SCAN=1 (continuous), MULT=1 (multi-ch), Ch AN5' },
      { name: 'ATD0DR0L', address: '$0091', value: 'Read', purpose: '8-bit low byte of conversion result (0–255)' },
    ],
    code: `// ═══════════════════════════════════════════════════════════
// SOURCE: CAN2_Rec_Template/Sources/main.c → ADC_Init()
// Also found in: Motors_Lab_PWM_Template/Sources/main.c → ATD_Init()
// Both files contain identical register values.
// ═══════════════════════════════════════════════════════════

void ADC_Init (void) {

  ATD0CTL2 = 0x80;
  // Register: ATD0CTL2 at $0082 — ATD Control Register 2
  // Value 0x80 = 1000 0000 in binary
  // bit7 ADPU = 1   → Powers ON the ATD module (must be set first)
  // bit6 AFFC = 0   → Normal flag clearing (not fast-clear mode)
  // bit5 AWAI = 0   → ATD continues running in wait mode
  // bit4 ETRIGLE = 0 → External trigger level/edge: N/A
  // bit3 ETRIGP = 0  → External trigger polarity: N/A
  // bit2 ETRIGE = 0  → External trigger disabled
  // bit1 ASCIE = 0   → Sequence complete interrupt DISABLED
  // bit0 ASCIF = 0   → Sequence complete interrupt flag (read-only)

  ATD0CTL3 = 0x20;
  // Register: ATD0CTL3 at $0083 — ATD Control Register 3
  // Value 0x20 = 0010 0000 in binary
  // bit6 S8C = 0, bit5 S4C = 1, bit4 S2C = 0, bit3 S1C = 0
  //   → Conversion sequence length = 4 conversions per sequence
  //   (S4C=1 selects 4; this is the standard setting for HC12)
  // bit2 FIFO = 0   → Result registers NOT in FIFO mode
  // bit1 FRZ1 = 0, bit0 FRZ0 = 0 → Continue in background debug

  ATD0CTL4 = 0x85;
  // Register: ATD0CTL4 at $0084 — ATD Control Register 4
  // Value 0x85 = 1000 0101 in binary
  // bit7 SRES8 = 1   → 8-bit resolution mode (not 10-bit)
  //   NOTE: Despite name, SRES8=1 means 8-bit. 0 would be 10-bit.
  // bit6 SMP1 = 0, bit5 SMP0 = 0 → 2 ATD clock sample periods
  // bit4-0 PRS[4:0] = 00101 = 5 → Prescaler divisor = (5+1)*2 = 12
  //   ATD clock = bus_clk / 12 ≈ 667kHz (with 8MHz bus)

  ATD0CTL5 = 0xA5;
  // Register: ATD0CTL5 at $0085 — ATD Control Register 5
  // Value 0xA5 = 1010 0101 in binary
  // bit7 DJM  = 1   → Right-justified result in data register
  // bit6 DSGN = 0   → Unsigned result data
  // bit5 SCAN = 1   → Continuous conversion mode (auto-restarts)
  // bit4 MULT = 0   → Single-channel mode (all 4 conversions on same ch)
  //   NOTE: Source comment says "multi-channel" but MULT=0 means single
  // bit2-0 CC:CB:CA = 101 = 5 → Select analog channel AN5
  //   AN5 = PAD05 on MC9S12DG128 = EVALH1 onboard potentiometer (POT1)
  //
  // Writing to ATD0CTL5 also STARTS the conversion sequence.
  // With SCAN=1, conversions repeat continuously after this write.

}

// ═══════════════════════════════════════════════════════════
// Reading results — used in CAN2_Rec_Template/Sources/main.c
// main() loop and CAN command handler:
// ═══════════════════════════════════════════════════════════
//
//   PTH = ATD0DR0L;
//   // ATD0DR0L at $0091 — low byte of first result register
//   // Contains 8-bit conversion value (0x00–0xFF) from AN5
//   // Written to Port H to display on EVALH1 LED1 bargraph
//
//   PWMDTY4 = ATD0DR0L;
//   // Directly loads ADC reading as PWM duty cycle for channel 4
//   // 0x00 = 0% duty, 0xFA = 100% duty (matches PWMPER4)`,
    wiring: [
      'EVALH1 onboard POT1 is already wired to AN05 (PAD05) as a voltage divider',
      'No external wiring needed for potentiometer — it is on the trainer board',
      'EVALH1 also has temp sensor (U3/MCP9701A) on AN07 — not used in this project',
      'PTH → LED1 bargraph shows raw ADC value for visual debug',
    ],
    testSteps: [
      'Flash ADC_Init() code to receiver EVALH1 board',
      'Connect pot to AN5, rotate fully CCW — PTH LEDs should show ~0x00',
      'Rotate pot fully CW — PTH LEDs should show ~0xFF',
      'Set breakpoint after ATD0DR0L read, inspect value in debugger',
      'Verify continuous conversion — value updates without re-triggering',
    ],
  },

  // ──────────────────────────────────────────────
  // PHASE 2 — PWM & Motor Control (Receiver Board)
  // ──────────────────────────────────────────────
  {
    id: 'pwm-motor',
    number: 2,
    title: 'PWM & Motor Control — Dual Fan Drive',
    module: 'PWME, PWMPOL, PWMPRCLK, PWMPER4/7, PWMDTY4/7, PTP5/6 (Receiver Board)',
    objectives: [
      'Configure PWM Channel 4 (PP4) and Channel 7 (PP7) for two fan motors',
      'Set prescaler using Clock B (PCKB1|PCKB2 masks)',
      'Use ATD0DR0L as direct duty cycle input from potentiometer',
      'Control motor direction via PTP5 and step clock via PTP6',
    ],
    registers: [
      { name: 'PWME', address: '$00A0', value: 'Bitfield', purpose: 'PWME_PWME4=1 and PWME_PWME7=1 to enable Ch4 + Ch7' },
      { name: 'PWMPOL', address: '$00A1', value: 'Bitfield', purpose: 'PPOL4=1, PPOL7=1 — start-high polarity on both channels' },
      { name: 'PWMPRCLK', address: '$00A3', value: 'PCKB1|PCKB2', purpose: 'Clock B prescaler masks (0x06|0x04)' },
      { name: 'PWMPER4', address: '$00B8', value: '$FA', purpose: 'Period = 250 counts for Ch4' },
      { name: 'PWMPER7', address: '$00BB', value: '$FA', purpose: 'Period = 250 counts for Ch7' },
      { name: 'PWMDTY4', address: '$00BC', value: 'ATD0DR0L', purpose: 'Duty cycle for Ch4 — loaded from ADC reading' },
      { name: 'PWMDTY7', address: '$00BF', value: 'ATD0DR0L', purpose: 'Duty cycle for Ch7 — loaded from ADC reading' },
      { name: 'DDRP', address: '$025A', value: '$FF', purpose: 'Port P all outputs (PP4, PP7 for PWM + PTP3–6 for motor)' },
      { name: 'PTP5', address: 'Bit', value: '0 or 1', purpose: 'Motor direction: 1=forward, 0=reverse' },
      { name: 'PTP6', address: 'Bit', value: 'Toggle', purpose: 'Motor step clock — pulse high then low to step' },
    ],
    code: `// ═══════════════════════════════════════════════════════════
// SOURCE: CAN2_Rec_Template/Sources/main.c → PWM_Init()
// Also found in: Motors_Lab_PWM_Template/Sources/main.c → PWM_Init()
// Both files contain identical initialization code.
// ═══════════════════════════════════════════════════════════

void PWM_Init (void) {

  PWME_PWME4 = 0x10;
  // Register: PWME at $00A0 — PWM Enable Register
  // PWME_PWME4 is a bitfield access: sets bit 4 = 1
  // Enables PWM output on channel 4 → appears on PP4
  // PP4 = EVALH1 H1 pin 17 = L293D MENA1 (Motor A enable)

  PWMPOL_PPOL4 = 0x10;
  // Register: PWMPOL at $00A1 — PWM Polarity Register
  // PPOL4 bitfield: sets bit 4 = 1
  // Polarity = 1 → output starts HIGH, goes LOW at duty count
  // (active-high PWM waveform)

  PWMPRCLK = 0x06|0x04;
  // Register: PWMPRCLK at $00A3 — PWM Prescaler Clock Select
  // 0x06 = 0000 0110 → PCKB[2:0] = 110 = Clock B prescaler ÷64
  // 0x04 = 0000 0100 → PCKB2 bit set
  // OR'd together = 0x06 → Clock B divides bus clock by 64
  // Bus clock 8MHz / 64 = 125kHz PWM clock
  // (Channels 4-7 use Clock B by default)

  PWMPER4 = 0xFA;
  // Register: PWMPER4 at $00B8 — PWM Channel 4 Period Register
  // Period = 250 (0xFA) → PWM frequency = 125kHz / 250 = 500Hz

}

// ═══════════════════════════════════════════════════════════
// SOURCE: CAN2_Rec_Template/Sources/main.c → second while(1)
// switch(CAN) case 0x01 — "Driver fan speed" command handler
// ═══════════════════════════════════════════════════════════

case 0x01:
  PWME_PWME4 = 1;           // Enable PWM channel 4 (PP4 → L293D MENA1)
  PWMPOL_PPOL4 = 1;         // Start-high polarity for Ch4
  PWMPRCLK = PWMPRCLK_PCKB1_MASK|PWMPRCLK_PCKB2_MASK;
                             // Set Clock B prescaler using derivative.h masks
                             // Same as 0x06|0x04 in PWM_Init but using named masks
  PWMPER4 = 0xFA;           // Period = 250 counts for Ch4
  PWMDTY4 = ATD0DR0L;       // Ch4 duty = pot reading (0–255 from AN5)
                             // Register: PWMDTY4 at $00C0
  PTH = ATD0DR0L;           // Show duty value on LED1 bargraph (debug)

  PWME_PWME7 = 1;           // Enable PWM channel 7 (PP7 → speaker/Motor B)
  PWMPOL_PPOL7 = 1;         // Start-high polarity for Ch7
  PWMPRCLK = PWMPRCLK_PCKB1_MASK|PWMPRCLK_PCKB2_MASK;
                             // Same prescaler for Ch7
  PWMPER7 = 0xFA;           // Period = 250 counts for Ch7 ($00BB)
  PWMDTY7 = ATD0DR0L;       // Ch7 duty = same pot reading ($00C3)
  PTH = ATD0DR0L;           // Debug LEDs (overwrites previous PTH write)

  PTP_PTP4 = 1;             // Set Port P bit 4 HIGH directly
                             // (separate from PWM — raw GPIO on same pin)
  transCAN(0xFF, 0x01);     // Echo 0x01 back to controller via CAN
                             // Controller will display "Driver fan / speed" on LCD
  CAN = 0;                  // Reset global CAN var → re-enter while(CAN==0) wait
break;

// ═══════════════════════════════════════════════════════════
// SOURCE: CAN2_Rec_Template/Sources/main.c → second while(1)
// switch(CAN) case 0x04 — "Passenger fan direction" handler
// Uses L293D H-bridge via Port P for motor stepping:
//   PP5 (MDIRB1) = L293D IN4 → Motor B direction
//   PP6 (MENB1) = L293D EN34 → Motor B enable (pulsed as step)
// ═══════════════════════════════════════════════════════════

case 0x04:
  if(x < ATD0DR0L) {         // If motor position < pot target value
    PTP_PTP5 = 1;            // PP5 = MDIRB1 → L293D IN4 → forward direction
    PTP_PTP6 = 1;            // PP6 = MENB1 → L293D EN34 → enable HIGH
    for(z=0; z<20; z++);     // Brief delay (~20 loop iterations) for pulse width
    PTP_PTP6 = 0;            // EN34 LOW → motor steps one increment
    x++;                     // Track position counter forward
  } else {                   // Motor position >= pot target
    PTP_PTP5 = 0;            // PP5 = MDIRB1 → reverse direction
    PTP_PTP6 = 1;            // EN34 HIGH
    for(z=0; z<=20; z++);    // Pulse delay
    PTP_PTP6 = 0;            // EN34 LOW → motor steps one increment
    x--;                     // Track position counter backward
  }
  transCAN(0xFF, 0x04);      // Echo 0x04 back → controller shows "Passenger fan / direction"
  CAN = 0;                   // Reset for next command
break;`,
    wiring: [
      'EVALH1 has L293D dual H-bridge (U5) already wired to Port P:',
      'PP4 (MENA1) → L293D EN12 → Motor Channel A enable/speed (PWM Ch4)',
      'PP3 (MDIRA1) → L293D IN2 → Motor Channel A direction',
      'PP6 (MENB1) → L293D EN34 → Motor Channel B enable pulse (PTP_PTP6)',
      'PP5 (MDIRB1) → L293D IN4 → Motor Channel B direction (PTP_PTP5)',
      'PP7 → normally speaker (LS1) on EVALH1 — repurposed as PWM Ch7',
      'Motors connect to terminal blocks TB2 (Ch A) and TB3 (Ch B) on EVALH1',
      'Motor voltage via TB1 (up to 24V DC) — separate from board 5V logic',
      'D3/D4 LEDs on EVALH1 indicate Channel A motor current direction',
      'D8/D9 LEDs on EVALH1 indicate Channel B motor current direction',
    ],
    testSteps: [
      'Flash PWM_Init() + ADC code to receiver board',
      'Connect LED to PP4 — rotate pot, LED brightness should change',
      'Connect LED to PP7 — same behavior on second channel',
      'Use oscilloscope on PP4 to verify PWM waveform with period=250',
      'Verify PTP5/PTP6 motor direction toggle with logic analyzer',
      'Confirm both channels track ATD0DR0L value simultaneously',
    ],
  },

  // ──────────────────────────────────────────────
  // PHASE 3 — LCD Display (Controller Board)
  // ──────────────────────────────────────────────
  {
    id: 'lcd-display',
    number: 3,
    title: 'LCD Display — Status Output',
    module: 'PTS[7:4] data, PORTE BIT4 (EN), PORTE BIT7 (RS) — Controller Board',
    objectives: [
      'Initialize HD44780 LCD in 4-bit mode via Port S (data) + Port E (control)',
      'Display CAN-received status: fan mode, direction, temperature',
      'Implement outcmd(), output(), output_string(), clear() functions',
      'Handle DDR switching: PTS/PORTE must be set to output before LCD writes',
    ],
    registers: [
      { name: 'DDRS', address: '$024A', value: '$FF (LCD) / $0F (keypad)', purpose: 'Switched per use: $FF for LCD output, $0F for keypad input on upper nibble' },
      { name: 'DDRE', address: '$0009', value: '$FF (LCD) / $10 (keypad)', purpose: 'Switched per use: $FF for LCD, $10 for keypad enable' },
      { name: 'PTS', address: '$0248', value: 'Variable', purpose: 'Upper nibble PTS[7:4] carries LCD D4–D7 data' },
      { name: 'PORTE_BIT4', address: 'Bit', value: 'Toggle', purpose: 'LCD Enable — pulse high→low to latch nibble' },
      { name: 'PORTE_BIT7', address: 'Bit', value: '0/1', purpose: 'LCD RS — 0=command, 1=data character' },
    ],
    code: `// ═══════════════════════════════════════════════════════════
// SOURCE: CAN2_Trans_Template/Sources/main.c
// All 5 LCD functions below are from this single file.
// EVALH1 wiring (from evalh1sch3.pdf & AD9S12Dpins.pdf):
//   PS4 (H1 pin 1) → LCD DB4 (pin 11)
//   PS5 (H1 pin 2) → LCD DB5 (pin 12)
//   PS6 (H1 pin 3) → LCD DB6 (pin 13)
//   PS7 (H1 pin 4) → LCD DB7 (pin 14)
//   PE4 (H1 pin 33) → LCD Enable (pin 6)
//   PE7 (H1 pin 43) → LCD RS (pin 4)
// ═══════════════════════════════════════════════════════════

void LCD_init (void) {
  unsigned int z;

  DDRS = 0xFF;              // Port S ($024A) all outputs → drive LCD data lines
  DDRE = 0xFF;              // Port E ($0009) all outputs → drive EN and RS
  PORTE_BIT7 = 0;           // RS = 0 → command mode for initialization
  PTS = 0x00;               // Clear data lines

  for (z=0;z<=33333;z++);   // ~50ms delay (HD44780 datasheet requirement)
  for (z=0;z<=33333;z++);   // Wait for LCD internal voltage to stabilize

  // HD44780 power-on reset sequence: send 0x3 three times
  // Must use raw PTS writes, NOT outcmd(), because outcmd()
  // would send both nibbles of 0x03 which corrupts the sequence
  PTS = 0x30;               // 0x30 on PTS[7:4] = 0x3 to LCD (Function Set 8-bit)
  for (z=0;z<=6666;z++);    // >4.1ms delay after first 0x3
  PTS = 0x30;               // Second 0x3 (Function Set 8-bit)
  for (z=0;z<=213;z++);     // >100us delay after second 0x3
  PTS = 0x30;               // Third 0x3 (Function Set 8-bit)
  for (z=0;z<=213;z++);     // >100us delay

  PTS = 0x20;               // 0x20 on PTS[7:4] = 0x2 → switch to 4-bit mode
  PORTE_BIT4 = 0;           // EN low (setup)
  PORTE_BIT4 = 1;           // EN high → LCD reads data on rising edge
  PORTE_BIT4 = 0;           // EN low → LCD latches data on falling edge
  for(z=0;z<=6666;z++);     // Wait for command to execute

  outcmd(0x28);             // Function Set: 4-bit mode, 2 lines, 5x8 font
  outcmd(0x08);             // Display OFF (clear display control bits)
  clear();                  // Clear display + return cursor home
  outcmd(0x06);             // Entry Mode: cursor moves right, no display shift
  outcmd(0x0F);             // Display ON, cursor ON, blink ON
}

// ── outcmd: Send a command byte to LCD in 4-bit mode ──
// SOURCE: CAN2_Trans_Template/Sources/main.c → outcmd()
void outcmd(unsigned char command) {
  unsigned int z;

  PTS = 0xF0 & command;     // Mask upper nibble of command → PTS[7:4] → LCD DB4-7
  PORTE_BIT4 = 0;           // EN low (setup)
  PORTE_BIT4 = 1;           // EN high → LCD reads upper nibble
  PORTE_BIT4 = 0;           // EN low → latch upper nibble

  PTS = 0xF0 & (command<<4); // Shift lower nibble into upper position → PTS[7:4]
  PORTE_BIT4 = 0;           // EN low
  PORTE_BIT4 = 1;           // EN high → LCD reads lower nibble
  PORTE_BIT4 = 0;           // EN low → latch lower nibble

  for(z=0;z<=6666;z++);     // ~1ms delay for command execution time
  // Note: RS (PORTE_BIT7) stays 0 from LCD_init → command mode
}

// ── clear: Clear display and return cursor home ──
// SOURCE: CAN2_Trans_Template/Sources/main.c → clear()
void clear(void) {
  outcmd(0x01);             // HD44780 cmd 0x01: Clear entire display, cursor to home
  outcmd(0x02);             // HD44780 cmd 0x02: Return cursor to home position (0,0)
}

// ── output_string: Write a null-terminated string to LCD ──
// SOURCE: CAN2_Trans_Template/Sources/main.c → output_string()
void output_string(char *op) {
  unsigned int x;

  PORTE_BIT7 = 1;           // RS = 1 → switch to DATA mode (characters, not commands)
  while(*op) {              // Loop until null terminator
    PTS = 0xF0 & *op;       // Upper nibble of ASCII char → PTS[7:4] → LCD DB4-7
    PORTE_BIT4 = 0;         // EN pulse: low → high → low (latch upper nibble)
    PORTE_BIT4 = 1;
    PORTE_BIT4 = 0;
    for(x=0;x<=4;x++);      // Brief settling delay between nibbles

    PTS = 0xF0 & (*op<<4);  // Lower nibble shifted up → PTS[7:4]
    PORTE_BIT4 = 0;         // EN pulse (latch lower nibble)
    PORTE_BIT4 = 1;
    PORTE_BIT4 = 0;
    for(x=0;x<=6666;x++);   // ~1ms delay — LCD needs time to process each character
    *op ++;                  // Advance string pointer to next character
  }
  PORTE_BIT7 = 0;           // RS = 0 → back to command mode
}

// ── output: Write a single ASCII character with extra delay ──
// SOURCE: CAN2_Trans_Template/Sources/main.c → output()
// Used for digit-by-digit temperature display — extra delays
// prevent display corruption when writing individual chars rapidly
void output(unsigned char op) {
  unsigned int x;

  PORTE_BIT7 = 1;           // RS = 1 → data mode
  PTS = 0xF0 & op;          // Upper nibble → LCD
  PORTE_BIT4 = 0;           // EN pulse
  PORTE_BIT4 = 1;
  PORTE_BIT4 = 0;
  for(x=0;x<=4;x++);        // Inter-nibble settling

  PTS = 0xF0 & (op<<4);     // Lower nibble → LCD
  PORTE_BIT4 = 0;           // EN pulse
  PORTE_BIT4 = 1;
  PORTE_BIT4 = 0;
  for(x=0;x<=6666;x++);     // Standard delay + 9 extra debounce loops:
  for(x=0;x<=6666;x++);     // These extra delays (~10ms total) ensure
  for(x=0;x<=6666;x++);     // the LCD has fully processed the character
  for(x=0;x<=6666;x++);     // before the next output() call.
  for(x=0;x<=6666;x++);     // Without these, rapid single-char writes
  for(x=0;x<=6666;x++);     // (like the temperature digit extraction)
  for(x=0;x<=6666;x++);     // would produce garbled display output.
  for(x=0;x<=6666;x++);
  for(x=0;x<=6666;x++);
  for(x=0;x<=6666;x++);

  PORTE_BIT7 = 0;           // RS = 0 → back to command mode
}`,
    wiring: [
      'EVALH1 LCD1 connector is pre-wired via H1 header to Adapt9S12D:',
      'H1 pin 1 (PS4/MISO) → LCD DB4 (pin 11)',
      'H1 pin 2 (PS5/MOSI) → LCD DB5 (pin 12)',
      'H1 pin 3 (PS6/SCK) → LCD DB6 (pin 13)',
      'H1 pin 4 (PS7/SS*) → LCD DB7 (pin 14)',
      'H1 pin 33 (PE4/ECLK) → LCD Enable (pin 6)',
      'H1 pin 43 (PE7) → LCD RS (pin 4)',
      'LCD R/W (pin 5) → GND (write-only mode)',
      'R10 on EVALH1 provides contrast control for LCD1',
      'Plug LCD (16-char or 20-char, 4-line) into EVALH1 LCD1 connector',
      'NOTE: PS4–PS7 shared with 74C922 keypad encoder — DDR must be switched before each use',
    ],
    testSteps: [
      'Wire LCD to controller board per pin list above',
      'Adjust contrast pot until empty blocks appear on line 1',
      'Call LCD_init() — display should clear and cursor should blink',
      'Call output_string("Hello") — verify text appears on line 1',
      'Call outcmd(0xC0) then output_string("Line 2") — verify second line',
      'Call clear() — verify display clears completely',
      'Verify no garbled characters — timing delays are critical',
    ],
  },

  // ──────────────────────────────────────────────
  // PHASE 4 — Keypad Input (Controller Board)
  // ──────────────────────────────────────────────
  {
    id: 'keypad-input',
    number: 4,
    title: 'Keypad Input — IRQ Interrupt Driven',
    module: 'interrupt 6, PTS[7:4] read, DDRS, DDRE (Controller Board)',
    objectives: [
      'Configure keypad as interrupt-driven input (IRQ vector 6)',
      'Read key value from PTS upper nibble (PTS & 0xF0)',
      'Map hardware key codes to commands 1–5 for CAN transmission',
      'Handle DDR switching: DDRS=0x0F, DDRE=0x10 for keypad mode',
    ],
    registers: [
      { name: 'DDRS', address: '$024A', value: '$0F', purpose: 'Lower nibble output (row drive), upper nibble input (column read)' },
      { name: 'DDRE', address: '$0009', value: '$10', purpose: 'Bit 4 output — needed to properly enable the keypad' },
      { name: 'PTS', address: '$0248', value: 'Read & 0xF0', purpose: 'Read upper nibble for key identification' },
      { name: 'DDRH', address: '$0262', value: '$FF', purpose: 'Debug LEDs to show which key was pressed' },
    ],
    code: `// ═══════════════════════════════════════════════════════════
// SOURCE: CAN2_Trans_Template/Sources/main.c
// Global variable declaration + main() DDR setup + interrupt 6
//
// How it works (from EVALH1 schematic — evalh1sch3.pdf):
//   1. Keypad matrix plugs into EVALH1 connector J1
//   2. 74C922 encoder chip (U2) continuously scans the matrix
//   3. When a key is pressed & debounced, 74C922 outputs:
//      - 4-bit binary key code on DOA→PS4, DOB→PS5, DOC→PS6, DOD→PS7
//      - DA* (Data Available) signal → chains to IRQ* (PE1, H1 pin 46)
//   4. IRQ* triggers interrupt vector 6 on the MC9S12
//   5. ISR reads PTS & 0xF0 to get the 4-bit code from upper nibble
// ═══════════════════════════════════════════════════════════

unsigned char check;          // Global variable — written by ISR, read by main()
                              // Holds key command number (1–5) or 0 (no key)

// ── DDR setup in main() before EnableInterrupts ──
// SOURCE: CAN2_Trans_Template/Sources/main.c → main(), lines before initCAN()
DDRH = 0xFF;                  // Port H ($0262) all outputs → LED1 bargraph for debug
DDRS = 0x0F;                  // Port S ($024A) = 0000 1111
                              //   bits 0-3 OUTPUT (directly drive low nibble)
                              //   bits 4-7 INPUT (read 74C922 DOA-DOD output)
DDRE = 0x10;                  // Port E ($0009) = 0001 0000
                              //   bit 4 OUTPUT (PE4 — needed to enable keypad circuit)
                              //   Source comment: "This is needed to properly enable
                              //   the Keypad, if students fail to do this, they may
                              //   run into keypad issues."

// ═══════════════════════════════════════════════════════════
// SOURCE: CAN2_Trans_Template/Sources/main.c → interrupt 6
// IRQ* vector = vector number 6 in MC9S12DG128 interrupt table
// Fires when 74C922 DA* asserts (key pressed and debounced)
// ═══════════════════════════════════════════════════════════

interrupt 6 void keypad (void) {
  unsigned char key;

  // Re-set DDRs inside ISR to ensure keypad-mode pin directions
  // (LCD functions may have changed them to $FF for output)
  DDRH = 0xFF;                // Port H outputs for debug LEDs
  DDRS = 0x0F;                // Port S: lower nibble out, upper nibble INPUT
  DDRE = 0x10;                // Port E bit 4 out

  key = PTS & 0xF0;           // Read Port S ($0248), mask upper nibble
                               // This reads the 4-bit code from 74C922:
                               //   DOA=PS4(bit4), DOB=PS5(bit5),
                               //   DOC=PS6(bit6), DOD=PS7(bit7)

  switch (key) {
    case 0x00:                 // 74C922 output = 0000 → keypad button 1
      check = 1;               // Store command 1 (driver fan speed)
      PTH = 0x01;              // LED1 bargraph shows 0x01 for debug
      break;

    case 0x40:                 // 74C922 output = 0100 → keypad button 2
      check = 2;               // Store command 2 (passenger fan speed)
      PTH = 0x02;
      break;

    case 0x80:                 // 74C922 output = 1000 → keypad button 3
      check = 3;               // Store command 3 (driver fan direction)
      PTH = 0x03;
      break;

    case 0x10:                 // 74C922 output = 0001 → keypad button 4
      check = 4;               // Store command 4 (passenger fan direction)
      PTH = 0x04;
      break;

    case 0x50:                 // 74C922 output = 0101 → keypad button 5
      check = 5;               // Store command 5 (request temperature)
      PTH = 0x05;
      break;
  }
  // After ISR returns, main() loop detects check != 0
  // and sends transCAN(0xFF, check) to the receiver board
}`,
    wiring: [
      'Keypad plugs into EVALH1 connector J1 (up to 16 keys)',
      'EVALH1 has 74C922 hardware encoder (U2 socket) — scans matrix automatically',
      '74C922 outputs: DOA→PS4, DOB→PS5, DOC→PS6, DOD→PS7 (4-bit key code)',
      '74C922 DA* (data available) → chains to IRQ* (PE1) → triggers interrupt 6',
      'DDRS=0x0F: lower nibble output, upper nibble INPUT to read 74C922 output',
      'DDRE=0x10: PE4 output — needed to properly enable the keypad circuit',
      'NOTE: PS4–PS7 SHARED with LCD — DDR is switched between $0F (keypad) and $FF (LCD)',
      'PTH → LED1 bargraph shows which key was pressed (for debugging)',
    ],
    testSteps: [
      'Wire keypad to Port S on controller board',
      'Ensure DDRS=0x0F and DDRE=0x10 are set in main() before EnableInterrupts',
      'Press button 1 — PTH LEDs should show 0x01',
      'Press button 2 — PTH should show 0x02, etc.',
      'Verify all 5 buttons map to correct check values (1–5)',
      'Verify interrupt fires immediately on keypress (no polling needed)',
      'Test that LCD still works after keypad press (DDR switching)',
    ],
  },

  // ──────────────────────────────────────────────
  // PHASE 5 — CAN Bus Module (Both Boards)
  // ──────────────────────────────────────────────
  {
    id: 'can-bus',
    number: 5,
    title: 'CAN Bus — Inter-Board Communication',
    module: 'CAN0CTL0/1, CAN0BTR0/1, CAN0IDAC, CAN0RIER (Both Boards)',
    objectives: [
      'Initialize MSCAN module using bitfield-style register access',
      'Configure 8-bit acceptance filters with exact match (IDARs=0xFF, IDMRs=0x00)',
      'Implement 1-byte data transmission with transCAN(id, data)',
      'Enable CAN RX interrupt (vector 38) for non-blocking reception',
    ],
    registers: [
      { name: 'CAN0CTL0', address: '$0140', value: 'Bitfield', purpose: 'CAN0CTL0_INITRQ=1 to enter init, =0 to exit' },
      { name: 'CAN0CTL1', address: '$0141', value: 'Masks', purpose: 'CANE_MASK (enable) + CLKSRC_MASK (bus clock), LISTEN=0' },
      { name: 'CAN0BTR0', address: '$0142', value: '$03', purpose: 'Prescaler=4 → TQ = fCANCLK / 4 = 2MHz' },
      { name: 'CAN0BTR1', address: '$0143', value: '$67', purpose: 'TSEG2=7, TSEG1=8, one bit sampling' },
      { name: 'CAN0IDAC', address: '$014B', value: '$20', purpose: '8-bit acceptance filters' },
      { name: 'CAN0IDAR0–7', address: '$0150–$015B', value: '$FF', purpose: 'All acceptance IDs = 0xFF (split: bank 0 at $0150, bank 1 at $0158)' },
      { name: 'CAN0IDMR0–7', address: '$0154–$015F', value: '$00', purpose: 'All masks = 0x00 (exact match) (split: bank 0 at $0154, bank 1 at $015C)' },
      { name: 'CAN0RIER', address: '$0145', value: 'RXFIE_MASK', purpose: 'Enable receive interrupt' },
      { name: 'CAN0TXIDR0', address: 'TX buf', value: '$FF', purpose: '8-bit identifier for transmitted frame' },
      { name: 'CAN0TXDLR', address: 'TX buf', value: '$01', purpose: 'Data length = 1 byte' },
    ],
    code: `// ═══════════════════════════════════════════════════════════
// SOURCE: CAN2_Trans_Template/Sources/CAN_2.c
//    AND: CAN2_Rec_Template/Sources/CAN_2.c
// Both files are IDENTICAL — same CAN module used on both boards.
// Header: CAN2_*/Sources/CAN_2.h
//
// Hardware (from AD9S12DG128sch.pdf — MCU module schematic):
//   PM0 (MCU pin 105) = RxCAN0 → PCA82C250 transceiver RXD
//   PM1 (MCU pin 104) = TxCAN0 → PCA82C250 transceiver TXD
//   PCA82C250 CANH/CANL → CAN bus twisted pair
//   120Ω termination resistors on Adapt9S12D module (R14, R15)
// ═══════════════════════════════════════════════════════════

// ── CAN_2.h ──
#include "derivative.h"       // MC9S12DG128 register definitions & bitfield macros
void initCAN(void);           // Initialize MSCAN0 module
void transCAN(unsigned char id, unsigned char k);  // Transmit one byte

// ═══════════════════════════════════════════════════════════
// SOURCE: CAN2_Trans_Template/Sources/CAN_2.c → initCAN()
// ═══════════════════════════════════════════════════════════
void initCAN(void) {

  CAN0CTL0_INITRQ = 1;
  // CAN0CTL0 at $0140 — Control Register 0
  // INITRQ bitfield = bit 0 → request initialization mode
  // CAN module must be in init mode to configure timing/filters

  while (CAN0CTL1_INITAK == 0);
  // CAN0CTL1 at $0141 — Control Register 1
  // INITAK = bit 0 → acknowledgement that init mode is active
  // MUST wait for this before writing config registers

  CAN0CTL1 = CAN0CTL1_CANE_MASK;
  // Set CANE (CAN Enable) bit → activates the MSCAN module
  // CANE_MASK is defined in derivative.h

  CAN0CTL1 = CAN0CTL1_CLKSRC_MASK;
  // Set CLKSRC bit → use bus clock (8MHz) as CAN clock source
  // NOTE: This overwrites the previous CANE write. The derivative.h
  // masks include CANE in CLKSRC_MASK, so CAN stays enabled.

  CAN0CTL1_LISTEN = 0;
  // LISTEN = bit 4 → 0 = normal mode (not listen-only)
  // Listen-only would receive but not send ACKs or transmit

  CAN0BTR0 = 0x03;
  // CAN0BTR0 at $0142 — Bus Timing Register 0
  // 0x03 = 0000 0011
  // bits 7-6: SJW[1:0] = 00 → Synchronization Jump Width = 1 Tq
  // bits 5-0: BRP[5:0] = 000011 = 3 → Prescaler value = 3+1 = 4
  // Time Quantum (Tq) = bus_clk / prescaler = 8MHz / 4 = 2MHz

  CAN0BTR1 = 0x67;
  // CAN0BTR1 at $0143 — Bus Timing Register 1
  // 0x67 = 0110 0111
  // bit 7: SAMP = 0 → single sample per bit (not triple)
  // bits 6-4: TSEG2[2:0] = 110 = 6 → Time Segment 2 = 6+1 = 7 Tq
  // bits 3-0: TSEG1[3:0] = 0111 = 7 → Time Segment 1 = 7+1 = 8 Tq
  // Total bit time = sync(1) + TSEG1(8) + TSEG2(7) = 16 Tq
  // Bit rate = 2MHz / 16 = 125 kbps

  CAN0IDAC = 0x20;
  // CAN0IDAC at $014B — Identifier Acceptance Control Register
  // 0x20 = 0010 0000
  // bits 5-4: IDAM[1:0] = 10 → 8-bit acceptance filter mode
  // (4 pairs of 8-bit filters vs 2 pairs of 16-bit or 1 pair of 32-bit)

  // Acceptance ID registers — set ALL to 0xFF
  // Bank 0: CAN0IDAR0-3 at $0150-$0153
  CAN0IDAR0 = 0xFF;          // Filter 0/1 ID byte
  CAN0IDAR1 = 0xFF;          // Filter 0/1 ID byte
  CAN0IDAR2 = 0xFF;          // Filter 2/3 ID byte
  CAN0IDAR3 = 0xFF;          // Filter 2/3 ID byte
  // Bank 1: CAN0IDAR4-7 at $0158-$015B
  CAN0IDAR4 = 0xFF;          // Filter 4/5 ID byte
  CAN0IDAR5 = 0xFF;          // Filter 4/5 ID byte
  CAN0IDAR6 = 0xFF;          // Filter 6/7 ID byte
  CAN0IDAR7 = 0xFF;          // Filter 6/7 ID byte

  // Acceptance MASK registers — set ALL to 0x00
  // 0 = bit must match, 1 = don't care
  // All 0x00 → EVERY bit must match the IDAR value (exact match: 0xFF)
  // Bank 0: CAN0IDMR0-3 at $0154-$0157
  CAN0IDMR0 = 0x00;          // Mask for filter 0/1
  CAN0IDMR1 = 0x00;
  CAN0IDMR2 = 0x00;          // Mask for filter 2/3
  CAN0IDMR3 = 0x00;
  // Bank 1: CAN0IDMR4-7 at $015C-$015F
  CAN0IDMR4 = 0x00;          // Mask for filter 4/5
  CAN0IDMR5 = 0x00;
  CAN0IDMR6 = 0x00;          // Mask for filter 6/7
  CAN0IDMR7 = 0x00;
  // Result: only accepts frames with ID byte = 0xFF
  // Both boards use transCAN(0xFF, ...) so this matches

  CAN0CTL0_INITRQ = 0;
  // Clear INITRQ → request exit from initialization mode

  while (CAN0CTL1_INITAK == 1);
  // Wait until INITAK clears → module is now in normal operating mode

  CAN0RIER = CAN0RIER_RXFIE_MASK;
  // CAN0RIER at $0145 — Receiver Interrupt Enable Register
  // RXFIE bit → enable interrupt when Receive Buffer Full flag sets
  // This triggers interrupt vector 38 (CAN_isr) on message reception
}

// ═══════════════════════════════════════════════════════════
// SOURCE: CAN2_Trans_Template/Sources/CAN_2.c → transCAN()
// ═══════════════════════════════════════════════════════════
void transCAN(unsigned char id, unsigned char k) {

  while (CAN0TFLG == 0);
  // CAN0TFLG at $0146 — Transmit Buffer Flag Register
  // Each bit represents one of 3 TX buffers (bits 2:0)
  // 0 = buffer busy (message pending), 1 = buffer empty
  // Wait until at least one buffer is empty

  CAN0TBSEL = CAN0TFLG;
  // CAN0TBSEL at $014A — Transmit Buffer Selection Register
  // Writing TFLG value selects the lowest-numbered empty buffer
  // for loading with new message data

  CAN0TXIDR0 = id;
  // TX Identifier Register 0 — loaded with 'id' parameter
  // In this project: always 0xFF (both boards send with ID=0xFF)
  // IDR0 contains bits [10:3] of the 11-bit standard ID

  CAN0TXIDR1 = 0x00;
  // TX Identifier Register 1
  // bits 7-5: ID[2:0] = 000 (lower 3 bits of standard ID)
  // bit 4: RTR = 0 → data frame (not remote request)
  // bit 3: IDE = 0 → standard frame (11-bit ID, not extended 29-bit)

  CAN0TXDSR0 = k;
  // TX Data Segment Register 0 — the actual data byte
  // Loaded with 'k' parameter (command echo or ATD0DR0L temp value)

  CAN0TXDLR = 0x01;
  // TX Data Length Register — set to 1 byte
  // CAN supports 0-8 bytes; this project only uses 1

  CAN0TFLG = CAN0TBSEL;
  // Writing back the selected buffer clears its flag → starts transmission
  // The MSCAN hardware handles arbitration, bit stuffing, CRC, and ACK
}

// ═══════════════════════════════════════════════════════════
// SOURCE: CAN2_Trans_Template/Sources/main.c (controller board)
//    AND: CAN2_Rec_Template/Sources/main.c (receiver board)
// Both boards have identical CAN_isr — interrupt vector 38
// ═══════════════════════════════════════════════════════════
interrupt 38 void CAN_isr (void) {

  CAN = CAN0RXDSR0;
  // Read received data byte from RX Data Segment Register 0
  // Store in global variable 'CAN' for main() to process

  CAN0RFLG = CAN0RFLG_RXF_MASK;
  // CAN0RFLG at $0144 — Receiver Flag Register
  // Writing 1 to RXF bit clears the Receive Buffer Full flag
  // This releases the RX buffer for the next incoming message

  PTH = CAN;
  // Display received byte on Port H ($0260) → LED1 bargraph
  // Visual debug: you can see the command/data value on the LEDs
}`,
    wiring: [
      'PM1 (TxCAN0) → PCA82C250 transceiver TXD on BOTH Adapt9S12D modules',
      'PM0 (RxCAN0) → PCA82C250 transceiver RXD on BOTH Adapt9S12D modules',
      'CAN transceiver CANH → twisted pair bus → other board CANH',
      'CAN transceiver CANL → twisted pair bus → other board CANL',
      '120Ω termination resistor between CANH and CANL at each bus end',
      'Both boards must share common GND for CAN to work',
    ],
    testSteps: [
      'Flash CAN_2.c to BOTH boards',
      'Call initCAN() on both — verify no hang (exits init mode)',
      'On board A: call transCAN(0xFF, 0x42) — check board B PTH shows 0x42',
      'On board B: call transCAN(0xFF, 0x55) — check board A PTH shows 0x55',
      'Verify CAN_isr fires on reception (set breakpoint inside ISR)',
      'Test rapid transmissions — verify no overrun errors',
      'Check CAN0RFLG for error flags — should be clean',
    ],
  },

  // ──────────────────────────────────────────────
  // PHASE 6 — Controller Board Main
  // ──────────────────────────────────────────────
  {
    id: 'controller-main',
    number: 6,
    title: 'Controller Board — Full Main Program',
    module: 'CAN TX + LCD + Keypad ISR (Controller Board)',
    objectives: [
      'Wire keypad ISR → CAN transmit → wait for CAN response → LCD display',
      'Handle all 5 commands: driver/passenger fan speed, direction, temperature',
      'Switch DDRS/DDRE between keypad mode and LCD mode per CAN response',
      'Display temperature with digit extraction and Celsius conversion',
    ],
    registers: [],
    code: `// ═══════════════════════════════════════════════════════════
// SOURCE: CAN2_Trans_Template/Sources/main.c (COMPLETE FILE)
// This is the controller board — has keypad + LCD + CAN TX/RX
// Flow: keypad IRQ → CAN transmit → wait CAN response → LCD
// ═══════════════════════════════════════════════════════════

#include <hidef.h>              // Freescale common defines/macros
#include "derivative.h"         // MC9S12DG128 register definitions
#include "CAN_2.h"              // initCAN() and transCAN() prototypes

// Forward declarations for LCD functions (defined later in same file)
void outcmd(unsigned char command);
void clear (void);
void output(unsigned char op);
void output_string(char *op);
void LCD_init (void);

unsigned char check;            // Written by keypad ISR (interrupt 6)
                                // Read by main() — holds command 1–5 or 0
unsigned char CAN;              // Written by CAN ISR (interrupt 38)
                                // Read by main() — holds response byte

void main(void) {
  unsigned char temp;           // Local var for temperature digit extraction

  DDRH = 0xFF;                  // Port H all outputs → LED1 bargraph debug
  DDRS = 0x0F;                  // Port S: lower nibble out, upper nibble IN
                                // → reads 74C922 keypad encoder DOA-DOD on PS4-PS7
  DDRE = 0x10;                  // Port E bit 4 out → enables keypad circuit

  initCAN();                    // Initialize MSCAN0 (from CAN_2.c — see Phase 5)
  LCD_init();                   // Initialize HD44780 LCD (see Phase 3)
  EnableInterrupts;             // Global interrupt enable — activates IRQ + CAN ISRs

  while(1) {

    // ── STEP 1: Wait for keypad press ──
    while(check == 0)           // Spin until keypad ISR sets check to 1–5
    {}                          // (check is set by interrupt 6 void keypad())

    // ── STEP 2: Transmit command to receiver board via CAN ──
    switch (check) {
      case 1:                   // Key 1 pressed → driver fan speed
        transCAN(0xFF, 0x01);   // Send ID=0xFF, data=0x01 to receiver
        check = 0;              // Reset so we wait for next keypress
        break;
      case 2:                   // Key 2 → passenger fan speed
        transCAN(0xFF, 0x02);
        check = 0;
        break;
      case 3:                   // Key 3 → driver fan direction
        transCAN(0xFF, 0x03);
        check = 0;
        break;
      case 4:                   // Key 4 → passenger fan direction
        transCAN(0xFF, 0x04);
        check = 0;
        break;
      case 5:                   // Key 5 → request temperature reading
        transCAN(0xFF, 0x05);
        check = 0;
        break;
    }

    // ── STEP 3: Wait for CAN response from receiver ──
    while(CAN == 0)             // Spin until CAN ISR receives a response
    {}                          // (CAN is set by interrupt 38 void CAN_isr())

    // ── STEP 4: Display result on LCD ──
    // CRITICAL: Must switch DDRS/DDRE to output mode before LCD writes!
    // Keypad ISR sets DDRS=0x0F (input on upper nibble),
    // but LCD needs DDRS=0xFF (output on all bits)
    switch(CAN) {

      case 0x01:                // Receiver echoed 0x01 → driver fan speed confirmed
        DDRS = 0xFF;            // Switch Port S to all outputs for LCD
        DDRE = 0xFF;            // Switch Port E to all outputs for LCD EN/RS
        clear();                // Clear LCD display
        output_string("Driver fan");  // Line 1: "Driver fan"
        outcmd(0xC0);           // HD44780 cmd: move cursor to line 2, position 0
        output_string("speed");       // Line 2: "speed"
        CAN = 0;                // Reset for next response
        break;

      case 0x02:                // Receiver echoed 0x02 → passenger fan speed
        DDRS = 0xFF;  DDRE = 0xFF;
        clear();
        output_string("Passenger fan");
        outcmd(0xC0);
        output_string("speed");
        CAN = 0;
        break;

      case 0x03:                // Receiver echoed 0x03 → driver fan direction
        DDRS = 0xFF;  DDRE = 0xFF;
        clear();
        output_string("Driver fan");
        outcmd(0xC0);
        output_string("direction");
        CAN = 0;
        break;

      case 0x04:                // Receiver echoed 0x04 → passenger fan direction
        DDRS = 0xFF;  DDRE = 0xFF;
        clear();
        output_string("Passenger fan");
        outcmd(0xC0);
        output_string("direction");
        CAN = 0;
        break;

      default:
        // Any other value = temperature response from cmd 0x05
        // Receiver sent raw ATD0DR0L value (0–255)
        temp = CAN;             // Capture value before CAN gets overwritten
        DDRS = 0xFF;  DDRE = 0xFF;   // Switch to LCD output mode
        outcmd(0xC0);           // Move cursor to LCD line 2
        output_string("Temp: ");

        temp = temp - 23;       // Offset calibration: raw ADC → approximate °C
                                // (EVALH1 temp sensor U3 on AN07 outputs
                                //  ~19.5mV/°C; 23 is a calibration offset)

        // ── Tens digit extraction ──
        // These while loops find the tens digit by range-checking
        // and subtracting, leaving the units digit in temp
        while (temp >= 10 && temp <= 19) {
          output('1');          // Display '1' as tens digit
          temp = temp - 10;     // Remove tens → leaves units
        }
        while (temp >= 20 && temp <= 29) {
          output('2');
          temp = temp - 20;
        }
        while (temp >= 30 && temp <= 39) {
          output('3');
          temp = temp - 30;
        }

        // ── Units digit via switch ──
        // After tens extraction, temp holds 0–9
        switch (temp) {
          case 0: output('0'); break;
          case 1: output('1'); break;
          case 2: output('2'); break;
          case 3: output('3'); break;
          case 4: output('4'); break;
          case 5: output('5'); break;
          case 6: output('6'); break;
          case 7: output('7'); break;
          case 8: output('8'); break;
          case 9: output('9'); break;
        }
        output('C');            // Append 'C' for Celsius
        break;
    }
    // Loop back → wait for next keypad press
  }
}

// ═══════════════════════════════════════════════════════════
// ISRs — both in CAN2_Trans_Template/Sources/main.c
// ═══════════════════════════════════════════════════════════

// CAN receive ISR — see Phase 5 for detailed line-by-line
interrupt 38 void CAN_isr (void) {
  CAN = CAN0RXDSR0;              // Read received data byte
  CAN0RFLG = CAN0RFLG_RXF_MASK; // Clear RX flag for next message
  PTH = CAN;                     // Debug: show on LED1 bargraph
}

// Keypad ISR — see Phase 4 for detailed line-by-line
interrupt 6 void keypad (void) {
  unsigned char key;
  DDRH = 0xFF;  DDRS = 0x0F;  DDRE = 0x10;  // Reset DDRs to keypad mode
  key = PTS & 0xF0;              // Read 74C922 output from PS4-PS7
  switch (key) {
    case 0x00: check = 1; PTH = 0x01; break;  // Button 1
    case 0x40: check = 2; PTH = 0x02; break;  // Button 2
    case 0x80: check = 3; PTH = 0x03; break;  // Button 3
    case 0x10: check = 4; PTH = 0x04; break;  // Button 4
    case 0x50: check = 5; PTH = 0x05; break;  // Button 5
  }
}

// LCD functions: LCD_init(), outcmd(), clear(), output_string(), output()
// Full source with line-by-line comments → see Phase 3`,
    wiring: [
      'LCD: PS4–PS7 → DB4–DB7, PE4 → EN, PE7 → RS (all via EVALH1 LCD1 connector)',
      'Keypad: J1 connector → 74C922 (U2) → DOA-DOD on PS4–PS7, DA* → IRQ* (shared with LCD!)',
      'CAN: PM1 → TxCAN0, PM0 → RxCAN0 via PCA82C250 on Adapt9S12D module',
      'PTH → LED1 bargraph (8 segments) for debug',
      'Ensure CAN bus connected to receiver board via CANH/CANL',
    ],
    testSteps: [
      'Flash complete controller code including CAN_2.c',
      'Verify LCD init shows cursor blinking',
      'Press key 1 — PTH shows 0x01, CAN transmits 0x01',
      'When receiver echoes back 0x01: LCD shows "Driver fan / speed"',
      'Press key 5 — receiver sends temp value, LCD shows "Temp: XXC"',
      'Verify DDRS/DDRE switch correctly between keypad and LCD modes',
      'Test all 5 keys in sequence — no crashes or garbled display',
    ],
  },

  // ──────────────────────────────────────────────
  // PHASE 7 — Receiver Board Main
  // ──────────────────────────────────────────────
  {
    id: 'receiver-main',
    number: 7,
    title: 'Receiver Board — Full Main Program',
    module: 'ADC + PWM + Motor + CAN ISR (Receiver Board)',
    objectives: [
      'Initialize ADC, PWM, and CAN on receiver board',
      'Handle 5 CAN commands: 0x01–0x04 (fan control), 0x05 (temp request)',
      'Drive dual PWM channels from potentiometer ADC reading',
      'Control motor direction with PTP5/PTP6 stepper logic',
    ],
    registers: [],
    code: `// ═══════════════════════════════════════════════════════════
// SOURCE: CAN2_Rec_Template/Sources/main.c (COMPLETE FILE)
// This is the receiver board — has ADC + PWM + motor + CAN RX
// Flow: CAN ISR receives command → switch handler → execute → echo back
// ═══════════════════════════════════════════════════════════

#include <hidef.h>              // Freescale common defines/macros
#include "derivative.h"         // MC9S12DG128 register definitions
#include "CAN_2.h"              // initCAN() and transCAN() prototypes

void ADC_Init (void);           // Forward declaration (defined at bottom)
unsigned char CAN;              // Written by CAN ISR (interrupt 38)
                                // Read by main() — holds command byte (0x01–0x05)
void PWM_Init (void);           // Forward declaration (defined at bottom)

void main(void) {
  unsigned int x;               // Motor position counter — tracks stepper position
  unsigned int z;               // Loop variable for pulse delay timing

  ADC_Init();                   // Configure ATD: AN5, continuous, 8-bit (see Phase 1)
  PWM_Init();                   // Configure PWM Ch4: PP4, period 250 (see Phase 2)

  EnableInterrupts;             // Global interrupt enable — activates CAN RX ISR
                                // Source comment: "I have a feeling that this line may
                                // be an issue many students will have. When misplaced,
                                // their interrupts will not work."

  DDRH = 0xFF;                  // Port H ($0262) all outputs → LED1 bargraph debug
  PERT = 0xFF;                  // Port T ($0246) pull-up enable → all pull-ups active
  DDRT = 0x00;                  // Port T ($0242) all inputs (timer/DIP switch on EVALH1)
  DDRP = 0xFF;                  // Port P ($025A) all outputs → PWM + L293D motor control
                                //   PP4 = MENA1 (Motor A enable/PWM)
                                //   PP3 = MDIRA1 (Motor A direction)
                                //   PP5 = MDIRB1 (Motor B direction)
                                //   PP6 = MENB1 (Motor B enable pulse)
                                //   PP7 = PWM Ch7 (repurposed from speaker)

  initCAN();                    // Initialize MSCAN0 (from CAN_2.c — see Phase 5)

  // ═══════════════════════════════════════════════════════════
  // FIRST while(1): Standalone motor position tracking loop
  // This loop runs forever — it continuously tracks the pot position
  // and steps the motor to match. The second while(1) below is
  // UNREACHABLE in this code as-is.
  // (Students may comment out one loop or the other for testing)
  // ═══════════════════════════════════════════════════════════
  while (1) {
    PTH = ATD0DR0L;             // Display current ADC reading on LED1 bargraph

    if(x <= ATD0DR0L) {         // If position counter <= pot target
      PTP_PTP5 = 1;             // PP5 = MDIRB1 → forward direction on L293D
      PTP_PTP6 = 1;             // PP6 = MENB1 → enable HIGH (motor energized)
      for(z=0; z<=20; z++);     // Brief pulse delay (~20 iterations)
      PTP_PTP6 = 0;             // MENB1 LOW → motor steps one increment
      x++;                      // Increment position tracker
    } else {                    // Position counter > pot target
      PTP_PTP5 = 0;             // MDIRB1 → reverse direction
      PTP_PTP6 = 1;             // MENB1 HIGH
      for(z=0; z<=20; z++);     // Pulse delay
      PTP_PTP6 = 0;             // MENB1 LOW → motor steps backward
      x--;                      // Decrement position tracker
    }
  }

  // ═══════════════════════════════════════════════════════════
  // SECOND while(1): CAN command handler
  // Waits for commands from controller board and executes them.
  // NOTE: This code is unreachable due to first while(1) above.
  // To use this handler, comment out the first while(1) block.
  // ═══════════════════════════════════════════════════════════
  while (1) {
    PTH = ATD0DR0L;             // Continuously show ADC on LEDs

    while(CAN == 0)             // Spin until CAN ISR receives a command
    {}

    switch(CAN) {

      case 0x01:                // Command: Driver fan speed
        // Enable both PWM channels with duty = pot reading
        PWME_PWME4 = 1;        // Enable PWM Ch4 (PP4 → L293D MENA1)
        PWMPOL_PPOL4 = 1;      // Start-high polarity
        PWMPRCLK = PWMPRCLK_PCKB1_MASK|PWMPRCLK_PCKB2_MASK;
                                // Clock B prescaler (same as PWM_Init)
        PWMPER4 = 0xFA;        // Period = 250 ($00B8)
        PWMDTY4 = ATD0DR0L;    // Duty = ADC reading from pot ($00C0)
        PTH = ATD0DR0L;        // Debug: show duty on LEDs

        PWME_PWME7 = 1;        // Enable PWM Ch7 (PP7)
        PWMPOL_PPOL7 = 1;      // Start-high polarity
        PWMPRCLK = PWMPRCLK_PCKB1_MASK|PWMPRCLK_PCKB2_MASK;
        PWMPER7 = 0xFA;        // Period = 250 ($00BB)
        PWMDTY7 = ATD0DR0L;    // Duty = same ADC reading ($00C3)
        PTH = ATD0DR0L;

        PTP_PTP4 = 1;          // Set PP4 HIGH (direct GPIO alongside PWM)
        transCAN(0xFF, 0x01);   // Echo 0x01 back → controller shows "Driver fan / speed"
        CAN = 0;               // Reset for next command
        break;

      case 0x02:                // Command: Passenger fan speed
        // Same PWM setup as cmd 0x01
        PWME_PWME4 = 1;  PWMPOL_PPOL4 = 1;
        PWMPRCLK = PWMPRCLK_PCKB1_MASK|PWMPRCLK_PCKB2_MASK;
        PWMPER4 = 0xFA;  PWMDTY4 = ATD0DR0L;  PTH = ATD0DR0L;
        PWME_PWME7 = 1;  PWMPOL_PPOL7 = 1;
        PWMPRCLK = PWMPRCLK_PCKB1_MASK|PWMPRCLK_PCKB2_MASK;
        PWMPER7 = 0xFA;  PWMDTY7 = ATD0DR0L;  PTH = ATD0DR0L;

        PTP_PTP3 = 0;          // PP3 = MDIRA1 → set Motor A direction LOW
        transCAN(0xFF, 0x02);   // Echo 0x02 → "Passenger fan / speed"
        CAN = 0;
        break;

      case 0x03:                // Command: Driver fan direction
        // Source has commented-out motor stepping code here
        // Currently just echoes back without motor action
        transCAN(0xFF, 0x03);   // Echo 0x03 → "Driver fan / direction"
        CAN = 0;
        break;

      case 0x04:                // Command: Passenger fan direction
        // Step motor toward pot target using L293D H-bridge
        if(x < ATD0DR0L) {     // Position < target
          PTP_PTP5 = 1;        // MDIRB1 → forward
          PTP_PTP6 = 1;        // MENB1 → enable HIGH
          for(z=0; z<20; z++); // Pulse delay
          PTP_PTP6 = 0;        // MENB1 LOW → step
          x++;                 // Track position
        } else {               // Position >= target
          PTP_PTP5 = 0;        // MDIRB1 → reverse
          PTP_PTP6 = 1;        // MENB1 HIGH
          for(z=0; z<=20; z++);
          PTP_PTP6 = 0;        // Step
          x--;
        }
        transCAN(0xFF, 0x04);   // Echo 0x04 → "Passenger fan / direction"
        CAN = 0;
        break;

      case 0x05:                // Command: Request temperature
        transCAN(0xFF, ATD0DR0L);
        // Send raw ADC value (0–255) back to controller
        // Controller's default case will display it as "Temp: XXC"
        // after subtracting offset of 23
        CAN = 0;
        break;
    }
  }
}

// ═══════════════════════════════════════════════════════════
// ISR — in CAN2_Rec_Template/Sources/main.c
// Identical to controller board version (see Phase 5)
// ═══════════════════════════════════════════════════════════
interrupt 38 void CAN_isr (void) {
  CAN = CAN0RXDSR0;              // Read command byte from controller
  CAN0RFLG = CAN0RFLG_RXF_MASK; // Clear RX flag
  PTH = CAN;                     // Debug: show on LED1 bargraph
}

// ═══════════════════════════════════════════════════════════
// ADC_Init — full annotated version in Phase 1
// SOURCE: CAN2_Rec_Template/Sources/main.c → ADC_Init()
// ═══════════════════════════════════════════════════════════
void ADC_Init (void) {
  ATD0CTL2 = 0x80;   // $0082: Power on ATD (ADPU=1)
  ATD0CTL3 = 0x20;   // $0083: 4 conversions per sequence (S4C=1)
  ATD0CTL4 = 0x85;   // $0084: 8-bit resolution, prescaler ÷12
  ATD0CTL5 = 0xA5;   // $0085: AN5, right-justified, continuous, starts conversion
}

// ═══════════════════════════════════════════════════════════
// PWM_Init — full annotated version in Phase 2
// SOURCE: CAN2_Rec_Template/Sources/main.c → PWM_Init()
// ═══════════════════════════════════════════════════════════
void PWM_Init (void) {
  PWME_PWME4 = 0x10;   // $00A0 bit 4: Enable PWM Ch4 on PP4
  PWMPOL_PPOL4 = 0x10; // $00A1 bit 4: Start-high polarity
  PWMPRCLK = 0x06|0x04; // $00A3: Clock B prescaler ÷64
  PWMPER4 = 0xFA;       // $00B8: Period = 250 counts
}`,
    wiring: [
      'EVALH1 POT1 already wired to AN5 (PAD05) — no external wiring needed',
      'PP4 (MENA1) → L293D Motor A enable/speed via EVALH1 H-bridge circuit',
      'PP7 → Motor B PWM (repurposed from speaker output on EVALH1)',
      'PP5 (MDIRB1) → L293D Motor B direction via EVALH1',
      'PP6 (MENB1) → L293D Motor B enable pulse via EVALH1',
      'Motors to TB2/TB3 terminal blocks, motor voltage to TB1 (up to 24V DC)',
      'CAN: PM1 → TxCAN0, PM0 → RxCAN0 via PCA82C250 on Adapt9S12D module',
      'PTH → LED1 bargraph (8 segments) for debug',
      'Ensure CAN bus connected to controller board via CANH/CANL',
    ],
    testSteps: [
      'Flash complete receiver code including CAN_2.c',
      'Verify ADC reads pot — PTH LEDs show value',
      'From controller: send command 0x01 — verify PWM on PP4 + PP7',
      'Rotate pot — duty cycle should change (LED brightness or scope)',
      'Send command 0x04 — verify motor direction toggle on PTP5/PTP6',
      'Send command 0x05 — verify raw ADC value echoed back via CAN',
      'Check controller LCD shows "Temp: XXC" after command 5',
      'Verify all 5 commands echo correct response back to controller',
    ],
  },

  // ──────────────────────────────────────────────
  // PHASE 8 — Testing
  // ──────────────────────────────────────────────
  {
    id: 'testing',
    number: 8,
    title: 'Testing — Dual-Board Integration',
    module: 'All (verification only)',
    objectives: [
      'Complete dual-board integration test over CAN bus',
      'Verify all 5 commands: fan speed (×2), direction (×2), temperature',
      'Confirm LCD displays correct status for each CAN response',
      'Validate motor direction and PWM duty track potentiometer',
    ],
    registers: [],
    code: `// ═══════════════════════════════════════════════════════════
//  DUAL-BOARD INTEGRATION TEST CHECKLIST — NO NEW CODE
//  Run through every test below and mark pass/fail.
// ═══════════════════════════════════════════════════════════

/*
  SYSTEM ARCHITECTURE:
  ┌───────────────────────┐   CAN BUS   ┌──────────────────────────┐
  │  CONTROLLER BOARD     │◄───────────►│  RECEIVER BOARD          │
  │                       │             │                          │
  │  Keypad → IRQ int 6   │  cmd 0x01-05│  CAN ISR → decode cmd   │
  │  CAN TX: send command │────────────►│  PWM Ch4+Ch7: drive fans │
  │  CAN RX: get response │◄────────────│  ADC AN5: read pot       │
  │  LCD: show status     │  echo/temp  │  Motor: PTP5/PTP6        │
  └───────────────────────┘             └──────────────────────────┘

  ┌──────────────────────────────────────────────────────────┐
  │  TEST CATEGORY             │ # TESTS  │ PASS CRITERIA    │
  ├──────────────────────────────────────────────────────────┤
  │  CAN Communication         │    4     │ Bi-directional   │
  │  Keypad → Command TX       │    5     │ All 5 keys work  │
  │  Fan Speed (Cmd 1 & 2)     │    4     │ PWM tracks pot   │
  │  Fan Direction (Cmd 3 & 4) │    3     │ Motor toggles    │
  │  Temperature (Cmd 5)       │    3     │ LCD shows temp   │
  │  LCD Display               │    4     │ No DDR glitch    │
  │  Endurance                 │    2     │ 10+ min stable   │
  └──────────────────────────────────────────────────────────┘

  Total: 25 test cases
  Required to pass: ALL 25
*/`,
    wiring: [
      'No changes — all hardware from Phases 1–7 on both boards',
      'Ensure CAN bus connected between both boards with termination',
    ],
    testSteps: [
      '── CAN Communication ──',
      '1. Power both boards — no error LEDs, CAN init completes',
      '2. Controller sends 0x01 — receiver PTH shows 0x01',
      '3. Receiver echoes 0x01 — controller PTH shows 0x01',
      '4. Rapid key presses — no CAN overrun errors',
      '── Keypad → Command TX ──',
      '5. Key 1 → PTH=0x01 on controller, CAN transmits 0x01',
      '6. Key 2 → PTH=0x02, transmits 0x02',
      '7. Key 3 → PTH=0x03, transmits 0x03',
      '8. Key 4 → PTH=0x04, transmits 0x04',
      '9. Key 5 → PTH=0x05, transmits 0x05',
      '── Fan Speed (Commands 1 & 2) ──',
      '10. Cmd 1: PWM on PP4 + PP7, duty = ATD0DR0L from pot',
      '11. Rotate pot min→max — fan speed ramps smoothly',
      '12. Cmd 2: Same PWM setup, PTP3 cleared for passenger',
      '13. LCD shows "Driver fan / speed" or "Passenger fan / speed"',
      '── Fan Direction (Commands 3 & 4) ──',
      '14. Cmd 3: Echo 0x03 back, LCD shows "Driver fan / direction"',
      '15. Cmd 4: Motor steps via PTP5/PTP6, LCD shows "Passenger fan / direction"',
      '16. Verify PTP5 toggles direction, PTP6 pulses step clock',
      '── Temperature (Command 5) ──',
      '17. Cmd 5: Receiver sends ATD0DR0L raw value via CAN',
      '18. Controller LCD shows "Temp: XXC" (with offset -23)',
      '19. Rotate pot — temperature reading changes on LCD',
      '── LCD Display ──',
      '20. DDRS/DDRE switch between keypad ($0F/$10) and LCD ($FF/$FF) modes',
      '21. No garbled characters after switching modes',
      '22. Line 2 (0xC0) displays correctly for all commands',
      '23. Temperature digit extraction works for values 0–39',
      '── Endurance ──',
      '24. Run command cycle (1→2→3→4→5 repeat) for 10 min — stable',
      '25. Rapid keypad presses for 5 min — no lockup or CAN errors',
    ],
  },
];
