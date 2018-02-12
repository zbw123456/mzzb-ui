import {connect} from 'react-redux'

function mapDispatch(onEnter) {
  return (dispatch) => {
    onEnter(dispatch)
    return {dispatch}
  }
}

export default function (mapState, onEnter, component) {
  return connect(mapState, mapDispatch(onEnter))(component)
}
