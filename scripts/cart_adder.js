window.addEventListener('load', cartAdder, true);

function cartAdder() {

    const miniCart = document.getElementsByClassName('minicart');
    const cartPreview = document.getElementById('cartpreview');
    const headerCart = document.getElementById('headercart');
    const itemsummaries = document.getElementsByClassName('itemsummary');

    headerCart.addEventListener('click', function() {
        if (cartPreviewBottom.style.display == 'none') {
            cartPreviewBottom.style.display = 'block';
        } else {
            cartPreviewBottom.style.display = 'none';
        }
    })

    let cartItems = localStorage.getItem("cartItems");
    let num = 1;
    let newT = 0;
    let subTotal = 0;
    let totalAndShipping = 0;
    let shipping = 0;

    if (localStorage.getItem("subTotal")) {
        subTotal = localStorage.getItem("subTotal")
    }

    assignButtons();

    function assignButtons() {
        let addToCartButtons = document.getElementsByClassName('addtocartbutton');
        for (let i = 0; i < addToCartButtons.length; i++) {
            addToCartButtons[i].addEventListener('click', addToCart(cartPreview), false);
        }
    }

    let shippingDetails = null;
    let billingDetails = null;
    let paymentMethod = null;

    setMiniCart();

    function addToCart(cartPreview) {

        return function() {

            tag = this.dataset.tag;
            url = this.dataset.url;
            title = this.dataset.source + ' ' + this.dataset.title;
            // price = this.dataset.price;
            taxrate = this.dataset.taxrate;
            shipping = this.dataset.shipping;
            img = this.dataset.img;
            productwidth = this.dataset.productwidth;
            stackprice = this.dataset.stackprice;
            num = 1;

            let item = 
                {
                    tag: tag,
                    url: url,
                    title: title,
                    // price: parseFloat(price),
                    taxrate: parseFloat(taxrate),
                    shipping: parseFloat(shipping),
                    // totalprice: parseFloat(price),
                    img: img,
                    productwidth: parseInt(productwidth),
                    stackprice: stackprice,
                    inCart: 0,
                }

            cartItems = getCartItems();

            if (cartItems != null) {
                if (cartItems[item.tag] == undefined) {
                    cartItems = {
                        ...cartItems,
                        [item.tag]: item
                    }
                }
                cartItems[item.tag].inCart += 1;

                cartItems = updatePrice(cartItems, item, tag);

                newT = (cartItems[item.tag].inCart * cartItems[item.tag].price * 100) / 100; 
                newT = newT.toFixed(2);
                cartItems[item.tag].totalprice = newT;
            } else {
                item.inCart = 1;
                cartItems = {
                    [item.tag]: item
                }
                cartItems = updatePrice(cartItems, item, tag);
            }

            setCartItems(cartItems);

            saveTotalItems();
            saveTotalCost();
            setMiniCart();
            
            UIkit.offcanvas(cartPreview).toggle();
            var $cartPreview = $('#cartPreview');
            
            // $(document).on('shown', $cartPreview, function() {
            //     setTimeout(function() {
            //         UIkit.offcanvas(cartPreview).hide();
            //     }, 2000);
            // });

        }

    }

}
