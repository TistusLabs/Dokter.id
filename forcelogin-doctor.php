<?php
session_start();
$data = '{"id": "1","name": "Shehan Tis","username": "shehan@gmail.com","status": "available","type": "doctor","country": "Sri Lanka","city": "Colombo","languages": ["English", "Indonesian"],"profileimage": "http://www.gravatar.com/avatar/7272996f825bd268885d6b20484d325c","SecurityToken":"a119b1f40ef4ecd0b06c4cf6aa9ce6ab","otherdata": {"speciality": "Specialist in Angular","currency":"USD","rate": "50","shortbiography": "Pationate in whatever the task is.","awards": "1st place in all places","graduateschool": "Cardif Metropolitan","residenceplace": "Colombo"}}';
$authObject = json_decode($data);
echo $data;
setcookie('securityToken',$authObject->SecurityToken, time() + (86400 * 30), "/");
setcookie('authData', json_encode($authObject), time() + (86400 * 30), "/");

?>