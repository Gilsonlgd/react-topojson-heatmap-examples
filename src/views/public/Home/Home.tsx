import { useState, useLayoutEffect, useMemo } from 'react';
import './Home.scoped.css';

import api from '@services/api';
import { Topo } from '@type/GeoMeshes';
import { ValueType, RegionData } from '@type/HeatmapData';

import {
  DiscreteLegendMap,
  ContinuousLegendMap,
  RegionLabelMap,
  TooltipMap,
} from '@examples';

const baseUrl = 'https://servicodados.ibge.gov.br/api/v3/malhas';

function Home(): JSX.Element {
  const [meshData, setMeshData] = useState<Topo<'BRGR'> | null>(null);
  const [selectedValueType, setSelectedValueType] =
    useState<ValueType>('percent');

  useLayoutEffect(() => {
    const loadMesh = async (intraregion: 'UF' | 'regiao'): Promise<void> => {
      const { data } = await api.get<Topo<'BRGR'>>(
        `${baseUrl}/paises/BR?formato=application/json&qualidade=minima&intrarregiao=${intraregion}`,
      );
      setMeshData(data);
    };

    void loadMesh('regiao');
  }, []);

  const randomData = useMemo(() => {
    if (!meshData) return {};

    const data: Record<string, RegionData> = {};
    meshData.objects.BRGR.geometries.forEach(geom => {
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

  return (
    <div className="container-fluid p-4 bg-dark">
      <div className="row">
        <div className="col-12 d-flex align-items-center justify-content-between mb-4">
          <h1 className="text-white">TopoJSON Heatmap Examples</h1>
          <div>
            <label
              htmlFor="valueTypeSelect"
              className="d-flex form-label text-white gap-2 align-items-center mb-0"
            >
              Value Type:
              <select
                id="valueTypeSelect"
                className="form-select d-inline-block w-auto"
                value={selectedValueType}
                onChange={e =>
                  setSelectedValueType(e.target.value as ValueType)
                }
              >
                <option value="percent">Percent</option>
                <option value="raw">Raw Value</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      <div className="row justify-content-center g-4">
        <div className="col-12 text-center">
          <h2 className="text-white">Children Components</h2>
        </div>
        <div className="col-12 col-md-6">
          <div className="card h-100 shadow-sm">
            <div className="card-header">
              <h5 className="card-title mb-0">Region Label Example</h5>
            </div>
            <div className="card-body d-flex align-items-center justify-content-center">
              <div className="map-container">
                <RegionLabelMap
                  meshData={meshData}
                  data={randomData}
                  valueType={selectedValueType}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="card h-100 shadow-sm">
            <div className="card-header">
              <h5 className="card-title mb-0">Tooltip Example</h5>
            </div>
            <div className="card-body d-flex align-items-center justify-content-center">
              <div className="map-container">
                <TooltipMap
                  meshData={meshData}
                  data={randomData}
                  valueType={selectedValueType}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="card h-100 shadow-sm">
            <div className="card-header">
              <h5 className="card-title mb-0">Discrete Legend Example</h5>
            </div>
            <div className="card-body d-flex align-items-center justify-content-center">
              <div className="map-container">
                <DiscreteLegendMap
                  meshData={meshData}
                  data={randomData}
                  valueType={selectedValueType}
                />
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
                <ContinuousLegendMap
                  meshData={meshData}
                  data={randomData}
                  valueType={selectedValueType}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
