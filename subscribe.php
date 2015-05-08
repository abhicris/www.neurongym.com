<?php
if (isset($_POST)) {
	
	$useMailChimp = true;
	
	$to_email = 'abhishek@edlogiq.in';  # Your email address
	
	$mc_apiKey = '8dc5bce0c8a0f40342642101da39af85-us8'; # Your MailChimp API key
	$mc_listId = '29b5469990'; # Your MailChimp list ID

	$mc_url = "http://us8.api.mailchimp.com/1.3/?method=listSubscribe"; //replace us6 with your actual datacenter
	
	$mc_double_optin = false;
	$mc_send_welcome = false;
	
	$ts = date('F j, Y, g:i a');
	$website = $_SERVER['SERVER_NAME'];
	$user_email=$_POST['sbemail'];
	
	
	if (filter_var($user_email, FILTER_VALIDATE_EMAIL))
	{
		if ($useMailChimp)
		{
			$data = array(
				'email_address' => $user_email,
				'apikey'        => $mc_apiKey,
				'id'            => $mc_listId,
				'double_optin'  => $mc_double_optin,
				'send_welcome'  => $mc_send_welcome,
				'email_type'    => 'html'
			);
			
			$json_data = json_encode($data);
		
			$ch = curl_init();
				curl_setopt($ch, CURLOPT_URL, $mc_url);
				curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
				curl_setopt($ch, CURLOPT_POST, true);
				curl_setopt($ch, CURLOPT_POSTFIELDS, urlencode($json_data));
				@curl_exec($ch);
			curl_close ($ch);
			
		} elseif (isset($to_email)) {

			$data = "$ts\r\n\r\nNotification request from $website vistor.\r\nE-mail: $user_email";
		
			@mail($to_email, 'Message from '.$website, $data, "Content-type:text/plain; charset=UTF-8\r\nFrom:$user_email");			
			
		}
		die('Added');
		
	} else {
		die('Error: 002'); # Invalid email ( wow, custom request from non-original form )
	}
	
} else {
	die('Error: 001'); # Can't load POST
}	
?>