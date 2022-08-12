import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";

const useRiverLevelData = () => {
  const reduxDispatch = useDispatch();
  const [riverLevelDataState, setRiverLevelData] = useState<RiverLevelSeoulAPIResonse | null>(null);

  const getRiverLevelData = (city: CityName) => {
    if (city === "seoul") {
      axios({
        method: "GET",
        url: `http://openAPI.seoul.go.kr:8088/${process.env["REACT_APP_RIVER_LEVEL_SEOUL_API_KEY"]}/json/ListRiverStageService/1/1000`,
      }).then(res => {
        (res.data as RiverLevelSeoulAPIResonse).ListRiverStageService.row.forEach(itm => {
          itm.RIVER_NAME = itm.RIVER_NAME.trim();
        });
        setRiverLevelData(res.data as RiverLevelSeoulAPIResonse);
      });
    }
  };

  useEffect(() => {
    reduxDispatch({ type: "SET_RIVER_LEVEL_DATA", riverLevelData: riverLevelDataState });
  }, [riverLevelDataState]);

  return getRiverLevelData;
};

export default useRiverLevelData;
