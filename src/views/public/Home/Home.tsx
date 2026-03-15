import { useState, useLayoutEffect, useMemo } from 'react';
import './Home.scoped.css';

// eslint-disable-next-line import/no-extraneous-dependencies
import { TopoHeatmap, DataItem } from 'react-topojson-heatmap';

import api from '@services/api';
import { Topo } from '@type/GeoMeshes';

const baseUrl = 'https://servicodados.ibge.gov.br/api/v3/malhas';

type ValueType = 'percent' | 'raw';
type RegionData = {
  percent: number;
  raw: number;
  title: string;
};

function Home(): JSX.Element {
  const [meshData, setMeshData] = useState<Topo<'BRUF'> | null>(null);
  const [selectedValueType, setSelectedValueType] =
    useState<ValueType>('percent');

  useLayoutEffect(() => {
    const loadMesh = async (intraregion: 'UF' | 'regiao'): Promise<void> => {
      const { data } = await api.get<Topo<'BRUF'>>(
        `${baseUrl}/paises/BR?formato=application/json&qualidade=minima&intrarregiao=${intraregion}`,
      );

      setMeshData(data);
    };

    void loadMesh('UF');
  }, []);

  const randomData = useMemo(() => {
    if (!meshData) return {};

    const data: { [key: string]: RegionData } = {};
    meshData.objects.BRUF.geometries.forEach(geom => {
      const { codarea } = geom.properties;
      const value = Math.random();
      data[codarea] = {
        percent: value * 100,
        raw: value,
        title: `Region ${codarea}`,
      };
    });

    return data;
  }, [meshData]);

  const formatLegendValue = (value: number): string => {
    if (selectedValueType === 'percent') {
      return `${value.toFixed(1)}%`;
    }
    return value.toFixed(2);
  };

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

  return (
    <div className="container-fluid p-4 bg-dark">
      <div className="row g-4">
        <div className="col-12 col-md-6">
          <div className="card h-100 shadow-sm">
            <div className="card-header">
              <h5 className="card-title mb-0">Discrete Legend Example</h5>
            </div>
            <div className="card-body d-flex align-items-center justify-content-center">
              <div className="map-container">
                {meshData ? (
                  <TopoHeatmap
                    data={randomData}
                    topojson={meshData}
                    idPath="properties.codarea"
                    valueKey={selectedValueType}
                    colorRange={['#8098f6', '#14256b']}
                  >
                    <TopoHeatmap.Legend
                      scaleType="discrete"
                      stepSize={20}
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
                ) : (
                  <p>Carregando...</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="card h-100 shadow-sm">
            <div className="card-header">
              <h5 className="card-title mb-0">Continuous Legend Example</h5>
            </div>
            <div className="card-body d-flex align-items-center justify-content-center">
              <div className="map-container">
                {meshData ? (
                  <TopoHeatmap
                    data={randomData}
                    topojson={meshData}
                    idPath="properties.codarea"
                    valueKey={selectedValueType}
                    colorRange={['#8098f6', '#14256b']}
                  >
                    <TopoHeatmap.Legend
                      scaleType="continuous"
                      stepSize={20}
                      formatter={formatLegendValue}
                      maxValueLabel="Max"
                      minValueLabel="Min"
                    />
                    <TopoHeatmap.Tooltip
                      trigger="click"
                      tooltipContent={tooltipContent}
                    />
                  </TopoHeatmap>
                ) : (
                  <p>Carregando...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
