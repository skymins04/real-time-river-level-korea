interface RiverLevelSeoulAPIResonse {
  ListRiverStageService: {
    list_total_count: number;
    RESULT: {
      CODE: string;
      MESSAGE: string;
    };
    row: Array<RiverLevelSeoulDataRow>;
  };
}

interface RiverLevelSeoulDataRow {
  RIVERGAUGE_CODE: string;
  RIVERGAUGE_NAME: string;
  RIVER_NAME: string;
  GU_CODE: string;
  GU_NAME: string;
  STORED_TIME: string;
  TRANSFER_TIME: string;
  CURRENT_LEVEL: number;
  LEVEE_LEVEL: number;
  PLANFLOOD_LEVEL: number;
  ORDINARY_LEVEL: number;
  CONTROL_LEVEL: number;
}

type CityName = "seoul";

interface Cities {
  [cityName: CityName]: Regions;
}

interface Regions {
  svg: {
    width: number;
    height: number;
  };
  regions: {
    [guName: string]: Region;
  };
}

interface Region {
  guName: string;
  target: Ref<SVGPathElement>;
  riverLevel: Array<RiverLevel>;
  averageRiverLevelRatio: number | null;
  svgPath: string;
  svgTextPos: {
    x: number;
    y: number;
  };
}

interface RiverLevel {
  riverName: string;
  rivergaugeName: string;
  currentLevel: number;
  planfloodLevel: number;
  riverLevelRatio: number;
}
