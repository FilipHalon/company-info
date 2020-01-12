import React, {Component} from 'react';
import {StyledPaginationButton} from './Styled';

export default class PaginationButton extends Component {
    render() {
        return <StyledPaginationButton onClick = {this.props.handleClick}>{this.props.pageNumber}</StyledPaginationButton>
    }
}