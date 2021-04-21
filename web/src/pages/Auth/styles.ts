import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fd;
  height: 100vh;
`;

export const Main = styled.main`
  background: #fff;
  width: 400px;
  min-height: 450px;
  border-radius: 4px;
  box-shadow: 0 0 4px 2px #eee;
  position: relative;
  display: grid;
  grid-template-rows: max-content 1fr;
  img{
    position: absolute;
    object-fit: cover;
    width: 50px;
    height: 50px;
    top: -100px;
    left: 50%;
    transform: translateX(-50%);
  }
  .types{
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-bottom: 1px solid #ddd;
    span{
      padding: 20px 0;
      text-align: center;
      font-size: 15pt;
      cursor: pointer;
      &.selected{
        background: #C77DFF;
        color: #fff;
        font-weight: 600;
        cursor: not-allowed;
      }
      &.login{
        border-right: 1px solid #ddd;
      }
    }

  }
  .form{
    position: relative;
    display: flex;
    flex-direction: column;
    row-gap: 20px;
    padding: 20px 10px;
    height: 100%;
    .input{
      width: 100%;
      display: flex;
      flex-direction: column;
      row-gap: 5px;
      p{
        display: flex;
        align-items: center;
        column-gap: 5px;
        font-size: 17pt;
        font-weight: 600;
        &,span{
          text-transform: uppercase;
        }
        span{
          font-size: 9pt;
          font-weight: 400;
        }
      }
      input{
        border: none;
        border-bottom: 2px solid #eee;
        outline: none;
        padding: 5px 10px;
        font-size: 13pt;
        :focus{
          border-color: #C77DFF;
        }
      }
      &.error{
        input,span{
          color: #ef233c;
        }
        input{
          border-color: #ef233c;

        }
      }
    }
    button{
      position: absolute;
      right: 10px;
      bottom: 10px;
      width: 125px;
      height: 50px;
      font-size: 15pt;
      font-weight: 600;
      color: #C77DFF;
      border: 2px solid #C77DFF;
      background: transparent;
      border-radius: 2px;
      transition: all .5s;
      cursor: pointer;
      :hover,:active{
        background: #C77DFF;
        color: #fff;
      }
    }
  }
  @media screen and (max-width: 500px){
    box-shadow: none;
    border-radius: none;
    width: 100%;
    min-height: 100%;
    img{
      display: none;
    }
    width: 100vw;
    height: 100vh;
    .types{
      span{
        font-size: 12pt;
      }
    }
    .form{
      .input {
        p {
          font-size: 12pt;
          span{
            font-size: 8pt;
          }
        }
        input {
          font-size: 11pt;
        }
      }
    }
  }
`
