import { ResponsiveBar, ComputedDatum } from "@nivo/bar";

import "./style.scss";

interface ChartBarProps {
  data: Array<{ [key: string]: number | string }>;
  keys: Array<string>;
  maxValue?: number;
  colors: Record<string, string> | string;
  axisBottomLegend?: string;
  direction?: "horizontal" | "vertical";
  height: string;
  chartTitle: string;
}

const ChartBar = ({
  data,
  keys,
  maxValue,
  colors,
  axisBottomLegend,
  direction,
  height,
  chartTitle,
}: ChartBarProps) => {
  const getColor = (
    bar: ComputedDatum<{
      [key: string]: string | number;
    }>,
  ) => (typeof colors !== "string" ? colors[bar.id] : "blue");

  return (
    <div className="chart-bar" style={{ height, minHeight: height, maxHeight: height }}>
      <div className="chart-bar-title">{chartTitle}</div>
      <div className="chart-bar-svg">
        <ResponsiveBar
          maxValue={maxValue}
          data={data}
          keys={keys}
          layout={direction || "vertical"}
          indexBy="group"
          margin={{
            top: 40,
            right: 30,
            bottom: direction === "horizontal" ? 20 : 50,
            left: direction === "horizontal" ? 100 : 30,
          }}
          padding={0.25}
          groupMode="grouped"
          colors={typeof colors === "string" ? colors : getColor}
          borderWidth={2}
          borderColor={"#ffffff"}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: axisBottomLegend,
            legendPosition: "middle",
            legendOffset: 32,
          }}
          labelSkipWidth={6}
          labelSkipHeight={14}
          labelTextColor={{
            from: "color",
            modifiers: [["darker", 3]],
          }}
          legends={[
            {
              dataFrom: "keys",
              anchor: "top",
              direction: "row",
              justify: false,
              translateX: direction === "horizontal" ? -35 : 0,
              translateY: -25,
              itemsSpacing: 10,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: "left-to-right",
              itemOpacity: 0.85,
              symbolSize: 10,
              effects: [
                {
                  on: "hover",
                  style: {
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
        />
      </div>
    </div>
  );
};

export default ChartBar;
