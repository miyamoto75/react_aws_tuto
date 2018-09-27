import React, { Component } from 'react';

class ConfirmForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email:  '',
      code:  '',
    };

    this.onSubmitHandle    = this.onSubmitHandle.bind(this);
    this.onEmailChange  = this.onEmailChange.bind(this);
    this.onCode  = this.onCode.bind(this);

  }

  onSubmitHandle = (e) => {
    e.preventDefault();
    // console.log("form submitted.");
    console.log(this.signUp);
    this.props.confirmSignUp(this.state.email, this.state.code);
    // this.props.signUp.bind(this);
  }

  onEmailChange = (e) => {
    this.setState({email: e.target.value});
  }

  onCode = (e) => {
    this.setState({code: e.target.value});
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
            ユーザーを確認
          </div>
          <div className="panel-body">
            <form onSubmit={this.onSubmitHandle}>
              <div className="form-group">
                <label htmlFor="exampleInputEmail1">Email address</label>
                <input type="email" className="form-control" id="exampleInputEmail1" placeholder="Email" value={this.state.email} onChange={this.onEmailChange} />
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputPassword1">確認コード</label>
                <input type="input" className="form-control" id="exampleConfirmPassword1" placeholder="confirm Password" value={this.state.code} onChange={this.onCode} />
              </div>

              {submitButton}

            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default ConfirmForm;
