var MyObj = null; //массив со всеми пользователями

//модальное окно для выбора победителя
let elem = document.getElementById('modal1');
var instances = M.Modal.init(elem);

//генерация случайного числа
function randomInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
};

function getObj(arr){
    MyObj = arr;
};

function startGeneration() {
    let elemModalContent = document.getElementById('modalContent');

    if(MyObj){
        elemModalContent.innerHTML = load;
        setTimeout(() => {
            let generatedNumber = randomInteger(1, MyObj.length - 1);
            if(generatedNumber){
                var positiveArr = MyObj.filter(function(item){
                    return +item[0] == generatedNumber;
                });
            };

            let contentWinner = '<table>';
            contentWinner += `<tr><th>${positiveArr[0][0]}</th><th>${positiveArr[0][2]}</th><th>${positiveArr[0][3]}</th><th>${positiveArr[0][5]}</th></tr>`
            contentWinner += '</table>';
            elemModalContent.innerHTML = contentWinner;
        }, 5100)

    }else{
        let contentWarning = "<div class='modal-answer'><h6>Данные не выбраны!</h6></div>";
        elemModalContent.innerHTML = contentWarning;
    };
};

const load = '<div class="wrap-loader">' +
                    '<div class="loader">' + 
                        '<div class="box"></div>' + 
                        '<div class="box"></div>' +
                        '<div class="box"></div>' +
                        '<div class="box"></div>' +
                        '<div class="wrap-text">' +
                            '<div class="text">' +
                                // '<span>10</span>' +
                                // '<span>9</span>' +
                                // '<span>8</span>' +
                                // '<span>7</span>' +
                                // '<span>6</span>' +
                                '<span>5</span>' +
                                '<span>4</span>' +
                                '<span>3</span>' +
                                '<span>2</span>' +
                                '<span>1</span>' +
                                '<span></span>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="loader-text">Пожалуйста, подождите</div>' +
                '</div>'