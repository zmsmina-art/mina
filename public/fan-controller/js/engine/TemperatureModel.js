export class TemperatureModel {
  adcToEngineTemp(rawADC) {
    return (rawADC / 1023) * 120;
  }

  adcToAmbientTemp(rawADC) {
    return (rawADC / 1023) * 70 - 20;
  }

  adcToVoltage(rawADC) {
    return (rawADC / 1023) * 5.0;
  }

  engineTempToADC(tempC) {
    return Math.round((tempC / 120) * 1023);
  }

  ambientTempToADC(tempC) {
    return Math.round(((tempC + 20) / 70) * 1023);
  }

  tempToDuty(tempC) {
    if (tempC < 60) return 0;
    if (tempC < 70) return 25;
    if (tempC < 80) return 50;
    if (tempC < 90) return 75;
    return 100;
  }
}
