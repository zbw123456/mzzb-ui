import React from 'react'
import {connect} from 'react-redux'
import Table from '../../libraries/Table'
import {requestHandler} from '../../utils/handler'
import {compareFactory} from '../../utils/factory'
import sakuraManager from '../../services/sakuraManager'
import {updateSakura} from '../../reducers/sakuraReducer'
import {isMobile, showSuccess} from '../../utils/window'
import {rank, surplusDays, title, totalPt} from '../../common/disc'
import {Collapse} from 'antd'

const {Panel} = Collapse

const rankCompare = compareFactory({
  compare: (a, b) => a['thisRank'] - b['thisRank'],
  isEmpty: disc => disc['thisRank'] === 0,
})

const columnsOfPc = [
  rank, totalPt, surplusDays, title
]

const columnsOfMo = [
  rank, title
]

const requestOfPc = [
  'id', 'asin', 'title', 'thisRank', 'prevRank', 'totalPt', 'surplusDays'
]

const requestOfMo = [
  'id', 'asin', 'title', 'thisRank', 'prevRank'
]

function Sakura({doFetchData, data}) {
  const columns = isMobile() ? columnsOfMo : columnsOfPc
  const request = isMobile() ? requestOfMo : requestOfPc
  const style = isMobile() ? {marginLeft: -9, marginRight: -9} : {}

  if (data.length === 0) doFetchData(request)

  data.forEach(s => s['discs'].sort(rankCompare))
  return (
    <div id="sakura">
      <Collapse accordion defaultActiveKey="9999-99">
        {data.map(s =>
          <Panel header={`点击展开或收起：${s['title']}`} key={s['key']}>
            <div style={style}>
              <Table title={s['title']} rows={s['discs']} columns={columns}/>
            </div>
          </Panel>
        )}
      </Collapse>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    data: state.sakura.data
  }
}

function fetchSakuraData(discColumns) {
  return requestHandler({
    fetchCall: () => sakuraManager.lists(discColumns),
    fetchDone: (json, dispatch) => {
      showSuccess('更新Sakura数据成功')
      dispatch(updateSakura(json.data))
    }
  })
}

function mapDispatchToProps(dispatch) {
  return {
    doFetchData(discColumns) {
      dispatch(fetchSakuraData(discColumns))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sakura)