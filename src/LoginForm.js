import React, { Component } from 'react';

class LoginForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email:  '',
      pass:  '',
    };

    this.onSubmitHandle    = this.onSubmitHandle.bind(this);
    this.onEmailChange  = this.onEmailChange.bind(this);
    this.onPasswordChange  = this.onPasswordChange.bind(this);

  }

  onSubmitHandle = (e) => {
    e.preventDefault();
    this.props.login(this.state.email, this.state.pass);
  }

  onEmailChange = (e) => {
    this.setState({email: e.target.value});
  }

  onPasswordChange = (e) => {
    this.setState({pass: e.target.value});
  }

  render() {
    return (
      <div id="loginBox" className="row col-md-6">
        <div className="panel panel-default">
          <div className="panel-heading">
      ログイン
          </div>
          <div className="panel-body">
            <form onSubmit={this.onSubmitHandle}>
              <div className="form-group">
                <label htmlFor="exampleInputEmail1">Email address</label>
                <input type="email" className="form-control" id="exampleInputEmail1" placeholder="Email" value={this.state.email} onChange={this.onEmailChange} />
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputPassword1">Password</label>
                <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" value={this.state.pass} onChange={this.onPasswordChange} />
              </div>
              <button type="submit" className="btn btn-default loginButton">ログイン</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginForm;
