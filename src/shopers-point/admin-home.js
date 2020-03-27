import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/iron-ajax/iron-ajax.js';

/**
 * @customElement
 * @polymer
 */
class AdminHome extends PolymerElement {
    static get template() {
        return html`
      <style>
        main{
          border-radius:8px;
          background-color:#f5f6ff;
          width:30%;
          height:20%;
          align-self:center;
        }
        iron-form{
          padding:20px;
        }
        #addProduct{
            background-color: #667db6;
            color: white;
          margin-top:20px;
          width: 100%;
        }
        #container{
          display:flex;
          justify-content:center;
          margin-top:3%;
        }
        h1{
            justify-self: center;
            color: white;
        }
        header{
            display: grid;
            grid-template-columns: 250px 1fr 1fr 100px 30px;
            grid-template-rows: 100px;
            height: 100px;
            width: 100%;
            background-color: #000000; 
       }
       /* #logout{
           grid-row: 1/2;
           grid-column: 4/5;
       } */
       #heading{
           margin: 10px;
           font-size: 1.4em;
           grid-row: 1/2;
           grid-column: 1/2;
       }
       iron-icon{
            color:red;
        }
      </style>
      <div id="container">
      <main>
      <iron-form id="product">
      <form>
      <h2>Add New Product</h2>
      <paper-input  auto id="productName" required name="productName" type="text" label="Enter Product Name"></paper-input>
      <paper-input  auto id="productCost" required name="productDescription" type="text" label="Enter Product Price"></paper-input>
      <paper-input  auto id="quantity" required name="quantity" type="Number" label="Enter Available Quantity"></paper-input>
      <paper-input auto id="productType" required name="productType"  label="Product Type"></paper-input>
      <paper-input  auto id="availability" required name="avalability" type="text" label="Enter Availablity"></paper-input>
      <paper-input  auto id="rating" required name="rating" type="Number" label="Enter Initial Rating"></paper-input>
        <paper-button id="addProduct" on-click="_addProduct" >Add Product</paper-button>
        </form>
        </iron-form>
      </main>
      </div>
      <paper-toast id="toast" text={{message}}></paper-toast>
      <iron-ajax id="ajax" on-response="_handleResponse" on-error="_handleError" content-type="application/json" handle-as="json"></iron-ajax>
   
    `;
    }
    /**
   * Properties used here are defined here with some respective default value.
   */
    static get properties() {
        return {
            userData: {
                type: Array,
                value: []
            }
        };
    }

    /**
      *  validates if the user exist and logs in to the user portal
       */
    _addProduct() {
        if (this.$.product.validate()) {
            let productName = this.$.productName.value;
            let productCost = this.$.productCost.value;
            let quantity = this.$.quantity.value;
            let productType = this.$.productType.value;
            let availability = this.$.availability.value;
            let rating = this.$.rating.value;
            let productObj = { productName, productCost, availability, productType,rating,quantity };
            this._makeAjaxCall(`http://localhost:2424/onlineshop/admin/products`, 'post', productObj);
        }
    }
    /**
    * @param {*} event 
    * handling the response for the ajax request made
    */
    _handleResponse(event) {
        this.userData = event.detail.response;
        console.log(this.userData)
        if(event.detail.response.statusCode==201){
            this.message="product added successfully"
            this.$.toast.open();
        }
     
    }

    _handleError(event) {
        console.log(event.detail.request.response.status);
        this.message = 'Invalid Credentials';
        this.$.toast0.open();
    }

    /**
   * function to make ajax calls
   * @param {String} url 
   * @param {String} method 
   * @param {Object} postObj 
   */
    _makeAjaxCall(url, method, postObj) {
        const ajax = this.$.ajax;
        ajax.method = method;
        ajax.url = url;
        ajax.body = postObj ? JSON.stringify(postObj) : undefined;
        ajax.generateRequest();
    }
}

window.customElements.define('admin-home', AdminHome);
