import styled from 'styled-components';

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: grid;
  grid-template-rows: 1fr max-content;
  background: #f8f9fd;
  footer{
    background: #C77DFF;
    display: flex;
    align-items: center;
    column-gap: 20px;
    padding: 10px 20px;
    textarea{
      width: 100%;
      resize: none;
      outline: none;
      font-size: 18pt;
      padding: 5px 10px;
      border: none;
      border-radius: 20px;
      box-shadow: 0 0 2px 1px #ddd;
    }
    svg{
      width: 30px;
      height: 30px;
      color: #fff;
      cursor: pointer;
      transform: scale(1.5);
    }
  }
`;
