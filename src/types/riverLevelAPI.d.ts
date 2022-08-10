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

interface Regions {
  [guName: string]: {
    target: Ref<SVGPathElement>;
    riverLevel: Array<RiverLevel>;
  };
}

interface RiverLevel {
  currentLevel: number;
  planfloodLevel: number;
  riverLevelRatio: number;
}
