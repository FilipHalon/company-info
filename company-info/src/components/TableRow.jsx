import React, {Component} from 'react';

export default class TableRow extends Component {
    render () {
        const {company} = this.props;
        return (
            <div className="row">
                <span>{company.id}</span>
                <span>{company.name}</span>
                <span>{company.city}</span>
                <span>{company.totalIncome}</span>
                <span>{company.avgIncome}</span>
                <span>{company.lastMonthIncome}</span>
            </div>
        )
    }
}