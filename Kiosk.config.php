<?php namespace ProcessWire;

/**
 * Optional external config file for Helloworld.module 
 * 
 * This is what defines the inputs that appear on your module configuration
 * screen in the admin. 
 * 
 * This is an alternative to using the getModuleConfigInputfields() method in 
 * in the HelloWorld.module.php file. This file is included here to demonstrate
 * this alternative option but note that the module does not use it unless it’s 
 * in the same directory as the module. As a result, this file is here only for
 * demonstration purposes and not currently used by the Helloworld module. 
 * 
 * If you do want to use this external config file then you would move it into
 * the parent directory (where the .module.php file is) and remove the 
 * getModuleConfigInputfields() method that’s in the .module.php file. 
 * 
 * Note: to make any text translatable, wrap it with __('your text'); 
 * This will make that text translatable with PW’s multi-language tools.
 * See the 'useHello' definition below (2nd field), for an example. 
 * 
 */


$config = array(
      'number_circle' => array(
        'type' => 'integer',
        'label' => 'Number Circle',
        'value' => 0,
        // 'editable' => 0,
        'columnWidth' => 100,
        'description' => 'iterates with every placed order, will be put on the created order page upon placed order.'
      ),     
      'shop_form_sender_name' => array(
        'label' => 'Shop Sender Name',
        'type' => 'text',
        'value' => '',
        'columnWidth' => 50,
      ),
      'shop_form_sender_email' => array(
        'label' => 'Shop Sender Email',
        'notes' => 'hier nur SMTP des localhosts verwenden!',
        'type' => 'email',
        'value' => '',
        'columnWidth' => 50,
      ),
      'shop_form_receiver_name' => array(
        'label' => 'Shop Receiver Name',
        'type' => 'text',
        'value' => '',
        'columnWidth' => 50,
      ),
      'shop_form_receiver_email' => array(
        'label' => 'Shop Receiver Email',
        'type' => 'email',
        'value' => '',
        'columnWidth' => 50,
      ),
      'shop_form_bcc_email' => array(
        'label' => 'Shop BCC Email',
        'type' => 'email',
        'value' => '',
        'collapsed' => 1,
      ),
      'email_template' => array(
        'label' => 'Email Template',
        'type' => 'text',
        'value' => '',
        'description' => 'optional custom email template, find the default template in the module\'s folder',
        'notes' => 'enter path relative to /templates/'
      ),
      'shop_countries_A' => array(
        'label' => 'Shipping country codes and names',
        'type' => 'textarea',
        'value' => '',
        'description' => 'this is the first (or the only) section of the dropdown options field',
        'notes' => 'use JSON format {"AT":"Austria","FR":"France"}',
        'columnWidth' => 50,
      ),
      'shop_countries_B' => array(
        'label' => 'Shipping country codes and names',
        'type' => 'textarea',
        'description' => 'this is the second section of the dropdown options field (not mandatory)',
        'value' => '',
        'notes' => 'use JSON format {"AT":"Austria","FR":"France"}',
        'columnWidth' => 50,
      ),
      'shop_success_url' => array(
        'label' => 'Shop Success URL',
        'type' => 'text',
        'value' => '',
        'columnWidth' => 50,
        'description' => 'enter path to success URL relative to home'
      ),
      'shop_error_url' => array(
        'label' => 'Shop Error URL',
        'type' => 'text',
        'value' => '',
        'columnWidth' => 50,
        'description' => 'enter path to error URL relative to home'
      ),
      'paypal_client_id_sandbox' => array(
        'type' => 'text',
        'label' => 'PAYPAL CLIENT ID (SANDBOX)',
        'value' => '',
        'columnWidth' => 50,
      ),
      'paypal_client_id_live' => array(
        'type' => 'text',
        'label' => 'PAYPAL CLIENT ID (LIVE)',
        'value' => '',
        'columnWidth' => 50,
      ),
      'paypal_secret_sandbox' => array(
        'type' => 'text',
        'label' => 'PAYPAL SECRET (SANDBOX)',
        'value' => '',
        'columnWidth' => 50,
      ),
      'paypal_secret_live' => array(
        'type' => 'text',
        'label' => 'PAYPAL SECRET (LIVE)',
        'value' => '',
        'columnWidth' => 50,
      ),
      'paypal_base_url' => array(
        'type' => 'url',
        'label' => 'PAYPAL BASE URL',
        'value' => '',
        'columnWidth' => 50,
      ),
      'paypal_mode' => array(
        'type' => 'radios',
        'label' => 'PayPal Mode',
        'value' => '',
        'options' => 
        array('sandbox' => 'Sandbox (testing)', 'live' => 'Live'),
      ),
      'google_recaptcha_site_key' => array(
        'type' => 'text',
        'label' => 'Google reCAPTCHA Site Key',
        'value' => '',
        'columnWidth' => 50,
        'description' => 'not yet implemented so disregard'
      ),
  );