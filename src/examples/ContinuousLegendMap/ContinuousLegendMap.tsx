// eslint-disable-next-line import/no-extraneous-dependencies
import { TopoHeatmap } from 'react-topojson-heatmap';

import { Topo } from '@type/GeoMeshes';
import { ValueType, RegionData } from '@type/HeatmapData';

interface ContinuousLegendMapProps {
  meshData: Topo<'BRGR'> | null;
  data: Record<string, RegionData>;
  valueType: ValueType;
}

function ContinuousLegendMap({
  meshData,
  data,
  valueType,
}: ContinuousLegendMapProps): JSX.Element {
  const formatLegendValue = (value: number): string => {
    if (valueType === 'percent') {
      return `${value.toFixed(1)}%`;
    }
    return value.toFixed(2);
  };

  const tooltipContent = (meta: RegionData): React.ReactNode => {
    return (
      <div className="d-flex container-fluid flex-column">
        <h3 className="fw-bold text-center text-white">{meta.title}</h3>
        <span>
          <strong>Value: </strong>
          {meta.raw.toLocaleString(undefined, {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })}
        </span>
        <span>
          <strong>Value (%): </strong>
          {meta.percent.toLocaleString(undefined, {
            maximumFractionDigits: 1,
            minimumFractionDigits: 1,
          })}
          %
        </span>
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
        formatter={formatLegendValue}
        maxValueLabel="Max"
        minValueLabel="Min"
      />
      <TopoHeatmap.Tooltip trigger="click" tooltipContent={tooltipContent} />
    </TopoHeatmap>
  );
}

export default ContinuousLegendMap;
