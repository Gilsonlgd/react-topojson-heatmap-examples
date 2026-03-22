import { TopoHeatmap, DataItem } from 'react-topojson-heatmap';

import { Topo } from '@type/GeoMeshes';
import { ValueType, RegionData } from '@type/HeatmapData';

interface TooltipMapProps {
  meshData: Topo<'BRGR'> | null;
  data: Record<string, RegionData>;
  valueType: ValueType;
}

function TooltipMap({
  meshData,
  data,
  valueType,
}: TooltipMapProps): JSX.Element {
  const tooltipContent = (meta: DataItem): React.ReactNode => {
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
      <TopoHeatmap.Tooltip
        float
        trigger="hover"
        tooltipContent={tooltipContent}
      />
    </TopoHeatmap>
  );
}

export default TooltipMap;
