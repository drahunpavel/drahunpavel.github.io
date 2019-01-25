import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import './CallBackComponent.scss';

let callbackThemes = require("../../src/callbackThemesA.json");
let callbackTimes = require("../../src/callbackTimes.json");


let chatConfig=require('../../src/chatConfig.js')
class CallBackComponent extends React.PureComponent {

    static defaultProps = {
        //openCallBack //открыто/закрыто окно
    }

    state = {
        closeWindowCallBack: false, //состояние окна открыто/закрыто

        nameCallBack: "",
        numberCallBack: "",

        //состояние ошибки валидации
        nameCallBackIsEmpty: false,
        numberCallBackIsEmpty: false,

        //require callbackThemesA,callbackTimes
        callbackThemes: callbackThemes,
        callbackTimes: callbackTimes,
    }
    //задержка в пол секунды
    timerCom = null;

    WindowButtonStartCallBack = () => {
        this.props.getWindowСondition("showThanksCallBack");
        let fieldSelect1 = ReactDOM.findDOMNode(this.refs.fieldSelect1).value;//поле темы        
        let fieldSelect2 = ReactDOM.findDOMNode(this.refs.fieldSelect2).value;//поле даты

        let data = "<SOAP-ENV:Envelope xmlns:SOAP-ENV='http://schemas.xmlsoap.org/soap/envelope/' xmlns:SOAP-ENC='http://schemas.xmlsoap.org/soap/encoding/' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:m0='http://schemas.datacontract.org/2004/07/BPSSberbankIvrAppServer.DataContracts'>" +
            "<SOAP-ENV:Body>" +
            "<m:RegisterSiteCallback xmlns:m='http://cisco.com/pcceappserver/'>" +
            "<m:requestSiteCallbackInfo>" +
            "<m0:PhoneNumber>" + this.state.numberCallBack.slice(1) + "</m0:PhoneNumber> " +
            "<m0:AccountNumber>" + this.state.numberCallBack.slice(1) + "</m0:AccountNumber>" +
            "<m0:Name>" + this.state.nameCallBack + "</m0:Name> " +
            "<m0:Category>" + fieldSelect1 + "</m0:Category>" +
            " <m0:CallbackDateTime>" + fieldSelect2 + "</m0:CallbackDateTime> " +
            "</m:requestSiteCallbackInfo> " +
            "</m:RegisterSiteCallback> " +
            "</SOAP-ENV:Body> " +
            "</SOAP-ENV:Envelope>"

        try {
            fetch(chatConfig.default.REQUESTServiceTestCallBack, {
                method: "POST",
                headers: {
                    "content-type": "text/xml; charset=utf-8"
                },
                body: data
            })
                .then(response => {
                    //console.log("status",response.status) // This is what returns [object Object]
                    if (response.status === 200) {
                        this.setState({
                            serviceCallBack: true,
                        })
                    } else {
                        this.setState({
                            serviceCallBack: false,
                        })
                    }
                })
        } catch (error) {
            console.log("--error session completion", error);
        }
        this.setState({
            toShowRenderThanksCallBack: true //переключатель для отображения renderThanksCallBack после нажатия кнопки
        });
    };


