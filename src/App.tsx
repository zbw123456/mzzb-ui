import React, { useEffect, useState } from 'react';
import './App.css';

interface IData {
  id: number
  key: string
  title: string
  modifyTime: number
}

interface IState {
  loading: boolean
  error?: string
  data?: IData[]
}

function App() {
  const [state, setState] = useState<IState>({ loading: false })
  useEffect(() => {
    fetch('/api/sakuras')
      .then(resp => resp.json())
      .then(json => setState({ loading: true, data: json.data }))
      .catch(error => setState({ ...state, error: error.message }))
  }, [])
  return (
    <div className="App">
      {state.error}
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Last Update</th>
          </tr>
        </thead>
        <tbody>
          {state.data && (
            state.data
              .sort((a, b) => b.key.localeCompare(a.key))
              .map((row, idx) => (
                <tr key={row.id}>
                  <td>{idx + 1}</td>
                  <td>{row.title}</td>
                  <td>{formatTime(row.modifyTime)}</td>
                </tr>
              ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function formatTime(time: number) {
  if (!time) return 'Stop Updated'
  return new Date(time).toLocaleString()
}

export default App;
