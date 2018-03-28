import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import { routerMiddleware, syncHistoryWithStore, routerReducer as routing } from 'react-router-redux'
import createSagaMiddleware from 'redux-saga'
import * as sagaEffects from 'redux-saga/effects'
import createHistory from 'history/createBrowserHistory'
import {
    takeEveryHelper as takeEvery,
    takeLatestHelper as takeLatest,
    throttleHelper as throttle,
} from 'redux-saga/lib/internal/sagaHelpers'


const initialState = {}
const reducers = {routing}
const sagas = []

const app = {
    _models: [],
    _store: null,
    _history: null,    

    model: function(model) {
        this._models.push(checkModel(model))
    },
    start: function() {

        const history = patchHistory(createHistory())               

        for (const m of this._models) {
            reducers[m.namespace] = getReducer(m.reducers, m.state)
            if (m.effects) {
                sagas.push(getSaga(m.effects, m))
            }
        }

        const sagaMiddleware = createSagaMiddleware()
        
        const middlewares = [routerMiddleware(history), sagaMiddleware]
    
        const store = this._store = createStore(combineReducers(reducers), initialState, applyMiddleware(...middlewares))
        
        this._history = syncHistoryWithStore(history, store)

        store.runSaga = sagaMiddleware.run
        store.asyncReducers = {}
        
        sagas.forEach(sagaMiddleware.run)
        
        for (const model of this._models) {
            if (model.subscriptions) {
                runSubscriptions(model.subscriptions, model, this)
            }
        } 
        
        this.model = injectModel.bind(this, createReducer)
    
        return store
    }
}

function handleAction(actionType, reducer = v => v) {
    return (state, action) => {
        const { type } = action
        if (type && actionType !== type) {
            return state
        }
        return reducer(state, action);
    }
}

function reduceReducers(...reducers) {
    return (previous, current) =>
        reducers.reduce(
            (p, r) => r(p, current),
            previous,
        )
  }

function handleActions(handlers, defaultState) {
    const reducers = Object.keys(handlers).map(type => handleAction(type, handlers[type]));
    const reducer = reduceReducers(...reducers);
    return (state = defaultState, action) => reducer(state, action);
}

function prefixType(type, model) {
    const prefixedType = `${model.namespace}/${type}`
    if ((model.reducers && model.reducers[prefixedType])
      || (model.effects && model.effects[prefixedType])) {
      return prefixedType
    }
    return type
}

function createEffects(model) {
    function put(action) {
        const { type } = action
        return sagaEffects.put({ ...action, type: prefixType(type, model) })
    }
    return { ...sagaEffects, put }
  }

function getSaga(effects, model, onError) {
    return function *() {
        for (const key in effects) {
            if (Object.prototype.hasOwnProperty.call(effects, key)) {
                const watcher = getWatcher(key, effects[key], model, onError)
                const task = yield sagaEffects.fork(watcher)
                yield sagaEffects.fork(function *() {
                    yield sagaEffects.take(`${model.namespace}/@@CANCEL_EFFECTS`)
                    yield sagaEffects.cancel(task)
                })
            }
        }
    };
}

function applyOnEffect(fns, effect, model, key) {
    for (const fn of fns) {
        effect = fn(effect, sagaEffects, model, key)
    }
    return effect
 }

function getWatcher(key, _effect, model, onError) {
    let effect = _effect;
    let type = 'takeEvery'
    let ms

    function *sagaWithCatch(...args) {
        try {
            yield effect(...args.concat(createEffects(model)))
        } catch (e) {
            onError && onError(e)
        }
    }

    const onEffect = [];
    const sagaWithOnEffect = applyOnEffect(onEffect, sagaWithCatch, model, key)

    switch (type) {
        case 'watcher':
            return sagaWithCatch
        case 'takeLatest':
            return function*() {
                yield takeLatest(key, sagaWithOnEffect)
            }
        case 'throttle':
            return function*() {
                yield throttle(ms, key, sagaWithOnEffect)
            }
        default:
            return function*() {
                yield takeEvery(key, sagaWithOnEffect)
            }
    }
}

function checkModel(m) {
    const model = { ...m }
    const { namespace, reducers, effects } = model

    if (app._models.some(model => model.namespace === namespace)) {
        throw new Error('model: namespace should be unique')
    }    

    function applyNamespace(type) {
        function getNamespacedReducers(reducers) {
            return Object.keys(reducers).reduce((memo, key) => {
                memo[`${namespace}/${key}`] = reducers[key]
                return memo
            }, {})
        }

        if (model[type]) {
            model[type] = getNamespacedReducers(model[type])
        }
    }

    applyNamespace('reducers')
    applyNamespace('effects')

    return model
}

function getReducer(reducers, state) {
    return handleActions(reducers || {}, state)
}

function runSubscriptions(subs, model, app) {
    for (const key in subs) {
        if (Object.prototype.hasOwnProperty.call(subs, key)) {
            const sub = subs[key]
            const unlistener = sub({
                dispatch: createDispatch(_store.dispatch, model),
                history: app._history,
            })
        }
    }
}

function createDispatch(dispatch, model) {
    return (action) => {
        const { type } = action
        return dispatch({ ...action, type: prefixType(type, model) })
    }
}

function patchHistory(history) {
    const oldListen = history.listen
    history.listen = (callback) => {
        callback(history.location)
        return oldListen.call(history, callback)
    }
    return history
}

function injectModel(createReducer, m) {
    m = checkModel(m)
    this._models.push(m)
    const store = this._store
    store.asyncReducers[m.namespace] = getReducer(m.reducers, m.state)
    store.replaceReducer(createReducer(reducers, store.asyncReducers))
    // effects
    if (m.effects) {
        store.runSaga(getSaga(m.effects, m))
    }
    // subscriptions
    if (m.subscriptions) {
        runSubscriptions(m.subscriptions, m, this)
    }
}

function createReducer(reducers, asyncReducers) {
    return combineReducers({
      ...reducers,
      ...asyncReducers,
    })
}

export default () => {
    return app
}