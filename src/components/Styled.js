import styled from 'styled-components';

const buttonColor = 'hsl(40, 75%, 45%)'

export const StyledPaginationButton = styled.button`
    height: 3.5vh;
    width: 13%;
    max-height: 2.6vw;
    max-width: 40px;
    margin: .4vw;
    font-size: 90%;
    border: solid ${buttonColor} 1px;
    background-color: white;
    -webkit-transition-duration: 0.4s;
    transition-duration: 0.4s;

    $:hover {
        cursor: pointer;
        background-color: var(--table-header-font-color);
    }

    @media (min-width: 600px) {
        width: 10%;
    }

    @media (min-width: 800px) {
        width: 5%;
    }
`;
