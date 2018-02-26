import { all, takeEvery, takeLatest } from 'redux-saga/effects'
import { appSaga } from '../App/reducer'
import { sakuraSaga } from '../components/sakura/reducer'
import { publicSaga } from '../components/public/reducer'
import { currentSaga } from '../App/current'
import { adminUserSaga } from '../components/admin-user/reducer'
import { adminSakuraSaga } from '../components/admin-sakura/reducer'
import { LOCATION_CHANGE } from 'react-router-redux'

export function* rootSagas() {
  yield all([
    takeLatest('sessionQueryRequest', appSaga.sessionQuery),
    takeLatest('sessionLoginRequest', appSaga.sessionLogin),
    takeLatest('sessionLogoutRequest', appSaga.sessionLogout),

    takeLatest('listSakuraRequest', sakuraSaga.listModel),
    takeLatest('viewSakuraRequest', sakuraSaga.viewModel),

    takeLatest('listPublicRequest', publicSaga.listModel),
    takeLatest('viewPublicRequest', publicSaga.viewModel),

    takeLatest(LOCATION_CHANGE, currentSaga.updateCurrent),
    takeLatest('reloadRequest', currentSaga.reloadCurrent),

    takeLatest('listAdminUserRequest', adminUserSaga.listModel),
    takeEvery('saveAdminUserRequest', adminUserSaga.saveModel),
    takeLatest('editAdminUserRequest', adminUserSaga.editModel),

    takeLatest('listAdminSakuraRequest', adminSakuraSaga.listModel),
    takeEvery('saveAdminSakuraRequest', adminSakuraSaga.saveModel),
    takeLatest('editAdminSakuraRequest', adminSakuraSaga.editModel),
  ])
}
