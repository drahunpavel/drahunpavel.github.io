import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import MessageList from "../MessageList/MessageList";
import ActiveChatEntryField from "../ActiveChatEntryField/ActiveChatEntryField";
let chatConfig=require('../../src/chatConfig.js')
import './ChatComponent.scss';

class ChatComponent extends React.PureComponent {

    static defaultProps = {
        nameChat:"121134143",
        numberChat: "+375298383838",
        requestFrom:"ib_auth",
        device:"iphone38",
        crmId: "1-6RDFYP0",
    } 


    state = {

        winTitle:window.document.title,
        
        //открыто/закрыто окно с активным чатом
        toShowRenderActiveChat:false,


        //состояния ошибок полей с именем, номером
        nameChatIsEmpty: false,
        numberChatIsEmpty: false,

        //все сообщения
        messageList: [],

        //переключатель для выбора оценки чата
        chatRatingSelected: false,

        //название выбранного смайла при оценке чата
        selectedSmile: "",

        //данные при входе в чат
        nameChat: this.props.nameChat,
        numberChat:this.props.numberChat,

        textMessage: "",
        newMessage: {},

        //информация об операторе, которая прилетает с сервера
        aboutOperator: [],

        //вкладка активна
        activeTab:true,
        //получили новое сообщение от оператора
        getNewMessage:false,
        //ко-во непрочитанных сообщений
        numberUnreadMessages:0,

        //скрывать рейтинг, закрывать сессию
        hideRatingFinishSession:false,

        //статус, который получаем каждые 10 секунд, по умолчанию on
        receivedStatus:"ONLINE",
        //состояние ошибки, которую получаем каждые 10 секунд, по умолчанию NO_ERROR
        exceptionMessage:"NO_ERROR",
        //
        hasErrors:false,

        //состояние запроса на callBack, mail  
        serviceCallBack:null,
        serviceAskQuestion:null,

        sessionId:"",
        getSessionCompletion:false,

        //поле ввода активно/не активно
        inactiveInputField:false,

        //состояние клика на поле мессаге лист
        // pressFieldMessageList:false,

        //переключатель окна выбора смайлов, по умолчанию выключено=false
        selectionWindowSmile: false,

        //высота и ширина поля ввода по умолчанию
        sizeYentryField:30,
        sizeXentryField:this.props.sizeX-85,
    }


    //таймер для запросов на обновление сообщений
    timerUpdateRequest = null;
    //таймер для мигания неактивной вкладкой при входях сообщениях
    timerInactiveTab=null;
    //таймер для завершения сессии
    timerCompleteSession=null;
    //таймер для получения статуса
    timerGetStatus=null;


    //////////////////////////////////Рендер чата
    renderChatTitle = () => {
        return <div className="ChatHeader">{chatConfig.default.titleChat}</div>;
    };

    renderChatWelcome = () => {
        return (
            <div>
                {this.props.status != "ONLINE" ?
                    <div>
                        <div className="ErrorSign"></div>
                        <div className="ErrorMessage">{chatConfig.default.chatErrorMessage}</div>
                    </div>
                    :
                    <div className="BlockWindowWelcome">{chatConfig.default.helloMessage}</div>
                }
            </div>
            // <div className="BlockWindowWelcome">{chatConfig.default.helloMessage}</div>
        );
    };
    renderChatMain = () => {
        return (
            <div>
                {/* поле с именем */}
                <div className="BlockWindowFieldLabel">
                    Ваше имя:
                    <div className={this.state.nameChatIsEmpty? "BlockWindowFieldControlFrameError": "BlockWindowFieldControlFrame"}>
                        <input disabled={this.props.status === "OFFLINE" ? true : false}//оставляем пропс статус
                            className="BlockWindowFieldEdit"
                            type="text"
                            ref="fieldName"
                            // defaultValue={this.props.nameChat}
                            value={this.state.nameChat}
                            onChange={this.onFieldChange.bind(this, "nameChatIsEmpty")}
                        />
                    </div>

                    <div className={this.state.nameChatIsEmpty ? "BlockWindowFieldError": "BlockWindowFieldErrorDisplayNone"}>{this.state.descriptionNameError}</div>
                </div>
                {/* поле с номером телефона */}
                <div className="BlockWindowFieldLabel">Номер телефона:
                    <div className={this.state.numberChatIsEmpty ? "BlockWindowFieldControlFrameError": "BlockWindowFieldControlFrame"}>
                        <input disabled={this.props.status === "OFFLINE" ? true : false}//оставляем пропс статус
                            className="BlockWindowFieldEdit"
                            type="text"
                            ref="fieldNumber"
                            placeholder="+37529"
                            // defaultValue={this.props.numberChat}
                            value={this.state.numberChat}
                            onChange={this.onFieldChange.bind(this, "numberChatIsEmpty")}
                        />
                    </div>

                    <div className={this.state.numberChatIsEmpty ? "BlockWindowFieldError": "BlockWindowFieldErrorDisplayNone"}>{this.state.descriptionNumberError}</div>
                </div>
            </div>
        );
    };
    renderChatButtom = () => {
        return (
            <div className="footer">
                <button
                    className="BlockButton"
                    onClick={this.WindowButtonStartChat}
                    ref="butStartChat"
                    disabled={
                        !this.state.field1 ||
                        !this.state.field2 ||
                        this.state.nameChatIsEmpty ||
                        this.state.numberChatIsEmpty ||
                        this.props.status!="ONLINE"//оставляем пропс статус
                    }
                >Начать чат
                </button>
            </div>
        );
    };

