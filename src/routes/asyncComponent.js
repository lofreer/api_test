import React, { Component } from 'react'

export default (importComponent, importModel) => {
    class AsyncComponent extends Component {
        constructor(props) {
            super(props)

            this.state = {
                component: null
            }
        }

        async componentDidMount() {
            const { default: component } = await importComponent()
            if (importModel) {
                const { default: model } = await importModel()
                if (window._store && window._store._models.every(item => item.namespace !== model.namespace)) {
                    window._store.model(model)
                }                
            }
            this.setState({ component })
        }

        render() {
            const C = this.state.component

            return C ? <C {...this.props} /> : null
        }
    }

    return AsyncComponent
}