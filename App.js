"use strict";

import React, { Fragment, Component } from "react";
import ReactDOM from "react-dom";

import "./components/App.scss";

import BlockWindowWrap from "./components/BlockWindowWrap";
import { throws } from "assert";

let SocButtons = require('./src/socButtons.json')
let errorMessage=require('./src/errorMessage.json');



class App extends React.Component {
  state = {
    //содержание ошибки
    errorMessage:errorMessage,

    //состояние подключения
    status:true,
    hasErrors:false,
    //состояние общего меню
    menuOpen: false,

    SocButtonsArr: SocButtons,

    //состояние открытия каждого из окон
    //начальное состояние false=закрыто
    //cht1=CallBack
    //cht2=Mail
    //cht3=Chat
    cht1: false,
    cht2: false,
    cht3: false,

    //счетчик zIndex
    counterZindex: 9000,

    // selectedHash: [],

    zIndexDefault:9000,
    // Zcht1: 9000,
    // Zcht2: 9000,
    // Zcht3: 9000,

  };


  //проверка состояния меню
  menuIsOpen = () => {
    //console.log("click menuIsOpen");
    this.setState({
      menuOpen: !this.state.menuOpen,
    })
  };

  //функция выбранной иконки из меню
  //1=cht1=CallBack
  //2=cht2=Mail
  //3=cht3=Chat
  isSelected = (fieldNumber) => {



    if (fieldNumber === 1) {
      console.log("open CallBack")
      
      // if (!this.state.cht1) {
      //   //console.log("open CallBack")
      //   this.setState({
      //     Zcht1: this.state.zIndexDefault + 1,
      //     Zcht2: this.state.zIndexDefault,
      //     Zcht3: this.state.zIndexDefault-1
          
      //   })
      //   //this.state.selectedHash.push('CallBack');
      // } else {
      //   //console.log("close CallBack")
      //   this.setState({
      //     Zcht1: this.state.zIndexDefault,
      //   })
      //   //let id_name='CallBack';
      //   //let position=this.state.selectedHash.indexOf(id_name);
      //   //if(~position) this.state.selectedHash.splice(position, 1)
      // }
      this.setState({
        cht1: !this.state.cht1,
        counterZindex: this.state.counterZindex+1,//добавляем в счетчик+1
      })
    }
    if (fieldNumber === 2) {
      console.log("open Mail")
      // if (!this.state.cht2) {
      //   //console.log("open Mail")
      //   this.setState({
      //     Zcht1: this.state.zIndexDefault-1,
      //     Zcht2: this.state.zIndexDefault + 1,
      //     Zcht3: this.state.zIndexDefault,
      //   })
      //   //this.state.selectedHash.push('Mail');
      // } else {
      //   //console.log("close Mail")
      //   this.setState({
      //     Zcht2: this.state.zIndexDefault,
      //   })
      //   //let id_name='Mail';
      //   //let position=this.state.selectedHash.indexOf(id_name);
      //   //if(~position) this.state.selectedHash.splice(position, 1)
      // }
      this.setState({
        cht2: !this.state.cht2,
        counterZindex: this.state.counterZindex+1,//добавляем в счетчик+1
      })
    }
    if (fieldNumber === 3) {
      console.log("open Chat")
      // if (!this.state.cht3) {
      //   //console.log("open Chat")
      //   this.setState({
      //     Zcht1: this.state.zIndexDefault-1,
      //     Zcht2: this.state.zIndexDefault,
      //     Zcht3: this.state.zIndexDefault + 1,
      //   })
      //   //this.state.selectedHash.push('Chat');
      // } else {
      //   //console.log("close Chat")
      //   this.setState({
      //     Zcht3: this.state.zIndexDefault,
      //   })
      //   //let id_name='Chat';
      //   //let position=this.state.selectedHash.indexOf(id_name);
      //   //if(~position) this.state.selectedHash.splice(position, 1)
      // }

      this.setState({
        cht3: !this.state.cht3,
        counterZindex: this.state.counterZindex+1,//добавляем в счетчик+1
      })
    }




    this.setState({
      menuOpen: false,
    })
  }

