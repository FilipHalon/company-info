import React, {Component} from 'react';

export default class SearchInput extends Component {
    render() {
        return <input onChange = {this.props.handleChange} />;
    }
}