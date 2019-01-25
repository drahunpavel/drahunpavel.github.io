import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

let chatConfig=require('../../src/chatConfig.js')

import './MailComponent.scss';

class MailComponent extends React.PureComponent {

    static defaultProps = {

    }

    state = {
        nameMail:"",
        mailMail:"",
        textMail:"",
    }

    //задержка в пол секунды
    timerCom=null;

    WindowButtonStartMail = () => {
        this.props.getWindowСondition("showThanksMail");
        let currTime = new Date();
        let currYear = currTime.getFullYear();
        let currMonth = currTime.getMonth();
        let currDay = currTime.getDate();
        let time = new Date(currYear, currMonth, currDay);
        console.log("time", time)

        let data = "<SOAP-ENV:Envelope xmlns:SOAP-ENV='http://schemas.xmlsoap.org/soap/envelope/' xmlns:SOAP-ENC='http://schemas.xmlsoap.org/soap/encoding/' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema'>" +
            "<SOAP-ENV:Body>" +
            "<m:REQUESTSITEASKQUESTIONINFO xmlns:m='http://cisco.com/pcceappserver/'>" +
            "<QUESTION>" + this.state.textMail + "</QUESTION>" +
            "<ACCOUNTNUMBER>" + this.state.mailMail + "</ACCOUNTNUMBER>" +
            "<NAME>" + this.state.nameMail + "</NAME>" +
            "<CATEGORY>Вопрос с сайта банка<CATEGORY>" +
            "<EMAIL>" + this.state.mailMail + "</EMAIL>" +
            "<ASKQUESTIONDATETIME>" + time + "</ASKQUESTIONDATETIME>" +
            "</m:REQUESTSITEASKQUESTIONINFO>" +
            "</SOAP-ENV:Body>"
        "</SOAP-ENV:Envelope>"

        try {
            fetch(chatConfig.default.REQUESTServiceTestQuestion, {
                method: "POST",
                headers: {
                    "content-type": "text/xml; charset=utf-8"
                },
                body: data
            })
                .then(response => {
                    if (response.status === 200) {
                        this.setState({
                            serviceAskQuestion: true,
                        })
                    } else {
                        this.setState({
                            serviceAskQuestion: false,
                        })
                    }
                })
        } catch (error) {
            console.log("--error session completion", error);
        }
        this.setState({
            toShowRenderThanksMail: true //переключатель для отображения renderThanksCallMail после нажатия кнопки
        });
    };
    //////////////////////////////////Рендер "Отправить вопрос"
    renderMailTitle = () => {
        return (<div className="MailHeader">{chatConfig.default.titleMail}</div>);
        // return <div className="BlockWindowHead">Задать вопрос<button onClick={this.not2200}>!200</button></div>;
    };

    renderMailWelcome = () => {
        return (<div className="BlockWindowWelcome">{chatConfig.default.helloMessage}</div>);
    };

