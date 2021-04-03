/*

const client = contentful.createClient({
    // This is the space ID. A space is like a project folder in Contentful terms
    space: "s6j8mkpbempu",
    // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
    accessToken: "lnKbyLdprsQeAJddgc79BrFWPzq1K9GNjC4g0o9nP8M"
  });
  
  */

//variables
const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM= document.querySelector('.cart');
const cartOverLay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const linetotal = document.querySelector('.line-Total');
const linediscount = document.querySelector('.line-Discount');
const linegrandtotal = document.querySelector('.line-Grand-Total');
const cartTotal = document.querySelector('.cart-total');
const cartGrandTotal = document.querySelector('.cart-grandTotal');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');



//cart
let cart = [];
//buttons
let buttonsDOM = [];

//getting Products
class Products{

    async getProducts(){
        try {

/*

let contentful = await client.getEntries({
    //content_type: "griffinCodeChallengeProducts"
});
        let products = contentful.items;

*/



            let result = await fetch('GriffinCodeChallenge.json');
            let data = await result.json();
            let products = data.items;

            

            products = products.map(items => {
                const {title,price}= items.fields;
                const {id} = items.sys;
                const image = items.fields.image.fields.file.url;
                return {title,price,id,image};

            })

            return products;

            
        } catch (error) {
            console.log(error);
            
        }
    
    }

}

