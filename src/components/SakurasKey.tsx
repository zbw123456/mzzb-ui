import React from 'react';
import { RouteChildrenProps } from 'react-router';
import Input from 'antd/lib/input';
import Radio from 'antd/lib/radio';
import Switch from 'antd/lib/switch';
import DataWarpper from '../libraries/DataWarpper';
import { useGetJson, useInput } from '../hooks';
import { ISakura } from './Sakuras';
import Icon from 'antd/lib/icon';

interface Params {
  key: string
}

export default function SakurasKey({ match }: RouteChildrenProps<Params, {}>) {
  const key = match!.params.key;
  const result = useGetJson<ISakura>(`/api/sakuras/key/${key}`)
  return (
    <div className="DiscsKey">
      <DataWarpper
        result={result}
        render={(({ id, key, title, enabled, viewType, modifyTime }) => (
          <div className="form-warpper">
            <Input
              addonBefore={<Icon type="key" />}
              value={key}
            />
            <Input
              addonBefore={<Icon type="tag" />}
              value={title}
            />
            <Input
              addonBefore={<Icon type="sync" />}
              value={new Date(modifyTime).toLocaleString()}
            />
            <div>
              <span style={{ marginRight: 10 }}>列表类型</span>
              <Radio.Group value={viewType}>
                <Radio value="SakuraList">Sakura（已弃用）</Radio>
                <Radio value="PublicList">公开列表</Radio>
                <Radio value="PrivateList">私有列表</Radio>
              </Radio.Group>
            </div>
            <div style={{marginTop: 10}}>
              <span style={{ marginRight: 10 }}>是否更新</span>
              <Switch checked={enabled} />
            </div>
          </div>
        ))}
      />
    </div>
  )
}
