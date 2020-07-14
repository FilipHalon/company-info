import styled from 'styled-components';

const buttonColor = 'hsl(40, 75%, 45%)'

export const StyledTable = styled.section`
    margin: auto 5vw;
    width: 100%;
    max-width: 1400px;
`;

export const StyledInputArea = styled.div`
    width: 100%;
    margin-top: 3vh;
    margin-bottom: 2.6vw;
    font-size: 73%;

    @media (min-width: 600px) {
        font-size: 90%;
    }

    @media (min-width: 800px) {
        height: 1.5vh;
        font-size: 100%;
    }
`;

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
        background-color: ${buttonColor};
    }

    @media (min-width: 600px) {
        width: 10%;
    }

    @media (min-width: 800px) {
        width: 5%;
    }
`;
