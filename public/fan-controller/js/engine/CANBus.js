export class CANBus {
  constructor() {
    this.startTime = performance.now();
    this.seqNum = 0;
  }

  generatePair(state, timestamp) {
    const elapsed = timestamp - this.startTime;
    const timeStr = this._formatTime(elapsed);
    this.seqNum++;

    const engRaw = state.get('engineTempRaw');
    const ambRaw = state.get('ambientTempRaw');
    const engHi = (engRaw >> 8) & 0xFF;
    const engLo = engRaw & 0xFF;
    const ambHi = (ambRaw >> 8) & 0xFF;
    const ambLo = ambRaw & 0xFF;

    const txMsg = {
      timestamp: timeStr,
      direction: 'TX',
      id: '0x100',
      dlc: 8,
      data: [0x01, engHi, engLo, ambHi, ambLo, 0x00, 0x00, this.seqNum & 0xFF],
      description: `Temp: Eng=${Math.round(state.get('engineTempC'))}\u00B0C Amb=${Math.round(state.get('ambientTempC'))}\u00B0C`
    };

    const modeCodes = { AUTO: 0x00, MANUAL: 0x01, SAFETY: 0x02 };
    const mode = state.get('mode');
    const duty = state.get('fanDutyPercent');

    const rxMsg = {
      timestamp: timeStr,
      direction: 'RX',
      id: '0x200',
      dlc: 8,
      data: [0x02, duty, modeCodes[mode] ?? 0x00, 0x00, 0x00, 0x00, 0x00, this.seqNum & 0xFF],
      description: `ACK: Fan=${duty}% Mode=${mode}`
    };

    return [txMsg, rxMsg];
  }

  _formatTime(ms) {
    const totalSec = ms / 1000;
    const min = Math.floor(totalSec / 60);
    const sec = (totalSec % 60).toFixed(3);
    return `${String(min).padStart(2, '0')}:${sec.padStart(6, '0')}`;
  }
}
