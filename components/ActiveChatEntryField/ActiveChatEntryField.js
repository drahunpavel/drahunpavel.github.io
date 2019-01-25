import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import './ActiveChatEntryField.scss';
import './ChooseSmiley.scss';

let allSmilies = require("../../src/allSmilies.json");

class ActiveChatEntryField extends React.Component {

    state = {
        allSmiliesArr: allSmilies,
        textMessage: "",

        sizeYentryFieldDefault:30,
    }

    timerSend=null;//костыль

    cbOpenWindowSmiles=()=>{
        this.props.cbOpenWindowSmiles();
    }

    //получает текст из поле ввода
    getMessageText=()=>{
        this.props.cbgetHeightEntryField(this.InputElement.scrollHeight);
        if(window.getSelection){
            let sel2 = window.getSelection();
            return sel2;
        }
    };

    //добавляет смайлы в поле ввода
    addEmotions=(EO)=>{
        let smlID=EO.currentTarget.dataset.title;
        if(smlID){
        let smile=smlID;
        let inputElement=this.InputElement;

        //создание тега img
        let img = document.createElement("IMG");
        img.className ="emoji desc"+smile;
        img.src="/bps-chat/images/images/opacity.png";

        if(window.getSelection){
            let sel=this.getMessageText();
            //FIX Me dont del
            // if (sel.getRangeAt && sel.rangeCount) {

            //     let currentInputElement = sel.focusNode.tagName ? sel.focusNode : sel.focusNode.parentNode;

            //     console.log(sel.focusNode.tagName, sel.focusNode, sel.focusNode.parentNode)
            //     let currentBlockElement = ReactDOM.findDOMNode(this.inputElementContainer); 

            //     console.log("---1",currentInputElement)

            //     if(currentInputElement === inputElement){
            //         let range = window.getSelection().getRangeAt(0);
            //         range.insertNode(img);
            //         this.SetCursorAfterElement(img);
            //         return true;
            //     }            
            // }
        }
            inputElement.appendChild(img);
            this.SetCursorToEnd(inputElement);  
        }  
    }
    //устанавливает курсор в конец элемента
    SetCursorToEnd=(inputElement)=> {
        inputElement.focus();
        if (window.getSelection && document.createRange) {
            let range = document.createRange();
            range.selectNodeContents(inputElement);
            range.collapse(false);
            this.SetRange(range);
        }
    };  

