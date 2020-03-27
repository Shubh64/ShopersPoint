import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/app-route/app-route.js';
import '@polymer/app-route/app-location.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-scroll-effects/effects/waterfall.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/iron-selector/iron-selector.js';
import '@polymer/iron-icon/iron-icon';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import { setRootPath } from '@polymer/polymer/lib/utils/settings.js';
import '@polymer/font-roboto/roboto.js';
/**
 * @customElement
 * @polymer
 */
setRootPath(MyAppGlobals.rootPath);
class ShopersPoint extends PolymerElement {
  static get template() {
    return html`
    <style>
    :host {
      display: block;
      margin:0;
      padding:0;
      font-family:"roboto"
    }
    .tabs-bar {
      background-image: linear-gradient(to right, #1488cc, #2b32b2);;
      width:100%;
      height: auto;
      text-align:center;
      margin-top:10px;
  }
  ul {
      display: inline-flex;
      list-style: none;
      align-items: flex-start;
      
  }
  ul li 
  {
      width:120px;
  }
  ul li a:visited
  {
    color:white;
  }
  ul li a
  {
    color:white;
    text-decoration:none;
  }
  .link
  {
    text-decoration:none;
    color:black;
  }
  .link:visited
  {
    color:black;
  }
  [hidden] {
    display: none !important;
  }
  .heading-title
  {
    color:white;
  }
  .heading
  {
    display:flex;
    background: linear-gradient(to right, #667db6, #0082c8, #0082c8, #667db6);
    font-size:24px;
    justify-content:space-between;
  }
  #logout
  {
    color:white;
    height:30px;
    font-size:1rem;
  }
  h1
  {
    color:white;
  }
  </style>
        <app-location id="location" route="{{route}}" url-space-regex="^[[rootPath]]" use-hash-as-path></app-location>
        <app-route route="{{route}}" data="{{routeData}}" pattern="[[rootPath]]:page" tail="{{subRoute}}"></app-route>
        <app-drawer-layout force-narrow>
          <app-drawer id="drawer" slot="drawer">
            <app-toolbar>Menu</app-toolbar>
            <!-- Nav on mobile: side nav menu -->
            <paper-listbox selected="[[page]]" attr-for-selected="name">
              <template is="dom-repeat" items="{{items}}">
              <a href="[[rootPath]]{{item.route}}" class="link">
                <paper-item name$="{{item.route}}">{{item.label}}</paper-item>
                </a>
              </template>
            </paper-listbox>
          </app-drawer>
          <app-header-layout has-scrolling-region>
            <app-header class="main-header" slot="header">
              <app-toolbar class="heading">
                <paper-icon-button class="menu-button" icon="menu" drawer-toggle hidden$="{{wideLayout}}">
                </paper-icon-button>
                <span class="heading-title">Shoppers Point</span>
                <paper-button raised id="logout" hidden$={{!login}} on-click="_handleLogout">Log Out</paper-button>
                </app-toolbar>
                <iron-pages selected="[[page]]" attr-for-selected="name" role="main" fallback-selection="error404">
                <registration-page name="registration"></registration-page>
                <login-page name="login"></login-page>
                <admin-home name="admin"></admin-home>
                <home-page name="home"></home-page>
                <view404-page name='view404'></view404-page>
                <my-orders name="orders"></my-orders>
              </iron-pages> 
            </app-header>
          </app-header-layout>
        </app-drawer-layout>
        <iron-media-query query="min-width: 600px" query-matches="{{wideLayout}}"></iron-media-query>
            `;
  }
  static get properties() {
    return {
      page: {
        type: String,
        observer: '_pageChanged'
      },
      wideLayout: {
        type: Boolean,
        value: false,
        observer: 'onLayoutChange',
      },
      login: {
        type: Boolean,
        value: true
      }
    };
  }
  /**
  *simple observer which is triggered when page property is changed
  *@param {String} newPage value of changed page 
  **/
 _pageChanged(newPage) {
  //Depending upon the changed page it lazy-imports the url
  switch (newPage) {
    case 'registration':
      import('./registration-page.js');
      break;
    case 'home':
      import('./home-page.js')
      break;
    case 'login':
      import('./login-page.js');
      break;
      case 'admin':
        import('./admin-home.js');
        break;
        case 'orders':
          import('./my-orders.js');
          break;
    case 'view404':
      import('./view404-page.js');
      break;
  }
  }
  /** Hence complex triggers is required to define to observe changes on first time page load.
    **/
  static get observers() {
    return ['_routerChanged(routeData.page)']
  }
  /**
     * @author: Abhinav
     *@param {String} page Value of new page
    **/
  _routerChanged(page) {
    console.log(page);
    this.page = page || 'login';
  }
  /**
   *onLayoutChange() is a simple observer which is triggered when wideLayout Property is changed.
   It closes the drawer if the layout is wider than 600px
   *@param {Boolean} wide tells that layout is wide or not? it's a value in true or false
  **/
  onLayoutChange(wide) {
    var drawer = this.$.drawer;
    if (wide && drawer.opened) {
      drawer.opened = false;
    }
  }
  _handleLogout() {
    sessionStorage.clear();
    window.history.pushState({}, null, '#/login');
    window.dispatchEvent(new CustomEvent('location-changed'));
    window.location.reload();

}
}

window.customElements.define('shopers-point', ShopersPoint);
