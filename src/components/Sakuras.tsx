import React, { useEffect, useState } from 'react';
import Alert from 'antd/lib/alert';
import request from '../functions/request';
import Table, { ICol } from '../libraries/Table';

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

function getCols(): ICol<IData>[] {
  return [
    { key: 'idx', title: '#', format: (row, idx) => idx + 1 },
    { key: 'title', title: 'Title', format: (row) => row.title },
    { key: 'lastUpdate', title: 'Last Update', format: (row) => formatTime(row.modifyTime) },
  ];
}

function formatTime(time: number) {
  if (!time) return 'Stop Updated'
  return new Date(time).toLocaleString()
}

function Sakuras() {
  const [state, setState] = useState<IState>({ loading: false })
  useEffect(() => {
    request('/api/sakuras')
      .then(json => setState({ loading: true, data: json.data }))
      .catch(error => setState({ ...state, error: error.message }))
  }, [])
  return (
    <div className="Sakuras">
      {state.error && (
        <Alert type="error" message={state.error} />
      )}
      <Table
        rows={state.data}
        cols={getCols()}
        sortRow={(a, b) => b.key.localeCompare(a.key)}
      />
    </div>
  );
}

export default Sakuras
