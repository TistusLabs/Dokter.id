<?php

require_once ("config.php");
require_once ("curl.php");

function get_app_by_id($id)
{
  $app_info = array();

  // normally this info would be pulled from a database.
  // build JSON array.
  switch ($id){
    case 1:
      $app_info = array("app_name" => "Web Demo", "app_price" => "Free", "app_version" => "2.0"); 
      break;
    case 2:
      $app_info = array("app_name" => "Audio Countdown", "app_price" => "Free", "app_version" => "1.1");
      break;
    case 3:
      $app_info = array("app_name" => "The Tab Key", "app_price" => "Free", "app_version" => "1.2");
      break;
    case 4:
      $app_info = array("app_name" => "Music Sleep Timer", "app_price" => "Free", "app_version" => "1.9");
      break;
  }

  return $app_info;
}

function get_app_list()
{
  //normally this info would be pulled from a database.
  //build JSON array
  $app_list = array(array("id" => 1, "name" => "Web Demo"), array("id" => 2, "name" => "Audio Countdown"), array("id" => 3, "name" => "The Tab Key"), array("id" => 4, "name" => "Music Sleep Timer")); 

  return $app_list;
}

function authenticate_user($email,$password){
    $response = '{"IsSuccess":false,"Message":"Incorrect Username or Password."}';
    $data = CurlGet(SERVER_URL .'/api/users/',NULL);
    $list = json_decode($data);
    if(!empty($list)){
        foreach ($list as $profile) {
            if($email == $profile->username && $password == $profile->password){
                unset($profile->password);
                $response = '{"IsSuccess":true,"Message":"Correct user credentials.","Data":'.json_encode($profile).'}';
            }
        }
    }
    return $response;
}

$possible_url = array("authenticate_user");

$value = '{"IsSuccess":false,"Message":"An Error occured."}';

if (isset($_GET["action"]) && in_array($_GET["action"], $possible_url))
{
  switch ($_GET["action"])
    {
      case "authenticate_user":
        if (isset($_GET["email"]) && isset($_GET["password"])){
            $value = authenticate_user($_GET["email"],$_GET["password"]);   
        }else{
            $value = '{"IsSuccess":false,"Message":"Email or Password is empty."}';
        }
        break;
      case "get_app":
        if (isset($_GET["id"]))
          $value = get_app_by_id($_GET["id"]);
        else
          $value = "Missing argument";
        break;
    }
}

//return JSON array
echo $value;
//exit(json_encode($value));

?>