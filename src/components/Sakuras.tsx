import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/lib/Table'
import Alert from 'antd/lib/alert'

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

function Sakuras() {
  const [state, setState] = useState<IState>({ loading: false })
  useEffect(() => {
    fetch('/api/sakuras')
      .then(resp => {
        if (resp.ok) {
          return resp.json()
        } else {
          throw new Error(`${resp.status} ${resp.statusText}`)
        }
      })
      .then(json => setState({ loading: true, data: json.data }))
      .catch(error => setState({ ...state, error: error.message }))
  }, [])
  return (
    <div className="Sakuras">
      {state.error && (
        <Alert type="error" message={state.error} />
      )}
      <Table bordered={true} striped={true} hover={true}>
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
      </Table>
    </div>
  );
}

export default Sakuras

function formatTime(time: number) {
  if (!time) return 'Stop Updated'
  return new Date(time).toLocaleString()
}
