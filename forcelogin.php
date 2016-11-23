<?php
session_start();


$ch = curl_init();
//curl_setopt($ch, CURLOPT_URL, 'http://smoothflow.io/auth/Login/shehan@duosoftware.com/DuoS123/smoothflow.io/');
//curl_setopt($ch, CURLOPT_URL, 'http://smoothflow.io/auth/Login/wewaneral@stexsy.com/DuoS123/smoothflow.io/');
//curl_setopt($ch, CURLOPT_URL, 'http://smoothflow.io/auth/Login/binuka@duosoftware.com/123/smoothflow.io/');
//curl_setopt($ch, CURLOPT_URL, 'http://smoothflow.io/auth/Login/xez@uacro.com/xez@uacro.com/smoothflow.io/');
//curl_setopt($ch, CURLOPT_URL, 'http://smoothflow.io/auth/Login/scsrr@maildx.com/scsrr@maildx.com/smoothflow.io/');
curl_setopt($ch, CURLOPT_URL, 'http://smoothflow.io/auth/Login/tmar@arur01.tk/tmar@arur01.tk/smoothflow.io/');
//curl_setopt($ch, CURLOPT_URL, 'http://smoothflow.io/auth/Login/rusiru.peiris@gmail.com/123/smoothflow.io/');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$data = curl_exec($ch);
$authObject = json_decode($data);
echo $data;
curl_close($ch);
	//var_dump($authObject);
setcookie('securityToken',$authObject->SecurityToken, time() + (86400 * 30), "/");
setcookie('authData', json_encode($authObject), time() + (86400 * 30), "/");
/*$_SESSION['securityToken']=$authObject->SecurityToken;
$_SESSION['authData']=$data;
*/
/*$data = "{\"UserID\":\"ea4e5588db48834b3bbe22192faf405a\",\"Username\":\"admin@duosoftware.com\",\"Name\":\"admin\",\"Email\":\"admin@duosoftware.com\",\"SecurityToken\":\"3497d800ebdc4632a60a56c4d341453b\",\"Domain\":\"duosoftware.com\",\"DataCaps\":\"#duosoftware.com#ea4e5588db48834b3bbe22192faf405a#1#2#4\",\"ClientIP\":\"112.134.96.10:62693\"}";
$authObject = json_decode($data);
setcookie('securityToken',$authObject->SecurityToken, time() + (86400 * 30), "/");
setcookie('authData',$data, time() + (86400 * 30), "/");
$_SESSION['securityToken']=$authObject->SecurityToken;
$_SESSION['userObject']=$data;
echo $data;*/
?>