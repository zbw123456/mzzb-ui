import { AnyAction } from 'redux'
import { call, put } from 'redux-saga/effects'
import { BaseState, PageInfo } from '../../common/root-reducer'
import { BaseModel, Manager } from '../../utils/manager'
import produce from 'immer'

export const pageInfo: PageInfo = {
  pageTitle: '推荐列表',
  matchPath: '/list',
  pageModel: 'List',
  modelName: '列表',
  searchFor: 'key',
  component: () => import('.')
}

export interface DiscModel extends BaseModel {
  thisRank: number
  prevRank: number
  totalPt: number
  title: string
}

export interface SakuraModel extends BaseModel {
  key: string
  title: string
  enabled: boolean
  viewType: string
  modifyTime: number
  discs: DiscModel[]
}

export interface SakuraState extends BaseState<SakuraModel> {
}

const initState: SakuraState = {
  pageInfo
}

export const sakuraReducer = (state: SakuraState = initState, action: AnyAction) => {
  return produce(state, draftState => {
    switch (action.type) {
      case `list${pageInfo.pageModel}Succeed`:
        draftState.models = action.models
        draftState.message = undefined
        break
      case `list${pageInfo.pageModel}Failed`:
        draftState.message = action.message
        break
      case `view${pageInfo.pageModel}Succeed`:
        draftState.detail = action.detail
        draftState.message = undefined
        break
      case `view${pageInfo.pageModel}Failed`:
        draftState.message = action.message
        break
      default:
    }
  })
}

const manager = new Manager<SakuraModel>('/api/lists')

function* listModel() {
  const result = yield call(manager.findAll)
  if (result.success) {
    yield put({type: `list${pageInfo.pageModel}Succeed`, models: result.data})
  } else {
    yield put({type: `list${pageInfo.pageModel}Failed`, message: result.message})
  }
}

function* viewModel(action: AnyAction) {
  const result = yield call(manager.findList, action.search, action.value, 'discs')
  if (result.success) {
    yield put({type: `view${pageInfo.pageModel}Succeed`, detail: result.data})
  } else {
    yield put({type: `view${pageInfo.pageModel}Failed`, message: result.message})
  }
}

export const sakuraSaga = {listModel, viewModel}
