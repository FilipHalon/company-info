import React, {Component} from 'react';

export default class PaginationButton extends Component {
    render() {
    return <button onClick = {this.props.handleClick}>{this.props.pageNumber}</button>
    }
}