    renderActiveChatFooter = () => {
        return (
            <div 
            className={this.state.dialogueCompleted ? "ActiveChatNone" : "ActiveChat"}
            style={{height:36+this.state.sizeYentryField+"px"}}//fix 36 - значение по умолчанию
            >
                <div className="BlockCompleteDialogue">
                    <div className="CompleteDialogueBefore"></div>
                    <a onClick={this.сhatCompleteDialogue}>Завершить диалог</a>
                </div>
                <ActiveChatEntryField
                    cbSendMessage={this.cbSendMessage}
                    // sessionId={this.state.sessionId}
                    getSessionCompletion={this.state.getSessionCompletion}
                    cbgetHeightEntryField={this.cbgetHeightEntryField}

                    cbOpenWindowSmiles={this.cbOpenWindowSmiles}
                    selectionWindowSmile={this.state.selectionWindowSmile}

                    messageList={this.state.messageList}//передаю информацию о массиве с сообщениями, чтобы можно было запрещать отправу сообщений

                    //передаем размеры 
                    sizeX={this.props.sizeX}
                    sizeY={this.props.sizeY}//общая высота окна
                    sizeBlockMessage={this.props.sizeXentryField}//размер поля сообщения
                    sizeXentryField={this.state.sizeXentryField}
                    sizeYentryField={this.state.sizeYentryField}

                    //данные с запросов. Состояния ошибок и статуса
                    status={this.state.receivedStatus}
                    exceptionMessage={this.state.exceptionMessage}
                    hasErrors={this.state.hasErrors}
                />
            </div>
        );
    };

