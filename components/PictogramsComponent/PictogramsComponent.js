import React, { Fragment, Component } from "react";
import ReactDOM from "react-dom";

import BlockWindowWrap from "../BlockWindowWrap/BlockWindowWrap";

import "./PictogramsComponent.scss";

let SocButtons = require("../../src/socButtons");

// let zzzzzzzzzzzz=require('../../src/chatConfig.js')

class PictogramsComponent extends React.Component {

  static defaultProps = {
    nameChat:"Игорь",
    numberChat: "+375298383838",
    requestFrom:"ib_auth",
    device:"iphone38",
    crmId: "1-6RDFYP0",
} 

  state = {


    //состояние подключения
    //состояние статуса по умолчанию
    status: "ONLINE",


    //состояние общего меню
    menuOpen: false,

    //содержимое пиктограммы
    SocButtonsArr: SocButtons,

    //состояние открытия каждого из окон
    //начальное состояние false=закрыто
    cht1: false,
    cht2: false,
    cht3: false,

    //счетчик zIndex
    counterZindex: 9000,
    zIndexDefault: 9000,

    //получено сообщение при свернетом чате
    receivedMessage: false,
    numberUnreadMessages: 0,



    /////////test
    errorcall:false,
    errormail:false,
    hasErrors: false,
    authorized:false,//менять true false
    /////////////////////////
  };

  //проверка состояния меню
  menuIsOpen = () => {
    //console.log(!this.state.menuOpen? "request Status":"")

    if (this.state.menuOpen === false) {
      try {
        fetch(chatConfig.default.REQUESTServiceHost + chatConfig.default.REQUESTServiceStatus, {
          method: "GET"
        })
          .then(response => response.json())
          .then(json => {
            //console.log(json);
            let answer = json;
            //console.log("Service status",answer)
            this.setState({
              status: answer.status,
              // errorCode: answer.errorCode,
              // exceptionMessage: answer.exceptionMessage
            })
          })
      } catch (error) {
        console.log("--error", error)
      }
    }
    this.setState({
      menuOpen: !this.state.menuOpen
    });
  };

  //функция выбранной иконки из меню
  //1. cht1=CallBack
  //2. cht2=Mail
  //3. cht3=Chat
  isSelected = fieldNumber => {
    if (fieldNumber === 1) {
      //console.log("open CallBack");
      this.setState({
        cht1: !this.state.cht1,
        counterZindex: this.state.counterZindex + 1 //добавляем в счетчик+1
      });
    }
    if (fieldNumber === 2) {
      //console.log("open Mail");
      this.setState({
        cht2: !this.state.cht2,
        counterZindex: this.state.counterZindex + 1 //добавляем в счетчик+1
      });
    }
    if (fieldNumber === 3) {
      //console.log("open Chat");
      this.setState({
        cht3: !this.state.cht3,
        counterZindex: this.state.counterZindex + 1, //добавляем в счетчик+1
        receivedMessage: false,
      });
    }
    this.setState({
      menuOpen: false
    });
  };

  //функция проверки закрытого состояния
  //1. cht1=CallBack
  //2. cht2=Mail
  //3. cht3=Chat
  cbCloseStatus = closedWindow => {
    if (closedWindow === "1") {
      //console.log("close CallBack");
      this.setState({
        cht1: !this.state.cht1
      });
    }
    if (closedWindow === "2") {
      //console.log("close Mail");
      this.setState({
        cht2: !this.state.cht2,
        changeWindowMail: false //переключает содержимое окна Mail
      });
    }
    if (closedWindow === "3") {
      //console.log("close Chat");
      this.setState({
        cht3: !this.state.cht3,
      });
    }
  };

  //функция изменения Z-index
  cbZindex = clickOnWindow => {
    if (clickOnWindow) {
      //через кб узнаем, что был клик по одному из окна
      this.setState({
        counterZindex: this.state.counterZindex + 1 //добавляем в счетчик+1
      });
    }
  };

  //получает и записывает количество непрочитанных сообщений при закрытом чате
  cbgetNumberUnreadMessages = (number) => {
    if (isNaN(number)) {
      console.log("Пусто");
    } else {
      this.setState({
        receivedMessage: true,
        numberUnreadMessages: number,
      })
    }
  }
//////////////////////////////////////////////////////////////////////////////////////
  testCall=()=>{
    this.setState({
      errorcall:!this.state.errorcall,
    })
  }
  testMail=()=>{
    this.setState({
      errormail:!this.state.errormail,
    })
  }

