const reducer = (state: any, action: any) => {
  if (state === undefined) {
    return {
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      ),
      selectedCity: "seoul",
      selectedRegion: null,
      riverLevelData: null,
    };
  }

  switch (action.type) {
    case "SELECT_CITY":
      return { ...state, selectedCity: action.selectedCity };
    case "SELECT_REGION":
      return { ...state, selectedRegion: action.selectedRegion };
    case "SET_RIVER_LEVEL_DATA":
      return { ...state, riverLevelData: action.riverLevelData };
  }

  return state;
};

export default reducer;