//display products
class UI{
displayProducts(products){

    let result = '';

    products.forEach (product => {
        result +=`
        <article class="product">
            <div class="img-container">
                <img src=${product.image} alt="product" class="product-img">
                <button class="bag-btn" data-id=${product.id}>
                    <i class="fas fa-shopping-cart"></i>
                    ADD TO CART!
                </button>
            </div>
            <h3>${product.title}</h3>
            <h4>$${product.price}</h4>
        </article>
        `;

    });
    productsDOM.innerHTML = result;
} 

getBagButtons(){
    const buttons = [...document.querySelectorAll(".bag-btn")];
    buttonsDOM = buttons;
    buttons.forEach(button => {
        let id = button.dataset.id;
        let inCart = cart.find(item => item.id == id);
        if(inCart){
            button.innerText = "Done! In Cart";
            button.disabled = true;
        }
        
            button.addEventListener("click" ,(event)=>{
                event.target.innerText = "Done! In Cart";
                event.target.disabled = true;
                //get product from products
                let cartItem = {...Storage.getProduct(id),
                amount: 1 };
                //add product to cart 
                cart = [...cart,cartItem];
                //save cart in local storage
                Storage.saveCart(cart);
                //set cart values
                this.setCartValues(cart);
                //display card items
                this.addCartItem(cartItem);
                //show the cart
                this.showCart();

            });
        
    });
}
setCartValues(cart){
    let tempTotal = 0;
    let itemsTotal = 0;

    var lineTotal=0;
    var discount=0;
    var lineGrandTotal=0;
    var grandTotal = 0;
    var cutoff;
    
    
    cart.map(item => {
        tempTotal += item.price * item.amount;
        itemsTotal += item.amount;
        
            if (item.amount>=10 && item.amount<=25)
            {
                lineTotal = parseFloat(item.amount.toFixed(2)) * item.price;
                discount = parseFloat(item.amount.toFixed(2)) * 0.1;
                lineGrandTotal = lineTotal - discount;
                cutoff = 0.1;
                
            }
            else if (item.amount>=26 && item.amount<=50)
            {
                lineTotal = parseFloat(item.amount.toFixed(2)) * item.price;
                discount = parseFloat(item.amount.toFixed(2)) * 0.25;
                lineGrandTotal = lineTotal - discount; 
                cutoff = 0.25;
                
            }
            else if (item.amount>=51)
            {
                lineTotal = parseFloat(item.amount.toFixed(2)) * item.price;
                discount = parseFloat(item.amount.toFixed(2)) * 0.5;
                lineGrandTotal = lineTotal - discount; 
                cutoff = 0.5; 
    
            }
            else
            {
                lineTotal = parseFloat(item.amount.toFixed(2)) * item.price;
                discount = 0;
                lineGrandTotal = lineTotal;
                cutoff = 0;
       
            }

             
            grandTotal += ((item.amount * item.price)-(item.amount * cutoff));
     
    });

    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
    cartGrandTotal.innerText = parseFloat(grandTotal.toFixed(2));

}
addCartItem(item){

        var lineTotal=0;
        var discount=0;
        var lineGrandTotal=0;
        var cutoff;
        
        if (item.amount>=10 && item.amount<=25)
        {
            lineTotal =parseFloat(item.amount.toFixed(2)) * item.price;
            discount = parseFloat(item.amount.toFixed(2)) * 0.1;
            lineGrandTotal = lineTotal - discount; 
            cutoff = 0.1; 
            
        }
        else if (item.amount>=26 && item.amount<=50)
        {
            lineTotal = parseFloat(item.amount.toFixed(2)) * item.price;
            discount = parseFloat(item.amount.toFixed(2)) * 0.25;
            lineGrandTotal = lineTotal - discount; 
            cutoff = 0.25;
            
        }
        else if (item.amount>=51)
        {
            lineTotal = parseFloat(item.amount.toFixed(2)) * item.price;
            discount = parseFloat(item.amount.toFixed(2)) * 0.5;
            lineGrandTotal = lineTotal - discount;  
            cutoff = 0.5;

        }
        else
        {
            lineTotal = parseFloat(item.amount.toFixed(2)) * item.price;
            discount = 0;
            lineGrandTotal = lineTotal;
            cutoff = 0;
            
        }
   
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = ` <img src=${item.image} alt="no image" />
    <div>
        <h4>${item.title}</h4>
        <h5>Price: $ ${item.price}</h5>
        Line Total: <span class ="line-Total"></span>  $ ${lineTotal}
        </br>
        Discount: <span class ="line-Discount"></span> $ ${discount}
        </br>
        Line Grand Total: <span class ="line-Grand-Total"></span> $ ${lineGrandTotal}
        </br>
        <span class="remove-item" data-id=${item.id}>remove</span>
    </div>
    <div>
        <i class="fas fa-chevron-up" data-id=${item.id}></i>
        <p class="item-amount">${item.amount}</p>
        <i class="fas fa-chevron-down" data-id=${item.id}></i>
    </div>`;
    cartContent.appendChild(div);

    //linetotal.innerText = parseFloat(lineTotal.toFixed(2));

    //document.getElementById("line-Total").innerHTML = lineTotal;

}
showCart(){
    cartOverLay.classList.add("transparentBcg");
    cartDOM.classList.add("showCart");

}

setupAPP(){
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populateCart(cart);
    cartBtn.addEventListener("click", this.showCart);
    closeCartBtn.addEventListener("click", this.hideCart);
}

populateCart(cart){
    cart.forEach(item =>this.addCartItem(item));
}

hideCart(){
    cartOverLay.classList.remove("transparentBcg");
    cartDOM.classList.remove("showCart");

}
cartLogic(){
    clearCartBtn.addEventListener("click", () => {this.clearCart();

     });
     cartContent.addEventListener("click", event => {
         if (event.target.classList.contains("remove-item"))
         {
             let removeItem = event.target;
             let id = removeItem.dataset.id;
             cartContent.removeChild(removeItem.parentElement.parentElement);
             this.removeItem(id);


         }
         else if (event.target.classList.contains("fa-chevron-up"))
         {
             let addAmount = event.target;
             let id = addAmount.dataset.id;
             let tempItem = cart.find(item => item.id == id);
             tempItem.amount = tempItem.amount + 1;
             Storage.saveCart(cart);
             this.setCartValues(cart);
             addAmount.nextElementSibling.innerText=tempItem.amount;

         }
         else if (event.target.classList.contains("fa-chevron-down"))
         {
             let lowerAmount = event.target;
             let id = lowerAmount.dataset.id;
             let tempItem = cart.find(item => item.id == id);
             tempItem.amount = tempItem.amount - 1;
             if(tempItem.amount>0){
                 Storage.saveCart(cart);
                 this.setCartValues(cart);
                 lowerAmount.previousElementSibling.innerText=tempItem.amount;

             }
             else{
                 cartContent.removeChild(lowerAmount.parentElement.parentElement);
                 this.removeItem(id);
             }

         }


     });
}
clearCart(){
    let cartItems = cart.map(item => item.id);
    cartItems.forEach(id => this.removeItem(id));
    while(cartContent.children.length>0){
        cartContent.removeChild(cartContent.children[0])
    }
    this.hideCart();

}
removeItem(id){
    cart = cart.filter(item => item.id !==id);
    this.setCartValues(cart);
    Storage.saveCart(cart);
    let button = this.getSingleButton(id);
    button.disabled = false;
    button.innerHTML = `<i class="fas fa-shopping-cart"></i>ADD TO CART!`;
}
getSingleButton(id){
    return buttonsDOM.find(button => button.dataset.id == id);
    
}


}

//local storage
class Storage{
    static saveProducts(products){
        localStorage.setItem("products",JSON.stringify(products));
    }
    static getProduct(id){
        let products = JSON.parse(localStorage.getItem("products"));
        return products.find(product => product.id == id)
    }
    static saveCart(cart){
        localStorage.setItem("cart", JSON.stringify(cart));
    }
    static getCart(){
        return localStorage.getItem("cart")?JSON.parse(localStorage.getItem("cart")):[];
    }


}

//action listener
document.addEventListener("DOMContentLoaded", ()=>{

    const ui = new UI();
    const products = new Products();

    //setpApp
    ui.setupAPP();

    //get all products
    products.getProducts().then(products => {
    ui.displayProducts(products)
    Storage.saveProducts(products);
  }).then(() => {
      ui.getBagButtons();
      ui.cartLogic();

  });
});