    renderChatRating = () => {
        return (
            <div className={this.state.startNewDialogue ? "ChatWindowAppreciateDialogueNone" : "ChatWindowAppreciateDialogue"}>
                {this.state.chatRatingSelected ? (
                    <div className="">
                        <div className="DialogueRating1">
                            <h3>Спасибо!</h3>
                            <p>Мы ценим Ваше мнение</p>
                        </div>
                        <div className="DialogueRating2">
                            {chatConfig.default.chatRatingSmiles.map((v) =>
                                    v.description === this.state.selectedSmile ? ( //проверка входящего JSON
                                        <div
                                            key={v.code}
                                            className="BlockChatWindowAppreciateDialogueImg2"
                                            style={{ backgroundImage: v.image, opacity: "1" }}
                                        />
                                    ) : (
                                            <div
                                                key={v.code}
                                                className="BlockChatWindowAppreciateDialogueImg2"
                                                style={{ backgroundImage: v.image, opacity: "0.3" }}
                                            />
                                        )
                            )}
                        </div>
                    </div>
                ) : (
                        <div className="">
                            <div className="DialogueRating1">
                                <h3>{chatConfig.default.dialogueRating1}</h3>
                                <p>{chatConfig.default.dialogueRating2}</p>
                            </div>
                            <div className="DialogueRating2">
                                {chatConfig.default.chatRatingSmiles.map(v => (
                                    <div
                                        key={v.code}
                                        className={this.state.hideRatingFinishSession?"BlockChatWindowAppreciateDialogueImg2":"BlockChatWindowAppreciateDialogueImg"}
                                        style={{ backgroundImage: v.image }}
                                        onClick={this.state.hideRatingFinishSession?null:() => this.rateChat(v.description)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
            </div>
        );
    };
    renderChatRatingFooter = () => {
        return (
            <div className={this.state.startNewDialogue? "ChatWindowAppreciateDialogueFooterNone": "ChatWindowAppreciateDialogueFooter"}>
                <div className="BlockAppreciateDialogueButton ">
                    <a onClick={this.saveDialog} className="BlockViewButton1">Сохранить</a>
                    <a onClick={this.printDialog} className="BlockViewButton1">Распечатать</a>
                </div>

                <div className="BlockAppreciateDialogueButton ">
                    {!this.state.turnOffButtonStartNewDialog?
                        <a className="ViewButton2" onClick={this.startNewDialog}>Начать новый диалог</a>
                        :
                        <a className="ViewButton2DisplayNone"></a>
                    }
                </div>
            </div>
        );
    };
    renderActiveChatMain = () => {
        return (
            <MessageList
                messageList={this.state.messageList}
                dialogueCompleted={this.state.dialogueCompleted}
                aboutOperator={this.state.aboutOperator}
                cbGetInfoSessionCompletion={this.cbGetInfoSessionCompletion}
                cbGetAnswerByButton={this.cbGetAnswerByButton}

                cbpressFieldMesList={this.cbpressFieldMesList}


                //передаем размеры 
                sizeY={this.props.sizeY}//общая высота окна
                sizeBlockMessage={this.props.sizeXentryField}//размер поля сообщения
                sizeXentryField={this.state.sizeXentryField}
                sizeYentryField={this.state.sizeYentryField}
                sizeYfooterChat={this.state.sizeYfooterChat}//размер условного футера чата


                //данные с запросов. Состояния ошибок и статуса
                status={this.state.receivedStatus}
                exceptionMessage={this.state.exceptionMessage}        
                hasErrors={this.state.hasErrors}        
            />
        );
    };
    //////////////////////////////////Конец Рендера чата
    
    //получает информаию о клике в зоне messList
    cbpressFieldMesList=()=>{
       this.setState({
        selectionWindowSmile:false,
       })
    }

    //следит за состоянием окна смайлов
    cbOpenWindowSmiles=()=>{
        this.setState({
            selectionWindowSmile: !this.state.selectionWindowSmile
        });
    }

    WindowButtonStartChat = () => {
        //запись в local st
        localStorage.setItem('UserName', JSON.stringify(this.state.nameChat));
        localStorage.setItem('UserNumber', JSON.stringify(this.state.numberChat));

        this.props.getWindowСondition("showChat");
        // clearTimeout(this.timerCompleteSession);//fix
        this.timerCompleteSession=null;
        this.timerGetStatus=setInterval(()=>{
            try{
                fetch(chatConfig.default.REQUESTServiceHost+chatConfig.default.REQUESTServiceStatus,{
                method: "GET"
                })
                .then(response=>response.json())
                .then(json=>{
                  let answer=json;
                  console.log("get status every 10 seconds after start chat",answer.status);
                  this.setState({
                    receivedStatus:answer.status,
                    // status: answer.status,
                    errorCode: answer.errorCode,
                    exceptionMessage: answer.exceptionMessage,
                    hasErrors:answer.hasErrors
                    // receivedStatus:"OFFLINE" //тест для статуса OFF
                  },()=>{
                        if(this.state.receivedStatus==="OFFLINE"){
                            if(this.state.isErr!=true){
                                let newMessageError = {};
                                newMessageError["type"] = "SYSTEM";
                                newMessageError["text"] = chatConfig.default.chatErrorMessage;
                                newMessageError['typeError']="statusErr";
                                let addNewErrMessage = this.state.messageList.concat(newMessageError);
                                this.setState({
                                        isErr:true,
                                        messageList: addNewErrMessage,
                                    });
                                }
                        }
                        if(this.state.receivedStatus==="ONLINE"){
                                this.setState({
                                    isErr:false,
                                });
                        }
                    })
                })
            }catch (error){ 
                console.log("--error",error)
                }
        },10000);  
        //Случай для неавторизированных пользователей
        if (localStorage.getItem('mySessionID') != null) {
            console.log("Session is here, use old session");
            let localStorageSessiaId = localStorage.getItem('mySessionID');
            try {
                fetch(chatConfig.default.REQUESTServiceHost + chatConfig.default.REQUESTServiceHistory, {
                    method: "POST",
                    headers: {
                        "Accept": 'application/json',
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        sessionId: localStorageSessiaId,
                    })
                })
                .then(response => response.json())
                .then(json => {
                    let oldMess = json.messages;

                    //если сессия сохранена в браузере и ее история не пустая, то получаем сообщения
                    if(oldMess!=null){
                        console.log("Got old story on session"+localStorage.getItem('mySessionID'));
                        let oldArrMess = this.state.messageList.concat(oldMess);
                        oldArrMess.splice(0, 1);//вырезает первое сообщение #START#
                        this.setState({
                            messageList: oldArrMess,
                            sessionId: localStorageSessiaId,
                        }, () => {
                                //при открытом диалоге запускаем таймер, делаем запросы для получения новых сообщений
                                if (this.state.dialogueCompleted === false) {
                                    this.timerUpdateRequest = setInterval(this.processMessages, 2000);
                                };
                        })
                    //если сессия сохранена в браузере и ее история УЖЕ пустая, то заново создаем сессию
                    }else{
                        localStorage.removeItem("mySessionID");
                        console.log("No session, create new session");
                        try {
                            fetch(chatConfig.default.REQUESTServiceHost + chatConfig.default.REQUESTServiceOpen, {
                                method: "POST",
                                headers: {
                                    "Accept": 'application/json',
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    phone: this.state.numberChat.substr(0),
                                    question: "#start#",
                                    requestFrom: "site_not_auth",
                                    //requestFrom: "ib_auth",
                                    username: this.state.nameChat,
                                })

                                // body: JSON.stringify({
                                //     phone: this.state.numberChat.substr(0),
                                //     question: "#start#",
                                //     requestFrom: this.props.requestFrom,
                                //     device:this.props.device,
                                //     crmId: this.props.crmId,
                                //     username: this.state.nameChat,
                                // })
                            })
                            //.then(response => console.log(response.status))
                            .then(response => response.json())
                            .then(json => {
                                    //запись  в  localstorage
                                localStorage.setItem('mySessionID', json.sessionId);
            
                                    this.setState({
                                        sessionId: json.sessionId,
                                    }, () => {
                                        //при открытом диалоге запускаем таймер, делаем запросы для получения новых сообщений
                                        if (this.state.dialogueCompleted === false) {
                                            this.timerUpdateRequest = setInterval(this.processMessages, 2000);
                                        };
                                    });
                                });
                                
                        } catch (error) {
                            console.log("--error", error);
                        };
                    }
                })
            } catch (error) {
                console.log("--error", error)
            }
        }else {
            console.log("No session, create new session");
            try {
                fetch(chatConfig.default.REQUESTServiceHost + chatConfig.default.REQUESTServiceOpen, {
                    method: "POST",
                    headers: {
                        "Accept": 'application/json',
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        phone: this.state.numberChat.substr(0),
                        question: "#start#",
                        requestFrom: "site_not_auth",
                        //requestFrom: "ib_auth",
                        username: this.state.nameChat,
                    })
                    // body: JSON.stringify({
                    //     phone: this.state.numberChat.substr(0),
                    //     question: "#start#",
                    //     requestFrom: this.props.requestFrom,
                    //     device:this.props.device,
                    //     crmId: this.props.crmId,
                    //     username: this.state.nameChat,
                    // })
                })
                //.then(response => console.log(response.status))
                .then(response => response.json())
                .then(json => {
                        //запись  в  localstorage
                    localStorage.setItem('mySessionID', json.sessionId);

                        this.setState({
                            sessionId: json.sessionId,
                        }, () => {
                            //при открытом диалоге запускаем таймер, делаем запросы для получения новых сообщений
                            if (this.state.dialogueCompleted === false) {
                                this.timerUpdateRequest = setInterval(this.processMessages, 2000);
                            };
                        });
                    });
                    
            } catch (error) {
                console.log("--error", error);
            };
        }

        
        this.setState({
            getSessionCompletion:false,
            toShowRenderActiveChat: true, //переключатель для отображения RenderActiveChat после нажатия кнопки
            isOpenChatWindow: true,
            dialogueCompleted: false,
            messageList: []
        });
    };

    processMessages = () => {
        //временное рещение

        if(this.props.openIsChat){
            this.setState({
                numberUnreadMessages:0,
            })
        }        
        try {//запрос REQUESTServicePoll
            fetch(chatConfig.default.REQUESTServiceHost + chatConfig.default.REQUESTServicePoll, {
                method: "POST",
                headers: {
                    "Accept": 'application/json',
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    sessionId: this.state.sessionId,
                })
            })
                .then(response => response.json())
                .then(json => {
                    //проверка на то, что входящий массив не пуст
                    if (json.messages!=null&&json.messages.length!=0) {
                        

                        //условие для мигания неактивной вкладкой, если пришло сообщение
                        if(!this.state.activeTab){
                            this.setState({
                                getNewMessage:true,
                            },()=>{this.changeTabTitle();})
                        }
                        //если чат свернут и при этом получает новое сообщение, кол-во таких сообщений передаются колбэком
                        if(!this.props.openIsChat&&json.messages[0].type!="AGENT_TYPING"){
                            this.state.numberUnreadMessages++;
                            // FIX me
                            this.props.cbgetNumberUnreadMessages(this.state.numberUnreadMessages)
                        }

                        let newMess = json.messages;
                        //console.log("---json.messages",newMess);
                        let oper;//сюда будут записываться данные об операторе, которые прилетают с сервера
                        fetch(chatConfig.default.REQUESTServiceHost + chatConfig.default.REQUESTServiceOperator, {
                            method: "POST",
                            headers: {
                                "Accept": 'application/json',
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                sessionId: this.state.sessionId,
                            })
                        })
                        .then(response => response.json())
                        .then(json => {
                            oper = json.operator;
                            for (let j = 0; j < newMess.length; j++) {

                                //отлавливаем заверешние сессии
                                if(newMess[j].type === "SESSION_COMPLETION"){
                                    this.setState({
                                        getSessionCompletion:true,
                                    })
                                }

                                //каждому входящему сообщению добовляется информация об авторе сообщения
                                if (newMess[j].type === "AGENT") {
                                    newMess[j].operatorFullName = oper.operatorFullName;
                                    newMess[j].operatorId = oper.operatorId;
                                    newMess[j].operatorImage = oper.operatorImage;
                                };
                            };
                            let newArrMess = this.state.messageList.concat(newMess);
                            //console.log("newArrMess",newArrMess)
                            this.setState({
                                messageList: newArrMess,
                            });
                        });
                    }
                });
        }catch (error) {
            console.log("--error", error);
        };
    };


    //управление неактивной вкладкой
    changeTabTitle=()=>{
        let show = ['Новое сообщение', window.document.title];
        let i=0;
        this.timerInactiveTab=setInterval(()=>{
            if(this.state.activeTab){//если активная вкладка
                window.document.title=this.state.winTitle;
                this.setState({
                    getNewMessage:false,
                });
                return
            }else{
                if(this.state.getNewMessage){
                    window.document.title = show[i++ % 2];
                }
            } 
        },1000);        
    };



    //функция валидации полей ввода
    onFieldChange = (fieldInput, EO) => {
        //nameChatIsEmpty - состояние ошибки true\false
        //descriptionNameError;//описание ошибки
        if (fieldInput == "nameChatIsEmpty"&&EO.target.value.trim().length < 31) {
            this.setState({
                nameChat: EO.target.value,
                field1: true
            },()=>{
                if(this.state.nameChat.trim().length===0){
                    this.setState({
                        descriptionNameError:chatConfig.default.errorMessageUserName[3],
                        nameChatIsEmpty: true,
                    });  
                }
                else if(this.state.nameChat.trim().length >=0&&this.state.nameChat.trim().length<2){
                    this.setState({
                        descriptionNameError:chatConfig.default.errorMessageUserName[1],
                        nameChatIsEmpty: true,
                    });         
                }
                else if(this.state.nameChat.trim().length > 20){
                    this.setState({
                        descriptionNameError:chatConfig.default.errorMessageUserName[2],
                        nameChatIsEmpty: true,
                    });  
                }
                else if(this.state.nameChat.trim().length >2&&this.state.nameChat.trim().length<20){
                    this.setState({
                        nameChatIsEmpty: false,
                    });  
                }
            });
        }
        else if (fieldInput === "numberChatIsEmpty"&&EO.target.value.trim().length < 21) {///^(\+|\d)[0-9]{7,16}$/
            this.setState({
                numberChat: EO.target.value,
                field2: true,
            },()=>{
                if(this.state.numberChat.trim().length===0){
                    this.setState({
                        numberChatIsEmpty: true,
                        descriptionNumberError:chatConfig.default.errorMessageUserNumber[1]
                    }) 
                }
                if(this.state.numberChat[0]!="+"){
                    this.setState({
                        numberChatIsEmpty: true,
                        descriptionNumberError:chatConfig.default.errorMessageUserNumber[3]
                    })                    
                }
                if(this.state.numberChat[0]==="+"){
                    this.setState({
                        numberChatIsEmpty: true,
                        descriptionNumberError:chatConfig.default.errorMessageUserNumber[4]
                    })  

                    if(this.state.numberChat[1]+this.state.numberChat[2]+this.state.numberChat[3]==="375"){
                        this.setState({
                            descriptionNumberError:chatConfig.default.errorMessageUserNumber[4]+'\n'+chatConfig.default.errorMessageUserNumber[5],
                        })
                        //рег на бел номера
                        if(this.state.numberChat.match(/^(\+375)(29|25|44|33|17)[0-9]{7}$/)){
                            this.setState({
                                numberChatIsEmpty: false,
                            }) 
                        }    
                    }
                    
                    else if(this.state.numberChat[1]+this.state.numberChat[2]+this.state.numberChat[3]==="420"){
                        this.setState({
                            descriptionNumberError:"Czech Republic",
                        })
                    }
                    else if(this.state.numberChat[1]+this.state.numberChat[2]+this.state.numberChat[3]==="372"){
                        this.setState({
                            descriptionNumberError:"Estonia",
                        })
                    }
                    else if(this.state.numberChat[1]+this.state.numberChat[2]+this.state.numberChat[3]==="486"){
                        this.setState({
                            descriptionNumberError:"Poland",
                        })
                    }
                    else{
                        this.setState({
                            descriptionNumberError:chatConfig.default.errorMessageUserNumber[4],
                        })
                        if(this.state.numberChat.match(/^(\+)[0-9]{7,16}$/)){
                            this.setState({
                                numberChatIsEmpty: false,
                            }) 
                        }  
                    }
                }
            });
        }
    };

    startNewDialog = () => {
        console.log("startNewDialog");
        this.props.getWindowСondition("showChatStartPage");
        this.setState({
            startNewDialogue: true,
            toShowRenderActiveChat: false,
            dialogueCompleted: false,
            chatRatingSelected: false,
            field1: false,
            field2: false,
            hideRatingFinishSession:false,
        });
    };

    сhatCompleteDialogue = () => {
        //удаляем:
        console.log("CompleteDialogue");
        localStorage.removeItem("mySessionID");
        localStorage.removeItem("UserName");
        localStorage.removeItem("UserNumber");

        this.props.getWindowСondition("showChatRating");

        this.timerCompleteSession=setTimeout(this.hideRating,5000);
        clearInterval(this.timerGetStatus);//удаляем таймер при завершении диалога на получение статуса
        clearInterval(this.timerUpdateRequest);//удаляем таймер на обновление сообщений

        this.setState({
            dialogueCompleted: true, //true при нажатии на "завершить диалог"
            startNewDialogue: false,
            // pressFieldMessageList:false,
            nameChat: "",
            numberChat: "",
            //sessionId: ""
            turnOffButtonStartNewDialog:true,
        });
    };

        //скрывает рейтинг и завершает сессию по истечению таймера
        hideRating=()=>{
            console.log('---hideRating performed')
            try {
                fetch(chatConfig.default.REQUESTServiceHost + chatConfig.default.REQUESTServicePush, {
                    method: "POST",
                    headers: {
                        "Accept": 'application/json',
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        sessionId: this.state.sessionId,
                        type: "SESSION_COMPLETION",
                        message: ""
                    })
                })
            } catch (error) {
                console.log("--error session completion", error)
            }
            this.setState({
                turnOffButtonStartNewDialog:false,

                hideRatingFinishSession:true,
                sessionId:""//затираем сессию
            })
        }

