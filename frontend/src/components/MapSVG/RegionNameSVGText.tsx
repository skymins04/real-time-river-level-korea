import { useTranslation } from "react-i18next";

interface RegionNameSVGTextProps {
  x: number;
  y: number;
  regionName: string;
  averageRiverLevelRatio: number | null;
}

const RegionNameSVGText = ({
  x,
  y,
  regionName,
  averageRiverLevelRatio,
}: RegionNameSVGTextProps) => {
  const { t } = useTranslation(["region"]);

  return (
    <text x={x} y={averageRiverLevelRatio ? y - 8 : y}>
      {t(`region:REGION_${regionName}`)}
      {averageRiverLevelRatio && (
        <tspan x={x + 3} y={y + 8}>
          {(averageRiverLevelRatio * 100).toFixed(2)} %
        </tspan>
      )}
    </text>
  );
};

export default RegionNameSVGText;
