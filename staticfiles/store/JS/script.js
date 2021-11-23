"use strict";

// Remove messages after 3s if present
if(document.querySelector('.header__messages')) {
    setTimeout(() => document.querySelector('.header__messages').remove(), 3000);
}


// Unhighlight tabs on contact us page
if(document.querySelector('#contactFormSubmit')) {
    localStorage.removeItem('highlightedTab');
}

// Unhlighlight all tabs on homepage
if(document.querySelector('.newHeights')) {
    localStorage.removeItem('highlightedTab');
}

// Loading symbol

const loader = document.getElementById('loader');

showSpinner();

function showSpinner() {
    loader.style.display = 'block';
}

function hideSpinner() {
    loader.style.display = 'none'
}
window.addEventListener('load', hideSpinner);

// Save which tab is highlighted across reloads


const allTabs = document.querySelector('.tabs.group');

allTabs.addEventListener('click', saveTab);

// let highlightedTab = localStorage.getItem('highlightedTab');

function saveTab(e) {
    if(e.target.closest('.fileTab')) {
        let tab = e.target.parentElement.id
        localStorage.setItem('highlightedTab', tab);
    };
}
function highlightSavedTab() {
        let tab = localStorage.getItem('highlightedTab');;
        if(!tab) {
           return false;
        } 
        allTabs.querySelector(`#${tab}`).classList.add('active');
};

highlightSavedTab();

//Variables related to modal (product info) pop-up
const caps = document.querySelector('.caps__grid');
const modal = document.querySelector('.modal');
const mainPic = modal.querySelector('#main');
const thumbnailContainer = modal.querySelector('.modal__content--pictures-thumbnails')
const descriptionList = modal.querySelector('.modal__content--description');
const sizeSelectorContainer = document.querySelector('.sizeSelector__container');
const title = modal.querySelector('.modal__content--title');
const description = modal.querySelector('#description');
const descriptorsGroup = modal.querySelector('#descriptors');
const addToCart = modal.querySelector('#addToCart');
const modalAlert = modal.querySelector('.modal__content--alert')


// Add event listener to addToCart button
addToCart.addEventListener('click', addProduct);

if(document.querySelector('.caps')) {
// Open modal 
    caps.addEventListener('click', openModalfromCard);
}

function openModalfromCard(e) {
    if(!e.target.closest('.card')) {
        return false;
    }
    
    const productID = e.target.closest('.card').dataset.productNumber;
    getProductInfo(productID, 'render');
}


// Fetch info about product from database

const getProductInfo = async function (id, callback) {
    try {
        showSpinner();
        const res  = await fetch(`product/${id}`);
        if (!res.ok) throw new Error(`Problem getting product information ${response.status}`)
        const data = await res.json();
        const renderer = await new RenderModal(data); 
        return renderer[callback]();
    } catch(err) {
        console.log(`${err}`);
    };
}



class RenderModal {
    constructor(data) {
        this.data = data;
        this.descriptors = ['subtype', 'price']
        this.labels = ['Subtipo', 'Precio']
    }
    
    render() {
        modal.style.display = 'block';
        let offset = window.pageYOffset; 
        modal.style.top = `${offset}px`;
        
        // Detect clicks outside of modal
        window.addEventListener('click', (e) => {
            if(!e.target.closest('.modal')) {
                e.stopPropagation;
                modal.style.display = 'none';
            }
        })

        //Ensure any previous add to cart is closed
        modalAlert.style.visibility = 'hidden';

        this.showMainFeatures();
        this.loadAllThumbnails();
        this.generateDescription();
        this.generateSizeSelectors();
        hideSpinner();
    }

    showMainFeatures() {
        title.textContent = this.data.title;
        description.textContent = this.data.description;
        mainPic.src = this.data.pictures[0];
    }

    loadAllThumbnails() {

        [...modal.querySelectorAll('.modal__content--pictures-thumbnails-wrapper')].forEach((el) => el.remove());

        // Add new thumbnails
        this.data.pictures.forEach((pic) => this.loadThumbnail(pic));
    }

