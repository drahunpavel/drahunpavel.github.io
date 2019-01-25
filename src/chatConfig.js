let windowOptions = {

  helloMessage: "Вас приветствует БПC-Сбербанк. Задайте интересующий вопрос.",
  helloMessage2: "Вас приветствует БПC-Сбербанк. Задайте ваш вопрос.",

  thanksMessage1: "Мы перезвоним Вам в указанное Вами время!",
  thanksMessage2: "Мы свяжемся с Вами!",

  //информация окна Заказать звонок
  titleCallBack: "Заказать звонок",
  titleMail: "Задать вопрос",
  titleChat: "Чат с банком",

  schedule: "Круглосуточно",

  chatOfflineMessage: "Уважаемый клиент! К сожалению, в данный момент наблюдается технический сбой в работе чата. Повторите Ваш запрос позже либо обратитесь в Банк по любому из доступных Вам каналов.",
  chatOperatorConnectedMessage: "К Вам подключился оператор $$$",
  chatErrorMessage: "Извините! Произошла техническая ошибка. Повторите Ваш запрос позже либо обратитесь в Банк по любому из доступных Вам каналов",
  chatErrMessage: "Уважаемый клиент! К сожалению, в данный момент наблюдается технический сбой в работе чата. Повторите Ваш запрос позже либо обратитесь в Банк по любому из доступных Вам каналов.",

  callbackErrorMessage: "Извините! Произошла техническая ошибка. Повторите Ваш запрос позже либо обратитесь в Банк по любому из доступных Вам каналов",
  questionErrorMessage: "Извините! Произошла техническая ошибка. Повторите Ваш запрос позже либо обратитесь в Банк по любому из доступных Вам каналов",
  
  // chatСompletionMessage: "Оператор покинул чат! Понравилось ли Вам обслуживание? Выберите, пожалуйста, соответствующую оценку после завершения диалога.",

  dialogueRating1: "Пожалуйста, оцените диалог с оператором",
  dialogueRating2: "Ваше мнение нужно, чтобы сделать сервис лучше",



  //REQUESTServiceHost: 'https://chat.bps-sberbank.by',  //
  REQUESTServiceHost: 'https://chattest.bps-sberbank.by/', //Test


  REQUESTServiceOpen: "/chat/api/session/open",
  REQUESTServiceOpenSBOL: "https://digital.bps-sberbank.by/SBOLServer/rest/user/chatSessionOpen",
  REQUESTServicePoll: "/chat/api/session/poll",
  REQUESTServicePush: "/chat/api/session/push",
  REQUESTServiceHistory: "/chat/api/session/history",
  REQUESTServiceStatus: "/chat/api/status",
  REQUESTServiceOperator: "/chat/api/session/operator",



  REQUESTServiceCallBack: "http://www.bps-sberbank.by/ccservice/CallBackOrder", //http://www.bps-sberbank.by/site/callbackorder.nsf/callbackorder
  REQUESTServiceTestCallBack: "http://172.30.71.116/ccservice/CallBackOrder",

  REQUESTServiceQuestion: "http://www.bps-sberbank.by/ccservice/AskQuestion", //http://www.bps-sberbank.by/site/callbackorder.nsf/AskQuestion
  REQUESTServiceTestQuestion: "http://172.30.71.116/ccservice/AskQuestion",


  //для рейтинга
  chatRatingSmiles: [
    {
      "code": 1,
      "image": "url(/bps-chat/images/images/smile_bad.png)",
      "description": "1"

    },
    {
      "code": 2,
      "image": "url(/bps-chat/images/images/smile_normal.png)",
      "description": "3"
    },
    {
      "code": 3,
      "image": "url(/bps-chat/images/images/smile_good.png)",
      "description": "5"
    }
  ],


  errorMessageUserName: {
    "1": "Ваше имя слишком короткое",
    "2": "Ваше имя слишком длинное",
    "3": "Заполните, пожалуйста, поле",
  },

  errorMessageUserNumber: {
    "1": "Заполните, пожалуйста, поле",
    "2": "Проверьте, пожалуйста, веденный Вами номер",
    "3": "Пример заполнения +ХХХХХХХХХХХХ",
    "4": "Пример заполнения +375(29|44|33|25)ХХХХХХХ",
    "5": "Номер белорусского оператора",
    "6": "Номер зарубежного оператора",
  },

  errorMessageUserMessage: {
    "1": "Заполните, пожалуйста, поле",
    "2": "Ваше сообщение слишком короткое",
    "3": "Вы превысили допустимую длину сообщения",
  },

  errorMessageUserMail: {
    "1": "Заполните, пожалуйста, поле",
    "2": "Пример заполнения example@email.com",
  },
  // ChatAutoRefreshInterval: 2000, // интервал авто-освежения чата
  // autoOpenChat: 10000, //время до автоматического открытия чата
  // userMarkWaitingInterval: 30, // сколько ждать выставления оценки пользователем в секундах
}; 


export default windowOptions;
