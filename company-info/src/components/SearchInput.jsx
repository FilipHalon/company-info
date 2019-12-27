import React, {Component} from 'react';

export default class SearchInput extends Component {
    render() {
        return (
            <label htmlFor="">
                Search: <input onChange = {this.props.handleChange} />
            </label>
        )
    }
}