import * as Services from 'services/api'
import { default as api } from '../constants/api'


const namespace = 'home'
export default {
    namespace: namespace,

    state: {
        userInfo: null
    },

    reducers: {
        updateState(state, { payload }) {
            if (!payload || typeof payload !== 'object' || Object.keys(payload).length === 0) return state
            return Object.assign({}, state, payload)
        }
    },

    effects: {
        *fetch_verify({ payload: {backup, onError} }, { call, put, select}) {
            const { success, data, msg } = yield call(Services.one, {url: api.VERIFY, onError})
            if (success) {
                yield put({
                    type: 'updateState',
                    payload: {
                        userInfo: data
                    }
                })
                if (typeof backup === 'function') {
                    backup(data)
                }
            }
        },
        *fetch_signout({ payload: {backup, onError} }, { call, put, select}) {
            const { success, data, msg } = yield call(Services.remove, {url: api.SIGNOUT, onError})
            if (success) {
                if (typeof backup === 'function') {
                    backup(data)
                }
            }
        }
    }, 
    subscriptions: {
        start: ({ dispatch, history }) => {
            return history.listen(({pathname}) => { 
                if (pathname === 'xxx') {
                    dispatch({
                        type: 'home/updateState',
                        payload: {
                            data: {
                                name: 999
                            }
                        }
                    })
                }                
            })
        }
    }
}