    //////////////////////////////////Рендер "Запросить звонок"
    renderCallBackTitle = () => {
        return <div className="CallBackHeader">{chatConfig.default.titleCallBack}</div>;
    };
    renderCallBackWelcome = () => {
        return (
            <div className="BlockWindowWelcome">{chatConfig.default.helloMessage}</div>
        );
    };
    renderCallBackMain = () => {
        return (
            <div>
                <div className="BlockWindowFieldLabel">
                    Ваше имя:
                    <div className={this.state.nameCallBackIsEmpty ? "BlockWindowFieldControlFrameError" : "BlockWindowFieldControlFrame"}>
                        <input
                            className="BlockWindowFieldEdit"
                            type="text"
                            ref="fieldName"
                            value={this.state.nameCallBack}
                            onChange={this.onFieldChange.bind(this, "nameCallBackIsEmpty")}
                        />
                    </div>
                    <div className={this.state.nameCallBackIsEmpty ? "BlockWindowFieldError" : "BlockWindowFieldErrorDisplayNone"}>{this.state.descriptionNameError}</div>
                </div>

                <div className="BlockWindowFieldLabel">Ваш телефон:
                    <div className={this.state.numberCallBackIsEmpty ? "BlockWindowFieldControlFrameError" : "BlockWindowFieldControlFrame"}>
                        <input
                            className="BlockWindowFieldEdit"
                            type="text"
                            placeholder="+37529"
                            ref="fieldNumber"
                            value={this.state.numberCallBack}
                            onChange={this.onFieldChange.bind(this, "numberCallBackIsEmpty")}
                        />
                    </div>

                    <div
                        className={
                            this.state.numberCallBackIsEmpty
                                ? "BlockWindowFieldError"
                                : "BlockWindowFieldErrorDisplayNone"
                        }
                    >{this.state.descriptionNumberError}
                    </div>
                </div>

                <div className="BlockWindowFieldLabel">Тема обращения:
                    <div className="BlockWindowFieldControlFrame">
                        <select ref="fieldSelect1" className="BlockWindowFieldEdit">
                            {this.state.callbackThemes.map(v => (
                                <option key={v.value} value={v.textEng}>
                                    {v.text}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="BlockWindowFieldLabel">Укажите удобное время звонка
                    <div className="BlockWindowFieldControlFrame">
                        <select ref="fieldSelect2" className="BlockWindowFieldEdit">
                            {this.returnCallbackTime().map((val, item) => (
                                <option key={item} value={val.value}>
                                    {val.text}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="BlockWindowFieldLabel schedule">График работы контакт-центра:&nbsp;<strong className="StrongStyle">{chatConfig.default.schedule}</strong></div>
            </div>
        );
    };
    renderCallBackButtom = () => {
        return (
            <div className="footer">
                <button
                    className="BlockButton"
                    onClick={this.WindowButtonStartCallBack}
                    disabled={
                        !this.state.field6 ||
                        !this.state.field7 ||
                        this.state.nameCallBackIsEmpty ||
                        this.state.numberCallBackIsEmpty
                    }
                >Перезвоните мне
                </button>
            </div>
        );
    };
    renderThanksCallBack = () => {
        return (
            <div>
                {this.state.serviceCallBack === undefined ?
                    <div className="BlockLoad"><hr /><hr /><hr /><hr /></div>
                    :
                    this.state.serviceCallBack ?
                        <div>
                            <div className="ThanksCallBackImg"></div>
                            <div className="RenderThanksText">
                                <h4>Спасибо!</h4>
                                <p>{chatConfig.default.thanksMessage1}</p>
                            </div>
                            <button
                                className="BlockButton2"
                                onClick={this.cbCloseWindow}
                            >Закрыть
                            </button>
                        </div>
                        :
                        <div>
                            <div className="ErrorSign"></div>
                            <div className="ErrorMessage">
                                {chatConfig.default.callbackErrorMessage}
                            </div>
                            <button
                                className="BlockButton"
                                onClick={this.cbCloseWindow}
                            >Закрыть
                            </button>
                        </div>
                }
            </div>
        );
    };
    //////////////////////////////Конец Рендера "Запросить звонок"

    returnCallbackTime = () => {
        let timeArr = [];
        let currTime = new Date();
        let currYear = currTime.getFullYear();
        let currMonth = currTime.getMonth();
        let currDay = currTime.getDate();
        let fromTodayHour = currTime.getHours() + 1;
        fromTodayHour = Math.max(fromTodayHour, 9);

        for (let H = fromTodayHour; H <= 23; H++) {
            let time = new Date(currYear, currMonth, currDay, H + 3);
            let v1 = {};
            // v1.value=time.getTime();
            v1.value = time;
            v1.text = "Сегодня с " + H + ":00 до " + (H + 1) + ":00";
            timeArr.push(v1);
        }
        for (let H = 0; H <= 23; H++) {
            let time = new Date(currYear, currMonth, currDay + 1, H + 3);
            let v2 = {};
            v2.value = time;
            v2.text = "Завтра с " + H + ":00 до " + (H + 1) + ":00";
            timeArr.push(v2);
        }
        return timeArr
    }

    cbCloseWindow = () => {
        this.props.getStatusClose();
        //FIX используется для анимации, задержка с переключением
        this.timerCom = setTimeout(() => { this.props.getWindowСondition("showCallBack") }, 500);
    }

    //функция валидации полей ввода
    onFieldChange = (fieldInput, EO) => {

        if (fieldInput === "nameCallBackIsEmpty" && EO.target.value.trim().length < 31) {
            this.setState({
                nameCallBack: EO.target.value,
                field6: true
            }, () => {
                if (this.state.nameCallBack.trim().length === 0) {
                    this.setState({
                        descriptionNameError: chatConfig.default.errorMessageUserName[3],
                        nameCallBackIsEmpty: true,
                    });
                }
                else if (this.state.nameCallBack.trim().length >= 0 && this.state.nameCallBack.trim().length < 2) {
                    this.setState({
                        descriptionNameError: chatConfig.default.errorMessageUserName[1],
                        nameCallBackIsEmpty: true,
                    });
                }
                else if (this.state.nameCallBack.trim().length > 20) {
                    this.setState({
                        descriptionNameError: chatConfig.default.errorMessageUserName[2],
                        nameCallBackIsEmpty: true,
                    });
                }
                else if (this.state.nameCallBack.trim().length > 2 && this.state.nameCallBack.trim().length < 20) {
                    this.setState({
                        nameCallBackIsEmpty: false,
                    });
                }
            });
        }
        else if (fieldInput === "numberCallBackIsEmpty" && EO.target.value.trim().length < 20) {///^(\+|\d)[0-9]{7,16}$/
            this.setState({
                numberCallBack: EO.target.value,
                field7: true,
            }, () => {
                if (this.state.numberCallBack.trim().length === 0) {
                    this.setState({
                        numberCallBackIsEmpty: true,
                        descriptionNumberError: chatConfig.default.errorMessageUserNumber[1]
                    })
                }
                if (this.state.numberCallBack[0] != "+") {
                    this.setState({
                        numberCallBackIsEmpty: true,
                        descriptionNumberError: chatConfig.default.errorMessageUserNumber[3]
                    })
                }
                if (this.state.numberCallBack[0] === "+") {
                    this.setState({
                        numberCallBackIsEmpty: true,
                        descriptionNumberError: chatConfig.default.errorMessageUserNumber[4]
                    })

                    if (this.state.numberCallBack[1] + this.state.numberCallBack[2] + this.state.numberCallBack[3] === "375") {
                        this.setState({
                            descriptionNumberError: chatConfig.default.errorMessageUserNumber[4] + '\n' + chatConfig.default.errorMessageUserNumber[5],
                        })
                        //рег на бел номера
                        if (this.state.numberCallBack.match(/^(\+375)(29|25|44|33|17)[0-9]{7}$/)) {
                            this.setState({
                                numberCallBackIsEmpty: false,
                            })
                        }
                    }
                    else {
                        this.setState({
                            descriptionNumberError: chatConfig.default.errorMessageUserNumber[4],
                        })
                        if (this.state.numberCallBack.match(/^(\+)[0-9]{7,16}$/)) {
                            this.setState({
                                numberCallBackIsEmpty: false,
                            })
                        }
                    }
                }
            });
        }
    };


/////////////////////test
componentDidUpdate(){

    if(this.props.errorcall){
        this.setState({
            serviceCallBack:false,
        })
    }else{
        this.setState({
            serviceCallBack:true
        })
    }
}
/////////////////////test

    render() {
        let {
            showCallback, showThanksCallback
        } = this.props;

        let {
            toShowRenderThanksCallBack
        } = this.state;
        console.log(chatConfig.default)
        return (
            <div className="windowCallBack">
                {showCallback && this.renderCallBackTitle()}
                {showThanksCallback && this.renderCallBackTitle()}
                <div className="CallBackMain">
                    {showCallback && this.renderCallBackWelcome()}
                    {showCallback && this.renderCallBackMain()}
                    {showCallback && this.renderCallBackButtom()}

                    {showThanksCallback && this.renderThanksCallBack()}
                </div>
            </div>
        )
    }

};

export default CallBackComponent;
