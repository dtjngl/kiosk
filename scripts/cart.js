window.addEventListener('load', checkOut, true);

function checkOut() {

    var step = 0;

    history.scrollRestoration = "manual";
    window.scrollTo({top: 0, behavior: 'smooth'});

    const cart = document.getElementById("cart");
    const cartBody = document.getElementById("cartbody");
    const cartHead = document.getElementById("carthead");
    const cartTotals = document.getElementById("carttotals");
    const cartTable = document.getElementById("carttable");
        
    const summaryMarkupDiv = document.getElementById('summarymarkup');

    const address2 = document.getElementById('address2');

    const checkoutSteps = document.getElementsByClassName('checkoutsteps');
    const proceeders = document.querySelectorAll('.proceed');
    const backers = document.querySelectorAll('.back');

    const paymentButtons = document.getElementsByClassName('paymentbutton');

    const cartForm = document.getElementById('cartform');

    const formData = new FormData(); 

    var sameAddressCheckbox = document.getElementById('sameaddress');
    sameAddressCheckbox.addEventListener('change', handleSameAddressCheckbox);

    const privacyCheckbox = document.getElementById('privacy');

    function handleSameAddressCheckbox() {
        if(this.checked==true){
            address2.style.display = 'none';
        } else {
            address2.style.display = 'block';
        }
    }


    handlePaymentMethodRadioButtons()

    var orderSubmission = new XMLHttpRequest();

    const sections = [
        document.querySelector("section#step1"),
        document.querySelector("section#step2"),
        document.querySelector("section#step3"),
        document.querySelector("section#step4"),
        ]

    const loadingDivs = document.getElementsByClassName('loadingdiv');

    const errorMessages =
        [
            "Bitte fügen Sie dem Warenkorb Produkte hinzu.",
            {
                first: "Vorname fehlt",
                last: "Nachname fehlt",
                email: "Email-Adresse fehlt",
                street: "Straße und Hausnummer fehlen",
                zip: "PLZ fehlt",
                city: "Ort fehlt",
                state: "Land fehlt"
            },
            "Bitte wählen Sie eine Zahlungsmethode.",
            "Bitte akzeptieren Sie unsere Datenschutzerklärung und AGB.",
        ]

    const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    const miniCart = document.getElementsByClassName('minicart');
    const errorAlerts = document.getElementsByClassName('infoalert');
    console.log(errorAlerts)

    const shippingForm = document.getElementsByClassName("shippingform");
    const requiredFields = document.getElementsByClassName("required");
    const billingForm = document.getElementsByClassName("billingform");

    for (var i = 0; i < proceeders.length; i++) {
        proceeders[i].addEventListener("click", stepForward(i), false);
    }

    for (var i = 0; i < backers.length; i++) {
        backers[i].addEventListener("click", stepBack(i), false);
    }

    displayCartForm();

    const stepsNav = document.getElementsByClassName('stepsnav');

    const paypalRadioButton = document.getElementById('paymentMethod-paypal');
    console.log('ppstatus: '+paypalRadioButton.dataset.ppstatus)

    if(localStorage.getItem('paymentMethod')=='PayPal'){
        if(paypalRadioButton.dataset.ppstatus=='approved'){
            handleSteps(3)
        } 
    }

    setMiniCart();

    ////////////////////////////////////
    // HIDE AND SHOW STEPS ON CONDITION
    ////////////////////////////////////

    function stepForward(element) {
        return function() {
            checkSteps(element);
        }
    }

    function checkSteps(element) {

        errormessage = '';

        try {
            
            check = 0

            if (element == 0) { // shopping cart

                createPurchaseUnit();

                condition = localStorage.getItem('totalItems')
                
                if (isNaN(condition) || condition < 1) {
                    errormessage += errorMessages[element] + "<br>"
                    throw errormessage
                }

                formData.append("cartItems", localStorage.getItem('cartItems'));
                formData.append("totalItems", localStorage.getItem('totalItems'));
                formData.append("subTotal", subTotal);
                formData.append("shipping", shipping);
                formData.append("totalTaxes", localStorage.getItem('totalTaxes'));
                formData.append("totalAndShipping", totalAndShipping);

            }

            if (element == 1) { // address form

                for (var i = 0; i < shippingForm.length; i++) {
                    shippingForm[i].classList.remove('uk-alert-warning')
                }

                for (var i = 0; i < billingForm.length; i++) {
                    billingForm[i].classList.remove('uk-alert-warning')
                }

                for (i=0;i<shippingForm.length;i++) {
                    if (shippingForm[i].value == '') {
                        errormessage += errorMessages[element][shippingForm[i].title]+"<br>"
                        shippingForm[i].classList.add('uk-alert-warning')
                        shippingForm[i].addEventListener('change', removeWarning)
                    }
                    if (shippingForm[i].type == 'email' && shippingForm[i].value != '' && reg.test(shippingForm[i].value) == false) {
                        errormessage += "so sieht keine Email-Adresse aus!<br>"
                        shippingForm[i].classList.add('uk-alert-warning')
                    } 
                }

                if (sameAddressCheckbox.checked == false) {
                    for (i=0;i<billingForm.length;i++) {
                        if (billingForm[i].value == '') {
                            errormessage += errorMessages[element][billingForm[i].title]+"<br>"
                            billingForm[i].classList.add('uk-alert-warning')
                            billingForm[i].addEventListener('change', removeWarning)
                        }
                        if (billingForm[i].type == 'email' && billingForm[i].value != '' && reg.test(billingForm[i].value) == false) {
                            errormessage += "so sieht keine Email-Adresse aus!<br>"
                            billingForm[i].classList.add('uk-alert-warning')
                            billingForm[i].addEventListener('change', removeWarning)
                        } 
                    } 
                } 

                createAddressObjects()

                if(errormessage.length>0){throw errormessage}

            }

            if (element == 2) { // payment method

                for (var i = 0; i < paymentButtons.length; i++) {
                    if(paymentButtons[i].checked==true){
                        setPaymentMethod(paymentButtons[i].title)
                    }
                }

                condition = localStorage.getItem('paymentMethod')

                if(condition=='PayPal' || condition=='Erlagschein'){
                    formData.append("paymentMethod", localStorage.getItem("paymentMethod"));
                    formData.append("action", "sendFormData");

                    sendFormData(formData)
                    return;
                }

                if (typeof(condition) != "string" || condition == 'null' || condition == 'undefined') {
                    errormessage += errorMessages[element] + "<br>"
                    throw errormessage
                } 

            }


            if (element == 3) { // summary AND privacy checkbox check
                if (privacyCheckbox.checked == false) {
                    console.log('NOT ACCEPTABLE')
                    errormessage += errorMessages[element] + "<br>"
                    check++
                    throw errormessage
                } else {
                    submitOrder()
                    return
                }
            }

            handleSteps(element+1);

        } catch(err) {
            console.log('err: '+err)
            console.log('element: '+element)
            errorAlerts[element].innerHTML = err;
            errorAlerts[element].style.display = 'block';
            scrollIntoView(element);
            console.log('something is wrong at '+element)
        }

    }

    function removeWarning() {
        this.classList.remove('uk-alert-warning')
    }

    function stepBack(step) {
        return function() {
            handleSteps(step);
        }
    }


    function handleSteps(step) {

        console.log('step:' +step)
        scrollIntoView(step);

        for (var i = 0; i < errorAlerts.length; i++) {
            errorAlerts[i].style.display = 'none';
        }

        for (var i = 0; i < stepsNav.length; i++) {
            stepsNav[i].classList.add('done');                
        }

        for (var i = 0; i < checkoutSteps.length; i++) {
            checkoutSteps[i].style.display = 'none';          
        }

        console.log(checkoutSteps[step]);

        checkoutSteps[step].style.display = 'block';

        stepsNav[step].classList.remove('done');

    }


    //////////////////
    // RADIOBUTTONS //
    //////////////////

    function setPaymentMethod(paymentMethod) {
        localStorage.setItem("paymentMethod", paymentMethod)
    }

    function handlePaymentMethodRadioButtons() {
        for(i=0;i<paymentButtons.length;i++){
            if(localStorage.getItem("paymentMethod")==paymentButtons[i].title){
                paymentButtons[i].checked = true;
            }
        }
    }

    function updateQuantity() {

        let q = this.parentElement.parentElement.querySelector('.quantity');
        let calc = this.dataset.calc;

        if (calc == 'up') {
            newQ = q.innerHTML;
            newQ++;
        }
        if (calc == 'down') {
            newQ = q.innerHTML;
            newQ--;
        }

        cartItems = getCartItems();
        tag = this.parentElement.dataset.tag; // get the item's title from frontend :D

        if (newQ <= 0) {
            removeFromCart(tag);
        } else {
            cartItems[tag].inCart = newQ;            
            q.innerHTML = newQ;

            item = cartItems[tag];
            cartItems = updatePrice(cartItems, item, tag);
            newP = (cartItems[tag].price * 100) / 100;
            newP = newP.toFixed(2);

            // calculate new total and save in LS :D
            newT = (newQ * cartItems[tag].price * 100) / 100; 
            newT = newT.toFixed(2);
            cartItems[tag].totalprice = newT;

            // and set in frontend :D
            this.parentElement.parentElement.querySelector('.itemprice').innerHTML = ' à EUR ' + dotToComma(newP) + ' = ';
            this.parentElement.parentElement.querySelector('.itemtotal').innerHTML = 'EUR ' + dotToComma(newT);

        } 


        setCartItems(cartItems);

        e = cartBody.querySelector(`[data-tag='${tag}']`); // span

        saveTotalItems();
        saveTotalCost();
        setMiniCart();

        setTotalTaxes(getCartItems());

    }


    function displayCartForm() {

        cartItems = getCartItems();

        totalItems = localStorage.getItem("totalItems");

        paymentMethod = localStorage.getItem("paymentMethod");

        if (totalItems > 0) {

            cartBody.innerHTML = ''
            cartTotals.innerHTML = ''

            Object.values(cartItems).map(item => {

                imageMarkup = `<a href="${item.url}">`;
                imageMarkup += `<img width="${item.productwidth}" class="cartproduct" src="${item.img}"/>`;
                imageMarkup += '</a>';

                cartBody.innerHTML += `<span data-tag="${item.tag}" class="uk-margin-bottom productimages">${imageMarkup}</span>`;
             
                cartTotals.innerHTML +=
                    `<tr>
                        <td class="noselect updown" data-tag="${item.tag}">
                            <a class="updown" data-calc="down">
                                <span>–</span>
                            </a>
                            <a class="updown" data-calc="up">
                                <span>+</span>
                            </a>
                        </td>
                        <td>&nbsp;</td>
                        <td>
                            <span class="quantity">${item.inCart} </span>
                            <span uk-icon="icon:close; ratio:0.5;"></span> 
                            <span><a href="${item.url}">${item.title}</a></span>
                            <span class="itemprice grey">à EUR ${dotToComma(item.price)} =</span>
                            <span class="itemtotal" style="text-align: right !important; right: 0; margin-right: 0; position: relative; font-weight: bold; white-space: nowrap;">EUR ${dotToComma(item.totalprice)}</span>
                        </td>
                    </tr>`;

            })

            imageMarkup = '';

                cartTotals.innerHTML += `
                    <tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
                    <tr>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>
                            <strong>inkl. MWSt.: </strong>
                            <span style="text-align: right;" id="totaltaxes"></span>
                        </td>
                    </tr>   
                    <tr>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>
                            <strong>ZWISCHENSUMME: </strong>
                            <span style="text-align: right;" id="subtotal"></span>
                        </td>
                    </tr>`;    
        } else {
            cart.innerHTML = `<strong>Ihr Warenkorb ist leer.</strong>`
        }

        subTotalTag = document.getElementById("subtotal");
        totalTaxesTag = document.getElementById("totaltaxes");

        let removers = document.getElementsByClassName('remove-cart');
        for (let i=0;i<removers.length;i++) {
            removers[i].addEventListener('click', removeFromCart);
        }

        saveTotalCost();
        assignUpDown();
        createPurchaseUnit();

        setTotalTaxes(getCartItems());

    }

    function createPurchaseUnit() {

        cartItems = getCartItems();

        if(cartItems) {

            purchase_units = [{
              amount: {
                value: localStorage.getItem('totalAndShipping'),
                currency_code: "EUR",
                breakdown: {
                    item_total: {
                        currency_code: "EUR",
                        value: localStorage.getItem('subTotal')
                    },
                    shipping: {
                        currency_code: "EUR",
                        value: localStorage.getItem('shipping')
                    }
                }
              },
              items: []
            }];

            Object.values(cartItems).map(item => {
              someItem = new Object();
              someItem['name'] = item.title;
              someItem['unit_amount'] = {
                'currency_code': 'EUR',
                'value': item.price
              };
              someItem['quantity'] = item.inCart;
              purchase_units[0].items.push(someItem);
            });

            localStorage.setItem('purchase_unit', JSON.stringify(purchase_units));

        }

    }

    function assignUpDown() {
        let items = document.querySelectorAll('a.updown')
        for (var i = 0; i < items.length; i++) {
            items[i].addEventListener('click', updateQuantity);
        }
    } 


    function titleCase(string) {
        if (string == '' || string == null) {return ''};
        return string[0].toUpperCase() + string.slice(1)
    }


    function removeFromCart(tag) {

        cartItems = getCartItems();
        if (cartItems) {
            num = 0 - cartItems[tag].inCart;
            delete cartItems[tag];
        }

        updateShipping(cartItems);

        setCartItems(cartItems);
        saveTotalItems();
        saveTotalCost();
        displayCartForm();
        setMiniCart();

        setTotalTaxes(getCartItems());

    }


    function saveTotalCost() {

        cartItems = getCartItems();
        // cartItems = JSON.parse(cartItems);

        subTotal = 0;

        if (cartItems) {
            Object.values(cartItems).map(item => {
                subTotal += item.inCart * item.price;
            });            
            subTotal = parseFloat(subTotal);
            shipping = parseFloat(localStorage.getItem("shipping"));
            totalAndShipping = subTotal + shipping;
            subTotal = subTotal.toFixed(2);
            shipping = shipping.toFixed(2);
            totalAndShipping = totalAndShipping.toFixed(2);

            localStorage.setItem("subTotal", subTotal);
            localStorage.setItem("shipping", shipping);
            localStorage.setItem("totalAndShipping", totalAndShipping);
            if (subTotal > 0) {subTotalTag.innerHTML = '<strong>EUR ' + dotToComma(subTotal) + '</strong>'};
        }

    } 


    /////////////////////////////////////////////////////////////////////////////////////////////////
    // ORDER SUMMARY DISPLAY, ATM THIS IS DYNAMICALLY BUT CONSIDERING REMOVING THE SUMMARY IN STEP 2 
    /////////////////////////////////////////////////////////////////////////////////////////////////

    function setTotalTaxes(cartItems) {
        totalTaxes = 0;
        Object.values(cartItems).map(item => {
            totalTaxes += (item.totalprice / (100 + item.taxrate)) * item.taxrate; // 0,80 = (8,80 / (100 + 10)) * 10 
        });

        totalTaxes = totalTaxes.toFixed(2);
        localStorage.setItem('totalTaxes', totalTaxes);
        if (totalTaxes > 0) {totalTaxesTag.innerHTML = '<strong>EUR ' + dotToComma(totalTaxes) + '</strong>'};
    }

    function createAddressObjects() {

        console.log('CREATING ADDRESS OBJECTS…')

        shippingDetails = new Object();
        billingDetails = new Object();

        for (i = 0; i < shippingForm.length; i++) {
            value = shippingForm[i].value;
            if (shippingForm[i].title == 'first' || shippingForm[i].title == 'last') {
                value = titleCase(value)
            }
            if (shippingForm[i].title == 'state') {
                shippingDetails['state'] = shippingForm[i].options[shippingForm[i].selectedIndex].title
                shippingDetails['countrycode'] = value
                continue
            }
            shippingDetails[shippingForm[i].title] = value
        };

        shippingDetails['sameAddress'] = JSON.stringify(sameAddressCheckbox.checked);

        for (i = 0; i < billingForm.length; i++) {
            value = billingForm[i].value;
            if (billingForm[i].title == 'first' || billingForm[i].title == 'last') {
                value = titleCase(value)
            }
            if (billingForm[i].title == 'state') {
                billingDetails['state'] = billingForm[i].options[billingForm[i].selectedIndex].title
                billingDetails['countrycode'] = value
                continue
            }
            billingDetails[billingForm[i].title] = value
        };

        formData.append("shippingDetails", JSON.stringify(shippingDetails));
        formData.append("billingDetails", JSON.stringify(billingDetails));
        killPaypalSession()

    }


    function sendFormData(formData) {

        console.log(formData)
        console.log('inside sendFormData');

        // Set up our HTTP request
        var approveOrderXHR = new XMLHttpRequest();
        // Setup our listener to process compeleted requests
        approveOrderXHR.onreadystatechange = function () {
            // Only run if the request is complete

            loadingDivs[2].innerHTML = '<h2>LOADING…</h2>';

            if (approveOrderXHR.readyState !== 4) return;
            // Process our return data
            if (approveOrderXHR.status >= 200 && approveOrderXHR.status < 300) {
                
                let response = approveOrderXHR.responseText;
                response = JSON.parse(response);

                console.log('hello AJAX #1');
                console.log(response);
                console.log(response.status);

                summaryMarkupDiv.innerHTML = response.summaryMarkup;

                if (response.status == 'CREATED' && response.orderstatus == 'PP-CREATED') {
                    localStorage.setItem("PayPalOrderStatus", response.status); // CREATED

                    console.log(response.data)                    
                    console.log(response.PayPalApproveOrderUrl) ;
                    window.location.href = response.PayPalApproveOrderUrl;
                } else if (response.orderstatus == 'DF-CREATED') {
                    handleSteps(3)
                } else {
                    errorAlerts[2].innerHTML = 'Ein Fehler ist aufgetreten, bitte versuchen Sie es später erneut';
                    errorAlerts[2].style.display = 'block';
                    scrollIntoView(2);
                }

            }

        };

        // Create and send a GET request
        // The first argument is the post type (GET, POST, PUT, DELETE, etc.)
        // The second argument is the endpoint URL
        approveOrderXHR.open('POST', '', true);
        approveOrderXHR.setRequestHeader('X-Requested-With', 'XMLHttpRequest'); // :D
        approveOrderXHR.send(formData);

    }


    function submitOrder() {

        console.log('inside submitOrder')

        // strip GET variables off URL (because PayerId and token) because redirecting… 
        function outputCurrentURL(u) {
            let path = window.location.href.split('?')[0]+u
            return path
        }

        if(privacyCheckbox.checked==false){return;} 
        console.log('passed')
        // Set up our HTTP request
        var submitOrderXHR = new XMLHttpRequest()
        // Setup our listener to process compeleted requests

        // Create and send a GET request
        // The first argument is the post type (GET, POST, PUT, DELETE, etc.)
        // The second argument is the endpoint URL

        submitOrderXHR.onreadystatechange = function () {
            // Only run if the request is complete

            loadingDivs[3].innerHTML = '<h2>LOADING…</h2>';

            if (submitOrderXHR.readyState !== 4) return;
            // Process our return data
            if (submitOrderXHR.status >= 200 && submitOrderXHR.status < 300) {
                
                let response2 = submitOrderXHR.responseText
                response2 = JSON.parse(response2);
                console.log('hello AJAX #2')
                console.log(response2)

                if(response2.data.status == 'COMPLETED' || response2.data.orderstatus == 'COMPLETED') {
                    localStorage.clear()
                }

                killPaypalSession()
                console.log(response2.redirectURL)
                console.log('redirecting…');
                window.location.href = response2.redirectURL

            }

        }

        if(localStorage.getItem('paymentMethod')=='PayPal' && localStorage.getItem('PayPalOrderStatus')=='CREATED'){
            if(localStorage.getItem('PayPalOrderStatus') != 'CREATED') {
                handleSteps(2)
                checkSteps(2)
                console.log('somehow passed the PayPal dialogue without approving')
            }
            var request = 'action=capturePayment';
            submitOrderXHR.open('POST', '', true);
            submitOrderXHR.setRequestHeader('X-Requested-With', 'XMLHttpRequest'); // :D
            submitOrderXHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            submitOrderXHR.send(request);
        } else {
            var request = 'action=deferredPayment';
            submitOrderXHR.open('POST', '', true);
            submitOrderXHR.setRequestHeader('X-Requested-With', 'XMLHttpRequest'); // :D
            submitOrderXHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            submitOrderXHR.send(request);
        }

    }

}


