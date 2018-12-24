import React from 'react';
import { RouteChildrenProps } from 'react-router';
import Icon from 'antd/lib/icon';
import Input from 'antd/lib/input';
import Radio from 'antd/lib/radio';
import Button from 'antd/lib/button';
import Switch from 'antd/lib/switch';
import DataWarpper from '../libraries/DataWarpper';
import { useTitle } from '../hooks';
import { useGetJson } from '../hooks/useGetJson';
import { ISakura } from './Sakuras';

interface Params {
  key: string
}

export default function SakurasKey({ match }: RouteChildrenProps<Params, {}>) {
  const key = match!.params.key;
  const result = useGetJson<ISakura>(`/api/sakuras/key/${key}`)
  const title = result.data ? result.data.title : '载入中'
  useTitle(title, [title])
  return (
    <div className="DiscsKey">
      <DataWarpper
        result={result}
        render={(({ id, key, title, enabled, viewType, modifyTime }, loading) => (
          <div className="form-warpper">
            <Input
              addonBefore={<Icon type="key" />}
              value={key}
              onChange={e => {
                result.produce(draft => {
                  draft.key = e.target.value.trim()
                })
              }}
            />
            <Input
              addonBefore={<Icon type="tag" />}
              value={title}
              onChange={e => {
                result.produce(draft => {
                  draft.title = e.target.value.trim()
                })
              }}
            />
            <Input
              readOnly={true}
              addonBefore={<Icon type="sync" />}
              value={new Date(modifyTime).toLocaleString()}
            />
            <div>
              <span style={{ marginRight: 10 }}>列表类型</span>
              <Radio.Group value={viewType} onChange={e => {
                result.produce(draft => draft.viewType = e.target.value)
              }}>
                <Radio value="SakuraList">Sakura（已弃用）</Radio>
                <Radio value="PublicList">公开列表</Radio>
                <Radio value="PrivateList">私有列表</Radio>
              </Radio.Group>
            </div>
            <div style={{ marginTop: 15 }}>
              <span style={{ marginRight: 10 }}>是否更新</span>
              <Switch checked={enabled} onChange={checked => {
                result.produce(draft => draft.enabled = checked)
              }} />
            </div>
            <div style={{ marginTop: 15 }}>
              <Button.Group>
                <Button>保存</Button>
                <Button onClick={result.refresh} loading={loading}>更新</Button>
              </Button.Group>
            </div>
          </div>
        ))}
      />
    </div>
  )
}
