if (localStorage.getItem("totalItems") === null) {
    localStorage.setItem("totalItems", 0);
}

let addToCart = async function(element) {
    let id = element.parentNode.getAttribute('data-id')

    localStorage.setItem(`product${id}`, Number(localStorage.getItem(`product${id}`)) + 1);
    localStorage.setItem("totalItems", Number(localStorage.getItem("totalItems")) + 1);

    refreshCart();
}

let refreshCart = async function() {
    items = document.querySelector('#cart-items');
    items.textContent = localStorage.getItem('totalItems');
}