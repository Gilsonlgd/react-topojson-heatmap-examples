// eslint-disable-next-line import/no-extraneous-dependencies
import { Topology } from 'react-topojson-heatmap';

type Geometry = {
  type: 'Polygon';
  properties: {
    codarea: string;
  };
  arcs: number[][];
};

export type Topo<T extends string> = Topology<{
  [key in T]: {
    type: 'GeometryCollection';
    bbox: [number, number, number, number];
    geometries: Array<Geometry>;
  };
}>;
