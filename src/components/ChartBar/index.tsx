import { ResponsiveBar, ComputedDatum } from "@nivo/bar";

interface ChartBarProps {
  data: Array<{ [key: string]: number | string }>;
  keys: Array<string>;
  maxValue?: number;
  colors: Record<string, string>;
  axisBottomLegend: string;
}

const ChartBar = ({ data, keys, maxValue, colors, axisBottomLegend }: ChartBarProps) => {
  const getColor = (
    bar: ComputedDatum<{
      [key: string]: string | number;
    }>,
  ) => colors[bar.id];

  return (
    <ResponsiveBar
      maxValue={maxValue}
      data={data}
      keys={keys}
      layout={"vertical"}
      indexBy="rivergauge"
      margin={{ top: 10, right: 30, bottom: 90, left: 30 }}
      padding={0.3}
      groupMode="grouped"
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={getColor}
      borderColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
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
          translateX: 0,
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
