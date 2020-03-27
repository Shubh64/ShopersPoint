import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-toast/paper-toast.js';
/**
* @customElement
* @polymer
*/
class HomePage extends PolymerElement {
    static get template() {
        return html`
<style>
:host{
    background-color: #667db6;
}
    main {
        border-radius: 8px;
        align-self: center;
    }

    iron-form{
        padding:20px;
    }
    h1 {
        justify-self: center;
        color: white;
    }
    #orderButton{
        background-color: #667db6;
        color: white;
        margin: 5% 3% 3% 0;
        width: 50%;
    }
    header {
        display: grid;
        grid-template-columns: 250px 1fr 1fr 200px 100px;
        grid-template-rows: 100px;
        height: 70px;
        width: 100%;
        background-color: #;
    }
    #logoutBtn{
        margin-left:20%;
        margin-top:30%;
    }
    #logout {

        grid-row: 1/2;
        grid-column: 5/6;
    }

    paper-card{
        background-color: #f5f6ff;
        margin-top:5%;
        margin-left:3%;
        width:30%;
        text-align:center;
    }
    iron-icon {
        color: red;
    }
    #searchBar{
        display:flex;
        margin-left:20%;
        width:100%;
        margin: 10px;
        font-size: 1.4em;
        grid-row: 1/2;
        grid-column: 4/5;
    }
    paper-icon-button{
        margin-top:20px;
    }
    #myOrders{
        grid-row:1/2;
        grid-column:1/2;
        background-color:#f5f6ff;
        width:200px;
        height:70px;
    }
    h2{
        color:black;
    }
    iron-icon{
        color:black;
    }
</style>
<header>
<paper-button id="myOrders" raised on-click="_myOrders" >MyOrders</paper-button>
        <div id="searchBar">
        <paper-input type="search" id="search" label="search"></paper-input>
      <paper-icon-button icon="search" on-click="_handleSearch"></paper-icon-button>
        </div>
    
</header>
    <main>
    <template is="dom-repeat" items="{{products}}">
    <paper-card>
    <div id="card">
    <h3>Product Name: {{item.productName}}</h3>
    <h3>Price: {{item.productCost}}</h3>
    <h3 id="total">Total Price:{{item.totalPrice}} </h3>
    </div>
    <div >
    <paper-input id="quantity{{index}}" label="Enter Quantity" on-input="_handlePrice"></paper-input>
    <paper-button id="orderButton" on-click="_makeOrder" >Buy Now</paper-button>
    </div>
    </paper-card>
    </template>
    </main>
<iron-ajax id="ajax" on-response="_handleResponse" on-error="_handleError" content-type="application/json"
    handle-as="json"></iron-ajax>
    <paper-toast id="toast" text={{message}}></paper-toast>
`;
    }
    static get properties() {
        return {
            products:{
                type:Array,
                value:[{"productName":"iphoneX",'description':'gfgh','productCost':200,'ratings':'3.5'}]
            }
        };
    }
   connectedCallback(){
       super.connectedCallback();
       this.user = JSON.parse(sessionStorage.getItem('userDetails'));
       const emailId = sessionStorage.getItem('emailId');
      console.log(emailId)
     this._makeAjaxCall(`http://localhost:2424/onlineshop/products?emailId=${emailId}`,`get`,null);
   }

    _handleSearch(){
        let productName = this.$.search.value;
        this._makeAjaxCall(`http://localhost:2424/onlineshop/product?productName=${productName}`,'get',productName);
         this.action='search';
    }

    _makeOrder(event){
      let productId=event.model.item.productId;
      let productCost=event.model.item.productCost;
      let userId=sessionStorage.getItem('userId');
      let buyQuantity=`#quantity${event.model.index}`;
      this.buyQuantity=this.shadowRoot.querySelector(`${buyQuantity}`).value;
      console.log(this.buyQuantity)
      let quantity=this.buyQuantity; 
      const postObj={productId,userId,quantity,productCost};
      console.log(postObj);
       this._makeAjaxCall(`http://localhost:2424/onlineshop/orders`,'post',postObj);
       this.action='buy';
       window.location.reload();
    }
    
    /**
     * @param {*} event
     * response from the backend is handled here 
     */
    _handleResponse(event) {
        console.log(event.detail.response)
        this.products = event.detail.response;
        switch(this.action){
            case 'buy':  
            if(event.detail.response.statusCode==607)
            {
                this.message="product bought successfully";
                this.$.toast.open();
            }
            if(event.detail.response.statusCode==606)
            {
                this.message="out of quantity";
                this.$.toast.open();
            }
            case 'search':  
            if(event.detail.response.statusCode==700)
            {
                this.message="sorry !! we didnt have this specific product";
                this.$.toast.open();
            }
            // else{
            //     this.searchData=event.detail.response;
            // }
           
            break;
        }

    }
    _handleError(event) {
        console.log(event.detail.request.response)
        this.products = event.detail.response;

    }

     /**
    * function to make ajax calls
    * @param {String} url 
    * @param {String} method 
    * @param {Object} postObj 
    */
    _makeAjaxCall(url, method, postObj, action) {
    const ajax = this.$.ajax;
    ajax.method = method;
    ajax.url = url;
    ajax.body = postObj ? JSON.stringify(postObj) : undefined;
    ajax.generateRequest();
    }
    _handlePrice(event){
        let quantity=`#quantity${event.model.index}`;
        let unitPrice=event.model.item.productCost;
        console.log(this.shadowRoot.querySelector(quantity).value)
        this.quantity=this.shadowRoot.querySelector(quantity).value;
        this.totalPrice=unitPrice*this.quantity;
        this.set(`products.${event.model.index}.totalPrice`,this.totalPrice);
        console.log(this.totalPrice);
    }
    _myOrders(){
        window.history.pushState({},null,'#/orders');
        window.dispatchEvent(new CustomEvent('location-changed'));
    }
}

window.customElements.define('home-page', HomePage);