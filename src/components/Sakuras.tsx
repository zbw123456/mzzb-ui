import React from 'react';
import { Link } from 'react-router-dom';
import Table, { ICol } from '../libraries/Table';
import DataWarpper from '../libraries/DataWarpper';
import { formatTimeout } from '../functions/format'
import { useDocumentTitle, useGetJson } from '../hooks';

interface IRow {
  id: number
  key: string
  title: string
  discsSize: number
  modifyTime: number
}

function getCols(): ICol<IRow>[] {
  return [
    { key: 'idx', title: '#', format: (row, idx) => idx + 1 },
    { key: 'title', title: 'Title', format: formatLinkedTitle },
    { key: 'lastUpdate', title: 'Last Update', format: formatLastUpdate },
  ];
}

function formatLinkedTitle(row: IRow) {
  return <Link to={`/discs/sakura/${row.key}`}>{row.title + `(${row.discsSize})`}</Link>
}

function formatLastUpdate(row: IRow) {
  if (!row.modifyTime) return 'Stop Updated'
  return `${formatTimeout(row.modifyTime)}前`
}

export default function Sakuras() {
  useDocumentTitle('Sakuras')
  const sakuras = useGetJson<IRow[]>('/api/sakuras')
  return (
    <div className="Sakuras">
      <DataWarpper
        result={sakuras}
        render={rows => (
          <Table
            rows={rows}
            cols={getCols()}
            sortRow={(a, b) => b.key.localeCompare(a.key)}
          />
        )}
      />
    </div>
  );
}
