export class TwoWayMap {
  map;
  reverseMap;
  constructor(map: Map<string, string>) {
    this.map = map;

    const reverseMap: Map<string, string> = new Map();
    map.forEach((value, key, map) => {
      reverseMap.set(value, key);
    });

    this.reverseMap = reverseMap;
  }
  getLanguage(key: string) {
    return this.map.get(key);
  }
  getLanguageCode(key: string) {
    return this.reverseMap.get(key);
  }
}
