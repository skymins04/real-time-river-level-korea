import { ResponsiveBar, ComputedDatum } from "@nivo/bar";

interface ChartBarProps {
  data: Array<{ [key: string]: number | string }>;
  keys: Array<string>;
  maxValue?: number;
  colors: Record<string, string> | string;
  axisBottomLegend?: string;
  direction?: "horizontal" | "vertical";
}

const ChartBar = ({ data, keys, maxValue, colors, axisBottomLegend, direction }: ChartBarProps) => {
  const getColor = (
    bar: ComputedDatum<{
      [key: string]: string | number;
    }>,
  ) => (typeof colors !== "string" ? colors[bar.id] : "blue");

  return (
    <ResponsiveBar
      maxValue={maxValue}
      data={data}
      keys={keys}
      layout={direction || "vertical"}
      indexBy="group"
      margin={{ top: 10, right: 30, bottom: 90, left: direction === "horizontal" ? 100 : 30 }}
      padding={0.25}
      groupMode="grouped"
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={typeof colors === "string" ? colors : getColor}
      borderWidth={2}
      borderColor={"#ffffff"}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: axisBottomLegend,
        legendPosition: "middle",
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "",
        legendPosition: "middle",
        legendOffset: -40,
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
          anchor: "bottom",
          direction: "row",
          justify: false,
          translateX: direction === "horizontal" ? -35 : 0,
          translateY: 70,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: "top-to-bottom",
          itemOpacity: 0.85,
          symbolSize: 15,
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
  );
};

export default ChartBar;