    loadThumbnail(url) {
        return new Promise( (resolve, reject) => {
            const image = new Image();
            image.src = url;
            image.onload = () => resolve(image);
            image.onerror = () => reject(new Error('Could not load image'));
        })
        .then((image) => {
            image.className = 'thumbnails';
            let wrapper = document.createElement('div');
            wrapper.className = 'modal__content--pictures-thumbnails-wrapper';
            wrapper.appendChild(image);
            thumbnailContainer.appendChild(wrapper);
            return Promise.resolve(image);
        })
        .then((image)=> {
            image.addEventListener('click', (e) => {
                // Unhighlight all pictures
                [...document.querySelectorAll('.thumbnails')].forEach((el) => {
                    el.classList.remove('active');
                })
                // Highlight picture
                e.target.classList.add('active');

                // Change main pic
                mainPic.src = e.target.getAttribute('src');
            })
        })
    };

    generateDescription() {
        // Clear description list
        [...descriptorsGroup.children].forEach((el) => el.remove());

        // Iterate over descriptors list and add to descriptorGroup
        this.descriptors.forEach((el) => {
            this.addToDescription(`${el}: ${this.data[el]}`);
        });

        // Add to Cart (product ID)
        addToCart.dataset.price = this.data.price;
        addToCart.dataset.productNumber = this.data.id;

    }

    capitalizeFirstLetter(content) {
        return content[0].toUpperCase() + content.slice(1);
    }
 

    addToDescription(content) {
        const element = document.createElement('li');
        content = this.capitalizeFirstLetter(content);
        element.textContent = content;
        descriptorsGroup.appendChild(element);
    }


    generateSizeSelectors() {    
        
        // Delete old sizeSelectorContainer contents
        [...sizeSelectorContainer.children].forEach(el => el.remove());
              
        // Create selectors and add to container
        const arr = this.data.sizesAvailable.split('/');
        arr.forEach((size) => {
            
            // If there is only one size available, make checkbox checked and remove option to uncheck;
            if(arr.length == 1) {
                createSizeSelectorCheckbox(size, false)
                return;
            }
            createSizeSelectorCheckbox(size);
        });

        function createSizeSelectorCheckbox(size, manySizesAvailable = true) {
            // Create selector
            const label = document.createElement('label');
            label.setAttribute('for', `sizeSelector-${size}`);
            label.textContent = size;
            const input = document.createElement('input');
            input.id = `sizeSelector-${size}`;
            input.type = 'checkbox';
            input.dataset.size = size;

            // If selector is selected, other must be unselected
            input.addEventListener('change', (e) => {
                if(e.target.checked) {
                    [...e.target.closest('.sizeSelector__container').querySelectorAll('input')].forEach((el) => {
                        if(el !== e.target) {
                            el.checked = false;
                        }
                    })
                }
            });

            if(!manySizesAvailable) {
                input.checked = true;
                input.disabled = true;
            }

            sizeSelectorContainer.appendChild(input);
            sizeSelectorContainer.appendChild(label);
        };
    }



}

// Close Modal

const closeModal = document.getElementById('closeModal');
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
})


// Add to cart functionality

const cartGrid = document.querySelector('.cart__grid');
const itemsInCart = document.querySelector('.itemsInCart');
itemsInCart.textContent = localStorage.getItem('itemsInCart') | 0;


function addProduct(e){
    e.preventDefault();
    e.stopPropagation();

    // Ensure one size was selected
    if(!document.querySelector('input:checked')) {
        showAlert('Por favor seleccione un tamaño', 1);
        return false
    }

    let products = [];
    if(localStorage.getItem('products')){
        products = JSON.parse(localStorage.getItem('products'));
    }
    
    const currentProductId = e.target.dataset.productNumber;
    const currentSizeSelected = document.querySelector('input:checked').dataset.size;
    const alreadyInCart = function(item) {
        if(item['productId'] == currentProductId && item['sizeSelected'] == currentSizeSelected) return true;
        return false;
    }

    if(products.find(alreadyInCart)) {
        products[products.findIndex(alreadyInCart)].quantity += 1;
    }
    else {
    products.push({
        'productId' : currentProductId,
        'sizeSelected': currentSizeSelected,
        'picture': mainPic.getAttribute('src'), 
        'title' : title.textContent, 
        'quantity': 1, 
        'price': e.target.dataset.price
    });
    }
    localStorage.setItem('products', JSON.stringify(products));

    // Add number to cart icon 
    changeNumberItemsInCart(1);

    showAlert('Agregado al carrito', 1);
}