    SetRange=(range)=> {
        if (document.getSelection) {
            let sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }
    //устанавливает курсос после смайла
    SetCursorAfterElement=(el)=> {
        var range = document.createRange();
        range.setStartAfter(el);
        range.setEndAfter(el);
        this.SetRange(range);
    }

    // при отправке сообщения заменяет теги img на ID смайла
    sendMessage = () => {
        if(this.props.status==="ONLINE"&&!this.props.getSessionCompletion){

            let input=this.InputElement;
            let contentInput=input.innerHTML;
           
            let newContentInput =this.conversionText(contentInput);
            this.setState({
                text:newContentInput,
                // selectionWindowSmile:false,
            })
            input.innerHTML="";
    }

    };
    //замены символов
    conversionText=(text)=>{
        // text.replace('&lt;','<').replace('&gt;', '>');
        let temporaryText=text.replace('&lt;','<').replace('&gt;', '>');
        let textMessage=temporaryText;
        let allTagImgArr = temporaryText.match(/\<img([^>]*)>/gi);
        let allTextDesc;
        let allSmileDeskArr=[];
        
        let spaces=temporaryText.match(/&nbsp;/gi);
        //FIX ME
        //сюда попадают пробелы в виде &nbsp; и прочие теги
        if(spaces){
            for(let j=0;j<spaces.length;j++){
                textMessage=textMessage.replace(spaces[j]," ");
            }
        };

        //replace img to id
        if(allTagImgArr!=null){            
            for(let i=0;i<allTagImgArr.length;i++){
                allTextDesc=allTagImgArr[i].match(/emoji descD83D[\w]{4}/gi);//вырезает значение класса
                allSmileDeskArr.push(allTextDesc);
                textMessage=this.replacingEmotionDescription(textMessage,allTagImgArr[i],allSmileDeskArr[i][0]);
            }
        };
        textMessage.replace(/\s+/g, ' ').trim();//Находит любое количество последовательных пробелов и удаляет их
        let textWithoutTags=textMessage.replace(/<\/?[^>]+(>|$)/g, "");//удаляет теги с текста
        // textMessage.replace('&lt;','<').replace('&gt;', '>')//управляет <>
        //в запросах не будет пустых сообщений
        if(textWithoutTags.trim().length!=0){
            this.setState({
                textMessage:textWithoutTags,
            },()=>this.props.cbSendMessage(textWithoutTags));
        };
    };

    replacingEmotionDescription=(text,imgSmile,nameSmile)=>{
            let newreg= RegExp(imgSmile,'g');
            let str=nameSmile;  
            let transText=text.replace(newreg," :"+str+": ");
        
        return transText;
    };

    //скроллит окно ввода сообщения вниз при каждом выборе смайла
    scrollInputFields=()=>{
        let inputElement=this.InputElement;
        inputElement.scrollIntoView(false);
    }

    //отправялет мессаге по enter
    controlKeyboardsButton = (EO) => {
        if (EO.keyCode === 13) {
            this.timerSend=setTimeout(()=>{this.props.cbgetHeightEntryField(30)},1);//FIX
            this.props.messageList===undefined||this.props.messageList===null||this.props.messageList.length!=0?this.sendMessage():null;
            EO.preventDefault();
        }
    }


    //преобразовывет текст, который копируем в поле ввода
    handlePaste=(EO)=>{
        let entryElem=this.InputElement;
        let clipboardData, pasteData;

        // Stop data actually being pasted into div
        EO.stopPropagation();
        EO.preventDefault();

        // Get pasted data via clipboard API
        clipboardData = EO.clipboardData || window.clipboardData;
        pasteData = clipboardData.getData('Text');
        let text =entryElem.innerHTML;
        entryElem.innerHTML=text+pasteData;
        this.SetCursorToEnd(entryElem);
        this.props.cbgetHeightEntryField(this.InputElement.scrollHeight);
    }

    //запрещает перетягивать тест
    allowDrop=(EO)=>{
        EO.preventDefault();
    }
    drag=(EO)=>{
        EO.dataTransfer.setData("Text", EO.target.id);
    }
    drop=(EO)=>{

        let entryElem=this.InputElement;

        EO.preventDefault();
        var data = EO.dataTransfer.getData("Text");
        // let elem=document.getElementById(data);
        // EO.target.appendChild(elem);
        let text =entryElem.innerHTML;
        entryElem.innerHTML=text+data;
        this.props.cbgetHeightEntryField(this.InputElement.scrollHeight);
    }

    componentDidUpdate() {
        let inputElementField=this.InputElement;
        //при ошибке меняет состояние contenteditable, чтобы не было возможности редактировать
        if(this.props.status!="ONLINE"||this.props.getSessionCompletion||this.props.hasErrors){
            inputElementField.setAttribute("contenteditable", "false");
            // this.state.selectionWindowSmile=false
        }else{
            inputElementField.setAttribute("contenteditable", "true");
        }
        this.props.cbgetHeightEntryField(this.InputElement.scrollHeight);
      }

    componentDidMount() {
        //this.refs.mesList.scrollTo(999999, 999999) // из-за этого условия не работает IE
        document.addEventListener('keydown', this.controlKeyboardsButton);

        //past text in div
        let inElement=this.InputElement;
        inElement.addEventListener('paste', this.handlePaste);
    }
    componentWillUnmount() {
        document.removeEventListener('keydown', this.controlKeyboardsButton);

        let inElement=this.InputElement;
        inElement.removeEventListener('paste', this.handlePaste);
    }


    render() {
        let { smileID,status } = this.props; //деструктуризация
        let { textMessage } = this.state; //деструктуризация
        return (
            <div className="BlockActiveChatEntryField">
                <form className="BlockActiveChatEntryFieldText" style={{width:this.props.sizeX-85+"px",height:this.props.sizeYentryField+"px" }}
                    ref={formElement => { this.formElement = formElement; }}
                >
                    <div className={this.props.status==="ONLINE"&&!this.props.getSessionCompletion ? "BlockMessageField":"BlockMessageFieldDisabled"}  
                        data-type="input" 
                        data-text="Напишите сообщение..."  
                        // ref={(node)=>{this.inputElement=node}} 
                        ref={InputElement => { this.InputElement = InputElement; }}
                        autoFocus  
                        contentEditable="true" 
                        // tabIndex="1" 
                        onDrop={(EO)=>this.drop(EO)}
                        onDragOver={(EO)=>this.allowDrop(EO)}
                        onInput={this.getMessageText}
                    >
                    </div>
                </form>

                <div
                    className={this.props.selectionWindowSmile ? "BlockWindowSmilies" : "BlockWindowSmiliesNone"}
                    style={{ backgroundColor: "white" }}>
                    {this.state.allSmiliesArr.map(v =>
                        <div onClick={(EO)=>{this.addEmotions(EO);this.scrollInputFields()}}  className="Emoji_Smile" id={v.title} data-title={v.title}  key={v.code}>
                            <div><i className={v.className}></i></div>
                        </div>
                    )}
                </div>

                {/*кнопка Открыть\закрыть окно со смайлами */}
                <div className={this.props.selectionWindowSmile
                            ? "BlockActiveChatFooterSmileActive"
                            : this.props.status==="ONLINE"&&!this.props.hasErrors&&!this.props.getSessionCompletion ? "BlockActiveChatFooterSmile":"BlockActiveChatFooterSmileDisabled"
                    }
                    onClick={this.props.status==="ONLINE"&&!this.props.hasErrors&&!this.props.getSessionCompletion ?this.cbOpenWindowSmiles:null}
                />

                {/* кнопка Отправки сообщения */}
                <div className={this.props.status==="ONLINE"&&!this.props.hasErrors&&!this.props.getSessionCompletion? "BlockActiveChatFooterButton":"BlockActiveChatFooterButtonDisabled"} onClick={this.props.status==="ONLINE"&&!this.props.hasErrors&&!this.props.getSessionCompletion&&this.props.messageList.length!=0?this.sendMessage:null} />

            </div>


        )
    }

};
export default ActiveChatEntryField;
