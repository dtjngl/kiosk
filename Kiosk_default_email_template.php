<?php namespace ProcessWire;

$order = $_SESSION['kiosk']['order'];

$paymentMethod = $order['paymentMethod'];
$subTotal = $order['subTotal'];
$shipping = $order['shipping'];
$totalAndShipping = $order['totalAndShipping'];
$totalTaxes = $order['totalTaxes'];
$cartItems = json_decode($order['cartItems'], true);
$shippingDetails = json_decode($order['shippingDetails'], true);
if($shippingDetails['sameAddress']==false){
    $billingDetails = json_decode($order['billingDetails'], true);
} else {
    $billingDetails = $shippingDetails;
}

$givenname_billing = $billingDetails['first']; 
$familyname_billing = $billingDetails['last']; 
$email_billing = $billingDetails['email']; 
$street_billing = $billingDetails['street']; 
$zip_billing = $billingDetails['zip']; 
$city_billing = $billingDetails['city']; 
$state_billing = $billingDetails['state']; 

$fullname_billing = $givenname_billing.' '.$familyname_billing;
$fullname_billing = ucwords($fullname_billing);

$givenname_shipping = $shippingDetails['first']; 
$familyname_shipping = $shippingDetails['last']; 
$email_shipping = $shippingDetails['email']; 
$street_shipping = $shippingDetails['street']; 
$zip_shipping = $shippingDetails['zip']; 
$city_shipping = $shippingDetails['city']; 
$state_shipping = $shippingDetails['state']; 

$fullname_shipping = $givenname_shipping.' '.$familyname_shipping;
$fullname_shipping = ucwords($fullname_shipping);


$subject_order = 'neue Bestellung von: ' . $fullname_billing;
$subject_confirmation = 'Ihre Bestellung ist eingegangen';

$order_markup = "";

foreach ($cartItems as $key => $value) {

    // $stackable = $value['stackable'];
    $productwidth = $value['productwidth'];
    $title = $value['title'];
    $incart = $value['inCart'];
    $imgurl = $value['img'];
    $temp = '';
    $css = '';

    $order_markup .= '<span style="align-items: baseline; vertical-align: bottom; display: inline-block; margin: 10px;">';

    $order_markup .= '<img src="'.$imgurl.'" width="'.$productwidth.'" height="auto"/>';
    $order_markup .= '</span>';

}

foreach ($cartItems as $key => $value) {
    $order_markup .= 
    '<p style="font-size: 14px;">
        <span>'.$value['inCart'].'</span>
        <span> x </span>
        <strong>'.$value['title'].'</strong>
        <span> à EUR </span>
        <span>'.$this->dotToComma($value['price']).'</span>
        <span> = </span>
        <strong>EUR '.$this->dotToComma($value['totalprice']).'</strong>
    </p>';
}

$order_markup .=
    '<br />
    <p style="font-size: 14px;">
        <span>ZWISCHENSUMME: EUR '.$this->dotToComma($subTotal).'</span>
    </p>
    <p style="font-size: 14px;">
        <span>(inkl. MWSt.: EUR '.$this->dotToComma($totalTaxes).')</span>
    </p>
    <p style="font-size: 14px;">
        <span>VERSAND: EUR '.$this->dotToComma($shipping).'</span>
    </p>
    <p style="font-size: 14px;">
        <strong>GESAMTSUMME: EUR '.$this->dotToComma($totalAndShipping).'</strong>
    </p>
    <br />';

$shippingDetails_markup = 
    '<p style="font-size: 14px;">
    <strong>Versandadresse</strong><br /><span>'
    . $givenname_shipping 
    . '</span> <span>'
    . $familyname_shipping 
    . '</span><br /><span>' 
    . $email_shipping 
    . '</span><br /><span>' 
    . $street_shipping 
    . '</span><br /><span>' 
    . $zip_shipping 
    . '</span> <span>'
    . $city_shipping 
    . '</span><br /><span>'
    . $state_shipping
    . '</span></p>'
    . '<br />';

$billingDetails_markup = 
    '<p style="font-size: 14px;">
    <strong>Rechnungsadresse</strong><br /><span>'
    . $givenname_billing 
    . '</span> <span>'
    . $familyname_billing 
    . '</span><br /><span>' 
    . $email_billing 
    . '</span><br /><span>' 
    . $street_billing 
    . '</span><br /><span>'
    . $zip_billing 
    . '</span> <span>'
    . $city_billing 
    . '</span><br /><span>'
    . $state_billing
    . '</span></p>'
    . '<br />';


$payment_markup =
    '<p style="font-size: 14px;">
        <strong>Zahlungsmethode</strong><br />
        <span>'.$paymentMethod.'</span>
    </p>
    <br />';

$email_order = '<h2>Folgende Bestellung ist eingegangen.</h2>';
$email_order .= $order_markup;
$email_order .= $shippingDetails_markup;
$email_order .= $billingDetails_markup;
$email_order .= $payment_markup;

$email_confirmation = '<h2>Danke für Ihre Bestellung!</h2>';
$email_confirmation = '<p>Ihre Bestellung ist soeben bei uns eingegangen und wir werden sie umgehend verarbeiten.</p>';
$email_confirmation .= $order_markup;
$email_confirmation .= $shippingDetails_markup;
$email_confirmation .= $billingDetails_markup;
$email_confirmation .= $payment_markup;


// this is what the module needs from you to continue :D

$email_markup = array(
    'email_order' => $email_order,
    'email_billing' => $email_billing,
    'fullname_billing' => $fullname_billing,
    'subject_order' => $subject_order,
    'email_confirmation' => $email_confirmation,
    'subject_confirmation' => $subject_confirmation
);

?>