  //функция првоерки закрытого состояния
  //1=cht1=CallBack
  //2=cht2=Mail
  //3=cht3=Chat
  cbCloseStatus = (closedWindow) => {
    if (closedWindow === '1') {
      console.log("close CallBack")
      //let id_name='CallBack';
      //let position=this.state.selectedHash.indexOf(id_name);
      //if(~position) this.state.selectedHash.splice(position, 1)
      this.setState({
        cht1: !this.state.cht1,
      })
    }
    if (closedWindow === '2') {
      console.log("close Mail")
      //let id_name='Mail';
      //let position=this.state.selectedHash.indexOf(id_name);
      //if(~position) this.state.selectedHash.splice(position, 1)
      this.setState({
        cht2: !this.state.cht2,
        changeWindowMail:false,//переключает содержимое окна Mail
      })
    }
    if (closedWindow === '3') {
      console.log("close Chat")
      //let id_name='Chat';
      //let position=this.state.selectedHash.indexOf(id_name);
      //if(~position) this.state.selectedHash.splice(position, 1)
      this.setState({
        cht3: !this.state.cht3,
      })
    }
  }



  //функция изменения Z-index
  cbZindex = (clickOnWindow) => { 
    if (clickOnWindow) {//через кб узнаем, что был клик по одному из окна
      this.setState({
        counterZindex: this.state.counterZindex+1,//добавляем в счетчик+1
      })
    }
  }



  // //функция изменения Z-index
  // cbZindex = (clickOnWindow) => {
  //   if (clickOnWindow==="clickCallBack") {
  //     // console.log('--1')
  //     this.setState({
  //       Zcht1: this.state.zIndexDefault+1,
  //       Zcht2: this.state.zIndexDefault,
  //       Zcht3: this.state.zIndexDefault-1,
  //     })
  //   }
  //   if(clickOnWindow==="clickMail"){
  //     // console.log('--2')
  //     this.setState({
  //       Zcht1: this.state.zIndexDefault-1,
  //       Zcht2: this.state.zIndexDefault+1,
  //       Zcht3: this.state.zIndexDefault,
  //     })
  //   }
  //   if(clickOnWindow==="clickChat"){
  //     // console.log('--3')
  //     this.setState({
  //       Zcht1: this.state.zIndexDefault,
  //       Zcht2: this.state.zIndexDefault-1,
  //       Zcht3: this.state.zIndexDefault+1,
  //     })
  //   }
  // }

  changeValues=()=>{
    this.setState({
      status:!this.state.status,
    })
  }
  changeValues2=()=>{
    this.setState({
      hasErrors:!this.state.hasErrors,
    })
  }

