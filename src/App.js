import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Hello from './Hello';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ConfirmForm from './ConfirmForm';
import TweetBox from './TweetBox';

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

    this.bindFunc4 = this.submitTweet.bind(this);
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
const comp = this;

    var cognitoUser = new CognitoUser(userData);
    cognitoUser.confirmRegistration(code, true, function(err, result) {
      if (err) {
        console.log(err);
        comp.setState({errorMessage: err.message});
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
              // AWS.config.credentials = new AWS.CognitoIdentityCredentials({
              const idp = `cognito-idp.ap-northeast-1.amazonaws.com/${appConfig.UserPoolId}` 
              const resp = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: appConfig.IdentityPoolId,
                Logins: {
                   : result.getIdToken().getJwtToken()
                }
              });
              console.log(resp);

              // AWS.config.credentials.get(function(){

              //   // Credentials will be available when this function is called.
              //   var accessKeyId = AWS.config.credentials.accessKeyId;
              //   var secretAccessKey = AWS.config.credentials.secretAccessKey;
              //   var sessionToken = AWS.config.credentials.sessionToken;
              //   console.log(AWS.config.credentials.accessKeyId);

              // });

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
  }

  submitTweet = (tweet) => {
    // Make the call to obtain credentials
    AWS.config.credentials.get(function(){

      // Credentials will be available when this function is called.
      var accessKeyId = AWS.config.credentials.accessKeyId;
      var secretAccessKey = AWS.config.credentials.secretAccessKey;
      var sessionToken = AWS.config.credentials.sessionToken;
      // console.log(AWS.config.credentials.accessKeyId);

    });

    const identity = AWS.config.credentials.identityId;
    console.log("identity id : " + AWS.config.credentials.identityId);
    // console.log("ak " + accessKeyId);
    // console.log("sec " + secretAccessKey);
    // console.log("sess " + sessionToken);

    // get dynamo client
    // const dynamo = new AWS.DynamoDB({
    //   accessKeyId:     accessKeyId,
    //   secretAccessKey: secretAccessKey,
    //   sessionToken:    sessionToken,
    // });
    // console.log(dynamo);

    // // push to dynamo
    // var params = {
    //   Item: {
    //     "user_id": {S: identity}, 
    //     "created_at": {N: String(+new Date())}, 
    //     "message": {S: tweet},
    //   }, 
    //   ReturnConsumedCapacity: "TOTAL", 
    //   TableName: appConfig.TableName
    // };

    // dynamo.putItem(params, (err, data) => {
    //   if (err) {
    //     console.log(err, err.stack);
    //   } else {
    //     console.log(data);
    //   }
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
      case "tweet":
        stageForm = <TweetBox post={this.bindFunc4} />;
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
