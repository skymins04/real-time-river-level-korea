interface RootState {
  isMobile: boolean;
  selectedCity: CityName;
  selectedRegion: Region | null;
  riverLevelData: RiverLevelSeoulAPIResonse | null;
}