  render() {
    //размеры окна
    let clientWidth = window.innerWidth;
    let clientHeight = window.innerHeight;
    // console.log('counterZindex APP',this.state.counterZindex)
    // console.log("isCallBack",this.state.cht1)

    return (
      <div>
        <div>
          Status Online:<button onClick={this.changeValues}>{String(this.state.status)}</button>
          <br/>
          has Errors:<button onClick={this.changeValues2}>{String(this.state.hasErrors)}</button>
        </div>

        {/* CallBack-заказать звонок */}
        <BlockWindowWrap
          errorMessage={this.state.errorMessage}
          status={this.state.status}
          //hasErrors={this.state.hasErrors}

          CallBack
          // PositionNumber={this.state.selectedHash.indexOf("CallBack")}
          isCallBack={this.state.cht1}
          cbClose={this.cbCloseStatus}


          cbchangeZIndex={this.cbZindex}//узнаем из дочернего компонента о клике
          counterZindex={this.state.counterZindex}//передаем в дочерний компонент актуальное значение Zindex




          //startLeftChat, startTopChat - координаты стартового расположения полей
          startLeftChat={clientWidth - 420}
          startTopChat={clientHeight - 510}
        />

        {/* Mail-ответить email */}
        <BlockWindowWrap
          errorMessage={this.state.errorMessage}
          status={this.state.status}
          //hasErrors={this.state.hasErrors}

          Mail
          // PositionNumber={this.state.selectedHash.indexOf("Mail")}
          isMail={this.state.cht2}
          cbClose={this.cbCloseStatus}

          changeWindowMail={this.state.changeWindowMail}

          cbchangeZIndex={this.cbZindex}
          counterZindex={this.state.counterZindex}

          startLeftChat={clientWidth - 420}
          startTopChat={clientHeight - 480}
        />

        {/* Chat-чат с оператором */}
        <BlockWindowWrap
          errorMessage={this.state.errorMessage}
          status={this.state.status}
          hasErrors={this.state.hasErrors}

          Chat
          // PositionNumber={this.state.selectedHash.indexOf("Chat")}
          isChat={this.state.cht3}
          cbClose={this.cbCloseStatus}

          cbchangeZIndex={this.cbZindex}
          counterZindex={this.state.counterZindex}

          startLeftChat={clientWidth - 420}
          startTopChat={clientHeight - 450}
        />

        <div onClick={this.menuIsOpen} className={this.state.menuOpen ? 'ISocMenuClose' : 'ISocMenu'}>
        </div>

        {/*Перебор с подготовленного JSON всех элементов меню с иконками*/}
        <div className='SocButtons'>
          {this.state.SocButtonsArr.map(v =>
            <div key={v.code}>
              {/* Ниже выборка всех элементов без ссылок */}
              {v.id === 'CallBack' &&//проверка входящего JSON

                <div
                  className={this.state.menuOpen ? "menuSelection" : "null"}
                  onClick={this.state.cht1 ?null: () => this.isSelected(v.code, v.hint)}//передача в isSelected номера выбранного элемента
                  style={this.state.cht1 ? { backgroundImage: v.image2 } : { backgroundImage: v.image }}//от состояния this.state.cht1 меняется иконка в меню
                >
                  <div className={this.state.menuOpen ? 'tooltip' : 'tooltip-none'}>{v.hint}</div>
                </div>

              }
              {v.id === 'Mail' &&//проверка входящего JSON

                <div
                  className={this.state.menuOpen ? "menuSelection" : "null"}
                  onClick={this.state.cht2 ?null: () => this.isSelected(v.code, v.hint)}//передача в isSelected номера выбранного элемента
                  style={this.state.cht2 ? { backgroundImage: v.image2 } : { backgroundImage: v.image }}
                >
                  <div className={this.state.menuOpen ? 'tooltip' : 'tooltip-none'}>{v.hint}</div>
                </div>
              }
              {v.id === 'Chat' &&//проверка входящего JSON

                <div
                  className={this.state.menuOpen ? "menuSelection" : "null"}
                  onClick={this.state.cht3 ?null: () => this.isSelected(v.code, v.hint)}//передача в isSelected номера выбранного элемента
                  style={this.state.cht3 ? { backgroundImage: v.image2 } : { backgroundImage: v.image }}
                >
                  <div className={this.state.menuOpen ? 'tooltip' : 'tooltip-none'}>{v.hint}</div>
                </div>
              }
              {/* Ниже выборка всех элементов с ссылками */}
              {v.way != '' &&//проверка входящего JSON
                <a target="_blank" href={v.way}>
                  <div
                    className={this.state.menuOpen ? "menuSelection" : "null"}
                    onClick={() => this.isSelected(v.code)}//передача в isSelected номера выбранного элемента
                    style={{ backgroundImage: v.image }}
                  >
                    <div className={this.state.menuOpen ? 'tooltip' : 'tooltip-none'}>{v.hint}</div>
                  </div>
                </a>
              }
            </div>
          )}

        </div>
      </div>
    );
  }
}

export default App;

ReactDOM.render(<App />, document.getElementById("container"));
