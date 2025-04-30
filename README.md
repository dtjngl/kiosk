KIOSK, One-Page Checkout Module for ProcessWire


DISCLAIMER

this is a BETA version at best, it's my first "real" module I'm writing for ProcessWire (and first module I'm writing at all) so please don't eat me alive.
I'm aware that it needs a lot of work, but at this point, but it's functional.

I'm also aware that it is not very customizable at this point (it's mostly customized for one specific use case), but I promise I will work on that.

My main objective is to get more seasoned developers' mentoring, feedback, advice, warnings – and and of course, if you want to look into or help develop it further – pull requests. 
Please point out any potential dangers you see or anything that raises a red flag for you. I'm learning so much from that.

Though the module is held in german, you can translate almost all strings that are in the php files via PW's translate functionality. I cannot help with the strings in the javascript yet, but will do so soon (using a json file that lives on the file system probably).


WHAT IT COINTAINS

OnePage checkout system with 4 steps:
1. cart, 
2. address(es) form, 
3. payment method (paypal and deferred), 
4. order overview

"minicart" (the cart-summary in the page's header)

buy button (to add items to the cart)

a dashboard (with admin template) for an overview of all placed orders

uses server session storage and browser localstorage


REQUIRED

WireMail SMTP
UIKIT (for best behaviour, will be optional soon)
vanilla Javascript (no jQuery required)
PHP (DUHDOY!)
ProcessWire Version (not sure, but works with version 3.0.200)
if you want it in english you need a multilanguage installation
PayPal Business Account (Live or Sandbox to test with)



HOW TO INSTALL

1. Put the folder "Kiosk" in your ProcessWire site's modules folder
2. Install the module Kiosk, this will…
2.1 create fields for the order template
2.2 create a template for the orders placed
2.3 create a template for the orders' parent page 
2.4 create a parent page "Custom Orders" for all orders under /admin/page/ (you can rename the page, not the template) 
2.5 create a template "checkout" for the checkout page 
2.6 create a page for the checkout, child to "Home" (you can move the page, you can rename the page, not the template) 
2.7 install module ProcessKiosk along with it
2.8 ProcessKiosk create a page under /admin/ (visible in the module upon creation). Here you will see a table with all the orders placed.

3. check the Kiosk module's settings page (navigate via the module's overview page) and enter details to your best knowledge. Some are not "required" but they actually are.

3. put the below code (in essence) on the checkout template file:

if ($config->ajax) {
    $kiosk->handleAJAX($input);
    return $this->halt();	
} else { 
    $kiosk->handleStaticContent($input);
	echo $kiosk->renderCheckoutSteps();
}

4. put this line on a page that loads everywhere, preferably on init.php:

$kiosk = $modules->get('Kiosk');

5. put this line where you want the "minicart" and toggling cart preview (provided the site runs UIKIT) to be, probably in a header that renders on each page:

echo $kiosk->renderMiniCart();

5. put this line just above you closing </body> tag:

echo $kiosk->addScripts(); 


HOW DOES THIS WORK?

1. add items to the cart or update quantity when viewing the cart, continue with "weiter"
2. enter your address, if your billing address differs, uncheck the "gleiche Rechnungsadresse" and enter the billing address, checked or unchecked, both forms will be sent to the server but handled accordingly, continue with "weiter"
3. select a payment method, continue with "weiter"

4. formdata object (containing cart items, address(es), payment method) will be sent via AJAX to the server and stored in the server session variable

if payment method is deferred

5.1 
- ajax response contains the order summary markup that will render in step4
- don't forget to check " ich habe die Datenschutzerklärung sowie die AGB zur Kenntnis genommen und akzeptiere diese." (privacy policy and terms and conditions)
- click on "Zahlungspflichtig bestellen" will send another AJAX request to the server thus submitting the order (continue to WHAT HAPPENS WHEN AN ORDER IS PLACED?) 

if it's paypal, a bit more is happening

