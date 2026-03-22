import { TopoHeatmap } from 'react-topojson-heatmap';

import { Topo } from '@type/GeoMeshes';
import { ValueType, RegionData } from '@type/HeatmapData';

interface DiscreteLegendMapProps {
  meshData: Topo<'BRGR'> | null;
  data: Record<string, RegionData>;
  valueType: ValueType;
}

function DiscreteLegendMap({
  meshData,
  data,
  valueType,
}: DiscreteLegendMapProps): JSX.Element {
  const formatLegendValue = (value: number): string => {
    if (valueType === 'percent') {
      return `${value.toFixed(1)}%`;
    }
    return value.toFixed(2);
  };

  const getStepSize = (): number => {
    if (valueType === 'percent') {
      return 20;
    }
    return 0.1;
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
        scaleType="discrete"
        stepSize={getStepSize()}
        formatter={formatLegendValue}
      >
        Legend
      </TopoHeatmap.Legend>
      <TopoHeatmap.Tooltip
        float
        trigger="hover"
        tooltipContent={tooltipContent}
      />
    </TopoHeatmap>
  );
}

export default DiscreteLegendMap;
