import { Handler } from "@netlify/functions";
import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config({ path: __dirname + "/../../.env.dev" });

const handler: Handler = async (event, context) => {
  const defaultResponseHeader = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Content-Type": "application/json",
  };

  const response = await axios({
    method: "GET",
    url: `http://openAPI.seoul.go.kr:8088/${process.env["REACT_APP_RIVER_LEVEL_SEOUL_API_KEY"]}/json/ListRiverStageService/1/1000`,
  }).then(res => {
    res.data.ListRiverStageService.row.forEach((itm: any) => {
      itm.RIVER_NAME = itm.RIVER_NAME.trim();
    });

    return {
      headers: defaultResponseHeader,
      statusCode: 200,
      body: JSON.stringify(res.data),
    };
  });

  return response;
};

export { handler };
