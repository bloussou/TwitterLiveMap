import React from 'react';
import ReactDOM from 'react-dom'
import './css/index.css';

import { BrowserRouter, Switch, Route } from 'react-router-dom';


// Component Imports 
import HostComponent from './host';
import Chart from './charts/Chart';

class RouterApp extends React.Component {
    constructor() {
        super()
        this.state = {
            tag: 'fun'
        }
    }

    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={HostComponent} />
                    <Route path="/chart" render={(props) => (
                        <Chart tag={this.state.tag} />
                    )} />
                </Switch>
            </BrowserRouter>

        )
    }
}

ReactDOM.render(<RouterApp />, document.getElementById('root'));