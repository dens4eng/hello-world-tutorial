import React, { Component } from 'react';
import Profile from './Profile.js';
import Signin from './Signin.js';
import {
  UserSession,
  AppConfig
} from 'blockstack';

//appConfig contains configuration data for the app
const appConfig = new AppConfig()
//userSession object represent the instance of a user on this app
const userSession = new UserSession({ appConfig: appConfig })

export default class App extends Component {
  //the UserSession API supplies sign in and sign out
  handleSignIn(e) {
    e.preventDefault();
    //generates an auth request and redirects the user to the blockstack Browser
    //to approve the sign in request
    userSession.redirectToSignIn();
  }
  handleSignOut(e) {
    e.preventDefault();
    //sign the user out and optionally redirect to given location
    userSession.signUserOut(window.location.origin);
  }

  //render checks if the user is signed in or not. If the user is signed in, Profile
  //component returns all the user data. If not, Signin component will sign the user in
  render() {
    return (
      <div className="site-wrapper">
        <div className="site-wrapper-inner">
          { !userSession.isUserSignedIn() ?
            <Signin userSession={userSession} handleSignIn={ this.handleSignIn } />
            : <Profile userSession={userSession} handleSignOut={ this.handleSignOut } />
          }
        </div>
      </div>
    );
  }

  componentDidMount() {
    //isSignInPending checks if there is a auth request that has not been handled
    //handlePendingSignIn try to process any pending sign in request by returning
    //a Promise that reolves to the user data object if the sign in succeeds
    //it loads the userData or not depending on the sign in determination
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        window.history.replaceState({}, document.title, "/")
        this.setState({ userData: userData})
      });
    }
  }

}
