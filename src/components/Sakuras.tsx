import React from 'react';
import { Link } from 'react-router-dom';
import DataWarpper from '../libraries/DataWarpper';
import Table, { ICol } from '../libraries/Table';
import { formatTimeout } from '../functions/format'
import { useDocumentTitle, useGetJson } from '../hooks';
import './Sakuras.scss';
import Icon from 'antd/lib/icon';

export interface ISakura {
  id: number
  key: string
  title: string
  enabled: boolean
  discsSize: number
  viewType: string
  modifyTime: number
}

function getCols(): ICol<ISakura>[] {
  return [
    { key: 'idx', title: '#', format: (_, idx) => idx + 1 },
    { key: 'title', title: '列表标题', format: formatLinkedTitle },
    { key: 'lastUpdate', title: '最后更新', format: formatLastUpdate },
    { key: 'command', title: '操作', format: formatCommand }
  ];
}

function formatLinkedTitle(row: ISakura) {
  return (
    <Link to={`/discs/sakura/${row.key}`}>
      {row.title + `(${row.discsSize})`}
    </Link>
  )
}

function formatLastUpdate(row: ISakura) {
  if (!row.modifyTime) return '停止更新'
  return `${formatTimeout(row.modifyTime)}前`
}

function formatCommand(row: ISakura) {
  return (
    <Link to={`/sakuras/${row.key}`}><Icon type="edit" /></Link>
  )
}

export default function Sakuras() {
  useDocumentTitle('Sakuras')
  const result = useGetJson<ISakura[]>('/api/sakuras')
  return (
    <div className="Sakuras">
      <DataWarpper
        result={result}
        render={sakuras => (
          <Table
            mark="Sakuras"
            rows={sakuras}
            cols={getCols()}
            refresh={result.refresh}
            defaultSort={(a, b) => b.key.localeCompare(a.key)}
          />
        )}
      />
    </div>
  );
}
