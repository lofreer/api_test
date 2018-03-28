import Store from 'utils/store'

import Home from './home'

window._store = Store()

_store.model(Home)

export default () => {
    return _store.start()
}