        cbGetAnswerByButton=(val,id)=>{
            try{
                fetch(chatConfig.default.REQUESTServiceHost+chatConfig.default.REQUESTServicePush,{
                    method:"POST",
                    headers:{
                        "Accept":'application/json',
                        "Content-Type":"application/json"
                    },
                    body: JSON.stringify({
                        sessionId:this.state.sessionId,
                        type:"BUTTON",
                        message:id
                    })
                }) 
                .then(response=>response.json())
                .then(json=>{})
            }catch (error){ 
              console.log("--error",error);
            }
            let newMessage = {};
    
            //актуаьное время для отправленных сообщений пользователем
            let date = new Date();
            let hours= date.getHours();
            if(hours<10){hours="0"+date.getHours();}
            let minutes=date.getMinutes();
            if(minutes<10){minutes="0"+date.getMinutes();}
            let time = hours+':'+minutes;
    
                newMessage["type"] ="CLIENT";
                newMessage["text"] = val;
                newMessage['mytime']=time;
                let addNewMessage = this.state.messageList.concat(newMessage);
                this.setState({
                    messageList: addNewMessage,
                });
        }

        saveDialog = () => {
            console.log("saveDialog");
    
            let str = 'История сообщений'+'<br/><br/>';
            
                this.state.messageList.map((item) => {
                    if(item.type==="AGENT"){
                        str+='ОПЕРАТОР'+'<br/>';
                        str += item.text + '<br/>';
                        str += item.time + "&nbsp;";
                        str += item.operatorFullName?"Оператор "+item.operatorFullName+ '<br/>':"Оператор" + '<br/>';    
                        str += '---------------------------------' + '<br/><br/>';              
                    }
                    if(item.type==="CLIENT"){
                        str+='ВЫ'+'<br/>';
                        str += item.text + '<br/>';
                        str += item.mytime + "&nbsp;";
                        str += "Вы" + '<br/>';  
                        str += '---------------------------------' + '<br/><br/>';              
                    }
                    if(item.type==="SYSTEM"){
                        str+='СИСТЕМНОЕ СООБЩЕНИЕ'+'<br/>';
                        str += item.text + '<br/>';
                        str += item.time + '<br/>';
                        str += '---------------------------------' + '<br/><br/>';              
                    }
                    if(item.type==="OPERATOR_CONNECT"){
                        let arr = item.text.split(' ');
                
                        str+='СИСТЕМНОЕ СООБЩЕНИЕ'+'<br/>';
                        str += item.text.length===0?"К Вам подключился оператор Алеся."+'<br/>':"К Вам подключился оператор "+arr[arr.length-1]+"."+ '<br/>';
                        str += item.time + '<br/>';
                        str += '---------------------------------' + '<br/><br/>';              
                    }   
                })
                str+='<br/>'+'Чат завершен'+'<br/>';    
    
            //new code
            let saveBlock = document.createElement('div');
            saveBlock.innerHTML=str;
            console.log("saveBlock",saveBlock)
            console.log("saveBlock",saveBlock.outerHTML)
    
            let filename = "Chating history.doc";
            let elHtml =saveBlock.innerText||saveBlock.textContent;////e.textContent || e.innerText;Во всех браузерах, кроме FF. Вместо innerText надо использовать textContent.
            
            console.log("elHtml",elHtml)
            let mimeType = 'text/plain';
    
            if (navigator.msSaveBlob) {
                navigator.msSaveBlob(new Blob([elHtml], { type: mimeType + ';charset=utf-8;' }), filename);//for IE
                //console.log(navigator.msSaveBlob(new Blob([elHtml], { type: mimeType + ';charset=utf-8;' }), filename))
            } else {
                let link = document.createElement('a');
                mimeType = mimeType || 'text/plain';
    
                link.setAttribute('download', filename);
                link.setAttribute('href', 'data:' + mimeType + ';charset=utf-8,' + encodeURIComponent(elHtml));
                document.body.appendChild(link);//for FF предположительно, Firefox не любит нажатия элементов, которые не являются «на странице»:
                link.click();
                document.body.removeChild(link);//for FF
            }
        };
    
    
    
    
        printDialog = () => {
            console.log("PrintDialog");
            let str = 'История сообщений'+'<br/><br/>';
            
                this.state.messageList.map((item) => {
                    if(item.type==="AGENT"){
                        str+='ОПЕРАТОР'+'<br/>';
                        str += item.text + '<br/>';
                        str += item.time + "&nbsp;";
                        str += item.operatorFullName?"Оператор "+item.operatorFullName+ '<br/>':"Оператор" + '<br/>';    
                        str += '---------------------------------' + '<br/><br/>';              
                    }
                    if(item.type==="CLIENT"){
                        str+='ВЫ'+'<br/>';
                        str += item.text + '<br/>';
                        str += item.mytime + "&nbsp;";
                        str += "Вы" + '<br/>';  
                        str += '---------------------------------' + '<br/><br/>';              
                    }
                    if(item.type==="SYSTEM"){
                        str+='СИСТЕМНОЕ СООБЩЕНИЕ'+'<br/>';
                        str += item.text + '<br/>';
                        str += item.time + '<br/>';
                        str += '---------------------------------' + '<br/><br/>';              
                    }
                    if(item.type==="OPERATOR_CONNECT"){
                        let arr = item.text.split(' ');
                
                        str+='СИСТЕМНОЕ СООБЩЕНИЕ'+'<br/>';
                        str += item.text.length===0?"К Вам подключился оператор Алеся."+'<br/>':"К Вам подключился оператор "+arr[arr.length-1]+"."+ '<br/>';
                        str += item.time + '<br/>';
                        str += '---------------------------------' + '<br/><br/>';              
                    }   
                })
                str+='<br/>'+'Чат завершен'+'<br/>';    
            
    
            //создаю всплывающее окно,наполняю, вызываю его print, затем close
            var myWindow = window.open("", "", "width=600,height=800");
            let headstr = "<html><head><title>chatdialogue</title></head><body>";
            let footstr = "</body>";
            let printBlock = document.createElement('div');
            printBlock.innerHTML = "<p>" + str + "</p>"
            let newstr = printBlock.innerHTML;
    
    
            myWindow.document.write(headstr + newstr + footstr)//заполняет страницу текстом
            //close-focus-primt-close - условие для работа во всех браузерах
            myWindow.document.close();
            myWindow.focus();
            myWindow.print();
            myWindow.close();
        };
    
