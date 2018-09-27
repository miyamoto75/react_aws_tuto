import React, { Component } from 'react';

class RegisterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email:  '',
      pass:  '',
      passConfirm:  '',
    };

    this.onSubmitHandle    = this.onSubmitHandle.bind(this);
    this.onEmailChange  = this.onEmailChange.bind(this);
    this.onPasswordConfirm = this.onPasswordConfirm.bind(this);
    this.onPasswordChange  = this.onPasswordChange.bind(this);

  }

  onSubmitHandle = (e) => {
    e.preventDefault();
    // console.log("form submitted.");
    console.log(this.signUp);
    this.props.signUp(this.state.email, this.state.pass);
    // this.props.signUp.bind(this);
  }

  onEmailChange = (e) => {
    this.setState({email: e.target.value});
  }

  onPasswordConfirm = (e) => {
    this.setState({passConfirm: e.target.value});
  }

  onPasswordChange = (e) => {
    this.setState({pass: e.target.value});
  }

  render() {

    var submitButton = '';
    if (this.state.pass !== this.state.passConfirm) {
      submitButton = <div className="alert alert-danger" role="alert">パスワードが一致しません</div>
    } else {
      submitButton = <button type="submit" className="btn btn-default loginButton">登録</button>
    }

    return (
      <div id="loginBox" className="col-md-6">
        <div className="panel panel-default">
          <div className="panel-heading">
            新規登録
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
              <div className="form-group">
                <label htmlFor="exampleInputPassword1">Password confirm</label>
                <input type="password" className="form-control" id="exampleConfirmPassword1" placeholder="confirm Password" value={this.state.passConfirm} onChange={this.onPasswordConfirm} />
              </div>

              {submitButton}

            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default RegisterForm;
