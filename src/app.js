import React from 'react'
import { render } from 'react-dom'
import { Route, Switch, BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import model from './models'

import Index from './routes/index'
import Signin from './routes/sign/signin'
import Signup from './routes/sign/signup'

import './styles/normalize.css';
import './styles/common.less';

if (module.hot) { module.hot.accept() }

const store = model()

render(
    <Provider store={store}>
        <BrowserRouter>
            <Route path="/" component={Index} />
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
)