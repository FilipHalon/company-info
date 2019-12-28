import React, {Component} from 'react';

export default class TableRow extends Component {
    render () {
        const {company} = this.props;
        return (
            <div className="row">
                <span className="column-id">{company.id}</span>
                <span className="column-name">{company.name}</span>
                <span className="column-city">{company.city}</span>
                <span className="column-total-income">{company.totalIncome}</span>
                <span className="column-avg-income">{company.avgIncome}</span>
                <span className="column-last-month-income">{company.lastMonthIncome}</span>
            </div>
        )
    }
}