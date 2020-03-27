import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/iron-ajax/iron-ajax.js';

/**
 * @customElement
 * @polymer
 */
class LoginPage extends PolymerElement {
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
        #loginBtn{
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
       #registerBtn{
        color:blue;
       }
       iron-icon{
            color:red;
        }
      </style>
      
      <div id="container">
      <main>
      <iron-form id="login">
      <form>
      <paper-input id="emailId"  required name="emailId" type="email" label="Enter Email Id" > </paper-input>
      <paper-input id="password"  required name="password" type="password" label="Enter Password"></paper-input>
      <paper-button raised id="loginBtn" on-click="_handleLogin">Login</paper-button>
      <sub>New Here?<paper-button id="registerBtn" on-click="_handleRegister">Register</paper-button></sub>
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
    _handleLogin() {
        if (this.$.login.validate()) {
            let password = this.$.password.value;
            let emailId = this.$.emailId.value;
            sessionStorage.setItem('emailId',emailId)
            const postObj={password,emailId};
            this._makeAjaxCall(`http://localhost:2424/onlineshop/login`, 'post', postObj);

        }
    }

    /**
     * Button for a new user registration
     */
    _handleRegister() {
        window.history.pushState({}, null, '#/registration');
        window.dispatchEvent(new CustomEvent('location-changed'));
    }

     /**
     * @param {*} event 
     * handling the response for the ajax request made
     */
    _handleResponse(event) {
      console.log(event)
        this.userData = event.detail.response;
        if(event.detail.response.statusCode==605){
       this.message="Id or password is incorrerct";
       this.$.toast.open();
        }
        else{
        console.log(this.userData);
        if (this.userData != null) {
            if(this.userData.userType== "admin"){
            window.history.pushState({}, null, '#/admin');
            window.dispatchEvent(new CustomEvent('location-changed'));
        }
          else{
            sessionStorage.setItem('userDetails', JSON.stringify(this.userData));
            sessionStorage.setItem('userId',this.userData.userId);
            window.history.pushState({}, null, '#/home');
            window.dispatchEvent(new CustomEvent('location-changed'));
          }
        }
        else {
            this.message = 'Invalid Credentials'
            this.$.toast0.open();
        }
    }
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

window.customElements.define('login-page', LoginPage);