<?php


function CurlGet($url, $headers){
	$headerArray = array(                                                                          
			    'Content-Type: application/json');
	if(!empty($headers)){
		$headerArray=array_merge($headers, $headerArray);
	}
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_HEADER, false);          
	curl_setopt($ch, CURLOPT_HTTPHEADER, $headerArray); 
	$data = curl_exec($ch);
	curl_close($ch);
	return $data;
}

?>