import { useState } from 'react';
import './MainExampleMap.css';
// eslint-disable-next-line import/no-extraneous-dependencies
import { TopoHeatmap } from 'react-topojson-heatmap';

import { Topo } from '@type/GeoMeshes';
import { ValueType, RegionData } from '@type/HeatmapData';

interface MainExampleMapProps {
  meshData: Topo<'BRGR'> | null;
  data: Record<string, RegionData>;
  valueType: ValueType;
}

function MainExampleMap({
  meshData,
  data,
  valueType,
}: MainExampleMapProps): JSX.Element {
  const [selectedGeos, setSelectedGeos] = useState<string[]>([]);

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
    <div className="main-map-container d-flex flex-column align-items-center justify-content-center gap-4">
      <TopoHeatmap
        data={data}
        topojson={meshData}
        geoIdPath="properties.codarea"
        valueKey={valueType}
        colorRange={['#38d9a9', '#ffd43b', '#ff6b6b']}
        onSelect={geos => {
          setSelectedGeos(geos.map(g => g.properties.codarea as string));
        }}
      >
        <TopoHeatmap.Legend
          height={150}
          scaleType="continuous"
          formatter={formatLegendValue}
          maxValueLabel="Max"
          minValueLabel="Min"
        />
        <TopoHeatmap.Tooltip
          float
          tooltipContent={(meta: RegionData) => tooltipContent(meta)}
        />
      </TopoHeatmap>

      <span className="selected-regions">
        <strong>Selected Regions: </strong>
        {selectedGeos.length > 0
          ? selectedGeos.join(', ')
          : 'None (Click on regions to select)'}
      </span>
    </div>
  );
}

export default MainExampleMap;
