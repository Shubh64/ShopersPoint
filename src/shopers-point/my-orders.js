import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/app-route/app-location.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/paper-toast/paper-toast.js';


/**
 * Define an element class
 * @customElement
 * @polymer
 */
class MyOrders extends PolymerElement {
  /**
     * Define the element's template
     */
  static get template() {
    return html`
<style>
  :host {
    display: block;
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;

  }
  table, td, th {  
    border: 1px solid rgb(0, 0, 0);
    text-align: left;
    border-style: dashed;
  }
  
  table {
    border-collapse: collapse;
    margin-top:20px;
    margin-bottom:20px;
    width: 90%;
  }
  
  th, td {
    padding: 15px;
  }
  #form {
    border: 2px solid black;
    width: 500px;
    margin-left: 400px;
  }

  form {
    margin-left: 20px;
    margin-right: 20px;
  }
  h2{
    text-align: center;
  }

  h2{
    text-align:center;
    color:white;
    position:absolute;
    top:22px;
    left:300px;

}
  paper-button {
    text-align: center;
    background-color:#667db6;
    color:white;
  }
  h1{
      text-align:center;
  }
  a{
    text-decoration:none;
    color:white;
  }
h3{
    color:#ff0800;
}
        #buttons{
          position:absolute;
          top:30px;
          float:right;
        }
        #productSearch{
          width:20%;
        }

        #dialog{
          width:50%;
          border-radius:20px;
        }
        #buyNow{
          float:right;
        }
        #login{
          left:1300%;
        }
</style>
<app-location route={{route}}></app-location>
<h1> Rate our Products </h1>
<table >
  <tr>
    <th>Product Name</th>
    <th>Cost</th>
    <th>ProductType</th>
    <th>RateNow</th>
    </tr>
    <template is="dom-repeat" items={{data}}>
  <tr>
  <td>{{item.productName}}</td>
  <td>{{item.productCost}}</td>
  <td>{{item.productType}} </td>
    <td><paper-button type="submit" id="rate" on-click="_handleRate">Rate</paper-button></td>
  </tr>
  </template>
</table>

<paper-dialog id="dialog">
<paper-dialog-scrollable>  
<h2> Enter the rating  </h2>
<h3> 5 : Highest   </h3>
<h3> 1 : Lowest   </h3>
 Product Name: {{productName}}<br>
 <paper-input id="productRating" allowed-pattern=[1-5] required type="text" label="Enter Rating"></paper-input>
  <paper-button type="submit" id="rate" on-click="_handleSubmit">Submit</paper-button>
  </paper-dialog-scrollable>
</paper-dialog>
<paper-toast text={{message}}  class="fit-bottom" id="toast"></paper-toast>
<iron-ajax id="ajax" on-response="_handleResponse" handle-as="json" content-type='application/json'>
</iron-ajax>

`;
  }

  /**
   * Define public API properties
   */
  static get properties() {
    return {
      data: {
        type: Array,
        value:[{"productName":"iphoneX",'productType':'high','productCost':200,'ratings':'3.5'}]
    },
      action: {
        type: String
      },
      cart: {
        type: Array,
        value: []
      },
      selected: {
        type: Object,
        value: {}
      }
    };
  }


  /**
   * getting list of all the items
   */
  connectedCallback() {
    super.connectedCallback();
    this.userId =sessionStorage.getItem('userId');
    this._makeAjax(`http://localhost:2424/onlineshop/user/${this.userId}/products`, 'get', null)
    this.action = 'List';
  }

  _handleRate(event) {
    this.productId=event.model.item.productId;
    this.productName=event.model.item.productName;
    console.log(this.productId)
    this.$.dialog.open();
  }



  _handleSubmit(event) {
    let productRating = this.$.productRating.value;
    let postObj = {productRating};
    console.log(postObj);
    this._makeAjax(`http://localhost:2424/onlineshop/users/${this.userId}/products/${this.productId}/rating`, 'put', postObj);
   window.location.reload();
  }



  /**
   * getting response from server and storing user data and id in session storage
   * @param {*} event 
   */
  _handleResponse(event) {
    console.log(event.detail.response);
    switch (this.action) {
      case 'List':
        this.data = event.detail.response;
        break;
    }
  }


  /**
    * calling main ajax call method 
    * @param {String} url 
    * @param {String} method 
    * @param {Object} postObj 
    */
  _makeAjax(url, method, postObj) {
    const ajax = this.$.ajax;
    ajax.method = method;
    ajax.url = url;
    ajax.body = postObj ? JSON.stringify(postObj) : undefined;
    ajax.generateRequest();
  }

  /**
   * clear session storage and route to login page
   */
  _handleLogout() {
    sessionStorage.clear();
    this.set('route.path', './login-page');
    window.location.reload();

  }


}

/**
 * Register the element with the browser
 */
window.customElements.define('my-orders', MyOrders);