// Add one to number in cart icon

function changeNumberItemsInCart(number) {
    itemsInCart.textContent = parseInt(itemsInCart.textContent) + number;
    let currentItems = localStorage.getItem('itemsInCart') | 0;
    if(currentItems < 0) return false;
    localStorage.setItem('itemsInCart', parseInt(currentItems)  + number);
}


function showAlert(message, seconds) {
    modalAlert.querySelector('span').textContent = message;
    modalAlert.style.visibility = 'visible';
    setTimeout(()=>modalAlert.style.visibility = 'hidden', seconds*1000);
}


// Shopping cart functionality

if(document.querySelector('.cart')) {
    renderCart();
    // Remove footer from page
    document.querySelector('.footer').style.display = 'none'; 
    document.querySelector('.cart__grid').addEventListener('click', openModalfromCart);
    // Cart item quantity functionality
    cartGrid.addEventListener('click', itemQuantityButtons);
}

function findProductIndex(arr, productId, sizeSelected) {
    return arr.findIndex(item => {
        if(item['productId'] === productId && item['sizeSelected'] === sizeSelected) return true;
    })
}

function itemQuantityButtons(e) {
    if(e.target.closest('.quantity')) {

        // Get product info and access Product object from local storage Products array
        const productId = e.target.closest('.quantity').id;
        const sizeSelected = e.target.closest('.quantity').dataset.sizeSelected;
        let products = JSON.parse(localStorage.getItem('products'));
        const productIndex = findProductIndex(products, productId, sizeSelected);

        

        if(e.target.id == 'removeFromCart') {
            let quantity = products[productIndex].quantity;
            changeNumberItemsInCart(-quantity);
            document.querySelector('#currentQuantity').textContent = 0;
            products.splice(productIndex,1);

        }

        if(e.target.id == 'increaseQuantity') {
            products[productIndex].quantity += 1;
            if(e.target.nextElementSibling.textContent >= 10) {
                return false;
            }
            e.target.nextElementSibling.textContent = parseInt(e.target.nextElementSibling.textContent) + 1;
            changeNumberItemsInCart(1);

        }
        if(e.target.id == 'decreaseQuantity') {
            products[productIndex].quantity -= 1;
            if(e.target.previousElementSibling.textContent <= 0) {
                return false;
            }
            e.target.previousElementSibling.textContent = parseInt(e.target.previousElementSibling.textContent) - 1;
            changeNumberItemsInCart(-1);
        }

        localStorage.setItem('products', JSON.stringify(products));
    }
}

function renderCart() {

    [...allTabs.children].forEach(el=>el.classList.remove('active'));

    if(!localStorage.getItem('products')){
        renderCartRow(null, true)
        return false;
    }


    let products = JSON.parse(localStorage.getItem('products'));

    products.forEach(product => renderCartRow(product))
}

function renderCartRow(product, empty = false) {

    let htmlRow;
    if(empty) {
        htmlRow = `<span class="emptyCart light300italic">Your cart is currently empty</span>`
    }
    
    else{
    htmlRow = 
    `
    <div class="product cart__grid--product" id="${product.productId}">
        <div class="product__image">
            <img src="${product.picture}" alt="">
        </div>
        <div class="product__description">
            <ul>
                <li class="product__description--description bold700">${product.title}</li>
                <li>Talla:${product.sizeSelected} </li>
                <li>Precio: $${product.price} </li>
                <li>En stock</li>
            </ul>
        </div>
    </div>
    <div class="quantity cart__grid--quantity" id="${product.productId}" data-size-selected="${product.sizeSelected}">
            <span id="increaseQuantity">&#43</span>
            <span id="currentQuantity">${product.quantity}</span>
            <span id="decreaseQuantity">&#8722</span>
            <span id="removeFromCart">Eliminar</span>
    </div>
    <div class="total cart__grid--total">$${product.quantity*product.price}</div>
    `
    }
    cartGrid.insertAdjacentHTML('beforeend', htmlRow);

}


function openModalfromCart(e) {
    if(!e.target.closest('.product')) {
        return false;
    }
    const productID = e.target.closest('.product').id;
    getProductInfo(productID, 'render');
}



