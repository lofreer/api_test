import * as Services from 'services/api'
import { default as api } from 'constants/api'
import { objectToString } from 'utils'

const namespace = 'overview'
export default {
    namespace: namespace,

    state: {
        
    },

    reducers: {
        updateState(state, { payload }) {
            if (!payload || typeof payload !== 'object' || Object.keys(payload).length === 0) return state
            return Object.assign({}, state, payload)
        }
    },

    effects: {
        *fetch_get({ payload: {url, header, query,  backup, onError} }, { call, put, select}) {
            url = `${url}?cond=${JSON.stringify(query)}`
            const { success, data, msg } = yield call(Services.get, {url, header, onError})
            if (success) {
                if (typeof backup === 'function') {
                    backup(data)
                }
            }
        },
        *fetch_post({ payload: {url, header, body,  backup, onError} }, { call, put, select}) {
            const { success, data, msg } = yield call(Services.post, {url, header, body, onError})
            if (success) {
                if (typeof backup === 'function') {
                    backup(data)
                }
            }
        },
        *fetch_put({ payload: {url, header, body,  backup, onError} }, { call, put, select}) {
            const { success, data, msg } = yield call(Services.put, {url, header, body, onError})
            if (success) {
                if (typeof backup === 'function') {
                    backup(data)
                }
            }
        },
        *fetch_delete({ payload: {url, header, body,  backup, onError} }, { call, put, select}) {
            const { success, data, msg } = yield call(Services.delete, {url, header, body, onError})
            if (success) {
                if (typeof backup === 'function') {
                    backup(data)
                }
            }
        }
    }, 
    subscriptions: {
        setup: ({ dispatch, history }) => {
            // return history.listen(({pathname}) => { 
                            
            // })
        }
    }
}