        //рейтинг чата
        rateChat = (evaluation) => {
            //отправляем рейтинг, он же завершает нашу сессию
            try {
                fetch(chatConfig.default.REQUESTServiceHost + chatConfig.default.REQUESTServicePush, {
                    method: "POST",
                    headers: {
                        "Accept": 'application/json',
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        sessionId: this.state.sessionId,
                        type: "RATING",
                        message: evaluation
                    })
                })
            } catch (errorCode) {
                console.error("--error rate", errorCode)
            }
            clearTimeout(this.timerCompleteSession);
            this.setState({
                turnOffButtonStartNewDialog:false,

                selectedSmile: evaluation,
                chatRatingSelected: true,
                sessionId:""//затираем сессию
            });
        };

            //принимает ID smile
    cbсonvertSmile = (smileID) => {
        this.setState({
            smileID: smileID,
        })
    };

    cbSendMessage = (receivedMessage) => {
        console.log("Get Message: ", receivedMessage);
        // receivedMessage.replace('&lt;','<').replace('&gt;', '>')//управляет <>
        try {
            fetch(chatConfig.default.REQUESTServiceHost + chatConfig.default.REQUESTServicePush, {
                method: "POST",
                headers: {
                    "Accept": 'application/json',
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    sessionId: this.state.sessionId,
                    type: "CLIENT",
                    message: receivedMessage
                })
            })
                //.then(response => console.log(response.status))
                .then(response => response.json())
                .then(json => {
                    //console.log("Service Push",json);
                })
        } catch (error) {
            console.error("--error", error)
        }
        let newMessage = {};

        //актуаьное время для отправленных сообщений пользователем
        let date = new Date();
        let hours= date.getHours();
        if(hours<10){hours="0"+date.getHours();}
        let minutes=date.getMinutes();
        if(minutes<10){minutes="0"+date.getMinutes();}
        let time = hours+':'+minutes;


        if (receivedMessage.length >= 1) {
            //если нет символов, пустое поле не будет отправляться в чат

            newMessage["type"] = "CLIENT";
            newMessage["text"] = receivedMessage;
            newMessage['mytime']=time;

            let addNewMessage = this.state.messageList.concat(newMessage);


            this.setState({
                selectionWindowSmile:false,
                messageList: addNewMessage,

                // sizeYentryField:30,//при отправки сообщения полю вводла даем значение по умолчанию
            });
        }
    }

    controlKeyboardsButtonStartChat=()=>{ 
        let buttonStartChat = ReactDOM.findDOMNode(this.refs.butStartChat);//ссылка на кнопку начать чат
        if (this.props.openIsChat&&this.props.showChatStartPage&&event.key === "Enter") {
            if(!buttonStartChat.disabled){
                this.WindowButtonStartChat();
            }
       };
    }

    // FIX Me
    //получает информаю о размере поля ввода (при наборе, при вставке, при изменении размера)
    cbgetHeightEntryField=(val)=>{

        if(val>=30&&val<=170){
            // console.log("Получили",val)
            this.setState({
                sizeYentryField:val,  
            })
        }

    }

    componentDidUpdate() {
        this.setState({
            sizeXentryField:this.props.sizeX-85,
            // sizeYentryField:this.state.getEntryFieldElement,
            sizeYfooterChat:36+this.state.sizeYentryField,
        })


        ////////test////////////////////////////
        if(this.props.hasErrors){
            this.setState({
                hasErrors:true,
            })
        }
        ///////////////////////////////////////
      }

    componentDidMount(){
        window.addEventListener("keydown", this.controlKeyboardsButtonStartChat);
        // fix
        window.onfocus=()=>{
            this.setState({
                activeTab:true,
            })
        };
        window.onblur =()=>{ 
            //win = false; //пользователь закрыл вкладку или переключил на другую
            this.setState({
                activeTab:false,
            })
        };

        //FIX
        if(localStorage.getItem('UserName')!=null){
            this.setState({
                nameChat:JSON.parse(localStorage.getItem('UserName')),
                nameChatIsEmpty:false,
                field1:true,
            })
        }
        if(localStorage.getItem('UserNumber')!=null){
            this.setState({
                numberChat:JSON.parse(localStorage.getItem('UserNumber')),
                numberChatIsEmpty:false,
                field2:true,
            })
        }
    }

    
    componentWillUnmount() {
        window.removeEventListener("keydown", this.controlKeyboardsButtonStartChat);
        // clearTimeout(this.timerCompleteSession);
        clearInterval(this.timerInactiveTab);
    }


    render() {
        let {
            showChat,showChatRating,showChatStartPage
        }=this.props;

        let {
            toShowRenderActiveChat,dialogueCompleted,
        }=this.state;
        // console.log("getEntryFieldElement",this.state.getEntryFieldElement)
        // console.log("sizeX",this.props.sizeX,"sizeY",this.props.sizeY,"sizeXentryField",this.state.sizeXentryField,"sizeYentryField",this.state.sizeYentryField)
        // console.log("receivedStatus", this.state.receivedStatus, "errorCode",this.state.errorCode, "exceptionMessage",this.state.exceptionMessage)
        // console.log("--authorized",this.props.authorized)
        // console.log("props",this.props.nameChat,this.props.numberChat)

        return (

            <div className="windowChat">
                    {showChatStartPage&&this.renderChatTitle()}
                    {showChat&&this.renderChatTitle()}
                    {showChatRating&&this.renderChatTitle()}
                <div className="ChatMain">
                        {/* showChatStartPage */}
                        {showChatStartPage&&this.renderChatWelcome()}
                        {showChatStartPage&&this.renderChatMain()}
                        {showChatStartPage&&this.renderChatButtom()}


                        {/*showChat  */}
                        {showChat&&this.renderActiveChatMain()}
                        {showChat&&this.renderActiveChatFooter()}

                        {/* showChatRating */}
                        {showChatRating&&this.renderChatRating()}
                        {showChatRating&&this.renderChatRatingFooter()}
                </div>                     
            </div>
        )
    }

};

export default ChatComponent;