
export default function DataSources() {
  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>Data Sources</h2>
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Source Name</th>
              <th>Category</th>
              <th>Document Count</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>CMPDI Geological Reports</td>
              <td>Internal</td>
              <td>1,248</td>
              <td>ACTIVE</td>
            </tr>
            <tr>
              <td>CIL Subsidiary Reports</td>
              <td>Subsidiary</td>
              <td>2,361</td>
              <td>ACTIVE</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
