import React, {Component} from 'react';

export default class TableHead extends Component {
    render () {
        return (         
            <div id="head" onClick={this.props.handleClick}>
                <span id="id">id</span>
                <span id="name">name</span>
                <span id="city">city</span>
                <span id="totalIncome">total income</span>
                <span id="avgIncome">average income</span>
                <span id="lastMonthIncome">last month income</span>
            </div>
        )
    }
}