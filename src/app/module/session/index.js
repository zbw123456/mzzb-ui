import produce from 'immer'
import {fetchHandler, sessionManager} from '../../manager'
import {hideLoginFrame, showAlertFrame} from '../appbar'

const ACTION_SESSION_LOGIN = '@@session/SESSION_LOGIN'
const ACTION_SESSION_LOGOUT = '@@session/SESSION_LOGOUT'

const initState = {
  isLogged: false
}

export default function sessionReducer(state = initState, action) {
  return produce(state, draft => {
    switch (action.type) {
      case ACTION_SESSION_LOGIN:
        draft.isLogged = true
        draft.userName = action.userName
        draft.authRole = action.authRole
        break
      case ACTION_SESSION_LOGOUT:
        draft.isLogged = false
        draft.userName = undefined
        draft.authRole = undefined
        break
      default:
    }
  })
}

function sessionLogin(userName, authRole) {
  return {
    type: ACTION_SESSION_LOGIN, userName, authRole
  }
}

function sessionLogout() {
  return {
    type: ACTION_SESSION_LOGOUT
  }
}

export function submitCheck() {
  return fetchHandler({
    fetchCall: () => sessionManager.check(),
    fetchDone: (json, dispatch) => {
      if (json.success) {
        dispatch(sessionLogin(json['username'], json['roles']))
      } else {
        dispatch(sessionLogout())
      }
    }
  })
}

export function submitLogin(username, password) {
  return fetchHandler({
    fetchCall: () => sessionManager.login(username, password),
    fetchDone: (json, dispatch) => {
      if (json.success) {
        dispatch(hideLoginFrame())
        dispatch(submitCheck())
      } else {
        dispatch(showAlertFrame('Login failed! Check username and password'))
      }
    }
  })
}

export function submitLogout() {
  return fetchHandler({
    fetchCall: () => sessionManager.logout(),
    fetchDone: (json, dispatch) => {
      dispatch(submitCheck())
    }
  })
}
