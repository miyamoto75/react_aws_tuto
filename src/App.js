import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom'

import logo from './logo.svg';
import './App.css';

import Hello from './Hello';
import Home from './Home';
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
    }


    // この例では関数内でthisを使用するため、thisをbind
    this.bindFunc = this.sendUser.bind(this);

    // confirmation func
    this.bindFunc2 = this.confirmUser.bind(this);

    this.bindFunc3 = this.loginUser.bind(this);

    this.bindFunc4 = this.submitTweet.bind(this);


    var comp = this;
    var cognitoUser = userPool.getCurrentUser();
    if (cognitoUser != null) {
      cognitoUser.getSession(function(err, session) {
        if (err) {
          alert(err.message || JSON.stringify(err));
          return;
        }
        console.log('session validity: ' + session.isValid());

        const idp_login = `cognito-idp.ap-northeast-1.amazonaws.com/${appConfig.UserPoolId}` 
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: appConfig.IdentityPoolId,
          Logins : {
            // Change the key below according to the specific region your user pool is in.
            [idp_login]: session.getIdToken().getJwtToken()
          }
        });
        comp.state = {errorMessage: ""};

      });
    }
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
        const idp_login = `cognito-idp.ap-northeast-1.amazonaws.com/${appConfig.UserPoolId}` 
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId : appConfig.IdentityPoolId, // your identity pool id here
          Logins : {
            // Change the key below according to the specific region your user pool is in.
            [idp_login]: result.getIdToken().getJwtToken()
          }
        });

        //refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
        AWS.config.credentials.refresh((error) => {
          if (error) {
            console.error(error);
          } else {
            // Instantiate aws sdk service objects now that the credentials have been updated.
            // example: var s3 = new AWS.S3();
            console.log('Successfully logged!');
          }
        });

      },


      onFailure: function(err) {
        console.log(err);
        comp.setState({errorMessage: err.message});
      },

    });
  }

  submitTweet = (tweet) => {
    console.log(`tweet : ${tweet}`);
    // Make the call to obtain credentials
    AWS.config.credentials.get(function(){

      // Credentials will be available when this function is called.
      var accessKeyId = AWS.config.credentials.accessKeyId;
      var secretAccessKey = AWS.config.credentials.secretAccessKey;
      var sessionToken = AWS.config.credentials.sessionToken;
      console.log(AWS.config.credentials.accessKeyId);

      const identity = AWS.config.credentials.identityId;
      console.log("identity id : " + AWS.config.credentials.identityId);
      // get dynamo client
      const dynamo = new AWS.DynamoDB({
        accessKeyId:     accessKeyId,
        secretAccessKey: secretAccessKey,
        sessionToken:    sessionToken,
      });
      console.log(dynamo);

      // push to dynamo
      var params = {
        Item: {
          "user_id": {S: identity}, 
          "created_at": {N: String(+new Date())}, 
          "message": {S: tweet},
        }, 
        ReturnConsumedCapacity: "TOTAL", 
        TableName: appConfig.TableName
      };

      dynamo.putItem(params, (err, data) => {
        if (err) {
          console.log(err, err.stack);
        } else {
          console.log(data);
        }
      });

    });

    // console.log("ak " + accessKeyId);
    // console.log("sec " + secretAccessKey);
    // console.log("sess " + sessionToken);

  }


  render() {

    const error_box = (this.state.errorMessage) ? 
          <div className="alert alert-danger" role="alert">{this.state.errorMessage}</div>
      : "";

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
          {error_box}
          <Hello />
        </div>

        <hr />

        <BrowserRouter>
          <div className="container">
          
          <div className="row" style={{height: "400px"}}>
            <Route exact path='/'   component={Home} />
            <Route path='/register' component={() => <RegisterForm signUp={this.bindFunc}         />} />
            <Route path='/confirm'  component={() => <ConfirmForm  confirmSignUp={this.bindFunc2} />} />
            <Route path='/login'    component={() => <LoginForm    login={this.bindFunc3}         />} />
            <Route path='/tweet'    component={() => <TweetBox     post={this.bindFunc4}          />} />
          </div>

          <hr />

          <div className="row">
            <Link className="btn btn-primary" to='/register'>新規登録</Link>
            <Link className="btn btn-default" to='/confirm'>ユーザーを認証</Link>
            <Link className="btn btn-success" to='/login'>ログイン</Link>
            <Link className="btn btn-warning" to='/tweet'>つぶやく</Link>
            <Link className="btn btn-link"    to='/'>Home</Link>
          </div>

          </div>
        </BrowserRouter>
      </React.Fragment>
    );
  }
}

export default App;