5.2 server sends a cURL request to paypal containing client ID and secret
- reponse will send a token
- server sends that token along with the purchase unit (created from our placed order) in another cURL request to paypal
- reponse will send an "approve"-URL
- ajax reponse contains that URL
- user is redirected to paypal to approve the order
- user is redirected to the "checkout" page along with a token and PayerID as GET parameters
- token (not needed actually) and PayerID are stored in the server session
- with the PayerID in the session variable and the "status" of the paypal approved order in the localstorage the checkout process will head on to step 4: order summary
- don't forget to check " ich habe die Datenschutzerklärung sowie die AGB zur Kenntnis genommen und akzeptiere diese." (privacy policy and terms and conditions)
- clicking on "Zahlungspflichtig bestellen" will send another AJAX request to the server
- second AJAX request will send PayPalAccessToken, PayPalPayerId and PayPalRequestId in another cURL to PayPal which will trigger the payment
- reponse will… continue to WHAT HAPPENS WHEN AN ORDER IS PLACED?



6. WHAT HAPPENS WHEN AN ORDER IS PLACED?
- an order-page with all the order's details (plus order number from the kiosk's number circle) is created under /admin/page/custom_orders/ (you can find it in the Kiosk Dashboard)
- number circle is iterated
- email markup is created using the module's default email template, you can add a path to a custom template in the module's settings
- email is sent to the site master and the user (check the module's settings for email addresses etc.)
- order in server session is reset to an empty array 
- paypal session in server session is reset to an empty array
- localstaorage of the browser is deleted
- user is redirected to a custom url (defined in the module's settings)


HOW ARE PRICES HANDLED?
prices allow for a stack price functionality. This means that prices and shipping depend on the quantity of items purchased.
You can enter different prices and shipping costs for different quantities. If a user's amount of a selected item reaches the specified stack price, the item price and the shipping costs change.


HOW ARE PRODUCTS ADDED TO THE CART?

a product should be a page object to keep things simple. That page needs an "images" array field (that very name).
Below you can see what a product would need. These values are added to the button's data attributes.


// This is how you make a product…

$product = new WireArray();
$product->id = $page->id;
$product->title = $page->title;
$product->source = $page->parent->name;
$product->url = $page->url;

$product->images = $page->images;
$product->product_width = 150 // for proportional item image calculation in the cart 
$product->taxrate = 10 // or what ever the tax rate

$product->stack_prices = 
	array(
		array(
			"qu" => 1,
			"sp" => 19.99,
			"sh" => 5
		),
		array(
			"qu" => 10,
			"sp" => 14.99,
			"sh" => 0
		),
);
$product->stack_prices = htmlspecialchars(json_encode($product->stack_prices)); 

// then render the "add to cart" button
$kiosk->renderBuyButton($product);


UPDATE:

installing kiosk.module will also
create a repeater field "kiosk_product_stack_prices" (including 3 subfields as described above) that handles the stack_prices array of arrays (as described above) so you can use the GUI.
create a field "kiosk_product_tax_rate"
create a field "kiosk_product_width	"
create a field "images" if there is none in your system.
create a template "kiosk_product" with all these mentioned fields
use this template for your products (or the fields thereon at least and add to your template of choice) and you should be good to go.

CAUTION! If you uninstall kiosk.module it will delete all pages with template "kiosk_product", that's because I'm still figuring out how to detach the fields and fieldgroups without deleting the template.


Class kiosk now provides the following hookable methods:

```___renderBuyButton(Page $product, string 'add to cart')```
pass a product (preferably with template kiosk_product) and it returns a buybutton with the price for 1 item. This method now accepts the button's label (string) as a second argument. Method is hookable.

```___getSpecificStackPrice(Page $product, int 5)```
pass a product (preferably with template kiosk_product) and an amount, it returns the price for that amount of items. Method is hookable.

```___getSinglePrice(Page $product)```
pass a product (preferably with template kiosk_product) and it returns the price for 1 item. Method is hookable.


So, use template "kiosk_product" for your products, edit the product page to add details, and then do

```echo $kiosk->renderBuyButton($product, string 'add to cart');```

to render an "add to cart" button.

