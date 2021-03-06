import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  loadUserData,
  Person,
  getFile
} from 'blockstack';
const blockstack = require("blockstack");
const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

export default class SharedVault extends Component {

  constructor(props) {
    super(props);
    this.state = {
      person: {
  	  	name() {
          return 'Anonymous';
        },
  	  	avatarUrl() {
  	  	  return avatarFallbackImage;
  	  	},
  	  },
      username: "",
      contacts: [],
      filteredContacts: [],
      title : "",
      grid: [
        []
      ],
      updated: "",
      words: "",
      index: "",
      save: "",
      loading: "hide",
      printPreview: false,
      autoSave: "Saved",
      senderID: "",
      sheets: [],
      filteredValue: [],
      tempDocId: "",
      redirect: false,
      receiverID: "",
      show: "",
      hide: "",
      hideButton: "",
      sharedWithMe: true
    }
    this.handleIDChange = this.handleIDChange.bind(this);
    this.pullData = this.pullData.bind(this);
  }

  componentDidMount() {
    getFile("contact.json", {decrypt: true})
     .then((fileContents) => {
       if(fileContents) {
         console.log("Contacts are here");
         this.setState({ contacts: JSON.parse(fileContents || '{}').contacts });
         this.setState({ filteredContacts: this.state.contacts });
       } else {
         console.log("No contacts");
       }
     })
      .catch(error => {
        console.log(error);
      });
  }

  componentWillMount() {
    this.setState({
      person: new Person(loadUserData().profile),
    });
  }

  windowRefresh() {
    window.location.reload(true);
  }

  handleIDChange(e) {
    this.setState({ senderID: e.target.value })
  }

  pullData() {
    this.fetchData();
    this.setState({ hideButton: "hide", loading: "" });
  }

  renderView() {
    const show = this.state.show;
    console.log(loadUserData().username);
    const loading = this.state.loading;
    let contacts = this.state.filteredContacts;
    let link = '/sheets/shared/';
    let user = this.state.senderID;
    const userData = blockstack.loadUserData();

    if(this.state.sharedWithMe === true) {
      return(
      <div className={show}>
        <div className="container center-align">
          <h3>Files Shared With Me</h3>
          <h5>Select the contact who shared with you</h5>
        </div>

        <div className="container">

        {contacts.slice(0).reverse().map(contact => {
          let imageLink;
          let name;
          if(contact.img) {
            imageLink = contact.img;
          } else {
            imageLink = avatarFallbackImage;
          }

          if(contact.name) {
            name = contact.name;
          } else {
            name = "";
          }

            return (
              <ul className="collection">
                <li key={contact.contact} className="collection-item avatar">
                  <Link to={'/vault/shared/'+ contact.contact}>
                    <img src={imageLink} alt="Profile" className="circle" />
                    <span className="title">{contact.contact}</span>
                    <p>{name}</p>
                  </Link>
                </li>
              </ul>
            )
          })
        }
        </div>
      </div>
    );
    } else {
      return (
      <div className={show}>
        <div className="container center-align">
          <h3>Files Shared With Others</h3>
          <h5 >Select the contact you shared with</h5>
        </div>

        <div className="container">

        {contacts.slice(0).reverse().map(contact => {
          let imageLink;
          let name;
          if(contact.img) {
            imageLink = contact.img;
          } else {
            imageLink = avatarFallbackImage;
          }

          if(contact.name) {
            name = contact.name;
          } else {
            name = "";
          }

            return (
              <ul className="collection">
                <li key={contact.contact} className="collection-item avatar">
                  <Link to={'/vault/sent/'+ contact.contact}>
                    <img src={imageLink} alt="Profile" className="circle" />
                    <span className="title">{contact.contact}</span>
                    <p>{name}</p>
                  </Link>
                </li>
              </ul>
            )
          })
        }
        </div>
      </div>
    );
    }
  }


  render() {
      console.log(loadUserData().username);
      let link = '/vault/shared/';
      let user = this.state.senderID;
      const userData = blockstack.loadUserData();
      const person = new blockstack.Person(userData.profile);

      return (
        <div>
        <div className="navbar-fixed toolbar">
          <nav className="toolbar-nav">
            <div className="nav-wrapper">
              <a href="/" className="brand-logo left text-white">Graphite.<img className="pencil" src="https://i.imgur.com/2diRYIZ.png" alt="pencil" /></a>

              <ul id="nav-mobile" className="right">
              <ul id="dropdown1" className="dropdown-content">
                <li><a href="/shared-sheets">Shared Files</a></li>
                <li><a href="/export">Export All Data</a></li>
                <li className="divider"></li>
                <li><a onClick={ this.handleSignOut }>Sign out</a></li>
              </ul>
              <ul id="dropdown2" className="dropdown-content">
              <li><a href="/documents"><img src="https://i.imgur.com/C71m2Zs.png" alt="documents-icon" className="dropdown-icon" /><br />Documents</a></li>
              <li><a href="/sheets"><img src="https://i.imgur.com/6jzdbhE.png" alt="sheets-icon" className="dropdown-icon-bigger" /><br />Sheets</a></li>
              <li><a href="/contacts"><img src="https://i.imgur.com/st3JArl.png" alt="contacts-icon" className="dropdown-icon" /><br />Contacts</a></li>
              <li><a href="/vault"><img src="https://i.imgur.com/9ZlABws.png" alt="vault-icon" className="dropdown-icon-file" /><br />Vault</a></li>
              </ul>
                <li><a className="dropdown-button" href="#!" data-activates="dropdown2"><i className="material-icons apps">apps</i></a></li>
                <li><a className="dropdown-button" href="#!" data-activates="dropdown1"><img src={ person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage } className="img-rounded avatar" id="avatar-image" /><i className="material-icons right">arrow_drop_down</i></a></li>
              </ul>
            </div>
          </nav>
        </div>
        <div className="shared-docs-page">

        </div>
        {this.renderView()}
      </div>
      );
    }

}
