import { Map, Layers } from 'lucide-react';

export default function GeologicalIntelligence() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Geological Intelligence</h1>
        <p className="page-subtitle">Exploration data, stratigraphy, and geological observations.</p>
      </div>

      <div className="card h-[400px] flex items-center justify-center bg-hover mb-6 border-dashed">
        <div className="text-center text-muted">
          <Map size={48} className="mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-primary mb-2">Geospatial Intelligence Layer</h3>
          <p className="text-sm">GIS visualization module placeholder. <br/>(Requires backend map service connection)</p>
        </div>
      </div>

      <div className="grid grid-cols-2">
        <div className="card">
          <h3 className="section-title"><Layers size={20} /> Stratigraphic Summary</h3>
          <div className="table-container mt-4">
            <table>
              <thead>
                <tr>
                  <th>Formation</th>
                  <th>Lithology</th>
                  <th>Depth Range</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Barakar</td>
                  <td>Sandstone, Coal</td>
                  <td>120m - 450m</td>
                </tr>
                <tr>
                  <td>Barren Measures</td>
                  <td>Shale, Sandstone</td>
                  <td>450m - 600m</td>
                </tr>
                <tr>
                  <td>Raniganj</td>
                  <td>Fine Sandstone, Coal</td>
                  <td>600m - 850m</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="card">
          <h3 className="section-title">Extracted Geological Anomalies</h3>
          <div className="flex flex-col gap-3 mt-4">
             <div className="p-3 border border-light rounded-md bg-hover">
               <div className="font-semibold text-sm">Fault Line F1-F1' Extension</div>
               <div className="text-xs text-secondary mt-1">AI detected mentions of fault extension not present in master structural map.</div>
             </div>
             <div className="p-3 border border-light rounded-md bg-hover">
               <div className="font-semibold text-sm">Unexpected Intrusion</div>
               <div className="text-xs text-secondary mt-1">Igneous intrusion noted in borehole BH-42 core logs, affecting seam IV quality.</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
