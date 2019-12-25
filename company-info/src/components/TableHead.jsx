import React, {Component} from 'react';

export default class TableHead extends Component {
    render () {
        return (         
            <div className="head">
                <span>id</span>
                <span>name</span>
                <span>city</span>
                <span>total income</span>
                <span>average income</span>
                <span>last month income</span>
            </div>
        )
    }
}