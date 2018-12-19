import React from 'react';
import Alert from 'antd/lib/alert';
import Table, { ICol } from '../libraries/Table';
import { useDocumentTitle, useGetJson } from '../hooks';
import { formatTimeout } from '../functions/format'

interface IRow {
  id: number
  key: string
  title: string
  modifyTime: number
}

function getCols(): ICol<IRow>[] {
  return [
    { key: 'idx', title: '#', format: (row, idx) => idx + 1 },
    { key: 'title', title: 'Title', format: (row) => row.title },
    { key: 'lastUpdate', title: 'Last Update', format: formatLastUpdate },
  ];
}

function formatLastUpdate(row: IRow) {
  if (!row.modifyTime) return 'Stop Updated'
  return `${formatTimeout(row.modifyTime)}前`
}

function Sakuras() {
  useDocumentTitle('Sakuras')
  const state = useGetJson<IRow[]>('/api/sakuras', { loading: false })
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
