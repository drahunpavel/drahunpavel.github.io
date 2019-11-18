<?php

echo 'Я тут';

$name = $_POST['name'];
$phone = $_POST['phone'];
$email = $_POST['email'];
$message = $_POST['message'];

// преобразует все символы
$fio = htmlspecialchars($fio);
$email = htmlspecialchars($email);

// декодирует url,
$fio = urldecode($fio);
$email = urldecode($email);

// удалим пробелы
$fio = trim($fio);
$email = trim($email);


if (mail("drahunpavel@gmail.com", "Заказ с сайта", "ФИО:".$fio.". E-mail: ".$email ,"From: example2@mail.ru \r\n"))
 {
    echo "сообщение успешно отправлено";
} else {
    echo "при отправке сообщения возникли ошибки";
}
?>