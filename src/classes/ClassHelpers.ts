export class TwoWayMap {
  map: Map<string, string>;
  reverseMap: Map<string, string>;
  constructor(map: Map<string, string>) {
    this.map = map;

    const reverseMap: Map<string, string> = new Map();
    map.forEach((value, key, _map) => {
      reverseMap.set(value, key);
    });

    this.reverseMap = reverseMap;
  }
  getLanguage(key: string): string | undefined {
    return this.map.get(key);
  }
  getLanguageCode(key: string): string | undefined {
    return this.reverseMap.get(key);
  }
}
