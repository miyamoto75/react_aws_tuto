import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Hello from './Hello';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ConfirmForm from './ConfirmForm';

import AWS from "aws-sdk";
import appConfig from './appConfig';
import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";


AWS.config.region = appConfig.region;
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: appConfig.IdentityPoolId
});

const userPool = new CognitoUserPool({
  UserPoolId: appConfig.UserPoolId,
  ClientId: appConfig.ClientId,
});

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      errorMessage: "",
      stage: "register"
    }


    // この例では関数内でthisを使用するため、thisをbind
    this.bindFunc = this.sendUser.bind(this);

    // confirmation func
    this.bindFunc2 = this.confirmUser.bind(this);

    this.bindFunc3 = this.loginUser.bind(this);
  }

  sendUser = (email, pass) => {
    console.log(this);
    const attributeList = [
      new CognitoUserAttribute({
        Name: 'email',
        Value: email,
      })
    ];
    userPool.signUp(email, pass, attributeList, null, (err, result) => {
      if (err) {
        console.log(err);
        console.log(result);
        this.setState({errorMessage: err.message});
        return;
      }
      console.log('user email is ' + result.user.getEmail());
      console.log('call result: ' + result);
    });
  }

  confirmUser = (email, code) => {
    console.log("inside confirmUser : " + this);

    var userData = {
        Username : email,
        Pool : userPool
    };

    var cognitoUser = new CognitoUser(userData);
    cognitoUser.confirmRegistration(code, true, function(err, result) {
      if (err) {
        console.log(err);
        this.setState({errorMessage: err.message});
        return;
      }
      console.log('call result: ' + result);
      alert(result);
    });
  }

  loginUser = (email, pass) => {
    console.log("inside loginUser : " + this);
    var comp = this;

    var authenticationData = {
      Username : email,
      Password : pass,
    };
    var authenticationDetails = new AuthenticationDetails(authenticationData);
    var userData = {
      Username : email,
      Pool : userPool
    };
    var cognitoUser = new CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        console.log(result);
        var accessToken = result.getAccessToken().getJwtToken();

        /* Use the idToken for Logins Map when Federating User Pools with identity pools or when passing through an Authorization Header to an API Gateway Authorizer*/
        var idToken = result.idToken.jwtToken;

        var cognitoUser = userPool.getCurrentUser();

        if (cognitoUser != null) {
          cognitoUser.getSession(function(err, result) {
            if (result) {
              console.log('You are now logged in.');

              // Add the User's Id Token to the Cognito credentials login map.
              AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: appConfig.IdentityPoolId,
                Logins: {
                  "cognito-idp.ap-northeast-1.amazonaws.com/ user pool id" : result.getIdToken().getJwtToken()
                }
              });
console.log(AWS.config.credentials);
              comp.setState({stage: "tweet"});

            }
          });
        }

      },

      onFailure: function(err) {
        console.log(err);
        comp.setState({errorMessage: err.message});
      },

    });

    // var userData = {
    //     Username : email,
    //     Pool : userPool
    // };

    // var cognitoUser = new CognitoUser(userData);
    // cognitoUser.confirmRegistration(code, true, function(err, result) {
    //   if (err) {
    //     console.log(err);
    //     return;
    //   }
    //   console.log('call result: ' + result);
    //   alert(result);
    // });
  }

  changeStage = (stage) => {
  }

  render() {

    var stageForm = "";
    switch (this.state.stage) {
      case "register":
        stageForm = <RegisterForm signUp={this.bindFunc} />;
        break;
      case "confirm":
        stageForm = <ConfirmForm confirmSignUp={this.bindFunc2} />;
        break;
    
      case "login":
        stageForm = <LoginForm login={this.bindFunc3} />;
        break;
    }

    return (
      <React.Fragment>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
          </p>
        </div>

        <div className="container">
          <div className="alert alert-danger" role="alert">{this.state.errorMessage}</div>
          <Hello />

          <div className="row">
            {stageForm}
          </div>

          <div className="row">
          <button className="btn btn-default" onClick={() => this.setState({stage: "register"})}>新規登録</button>
          <button className="btn btn-default" onClick={() => this.setState({stage: "confirm"})}>ユーザーを認証</button>
          <button className="btn btn-default" onClick={() => this.setState({stage: "login"})}>ログイン</button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