    renderMailMain = () => {
        return (
            <div>
                <div className="BlockWindowFieldLabel">
                Ваше имя:
                <div className={this.state.nameMailIsEmpty ? "BlockWindowFieldControlFrameError" : "BlockWindowFieldControlFrame"}>
                        <input
                            className="BlockWindowFieldEdit"
                            type="text"
                            ref="fieldName"
                            value={this.state.nameMail}
                            onChange={this.onFieldChange.bind(this, "nameMailIsEmpty")}
                        />
                    </div>

                    <div className={this.state.nameMailIsEmpty ? "BlockWindowFieldError" : "BlockWindowFieldErrorDisplayNone"}>{this.state.descriptionNameError}</div>
                </div>

                <div className="BlockWindowFieldLabel">
                Ваш E-mail:
                <div className={this.state.mailMailIsEmpty ? "BlockWindowFieldControlFrameError" : "BlockWindowFieldControlFrame"}>
                        <input
                            className="BlockWindowFieldEdit"
                            type="text"
                            ref="fieldNumber"
                            value={this.state.mailMail}
                            onChange={this.onFieldChange.bind(this, "mailMailIsEmpty")}
                        />
                    </div>

                    <div className={this.state.mailMailIsEmpty ? "BlockWindowFieldError" : "BlockWindowFieldErrorDisplayNone"}>{this.state.descriptionMailError}</div>
                </div>

                <div className="BlockWindowFieldLabel">
                Вопрос:
                <div className={this.state.textMailIsEmpty ? "BlockWindowFieldControlFrameError" : "BlockWindowFieldControlFrame"}>
                        <textarea
                            className="BlockWindowFieldTextareaEdit"
                            type="text"
                            ref="fieldTextarea"
                            placeholder="Введите Ваш вопрос..."
                            value={this.state.textMail}
                            onChange={this.onFieldChange.bind(this, "textMailIsEmpty")}
                        />
                    </div>

                    <div className={this.state.textMailIsEmpty ? "BlockWindowFieldError" : "BlockWindowFieldErrorDisplayNone"}>{this.state.descriptionTextError}</div>
                </div>
            </div>
        );
    };
    renderMailButtom = () => {
        return (
            <div className="footer">
                <button
                    className="BlockButton"
                    onClick={this.WindowButtonStartMail}
                    disabled={
                        !this.state.field3 ||
                        !this.state.field4 ||
                        !this.state.field5 ||
                        this.state.nameMailIsEmpty ||
                        this.state.mailMailIsEmpty
                    }
                >Свяжитесь со мной
                </button>
            </div>
        );
    };
    renderThanksMail = () => {
        return (
            <div>
                {this.state.serviceAskQuestion === undefined ?
                    <div className="BlockLoad"><hr /><hr /><hr /><hr /></div>
                    :
                    this.state.serviceAskQuestion ?
                        <div>
                            <div className="ThanksMailImg"></div>
                            <div className="RenderThanksText">
                                <h4>Спасибо!</h4>
                                <p>{chatConfig.default.thanksMessage2}</p>
                            </div>
                            <button
                                className="BlockButton"
                                onClick={this.cbCloseWindow}
                            >Закрыть
                            </button>
                        </div>
                        :
                        <div>
                            <div className="ErrorSign"></div>
                            <div className="ErrorMessage">
                                {chatConfig.default.questionErrorMessage}
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
    //////////////////////////////////Конец Рендера ""Отправить вопрос"
    cbCloseWindow = () => {
        this.props.getStatusClose();
        //FIX используется для анимации, задержка с переключением
        this.timerCom=setTimeout(()=>{this.props.getWindowСondition("showMail")}, 500);
    }

    //функция валидации полей ввода
    onFieldChange = (fieldInput, EO) => {



        if (fieldInput === "nameMailIsEmpty"&&EO.target.value.trim().length < 30) {
            this.setState({
                nameMail: EO.target.value,
                field3: true
            }, () => {
                if (this.state.nameMail.trim().length === 0) {
                    this.setState({
                        descriptionNameError: chatConfig.default.errorMessageUserName[3],
                        nameMailIsEmpty: true,
                    });
                }
                else if (this.state.nameMail.trim().length >= 0 && this.state.nameMail.trim().length < 2) {
                    this.setState({
                        descriptionNameError: chatConfig.default.errorMessageUserName[1],
                        nameMailIsEmpty: true,
                    });
                }
                else if (this.state.nameMail.trim().length > 20) {
                    this.setState({
                        descriptionNameError: chatConfig.default.errorMessageUserName[2],
                        nameMailIsEmpty: true,
                    });
                }
                else if (this.state.nameMail.trim().length > 2 && this.state.nameMail.trim().length < 20) {
                    this.setState({
                        nameMailIsEmpty: false,
                    });
                }
            });
        }

        else if (fieldInput === "mailMailIsEmpty"&&EO.target.value.trim().length < 31) {
            this.setState({
                mailMail: EO.target.value,
                field4: true
            }, () => {
                if (this.state.mailMail.trim().length === 0) {
                    this.setState({
                        descriptionMailError: chatConfig.default.errorMessageUserMail[1],
                        mailMailIsEmpty: true,
                    });
                }else if (this.state.mailMail.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
                    this.setState({
                        mailMailIsEmpty: false,
                    });
                }else {
                    this.setState({
                        descriptionMailError: chatConfig.default.errorMessageUserMail[2],
                        mailMailIsEmpty: true,
                    });
                }
            });
        }


        else if (fieldInput === "textMailIsEmpty"&&EO.target.value.trim().length < 191) {
            this.setState({
                textMail: EO.target.value,
                field5: true
            }, () => {
                if (this.state.textMail.trim().length === 0) {
                    this.setState({
                        descriptionTextError: chatConfig.default.errorMessageUserMessage[1],
                        textMailIsEmpty: true,
                    });
                }
                else if (this.state.textMail.trim().length >= 0 && this.state.textMail.trim().length < 5) {
                    this.setState({
                        descriptionTextError: chatConfig.default.errorMessageUserMessage[2],
                        textMailIsEmpty: true,
                    });
                }
                else if (this.state.textMail.trim().length > 180) {
                    this.setState({
                        descriptionTextError: chatConfig.default.errorMessageUserMessage[3],
                        textMailIsEmpty: true,
                    });
                }
                else if (this.state.textMail.trim().length > 5 && this.state.textMail.trim().length < 180) {
                    this.setState({
                        textMailIsEmpty: false,
                    });
                }
            });
        }

    };
/////////////////////test
componentDidUpdate(){

    if(this.props.errormail){
        this.setState({
            serviceAskQuestion:false,
        })
    }else{
        this.setState({
            serviceAskQuestion:true
        })
    }
}
/////////////////////test
    render() {
        let {
            showMail, showThanksMail
        } = this.props;

        let {
            toShowRenderThanksMail,
        } = this.state;

        return (
            <div className="windowMail">
                {showMail && this.renderMailTitle()}
                {showThanksMail && this.renderMailTitle()}
                <div className="MailMain">
                    {showMail && this.renderMailWelcome()}
                    {showMail && this.renderMailMain()}
                    {showMail && this.renderMailButtom()}

                    {showThanksMail && this.renderThanksMail()}
                </div>
            </div>
        )
    }

};

export default MailComponent;