  testStatusON=()=>{
    this.setState({
      status:"ONLINE",
    })
  }
  testStatusOFF=()=>{
    this.setState({
      status:"OFFLINE",
    })
  }
  testHasError=()=>{
    this.setState({
      hasErrors:!this.state.hasErrors,
    })
  }
  testauthorized=()=>{
    this.setState({
      authorized:!this.state.authorized,
    })
  }
//////////////////////////////////////////////////////////////////////////////////////
  render() {
    //размеры окна
    let clientWidth = window.innerWidth;
    let clientHeight = window.innerHeight;
    let scrollTOP=window.pageYOffset || document.documentElement.scrollTop;
    // console.log("status",this.state.status,"errorCode",this.state.errorCode,"exceptionMessage",this.state.exceptionMessage)
    // console.log("---","clientWidth",clientWidth,"clientHeight",clientHeight,"scrollTop",scrollTOP)

    return (
      <div>
        <div className="testPanel">
          <p>test panel</p>
          <br />
          <br />
          <p>clientWidth: {String(clientWidth)}</p>
          <br />
          <p>clientHeight: {String(clientHeight)}</p>
          <br />
          <br />
          -----------------------------------------------
          <p>status: <button onClick={this.testStatusON}>set status ON</button></p>
          <br />
          <p>status: <button onClick={this.testStatusOFF}>set status OFF</button></p>
          <br />
          <p>error: <button onClick={this.testHasError}>{String(this.state.hasErrors)}</button></p>
          <br />
          <p>authorized user: <button onClick={this.testauthorized}>{String(this.state.authorized)}</button></p>
          <br/>
          <br/>
          -----------------------------------------------
          <p>errorCall<button onClick={this.testCall}>{String(this.state.errorcall)}</button></p>
          <br/>
          -----------------------------------------------
          <p>errorMail<button onClick={this.testMail}>{String(this.state.errormail)}</button></p>
        </div>



        {/* CallBack-заказать звонок */}
        <BlockWindowWrap
          CallBack
          isCallBack={this.state.cht1}
          cbClose={this.cbCloseStatus}
          cbchangeZIndex={this.cbZindex} //узнаем из дочернего компонента о клике
          counterZindex={this.state.counterZindex} //передаем в дочерний компонент актуальное значение Zindex
          //startLeftChat, startTopChat - координаты стартового расположения полей
          //startLeftChat={clientWidth - 420}
          startLeftChat={
            clientWidth > 420 ? clientWidth - 420 : clientWidth - 320
          }
          //startTopChat={clientHeight - 510}
          startTopChat={
            clientWidth > 420 ? clientHeight - 510 : clientHeight - 540
          }
          scrollTOP={scrollTOP}

          ////////test
          errorcall={this.state.errorcall}
          /////////////
        />

        {/* Mail-ответить email */}
        <BlockWindowWrap
          Mail
          isMail={this.state.cht2}
          cbClose={this.cbCloseStatus}
          changeWindowMail={this.state.changeWindowMail}
          cbchangeZIndex={this.cbZindex}
          counterZindex={this.state.counterZindex}
          //startLeftChat={clientWidth - 420}
          startLeftChat={
            clientWidth > 420 ? clientWidth - 420 : clientWidth - 320
          }
          //startTopChat={clientHeight - 480}
          startTopChat={
            clientWidth > 420 ? clientHeight - 480 : clientHeight - 540
          }
          scrollTOP={scrollTOP}

          ////////test
          errormail={this.state.errormail}
          /////////////

        />

        {/* Chat-чат с оператором */}
        <BlockWindowWrap
          authorized={this.state.authorized}
          /////////////////////
          //данные и пользователе
          // nameChat:"Игорь",
          // numberChat: "+375298383838",
          // requestFrom:"ib_auth",
          // device:"iphone38",
          // crmId: "1-6RDFYP0",

          nameChat={!this.state.authorized?"":this.props.nameChat}
          numberChat={!this.state.authorized?"":"+375291234556"}
          requestFrom={!this.state.authorized?"site_not_auth":this.props.requestFrom}
          device={!this.state.authorized?"":this.props.device}
          crmId={!this.state.authorized?"":this.props.crmId}
          /////////////


          status={this.state.status}
          Chat
          isChat={this.state.cht3}
          cbClose={this.cbCloseStatus}
          cbchangeZIndex={this.cbZindex}
          counterZindex={this.state.counterZindex}
          cbgetNumberUnreadMessages={this.cbgetNumberUnreadMessages}
          //startLeftChat={clientWidth>320? clientWidth- 300:clientWidth-420}
          startLeftChat={
            clientWidth > 420 ? clientWidth - 420 : clientWidth - 320
          }
          //startTopChat={clientHeight - 450}
          startTopChat={
            clientWidth > 420 ? clientHeight - 450 : clientHeight - 540
          }
          scrollTOP={scrollTOP}

          ////////test
          hasErrors={this.state.hasErrors}
          /////////////          
        />

        <div
          onClick={this.menuIsOpen}
          className={this.state.menuOpen ? "IconsMenuClose" : "IconsMenuOpen"}
        />

        {/*Перебор с подготовленного JSON всех элементов меню с иконками*/}
        <div className="Pictograms">
          <div className={this.state.receivedMessage ? "unreadMessages" : "unreadMessagesNone"} style={this.state.menuOpen ? { bottom: "340px" } : { bottom: "90px" }}>{this.state.numberUnreadMessages}</div>
          {this.state.SocButtonsArr.map(v => (
            <div key={v.code}>
              {/* Ниже выборка всех элементов без ссылок */}
              {v.id === "CallBack" && ( //проверка входящего JSON
                <div
                  className={this.state.menuOpen ? "PictogramSelected" : "null"}
                  onClick={
                    this.state.cht1
                      ? null
                      : () => this.isSelected(v.code, v.hint)
                  } //передача в isSelected номера выбранного элемента
                  style={
                    this.state.cht1
                      ? { backgroundImage: v.image2 }
                      : { backgroundImage: v.image }
                  } //от состояния this.state.cht1 меняется иконка в меню
                >
                  <div
                    className={this.state.menuOpen ? "IconDescription" : "IconDescriptionNone"}
                  >
                    {v.hint}
                  </div>
                </div>
              )}
              {v.id === "Mail" && ( //проверка входящего JSON
                <div
                  className={this.state.menuOpen ? "PictogramSelected" : "null"}
                  onClick={
                    this.state.cht2
                      ? null
                      : () => this.isSelected(v.code, v.hint)
                  } //передача в isSelected номера выбранного элемента
                  style={
                    this.state.cht2
                      ? { backgroundImage: v.image2 }
                      : { backgroundImage: v.image }
                  }
                >
                  <div
                    className={this.state.menuOpen ? "IconDescription" : "IconDescriptionNone"}
                  >
                    {v.hint}
                  </div>
                </div>
              )}
              {v.id === "Chat" && ( //проверка входящего JSON
                <div
                  className={this.state.menuOpen ? "PictogramSelected" : "null"}
                  onClick={
                    this.state.cht3
                      ? null
                      : () => this.isSelected(v.code, v.hint)
                  } //передача в isSelected номера выбранного элемента
                  style={
                    this.state.cht3
                      ? { backgroundImage: v.image2 }
                      : { backgroundImage: v.image }
                  }
                >
                  <div
                    className={this.state.menuOpen ? "IconDescription" : "IconDescriptionNone"}
                  >
                    {v.hint}
                  </div>
                </div>
              )}
              {/* Ниже выборка всех элементов с ссылками */}
              {v.way != "" && ( //проверка входящего JSON
                <a target="_blank" href={v.way}>
                  <div
                    className={this.state.menuOpen ? "PictogramSelected" : "null"}
                    onClick={() => this.isSelected(v.code)} //передача в isSelected номера выбранного элемента
                    style={{ backgroundImage: v.image }}
                  >
                    <div
                      className={
                        this.state.menuOpen ? "IconDescription" : "IconDescriptionNone"
                      }
                    >
                      {v.hint}
                    </div>
                  </div>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default PictogramsComponent;
