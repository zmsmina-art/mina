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
    { pin: 'PAD05 (AN5)', function: 'Potentiometer Input', direction: 'Input', notes: 'ATD Ch5 — pot for fan speed / temp sim (Receiver board)' },
    { pin: 'PP4', function: 'PWM Ch4 — Motor A', direction: 'Output', notes: 'Driver fan PWM output (Receiver board)' },
    { pin: 'PP7', function: 'PWM Ch7 — Motor B', direction: 'Output', notes: 'Passenger fan PWM output (Receiver board)' },
    { pin: 'PTP5', function: 'Motor Direction', direction: 'Output', notes: 'Motor direction bit — 1=forward, 0=reverse (Receiver board)' },
    { pin: 'PTP6', function: 'Motor Step/Clock', direction: 'Output', notes: 'Motor step clock pulse (Receiver board)' },
    { pin: 'PTS[7:4]', function: 'LCD D4–D7 / Keypad Read', direction: 'Bidir', notes: 'Shared: LCD data (output) + keypad column read (input) — DDR swapped per use (Controller board)' },
    { pin: 'PTS[3:0]', function: 'Keypad Row Drive', direction: 'Output', notes: 'DDRS=0x0F — lower nibble drives rows (Controller board)' },
    { pin: 'PORTE BIT4', function: 'LCD Enable', direction: 'Output', notes: 'Enable pulse (toggle high→low to latch) (Controller board)' },
    { pin: 'PORTE BIT7', function: 'LCD RS', direction: 'Output', notes: 'Register Select: 0=command, 1=data (Controller board)' },
    { pin: 'PM0 (CAN0_TX)', function: 'CAN Transmit', direction: 'Output', notes: 'To CAN transceiver TXD (Both boards)' },
    { pin: 'PM1 (CAN0_RX)', function: 'CAN Receive', direction: 'Input', notes: 'From CAN transceiver RXD (Both boards)' },
    { pin: 'PTH[0:7]', function: 'Debug LEDs', direction: 'Output', notes: 'DDRH=0xFF — used for troubleshooting on both boards' },
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
    { name: 'PWMDTY4', address: '$00BC', description: 'PWM Ch4 duty — loaded from ATD0DR0L' },
    { name: 'PWMDTY7', address: '$00BF', description: 'PWM Ch7 duty — loaded from ATD0DR0L' },
    { name: 'CAN0CTL0', address: '$0140', description: 'CAN control 0 — INITRQ bitfield for init mode' },
    { name: 'CAN0CTL1', address: '$0141', description: 'CAN control 1 — CANE + CLKSRC masks, LISTEN=0' },
    { name: 'CAN0BTR0', address: '$0142', description: 'Bus timing 0 (0x03 = prescaler÷4, SJW default)' },
    { name: 'CAN0BTR1', address: '$0143', description: 'Bus timing 1 (0x67 = TSEG2=7, TSEG1=8)' },
    { name: 'CAN0IDAC', address: '$0148', description: 'ID acceptance control (0x20 = 8-bit filters)' },
    { name: 'CAN0IDAR0–7', address: '$0150–$0157', description: 'Acceptance IDs — all set to 0xFF' },
    { name: 'CAN0IDMR0–7', address: '$0158–$015F', description: 'Acceptance masks — all 0x00 (exact match only)' },
    { name: 'CAN0RIER', address: '$0147', description: 'Receiver interrupt enable (RXFIE mask)' },
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
    code: `// ATD Module — Potentiometer on AN5 (Receiver Board)
// From: CAN2_Rec_Template/Sources/main.c → ADC_Init()

void ADC_Init (void) {

ATD0CTL2 = 0x80; // TURNS ATD ON

//bit0 ASCIF       /* ATD 0 Sequence Complete Interrupt Flag */
//bit1 ASCIE       /* ATD 0 Sequence Complete Interrupt Enable */
//bit2 ETRIGE      /* External Trigger Mode enable */
//bit3 ETRIGP      /* External Trigger Polarity */
//bit4 ETRIGLE     /* External Trigger Level/Edge control */
//bit5 AWAI        /* ATD Power Down in Wait Mode */
//bit6 AFFC        /* ATD Fast Conversion Complete Flag Clear */
//bit7 ADPU        /* ATD Disable / Power Down */

ATD0CTL3 = 0x20; // SETS CONVERSION LENGTH TO 4 (STANDARD FOR HC12)

//bit0 FRZ0        /* Background Debug Freeze Enable Bit 0 */
//bit1 FRZ1        /* Background Debug Freeze Enable Bit 1 */
//bit2 FIFO        /* Result Register FIFO Mode */
//bit3 S1C         /* Conversion Sequence Length 1 */
//bit4 S2C         /* Conversion Sequence Length 2 */
//bit5 S4C         /* Conversion Sequence Length 4 */
//bit6 S8C         /* Conversion Sequence Length 8 */

ATD0CTL4 = 0x85; // SETS PRESCALER TO 5 (STANDARD SETTING AFTER RESET)

//bit0 PRS0        /* ATD Clock Prescaler 0 */
//bit1 PRS1        /* ATD Clock Prescaler 1 */
//bit2 PRS2        /* ATD Clock Prescaler 2 */
//bit3 PRS3        /* ATD Clock Prescaler 3 */
//bit4 PRS4        /* ATD Clock Prescaler 4 */
//bit5 SMP0        /* Sample Time Select 0 */
//bit6 SMP1        /* Sample Time Select 1 */
//bit7 SRES8       /* ATD Resolution Select */

ATD0CTL5 = 0xA5;   // BITS 0-2 SELECT WHICH ANALOG CHANNEL YOU
                   // WILL READ FROM & WE HAVE SET THE DATA TO BE
                   // RIGHT ALIGNED, UNSIGNED, AND SINGLE SEQUENCE MODE

  //bit0 CA          /* Analog Input Channel Select Code A */
  //bit1 CB          /* Analog Input Channel Select Code B */
  //bit2 CC          /* Analog Input Channel Select Code C */
  //bit3
  //bit4 MULT        /* Multi-Channel Sample Mode */
  //bit5 SCAN        /* Continuous Conversion Sequence Mode */
  //bit6 DSGN        /* Signed/Unsigned Result Data Mode */
  //bit7 DJM         /* Result Register Data Justification Mode */

}

// Reading the ADC value (used throughout receiver main loop):
//   PTH = ATD0DR0L;   // Display raw ADC on debug LEDs
//   PWMDTY4 = ATD0DR0L;  // Use as PWM duty directly`,
    wiring: [
      'Potentiometer wiper → AN5 (PAD05) on receiver board',
      'Pot ends → VCC (5V) and GND',
      'Ensure VDDA and VSSA powered on EVALH1 board',
      'PTH LEDs used to visually verify ADC value (debug)',
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
    code: `// PWM & Motor Control (Receiver Board)
// From: CAN2_Rec_Template/Sources/main.c → PWM_Init() + motor logic

// ── PWM Initialization ──
void PWM_Init (void) {
  // Initialize the PWM Module here, set the registers
  // NOTE: By default the channels will appear on the respective
  // Port P pin. In this case our PWM will be appearing across
  // bit4 of Port P.
  PWME_PWME4 = 0x10;         // 0001-0000
  PWMPOL_PPOL4 = 0x10;       // 0001-0000
  PWMPRCLK = 0x06|0x04;      // 0000-0110  |  0000-0100
  PWMPER4 = 0xFA;
}

// ── Runtime PWM usage (inside CAN command handler) ──
// When command 0x01 (driver fan speed) is received:
case 0x01:
  PWME_PWME4 = 1;
  PWMPOL_PPOL4 = 1;
  PWMPRCLK = PWMPRCLK_PCKB1_MASK|PWMPRCLK_PCKB2_MASK;
  PWMPER4 = 0xFA;
  PWMDTY4 = ATD0DR0L;        // Duty from pot position
  PTH = ATD0DR0L;             // Debug LEDs show duty value

  PWME_PWME7 = 1;
  PWMPOL_PPOL7 = 1;
  PWMPRCLK = PWMPRCLK_PCKB1_MASK|PWMPRCLK_PCKB2_MASK;
  PWMPER7 = 0xFA;
  PWMDTY7 = ATD0DR0L;
  PTH = ATD0DR0L;

  PTP_PTP4=1;
  transCAN(0xFF,0x01);        // Echo command back to controller
  CAN=0;
break;

// ── Motor Direction Control (command 0x04) ──
// Uses PTP5 for direction and PTP6 for step clock pulse:
case 0x04:
  if(x < ATD0DR0L) {
    PTP_PTP5 = 1;             // Forward direction
    PTP_PTP6 = 1;             // Clock high
    for(z=0; z<20; z++);      // Brief pulse delay
    PTP_PTP6 = 0;             // Clock low → step
    x++;
  } else {
    PTP_PTP5 = 0;             // Reverse direction
    PTP_PTP6 = 1;
    for(z=0; z<=20; z++);
    PTP_PTP6 = 0;
    x--;
  }
  transCAN(0xFF,0x04);
  CAN=0;
break;`,
    wiring: [
      'PP4 → Motor A driver (driver fan) — PWM Ch4 output',
      'PP7 → Motor B driver (passenger fan) — PWM Ch7 output',
      'PTP5 → Motor direction control line',
      'PTP6 → Motor step clock line',
      'Motor power from external supply, NOT from board 5V',
      'Common GND between motor driver and EVALH1 board',
      'For initial testing: PP4 → 330Ω → LED → GND (verify PWM visually)',
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
    code: `// LCD Module — HD44780 in 4-bit mode (Controller Board)
// PTS[7:4] = D4-D7, PORTE BIT4 = EN, PORTE BIT7 = RS
// From: CAN2_Trans_Template/Sources/main.c

void LCD_init (void) {
  // The following LCD initialization commands are given
  // by the datasheet and follow a very specific set of commands.

  unsigned int z;

  DDRS = 0xFF;
  DDRE = 0xFF;
  PORTE_BIT7 = 0;
  PTS = 0x00;

  for (z=0;z<=33333;z++);     // 50ms wait specified by manufacturer to ensure
  for (z=0;z<=33333;z++);     // LCD voltage level moves up to proper power level.

  PTS = 0x30;                  // 0x30 must be sent three times to establish
  for (z=0;z<=6666;z++);      // connection with the LCD. outcmd has not been used
  PTS = 0x30;                  // because it will send the entire hex value 0x03 and
  for (z=0;z<=213;z++);       // will interfere with the process.
  PTS = 0x30;
  for (z=0;z<=213;z++);

  PTS = 0x20;                  // 4 - bit initialization
  PORTE_BIT4 = 0;             // Toggle enable to process data
  PORTE_BIT4 = 1;
  PORTE_BIT4 = 0;
  for(z=0;z<=6666;z++);

  outcmd(0x28);                // 4-bit 2 line setup
  outcmd(0x08);                // turn display off
  clear();
  outcmd(0x06);                // entry mode set to increment DDRAM address
  outcmd(0x0F);                // Turn display/cursor/blink on
}

void outcmd(unsigned char command) {
  // Since we are using the LCD in 4-bit mode, we have to send
  // the data one nibble at a time and toggle the enable bit
  // directly after a nibble has been sent to the LCD.
  unsigned int z;
  PTS = 0xF0 & command;        // Send high nibble
  PORTE_BIT4 = 0;
  PORTE_BIT4 = 1;
  PORTE_BIT4 = 0;
  PTS = 0xF0 & (command<<4);   // Send low nibble
  PORTE_BIT4 = 0;
  PORTE_BIT4 = 1;
  PORTE_BIT4 = 0;
  for(z=0;z<=6666;z++);
}

void clear(void) {
  outcmd(0x01);
  outcmd(0x02);
}

void output_string(char *op) {
  unsigned int x;
  PORTE_BIT7 = 1;              // RS=1 for data
  while(*op) {
    PTS = 0xF0 & *op;
    PORTE_BIT4 = 0;
    PORTE_BIT4 = 1;
    PORTE_BIT4 = 0;
    for(x=0;x<=4;x++);
    PTS = 0xF0 & (*op<<4);
    PORTE_BIT4 = 0;
    PORTE_BIT4 = 1;
    PORTE_BIT4 = 0;
    for(x=0;x<=6666;x++);
    *op ++;
  }
  PORTE_BIT7 = 0;
}

void output(unsigned char op) {
  // Single ASCII character output with debounce delay
  unsigned int x;
  PORTE_BIT7 = 1;
  PTS = 0xF0 & op;
  PORTE_BIT4 = 0;
  PORTE_BIT4 = 1;
  PORTE_BIT4 = 0;
  for(x=0;x<=4;x++);
  PTS = 0xF0 & (op<<4);
  PORTE_BIT4 = 0;
  PORTE_BIT4 = 1;
  PORTE_BIT4 = 0;
  for(x=0;x<=6666;x++);
  for(x=0;x<=6666;x++);
  for(x=0;x<=6666;x++);
  for(x=0;x<=6666;x++);
  for(x=0;x<=6666;x++);
  for(x=0;x<=6666;x++);
  for(x=0;x<=6666;x++);
  for(x=0;x<=6666;x++);
  for(x=0;x<=6666;x++);
  for(x=0;x<=6666;x++);
  PORTE_BIT7 = 0;
}`,
    wiring: [
      'PTS4 (Port S bit 4) → LCD D4 (pin 11)',
      'PTS5 (Port S bit 5) → LCD D5 (pin 12)',
      'PTS6 (Port S bit 6) → LCD D6 (pin 13)',
      'PTS7 (Port S bit 7) → LCD D7 (pin 14)',
      'PORTE BIT4 → LCD EN (pin 6)',
      'PORTE BIT7 → LCD RS (pin 4)',
      'LCD R/W (pin 5) → GND (write-only mode)',
      'LCD VSS (pin 1) → GND',
      'LCD VDD (pin 2) → +5V',
      'LCD V0 (pin 3) → 10k pot wiper (contrast adjust)',
      'NOTE: PTS is shared with keypad — DDR must be switched before each use',
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
    code: `// Keypad Module — Interrupt-Driven (Controller Board)
// From: CAN2_Trans_Template/Sources/main.c → interrupt 6

unsigned char check;           // Global — stores key command (1–5)

// In main() setup:
DDRH = 0xFF;
DDRS = 0x0F;                   // Upper nibble of Port S = input
DDRE = 0x10;                   // Needed to properly enable the keypad

// ── Keypad ISR (IRQ Vector 6) ──
// This interrupt routine translates the hex values sent from
// the keypad (buttons 1-5) and stores them in a global variable
// to be read and interpreted within the main program.

interrupt 6 void keypad (void) {
  unsigned char key;

  DDRH = 0xFF;
  DDRS = 0x0F;
  DDRE = 0x10;

  key = PTS & 0xF0;            // Read upper nibble

  switch (key) {
    case 0x00:
      check = 1;               // Key 1: Driver fan speed
      PTH = 0x01;
      break;

    case 0x40:
      check = 2;               // Key 2: Passenger fan speed
      PTH = 0x02;
      break;

    case 0x80:
      check = 3;               // Key 3: Driver fan direction
      PTH = 0x03;
      break;

    case 0x10:
      check = 4;               // Key 4: Passenger fan direction
      PTH = 0x04;
      break;

    case 0x50:
      check = 5;               // Key 5: Request temperature
      PTH = 0x05;
      break;
  }
}

// Key mapping:
// PTS & 0xF0 = 0x00 → check=1 → transCAN(0xFF, 0x01) → Driver fan speed
// PTS & 0xF0 = 0x40 → check=2 → transCAN(0xFF, 0x02) → Passenger fan speed
// PTS & 0xF0 = 0x80 → check=3 → transCAN(0xFF, 0x03) → Driver fan direction
// PTS & 0xF0 = 0x10 → check=4 → transCAN(0xFF, 0x04) → Passenger fan direction
// PTS & 0xF0 = 0x50 → check=5 → transCAN(0xFF, 0x05) → Request temperature`,
    wiring: [
      'Keypad directly to Port S + Port E on controller board',
      'DDRS=0x0F: PTS[3:0] drive rows, PTS[7:4] read columns',
      'DDRE=0x10: PORTE bit 4 must be configured for keypad enable',
      'NOTE: Port S is SHARED with LCD — DDR is switched before each use',
      'PTH LEDs show which key was pressed (for debugging)',
      'Keypad GND must be connected to board GND',
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
      { name: 'CAN0IDAC', address: '$0148', value: '$20', purpose: '8-bit acceptance filters' },
      { name: 'CAN0IDAR0–7', address: '$0150+', value: '$FF', purpose: 'All acceptance IDs = 0xFF' },
      { name: 'CAN0IDMR0–7', address: '$0158+', value: '$00', purpose: 'All masks = 0x00 (exact match — all bits must match)' },
      { name: 'CAN0RIER', address: '$0147', value: 'RXFIE_MASK', purpose: 'Enable receive interrupt' },
      { name: 'CAN0TXIDR0', address: 'TX buf', value: '$FF', purpose: '8-bit identifier for transmitted frame' },
      { name: 'CAN0TXDLR', address: 'TX buf', value: '$01', purpose: 'Data length = 1 byte' },
    ],
    code: `// CAN Bus Module — Shared by Both Boards
// From: CAN2_Trans_Template/Sources/CAN_2.c (identical on both boards)
// Header: CAN_2.h

// ── CAN_2.h ──
#include "derivative.h"
void initCAN(void);
void transCAN(unsigned char id, unsigned char k);

// ── initCAN() ──
void initCAN(void) {
  CAN0CTL0_INITRQ = 1;           // Enters initialization mode

  while (CAN0CTL1_INITAK == 0);  // Wait for acknowledgement

  CAN0CTL1 = CAN0CTL1_CANE_MASK;
  CAN0CTL1 = CAN0CTL1_CLKSRC_MASK;
  CAN0CTL1_LISTEN = 0;           // Enables CAN, bus clock source

  CAN0BTR0 = 0x03;               // Prescaler=4, SJW default
                                  // TQ = fCANCLOCK / PRESCALER = 2MHz

  CAN0BTR1 = 0x67;               // TSEG2=7, TSEG1=8
                                  // One bit sampling selected

  CAN0IDAC = 0x20;               // 8-bit acceptance filters

  CAN0IDAR0 = 0xFF;              // Acceptance identifiers — all 0xFF
  CAN0IDAR1 = 0xFF;
  CAN0IDAR2 = 0xFF;
  CAN0IDAR3 = 0xFF;
  CAN0IDAR4 = 0xFF;
  CAN0IDAR5 = 0xFF;
  CAN0IDAR6 = 0xFF;
  CAN0IDAR7 = 0xFF;

  CAN0IDMR0 = 0x00;              // Mask bits — all 0x00
  CAN0IDMR1 = 0x00;              // 0 = must match acceptance register
  CAN0IDMR2 = 0x00;              // 1 = don't care (masked)
  CAN0IDMR3 = 0x00;
  CAN0IDMR4 = 0x00;
  CAN0IDMR5 = 0x00;
  CAN0IDMR6 = 0x00;
  CAN0IDMR7 = 0x00;

  CAN0CTL0_INITRQ = 0;           // Exit initialization mode

  while (CAN0CTL1_INITAK == 1);  // Wait for normal mode

  CAN0RIER = CAN0RIER_RXFIE_MASK; // Enable reception interrupt
}

// ── transCAN() ──
void transCAN(unsigned char id, unsigned char k) {
  while (CAN0TFLG == 0);         // Wait for empty TX buffer

  CAN0TBSEL = CAN0TFLG;          // Select empty buffer

  CAN0TXIDR0 = id;               // Set 8-bit identifier
  CAN0TXIDR1 = 0x00;             // IDE=0, RTR=0 (standard data frame)

  CAN0TXDSR0 = k;                // Load data byte

  CAN0TXDLR = 0x01;              // Data length = 1 byte

  CAN0TFLG = CAN0TBSEL;          // Clear buffer → start transmission
}

// ── CAN RX Interrupt (Vector 38) — on BOTH boards ──
interrupt 38 void CAN_isr (void) {
  CAN = CAN0RXDSR0;              // Gather received data
  CAN0RFLG = CAN0RFLG_RXF_MASK; // Reset RXF flag for next reception
  PTH = CAN;                     // Display on debug LEDs
}`,
    wiring: [
      'PM0 (CAN0_TX) → CAN transceiver TXD on BOTH boards',
      'PM1 (CAN0_RX) → CAN transceiver RXD on BOTH boards',
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
    code: `// Controller Board — Full Main Program
// From: CAN2_Trans_Template/Sources/main.c (complete file)

#include <hidef.h>
#include "derivative.h"
#include "CAN_2.h"

void outcmd(unsigned char command);
void clear (void);
void output(unsigned char op);
void output_string(char *op);
void LCD_init (void);

unsigned char check;            // Key command from IRQ (1–5)
unsigned char CAN;              // Data received from CAN ISR

void main(void) {
  unsigned char temp;

  DDRH = 0xFF;
  DDRS = 0x0F;                  // Upper nibble input for keypad
  DDRE = 0x10;                  // Needed for keypad enable

  initCAN();
  LCD_init();
  EnableInterrupts;

  while(1) {
    while(check == 0)           // Wait for keypad interrupt
    {}

    switch (check) {
      case 1:
        transCAN(0xFF,0x01);    // Driver fan speed
        check = 0;
        break;
      case 2:
        transCAN(0xFF,0x02);    // Passenger fan speed
        check = 0;
        break;
      case 3:
        transCAN(0xFF,0x03);    // Driver fan direction
        check = 0;
        break;
      case 4:
        transCAN(0xFF,0x04);    // Passenger fan direction
        check = 0;
        break;
      case 5:
        transCAN(0xFF,0x05);    // Request temperature
        check = 0;
        break;
    }

    while(CAN == 0)             // Wait for CAN response
    {}

    switch(CAN) {
      // Each case must switch DDR to LCD mode before writing
      case 0x01:
        DDRS = 0xFF;
        DDRE = 0xFF;
        clear();
        output_string("Driver fan");
        outcmd (0xC0);          // Move to line 2
        output_string("speed");
        CAN = 0;
        break;

      case 0x02:
        DDRS = 0xFF;
        DDRE = 0xFF;
        clear();
        output_string("Passenger fan");
        outcmd (0xC0);
        output_string("speed");
        CAN = 0;
        break;

      case 0x03:
        DDRS = 0xFF;
        DDRE = 0xFF;
        clear();
        output_string("Driver fan");
        outcmd (0xC0);
        output_string("direction");
        CAN = 0;
        break;

      case 0x04:
        DDRS = 0xFF;
        DDRE = 0xFF;
        clear();
        output_string("Passenger fan");
        outcmd (0xC0);
        output_string("direction");
        CAN = 0;
        break;

      default:
        // Temperature reading — extract digits
        temp = CAN;
        DDRS = 0xFF;
        DDRE = 0xFF;
        outcmd (0xC0);
        output_string ("Temp: ");
        temp = temp - 23;       // Offset calibration

        // Extract tens digit
        while (temp >= 10 && temp <= 19) {
          output ('1');
          temp = temp - 10;
        }
        while (temp >= 20 && temp <= 29) {
          output ('2');
          temp = temp - 20;
        }
        while (temp >= 30 && temp <= 39) {
          output ('3');
          temp = temp - 30;
        }

        // Units digit via switch
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
        output ('C');           // Celsius
        break;
    }
  }
}

// ── CAN RX ISR ──
interrupt 38 void CAN_isr (void) {
  CAN = CAN0RXDSR0;
  CAN0RFLG = CAN0RFLG_RXF_MASK;
  PTH = CAN;
}

// ── Keypad ISR ──
interrupt 6 void keypad (void) {
  unsigned char key;
  DDRH = 0xFF;
  DDRS = 0x0F;
  DDRE = 0x10;
  key = PTS & 0xF0;
  switch (key) {
    case 0x00: check = 1; PTH = 0x01; break;
    case 0x40: check = 2; PTH = 0x02; break;
    case 0x80: check = 3; PTH = 0x03; break;
    case 0x10: check = 4; PTH = 0x04; break;
    case 0x50: check = 5; PTH = 0x05; break;
  }
}

// LCD functions: LCD_init(), outcmd(), clear(),
// output_string(), output() — see Phase 3 for full code`,
    wiring: [
      'LCD: PTS[7:4] → D4–D7, PORTE BIT4 → EN, PORTE BIT7 → RS',
      'Keypad: PTS[3:0] rows out, PTS[7:4] columns in (shared with LCD!)',
      'CAN: PM0 → TX, PM1 → RX via CAN transceiver',
      'PTH → 8 debug LEDs',
      'Ensure CAN bus connected to receiver board',
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
    code: `// Receiver Board — Full Main Program
// From: CAN2_Rec_Template/Sources/main.c (complete file)

#include <hidef.h>
#include "derivative.h"
#include "CAN_2.h"

void ADC_Init (void);
unsigned char CAN;              // Data from CAN RX interrupt
void PWM_Init (void);

void main(void) {
  unsigned int x;
  unsigned int z;

  ADC_Init();                   // ADC for potentiometer
  PWM_Init();

  EnableInterrupts;

  DDRH = 0xFF;                  // Debug LEDs
  PERT = 0xFF;
  DDRT = 0x00;
  DDRP = 0xFF;                  // Port P for motor control

  initCAN();

  // ── First while(1): Motor position tracking loop ──
  while (1) {
    PTH = ATD0DR0L;

    if(x <= ATD0DR0L) {
      PTP_PTP5 = 1;             // Forward direction
      PTP_PTP6 = 1;
      for(z=0; z<=20; z++);
      PTP_PTP6 = 0;
      x++;
    } else {
      PTP_PTP5 = 0;             // Reverse direction
      PTP_PTP6 = 1;
      for(z=0; z<=20; z++);
      PTP_PTP6 = 0;
      x--;
    }
  }

  // ── Second while(1): CAN command handler ──
  while (1) {
    PTH = ATD0DR0L;

    while(CAN == 0)             // Wait for CAN command
    {}

    switch(CAN) {
      case 0x01:                // Driver fan speed
        PWME_PWME4 = 1;
        PWMPOL_PPOL4 = 1;
        PWMPRCLK = PWMPRCLK_PCKB1_MASK|PWMPRCLK_PCKB2_MASK;
        PWMPER4 = 0xFA;
        PWMDTY4 = ATD0DR0L;
        PTH = ATD0DR0L;
        PWME_PWME7 = 1;
        PWMPOL_PPOL7 = 1;
        PWMPRCLK = PWMPRCLK_PCKB1_MASK|PWMPRCLK_PCKB2_MASK;
        PWMPER7 = 0xFA;
        PWMDTY7 = ATD0DR0L;
        PTH = ATD0DR0L;
        PTP_PTP4=1;
        transCAN(0xFF,0x01);    // Echo back to controller
        CAN=0;
        break;

      case 0x02:                // Passenger fan speed
        PWME_PWME4 = 1;
        PWMPOL_PPOL4 = 1;
        PWMPRCLK = PWMPRCLK_PCKB1_MASK|PWMPRCLK_PCKB2_MASK;
        PWMPER4 = 0xFA;
        PWMDTY4 = ATD0DR0L;
        PTH = ATD0DR0L;
        PWME_PWME7 = 1;
        PWMPOL_PPOL7 = 1;
        PWMPRCLK = PWMPRCLK_PCKB1_MASK|PWMPRCLK_PCKB2_MASK;
        PWMPER7 = 0xFA;
        PWMDTY7 = ATD0DR0L;
        PTH = ATD0DR0L;
        PTP_PTP3=0;
        transCAN(0xFF,0x02);
        CAN=0;
        break;

      case 0x03:                // Driver fan direction
        transCAN(0xFF,0x03);
        CAN=0;
        break;

      case 0x04:                // Passenger fan direction
        if(x < ATD0DR0L) {
          PTP_PTP5 = 1;
          PTP_PTP6 = 1;
          for(z=0; z<20; z++);
          PTP_PTP6 = 0;
          x++;
        } else {
          PTP_PTP5 = 0;
          PTP_PTP6 = 1;
          for(z=0; z<=20; z++);
          PTP_PTP6 = 0;
          x--;
        }
        transCAN(0xFF,0x04);
        CAN=0;
        break;

      case 0x05:                // Temperature request
        transCAN(0xFF,ATD0DR0L); // Send raw ADC value
        CAN=0;
        break;
    }
  }
}

// ── CAN RX ISR ──
interrupt 38 void CAN_isr (void) {
  CAN = CAN0RXDSR0;
  CAN0RFLG = CAN0RFLG_RXF_MASK;
  PTH = CAN;
}

// ── ADC_Init — see Phase 1 for full annotated version ──
void ADC_Init (void) {
  ATD0CTL2 = 0x80;              // Power on ATD
  ATD0CTL3 = 0x20;              // 4 conversions
  ATD0CTL4 = 0x85;              // 10-bit, prescaler 5
  ATD0CTL5 = 0xA5;              // AN5, right-justified, continuous, multi-ch
}

// ── PWM_Init — see Phase 2 for full annotated version ──
void PWM_Init (void) {
  PWME_PWME4 = 0x10;
  PWMPOL_PPOL4 = 0x10;
  PWMPRCLK = 0x06|0x04;
  PWMPER4 = 0xFA;
}`,
    wiring: [
      'Potentiometer wiper → AN5 (PAD05)',
      'PP4 → Motor A / Driver fan',
      'PP7 → Motor B / Passenger fan',
      'PTP5 → Motor direction control',
      'PTP6 → Motor step clock',
      'CAN: PM0 → TX, PM1 → RX via CAN transceiver',
      'PTH → 8 debug LEDs',
      'Ensure CAN bus connected to controller board',
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
