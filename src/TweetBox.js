import React, { Component } from 'react';

class TweetBox extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tweet:  '',
    };

    this.onSubmitHandle    = this.onSubmitHandle.bind(this);
    this.onTweetChange  = this.onTweetChange.bind(this);
  }

  onSubmitHandle = (e) => {
    e.preventDefault();
    this.props.post(this.state.tweet);
  }

  onTweetChange = (e) => {
    this.setState({tweet: e.target.value});
  }


  render() {
    return (
      <div id="loginBox" className="col-md-6">
        <div className="panel panel-default">
          <div className="panel-heading">
      ツイートフォーム
          </div>
          <div className="panel-body">
            <form onSubmit={this.onSubmitHandle}>
              <div className="form-group">
                <label htmlFor="exampleInputEmail1">tweet</label>
                <textarea className="form-control" placeholder="なんでも" value={this.state.email} onChange={this.onEmailChange} />
              </div>
              <button type="submit" className="btn btn-default ">つぶやく</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default TweetBox;
