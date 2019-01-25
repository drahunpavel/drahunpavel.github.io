import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

let allSmilies = require("../../src/allSmilies.json");

import './MessageList.scss';

class MessageList extends React.PureComponent {

    static defaultProps = {
        defaultOperatorImage: "url(/bps-chat/images/images/TN_Alesya_bot.jpg)",
    } 

    state = {
        allSmiliesArr: allSmilies,

        agentTyping:false,
    }

    //FIX 
    transformationMessage = (textMessage) => {

        

        let out = [];
        for (let i = 0; i < textMessage.length; i++) {


            if (textMessage[i] === ":" && textMessage[i + 19] === ":") {
                //переделать
                let smileyСode = textMessage[i + 1] + textMessage[i + 2] + textMessage[i + 3] + textMessage[i + 4] + textMessage[i + 5] + textMessage[i + 6] + textMessage[i + 7]
                    + textMessage[i + 8] + textMessage[i + 9] + textMessage[i + 10] + textMessage[i + 11] + textMessage[i + 12] + textMessage[i + 13] + textMessage[i + 14] + textMessage[i + 15] + textMessage[i + 16]
                    + textMessage[i + 17] + textMessage[i + 18];

                this.state.allSmiliesArr.map((v) => {

                    if (smileyСode === v.className) {

                        out.push(<div style={{ display: "inline-block", height: 16 + "px", width: 16 + "px", cursor: "text", marginRight: 2 + "px", marginBottom: -2 + "px" }} key={i} className={v.className}></div>)
                        i += 19;
                    }
                }
                )
            } else {
                out.push(textMessage[i])
            }
        }

        return out
    }


    //считает длину текста
    getTextWidth=(text, font)=> {
        let canvas = this.getTextWidth.canvas || 
            (this.getTextWidth.canvas = document.createElement("canvas"));
        let context = canvas.getContext("2d");
        context.font = font;
        let metrics = context.measureText(text);
        return metrics.width;
    };

    //получает значение выбранной кнопки в диалоге сообщения
    chooseButton=(EO)=>{
        let selecteddiv=EO.target;
        // console.log("--2",EO.currentTarget.dataset.info)
        selecteddiv.style.backgroundColor = "#424242";
        let buttonValue=selecteddiv.title;
        let buttonId=selecteddiv.id
        this.props.cbGetAnswerByButton(buttonValue,buttonId);
    }

    
    renderMessages = (allmessages) => {
        let message = [];//итоговый массив, который показываем

        //костыль, не заюзан
        let myArray = [];
        myArray= [...allmessages];//уникальная копия массива

        allmessages.map((item, index) => {
            //console.log(item, index)
            let messageContent = [];
            let buttonsArr=[];//массив для входящих кнопок
            message.push(<div key={index} className="BlockMessage">{messageContent}</div>);


            let receivedText=item.text;
            let stringWithoutSpaces=receivedText.split(' ').length-1; //хранит информацию о кол-ве пробелов в сообщении
            
            if (item.type === "AGENT") {
                // console.log("---receivedText Operator",receivedText)
                let mesLenght;
                if(stringWithoutSpaces===0){
                    mesLenght=this.getTextWidth(this.transformationMessage(item.text),"SeroPro");//подсчитывает длину текста в px
                }
                messageContent.push(
                    <div key={index} className="BlockMessageContent" >
                        {/* {подставляет лого с сервера или значение по дефолту} */}
                        <div className="BlockLogoOperator" style={item.operatorImage?{backgroundImage:"url("+item.operatorImage+")"}:{backgroundImage:this.props.defaultOperatorImage}}></div>
                        <div className="BlockMessageOperatorPointer"><div className="PointerOperator"></div></div>
                        <div className="BlockMessageOperator" style={{wordWrap:this.props.sizeBlockMessage-mesLenght<10?"break-word":"normal"}}>
                        
                            {this.transformationMessage(item.text)}
                            <br/>
                            {buttonsArr}
                            {/* {проверка, есть ли что-то в buttons, если есть, выводим их на экран} */}
                            {item.buttons.length!=0?
                            item.buttons.map((v,i)=>{
                                buttonsArr.push(
                                    <div onClick={(EO)=>{this.chooseButton(EO)}}
                                    data-info={v.tag} 
                                    id={v.tag}
                                    title={v.title}
                                    className="BlockMessageButtons" key={i}>{v.title}</div>
                                )
                            })
                            :
                            null}
                            <br />
                            <div className="BlockMessageOperatorNameTimeOperator">{item.time}</div>
                            <div className="BlockMessageOperatorNameTimeOperator">{item.operatorFullName?item.operatorFullName:"Оператор"}</div>
                        </div>
                    </div>
                );
            }
            if (item.type === "AGENT_TYPING") {
            //         console.log("Это я",item.text);
            //         console.log("Я под индексом",index);
            }
            if (item.type === "SYSTEM") {
                if("typeError" in item){
                    messageContent.push(
                        <div key={index} className="BlockMessageContent" >
                            <div className="BlockMessageSystem" style={{color:"red"}}>{item.text}</div>
                        </div>
                    );
                }else{
                    messageContent.push(
                        <div key={index} className="BlockMessageContent" >
                            <div className="BlockMessageSystem" style={{ }}>{item.text}</div>
                        </div>
                    );
                }
            }
            if (item.type === "OPERATOR_CONNECT") {
                messageContent.push(
                    <div key={index} className="BlockMessageContent" >
                        <div className="BlockMessageOperatorConnect" style={{}}>{item.text}</div>
                    </div>
                );
            }
            if (item.type === "SESSION_COMPLETION") {
                //this.props.cbGetInfoSessionCompletion(item.type); //delete
                messageContent.push(
                    // Понравилось ли Вам обслуживание? Выберите соответствующий смайлик.
                    <div key={index} className="BlockMessageContent" >
                        {/* <div className="BlockMessageOperator" style={{}}>{item.text}</div> */}
                        <div className="BlockMessageSystem">{windowOptions.chatСompletionMessage}</div>
                    </div>
                );
            }
            
            if (item.type === "CLIENT") {
                // console.log("---receivedText Client",receivedText)
                let mesLenght;
                if(stringWithoutSpaces===0){
                    mesLenght=this.getTextWidth(this.transformationMessage(item.text),"SeroPro");
                }
                messageContent.push(
                    <div key={index} className="BlockMessageContent">
                        <div className="BlockLogoUser" style={{}}></div>
                        <div className="BlockMessageUserPointer"><div className="PointerUser"></div></div>
                        {/* <div className="BlockMessageUserPointer"></div> */}
                        <div className="BlockMessageUser"  style={{wordWrap:this.props.sizeBlockMessage-mesLenght<10?"break-word":"normal"}}>
                        {this.transformationMessage(item.text)}
                        <br/>
                        <div className="BlockMessageOperatorNameTimeUser">{item.mytime}</div>
                        <div className="BlockMessageOperatorNameTimeUser">{item.name===undefined?"Вы":item.name}</div>
                        </div>
                    </div>
                );
            };
        });

        // console.log("--1",message)
        return message;
    }

