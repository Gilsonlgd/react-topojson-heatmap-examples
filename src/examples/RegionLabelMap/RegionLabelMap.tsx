import { TopoHeatmap } from 'react-topojson-heatmap';

import { Topo } from '@type/GeoMeshes';
import { ValueType, RegionData } from '@type/HeatmapData';

interface RegionLabelMapProps {
  meshData: Topo<'BRGR'> | null;
  data: Record<string, RegionData>;
  valueType: ValueType;
}

function RegionLabelMap({
  meshData,
  data,
  valueType,
}: RegionLabelMapProps): JSX.Element {
  const formatLegendValue = (value: number): string => {
    if (valueType === 'percent') {
      return `${value.toFixed(1)}%`;
    }
    return value.toFixed(2);
  };

  const getRegionLabelContent = (
    regionId: string | number,
    meta: RegionData,
  ): React.ReactNode => {
    const value = meta[valueType] as number;
    return (
      <div className="d-flex container-fluid flex-column align-items-center">
        <h5 className="fw-bold text-center text-white">{regionId}</h5>
        <h4>{formatLegendValue(value)}</h4>
      </div>
    );
  };

  if (!meshData) {
    return <div>Loading...</div>;
  }

  return (
    <TopoHeatmap
      data={data}
      topojson={meshData}
      geoIdPath="properties.codarea"
      valueKey={valueType}
      colorRange={['#8098f6', '#14256b']}
    >
      <TopoHeatmap.Legend
        scaleType="continuous"
        stepSize={20}
        formatter={formatLegendValue}
        maxValueLabel="Max"
        minValueLabel="Min"
      />
      <TopoHeatmap.RegionLabel<RegionData>
        width={120}
        height={100}
        content={getRegionLabelContent}
      />
    </TopoHeatmap>
  );
}

export default RegionLabelMap;
