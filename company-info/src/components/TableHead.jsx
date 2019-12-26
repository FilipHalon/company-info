import React, {Component} from 'react';

export default class TableHead extends Component {
    render () {
        return (         
            <div id="head" onClick={this.props.handleClick}>
                <span id="head-id">id</span>
                <span id="head-name">name</span>
                <span id="head-city">city</span>
                <span id="head-total-income">total income</span>
                <span id="head-avg-income">average income</span>
                <span id="head-last-month-income">last month income</span>
            </div>
        )
    }
}