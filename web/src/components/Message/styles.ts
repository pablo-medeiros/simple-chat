import styled from 'styled-components';

export const Container = styled.li`
  width: 100%;
  min-width: 300px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  column-gap: 20px;
  &.me{
    flex-direction: row-reverse;
    section{
      background: #9D4EDD;
      color: #fff;
    }
  }
  section{
    max-width: 60%;
    background: #E0AAFF;
    padding: 5px 10px;
    border-radius: 4px;
    font-weight: 500;
    font-size: 15pt;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    row-gap: 10px;
    span{
      font-size: 11pt;
      font-weight: 500;
    }
    p{
      text-align: left;
      width: 100%;
    }
    div{
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      column-gap: 10px;
      span:first-child{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  svg{
    display: none;
    cursor: pointer;
    width: 24px;
    height: 24px;
  }
  :hover{
    svg{
      display: block;
    }
  }
  @media screen and (max-width: 700px){
    section {
      font-size: 13pt;
      row-gap: 5px;
      > span {
        font-size: 9pt;
      }
      div{
        margin-bottom: 5px;
        span{
          font-size: 8pt;
        }
      }
    }
  }
`;

