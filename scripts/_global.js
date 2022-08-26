let subTotalTag = null;

let shippingForm = null;
let billingForm = null;
let imageMarkup = '';
let imageContainer = null;

const itemsummaries = document.getElementsByClassName('itemsummary');
checkoutlink = document.getElementsByClassName('checkoutlink');
const cartUrl = checkoutlink[0].href;


function setMiniCart() {
    let totalItems = localStorage.getItem("totalItems");
    let subTotal = localStorage.getItem("subTotal");
    if (totalItems) {
        document.getElementById('pricesummary').textContent = '€' + dotToComma(subTotal);
        for (var i = 0; i < itemsummaries.length; i++) {
            itemsummaries[i].innerHTML = totalItems;
        }
    } else {
        for (var i = 0; i < itemsummaries.length; i++) {
            itemsummaries[i].innerHTML = '0';
        }
        document.getElementById('pricesummary').textContent = '€0,00';
    }
    displayCartPreview()
}


function dotToComma(item) {
    item = (item * 100) / 100;
    item = item.toFixed(2);
    priceComma = item.toString()
    priceComma = priceComma.replace('.',',')
    return priceComma
}


function displayCartPreview() {

    const cartPreviewItems = document.getElementById('cartpreviewitems');
    const cartPreviewButtons = document.getElementById('cartpreviewbuttons');
    cartItems = getCartItems();
    subTotal = localStorage.getItem('subTotal');
    totalItems = localStorage.getItem('totalItems');

    if (parseInt(localStorage.getItem("totalItems")) > 0) {
        cartPreviewItems.innerHTML = ''
        Object.values(cartItems).map(item => {
            cartPreviewItems.innerHTML += `
                <div class="uk-width-3-5">
                    <span class="striking whitefont">
                        ${item.inCart} <span class="uk-margin-small-right" uk-icon="icon:close; ratio:1.2;"></span>
                    </span><br/>
                    <strong><a href="${item.url}">${item.title}</a></strong><br>à EUR ${dotToComma(item.price)}
                </div>
                <div class="uk-width-2-5 uk-flex uk-flex-right">
                    <a href="${item.url}">
                        <img width="${item.productwidth}" src="${item.img}">
                    </a>
                </div>`;
            })
        cartPreviewItems.innerHTML += `<div class="whitefont uk-margin-medium-top">${totalItems} Artikel im Warenkorb<br>Zwischensumme: <strong>EUR ${dotToComma(subTotal)}</strong></div>`;
        cartPreviewButtons.innerHTML = `<div class="whitefont uk-margin-medium-top uk-width-full">
                                            <div>
                                                <button class="uk-button uk-button-primary uk-margin-small-right@m uk-margin-small-bottom uk-width-auto@m uk-width-1-1@s" type="button" uk-toggle="target: #cartpreview">weiterstöbern</button>
                                                <a class="uk-button uk-button-primary uk-margin-small-bottom uk-width-auto@m uk-width-1-1@s" id="opencart" href="${cartUrl}">zur bestellung</a>
                                            </div>
                                        </div>`
    } else {
        cartPreviewItems.innerHTML = `<div><strong>Ihr Warenkorb ist leer.</strong></div>`
        cartPreviewButtons.innerHTML = `<button class="uk-button uk-button-primary uk-margin-small-bottom uk-width-auto@m uk-width-1-1@s" type="button" uk-toggle="target: #cartpreview">weiterstöbern</button>`
    }

}


function saveTotalItems() {

    cartItems = getCartItems();
    let totalItems = 0;

    Object.values(cartItems).map(item => {
        totalItems += parseInt(item.inCart);
    });
    localStorage.setItem("totalItems", totalItems);

}


function saveTotalCost() {

    cartItems = getCartItems();

    subTotal = 0;

    if (cartItems) {
        Object.values(cartItems).map(item => {
            subTotal += item.inCart * item.price;
        });            
        subTotal = parseFloat(subTotal);
        shipping = parseFloat(localStorage.getItem("shipping"));
        totalAndShipping = subTotal + shipping;
        subTotal = subTotal.toFixed(2);
        shipping = shipping.toFixed(2)
        totalAndShipping = totalAndShipping.toFixed(2);

        localStorage.setItem("subTotal", subTotal);
        // localStorage.setItem("shipping", shipping);
        localStorage.setItem("totalAndShipping", totalAndShipping);
        if (subTotalTag) {
            subTotalTag.innerHTML = '<strong>EUR ' + dotToComma(subTotal) + '</strong>';
        }
    }

} 

function clearCart() {
    localStorage.clear();
    setMiniCart();
}


function updatePrice(cartItems, item, tag) {

    q = cartItems[item.tag].inCart;

    stackprice = cartItems[item.tag].stackprice;

    try{
        stackprice = JSON.parse(stackprice);        

        price = stackprice[0].sp;
        shipping = stackprice[0].sh;

        if (q>0) {
            for(ii=1;ii<stackprice.length;ii++){
                if(q>=stackprice[ii].qu){
                    price = stackprice[ii].sp;
                    shipping = stackprice[ii].sh;
                }
            }
        } 
    } catch(err) {
        price = 0;
        shipping = 0;
        console.log(err)
    }

    cartItems[item.tag].price = price;
    cartItems[item.tag].totalprice = price;
    cartItems[item.tag].shipping = shipping;

    updateShipping(cartItems);

    return (cartItems);

}


function updateShipping(cartItems) {
    temp = [];
    console.log(cartItems);
    Object.values(cartItems).map(item => {
        temp.push(item.shipping);
    });
    if (temp.length>0) {
        newShipping = Math.max.apply(Math, temp);        
    } else {
        newShipping = 0;
    }
    localStorage.setItem('shipping', newShipping);

}


function killPaypalSession() {
    console.log('deleting pp session…')
    localStorage.removeItem('PayPalOrderStatus');
    localStorage.removeItem('paymentMethod');
    console.log('pp session deleted.')
}


function setCartItems(cartItems) {
    killPaypalSession();
    localStorage.setItem('cartItems', JSON.stringify(cartItems))
}


function getCartItems() {
    return JSON.parse(localStorage.getItem('cartItems'));
}


function scrollIntoView(step) {
    const yOffset = -10; 
    let currentStep = document.getElementById(document.querySelector("section#step1").id);
    let y = currentStep.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({top: y, behavior: 'smooth'});        
}

function checkUrlEndsWith(string) {
    let path = window.location.href
    return path.endsWith(string);
}

// if(
//     checkUrlEndsWith('checkout/fehler') ||
//     checkUrlEndsWith('checkout/fehler/') ||
//     checkUrlEndsWith('checkout/danke') ||
//     checkUrlEndsWith('checkout/danke/')
// ) {
//     killPaypalSession();
// }
