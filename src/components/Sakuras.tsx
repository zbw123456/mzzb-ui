import React from 'react';
import { Link } from 'react-router-dom';
import DataWarpper from '../libraries/DataWarpper';
import Table, { ICol } from '../libraries/Table';
import { formatTimeout } from '../functions/format'
import { useDocumentTitle, useGetJson } from '../hooks';

interface ISakura {
  id: number
  key: string
  title: string
  enabled: boolean
  discsSize: number
  modifyTime: number
}

function getCols(): ICol<ISakura>[] {
  return [
    { key: 'idx', title: '#', format: (_, idx) => idx + 1 },
    { key: 'title', title: 'Title', format: formatLinkedTitle },
    { key: 'lastUpdate', title: 'Last Update', format: formatLastUpdate },
  ];
}

function formatLinkedTitle(row: ISakura) {
  return <Link to={`/discs/sakura/${row.key}`}>{row.title + `(${row.discsSize})`}</Link>
}

function formatLastUpdate(row: ISakura) {
  if (!row.modifyTime) return 'Stop Updated'
  return `${formatTimeout(row.modifyTime)}前`
}

export default function Sakuras() {
  useDocumentTitle('Sakuras')
  const [result, refresh] = useGetJson<ISakura[]>('/api/sakuras')
  return (
    <div className="Sakuras">
      <DataWarpper
        result={result}
        refresh={refresh}
        render={sakuras => (
          <Table
            mark="Sakuras"
            rows={sakuras}
            cols={getCols()}
            refresh={refresh}
            defaultSort={(a, b) => b.key.localeCompare(a.key)}
          />
        )}
      />
    </div>
  );
}
