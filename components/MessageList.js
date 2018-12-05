import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

let allSmilies = require("../src/allSmilies.json");



import './MessageList.scss';
//import './BlockWindowWrap.scss';
//import './ChooseSmiley.scss'

//let messageList=require("../src/messageList.json");

class MessageList extends React.PureComponent {

    static propTypes = {
        //messageList
        //dialogueCompleted - workimg
        //sendMessageUpdate
        //cbkeyPressEnter
    };
    state = {
        allSmiliesArr: allSmilies,
    }


    // cbkeyPressEnter = (EO) => {

    //     if (EO.keyCode === 13) {
    //         //console.log(EO.keyCode)

    //         EO.preventDefault();
    //         this.props.cbkeyPressEnter()
    //     }
    // }

   
    

    messageUpdate = () => {
        if (this.props.sendMessageUpdate) {

            //this.refs.mesList.scrollTo(999999, 999999)
            console.log("Обновление!")
            // this.props.cbClose(this.refs.mesList.scrollTo(999999, 999999));
        }
    }

    transformationMessage = (textMessage) => {

        let out = [];
        for (let i = 0; i < textMessage.length; i++) {
           

            if (textMessage[i] === ":" && textMessage[i + 19] === ":") {
                //переделать
                let smileyСode = textMessage[i + 1] + textMessage[i + 2] + textMessage[i + 3] + textMessage[i + 4] + textMessage[i + 5]+textMessage[i + 6]+textMessage[i + 7]
                +textMessage[i + 8]+textMessage[i + 9]+textMessage[i + 10]+textMessage[i + 11]+textMessage[i + 12]+textMessage[i + 13]+textMessage[i + 14]+textMessage[i + 15]+textMessage[i + 16]
                +textMessage[i + 17]+textMessage[i + 18];

                this.state.allSmiliesArr.map((v) => {

                    if (smileyСode === v.className) {
                        
                        out.push(<div style={{display:"inline-block", height:16+"px", width:16+"px",cursor:"text",marginRight:2+"px",marginBottom:-2+"px"}} key={i} className={v.className}></div>)
                        i += 19;
                    }
                }
                )
            } else {
                out.push(textMessage[i])
            }
        }
        // let reg=textMessage.replace( /[:]{1}[0-9]{2}[a-z]{2}[:]{1}/g )

        return out
    }

//автоскролл сообщений
    scrollToBottom() {
        const scrollHeight = this.refs.mesList.scrollHeight;
        const height = this.refs.mesList.clientHeight;
        const maxScrollTop = scrollHeight - height;
        this.refs.mesList.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
        // const height = this.messageList.clientHeight;
        // const maxScrollTop = scrollHeight - height;
        // this.messageList.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
      }

    componentDidUpdate() {
        //console.log("---1")
        this.scrollToBottom();//некоректно работает
        //this.refs.mesList.scrollTop=90000;//автоскролл сообщений при загрузке чата
      }

    componentDidMount() {
        //this.refs.mesList.scrollTo(999999, 999999) // из-за этого условия не работает IE
        this.refs.mesList.scrollTop=90000;//автоскролл сообщений при загрузке чата
        
    }


    render() {
        //console.log("props",this.props.sendMessageUpdate)
        console.log("MesList",this.props.hasErrors)
        return (
            <div className={this.props.dialogueCompleted ? "ChatWindowDisplayMessagesNone" : "ChatWindowDisplayMessages"}
                 ref="mesList"
            >
                    <ul className="message-list">
                        {this.props.messageList.map(v =>
                            <li key={v.code} className="message">
                                {v.id === "operator" &&
                                    <div className="messageContent" >
                                        <div className=" logoOperator" style={{backgroundImage: v.image}}></div>
                                        <div className=" messageOperator" style={{ }}>{this.transformationMessage(v.message)}</div>
                                    </div>
                                }
                                {v.id === "user" &&
                                    <div className="messageContent">
                                        <div className=" logoUser" style={{}}></div>
                                        <div className=" messageUser" style={{}}>{this.transformationMessage(v.message)}</div>
                                    </div>
                                }
                                {v.id === "error" &&
                                    <div className="messageContent">
                                        {/* <div className=" logoUser" style={{}}></div> */}
                                        <div className="messageServis" style={{}}>{v.message}</div>
                                    </div>
                                }                                
                            </li>
                        )}
                    </ul>
            </div>
        )
    }

};

export default MessageList;