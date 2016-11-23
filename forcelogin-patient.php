<?php
session_start();
$data = '{"id": "4","name": "John Cena","username": "john@gmail.com","status": "available","type": "patient","country": "US and A","city": "New York","languages": ["English"],"profileimage": "","SecurityToken":"7ef5s2f40ef4ecd0b06c4cf7ed4f1qab","otherdata": {"speciality": "Specialist in Angular","currency":"USD","rate": "50","shortbiography": "Pationate in whatever the task is.","awards": "1st place in all places","graduateschool": "Cardif Metropolitan","residenceplace": "Colombo"}}';
$authObject = json_decode($data);
echo $data;
setcookie('securityToken',$authObject->SecurityToken, time() + (86400 * 30), "/");
setcookie('authData', json_encode($authObject), time() + (86400 * 30), "/");

?>