    cbpressFieldMesList=()=>{
        this.props.cbpressFieldMesList();
    }

    //автоскролл сообщений
    scrollToBottom() {
        let scrollHeight = this.MesList.scrollHeight;
        let height = this.MesList.clientHeight;
        let maxScrollTop = scrollHeight - height;
        this.MesList.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }

    componentDidUpdate() {
        this.scrollToBottom();//некоректно работает
        
        let arr=this.props.messageList;
        arr.map((item, index) => {
            if (item.type === "AGENT_TYPING") {
                this.setState({
                    agentTyping:true
                })
            };
            if (item.type === "AGENT") {
                this.setState({
                    agentTyping:false
                })
            };
        });
    }

    componentDidMount() {
        this.MesList.scrollTop = 90000;//автоскролл сообщений при загрузке чата
        this.MesList.addEventListener("mousedown", this.cbpressFieldMesList);
    }

    componentWillUnmount() {
       this.MesList.removeEventListener("mousedown", this.cbpressFieldMesList);
    };


    render() {

        return (
            <div className={this.props.dialogueCompleted ? "BlockChatWindowDisplayMessagesNone" : "BlockChatWindowDisplayMessages"}
                // style={{height:this.props.sizeY-120-this.props.heightMeslist + "px"}}
                style={{height:this.props.sizeY-45-this.props.sizeYfooterChat + "px"}}//fix 45 запас
                // ref="mesList"
                ref={MesList => { this.MesList = MesList; }}
            >
                <div className="BlockMessageList">
                    {this.props.messageList===undefined||this.props.messageList===null||this.props.messageList.length===0 ? 
                        <div className="BlockLoad"><hr/><hr/><hr/><hr/></div>
                        :
                        this.renderMessages(this.props.messageList)}
                </div>
                <div className="BlockMessageAgentTyping"
                    style={{bottom:38+this.props.sizeYentryField+"px"}}//fix 38
                >
                    {this.props.hasErrors&&<div className="chatErrorMessage">{windowOptions.chatErrMessage}</div>}
                    {this.state.agentTyping ? "Оператор набирает сообщение":" "}
                </div>
            </div>
        )
    }

};

export default MessageList;