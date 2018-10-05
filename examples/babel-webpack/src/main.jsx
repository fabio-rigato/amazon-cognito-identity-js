import {Config, CognitoIdentityCredentials} from "aws-sdk";
import {
  CognitoUserPool,
  CognitoUserAttribute,
  AuthenticationDetails,
  CognitoUser
} from "amazon-cognito-identity-js";
import React from "react";
import ReactDOM from "react-dom";
import appConfig from "./config";

Config.region = appConfig.region;
Config.credentials = new CognitoIdentityCredentials({
  IdentityPoolId: appConfig.IdentityPoolId
});

const userPool = new CognitoUserPool({
  UserPoolId: appConfig.UserPoolId,
  ClientId: appConfig.ClientId,
});

let cognitoUser = null;

/**
 * SignUp class
 */

class SignUpForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  handleEmailChange(e) {
    this.setState({email: e.target.value});
  }

  handlePasswordChange(e) {
    this.setState({password: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    const email = this.state.email.trim();
    const password = this.state.password.trim();
    const attributeList = [
      new CognitoUserAttribute({
        Name: 'email',
        Value: email,
      })
    ];
    userPool.signUp(email, password, attributeList, null, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log('user name is ' + result.user.getUsername());
      console.log('call result: ' + result);
    });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <input type="text"
               value={this.state.email}
               placeholder="Email"
               onChange={this.handleEmailChange.bind(this)}/>
        <input type="password"
               value={this.state.password}
               placeholder="Password"
               onChange={this.handlePasswordChange.bind(this)}/>
        <input type="submit"/>
      </form>
    );
  }
}

/**
 * Log-in class
 */

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  handleEmailChange(e) {
    this.setState({email: e.target.value});
  }

  handlePasswordChange(e) {
    this.setState({password: e.target.value});
  }

  /**
   *  Handlers to User authentication
   */
  static handleOnSuccess(session, userConfirmationNecessary) {
    console.log('*********************** LoggedIN ************************');
    console.log('session: ', session);
    console.log('userConfirmationNecessary: ', userConfirmationNecessary);
    console.log('*********************************************************');
  }
  static handleOnFailure(error) {
    console.log('*********** error **********');
    console.log('error: ', error);
    console.log('****************************');
  }
  static handleNewPasswordRequired(userAttributes, requiredAttributes) {
    console.log('*********** newPasswordRequired **********');
    console.log('userAttributes: ', userAttributes);
    console.log('requiredAttributes: ', requiredAttributes);
    console.log('******************************************');
  }

  /**
   * Signing Method
   * @param e
   */
  handleSignin(e) {
    e.preventDefault();
    const email = this.state.email.trim();
    const password = this.state.password.trim();

    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password
    });
    cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool
    });

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: LoginForm.handleOnSuccess,
      onFailure: LoginForm.handleOnFailure,
      newPasswordRequired: LoginForm.handleNewPasswordRequired
    });
  }

  render() {
    return (
      <form onSubmit={this.handleSignin.bind(this)}>
        <input type="text"
               value={this.state.email}
               placeholder="Email"
               onChange={this.handleEmailChange.bind(this)}/>
        <input type="password"
               value={this.state.password}
               placeholder="Password"
               onChange={this.handlePasswordChange.bind(this)}/>
        <input type="submit"/>
      </form>
    );
  }
}

/**
 * Change Password Class
 */

class ChangePasswordForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      oldPassword: '',
      newPassword: '',
    };
  }

  handleOldPasswordChange(e) {
    this.setState({oldPassword: e.target.value});
  }

  handleNewPasswordChange(e) {
    this.setState({newPassword: e.target.value});
  }

  static handleNodeCallback(error, data) {
    console.log('*********** handleChangePassword **********');
    console.log('error: ', error);
    console.log('data: ', data);
    console.log('*******************************************');
  }

  /**
   * Signing Method
   * @param e
   */
  handleChangePassword(e) {
    e.preventDefault();
    const oldPassword = this.state.oldPassword.trim();
    const newPassword = this.state.newPassword.trim();

    cognitoUser.changePassword(oldPassword, newPassword, ChangePasswordForm.handleNodeCallback);
  }

  render() {
    return (
      <form onSubmit={this.handleChangePassword.bind(this)}>
        <input type="text"
               value={this.state.oldPassword}
               placeholder="Old Password"
               onChange={this.handleOldPasswordChange.bind(this)}/>
        <input type="password"
               value={this.state.newPassword}
               placeholder="New Password"
               onChange={this.handleNewPasswordChange.bind(this)}/>
        <input type="submit"/>
      </form>
    );
  }
}

ReactDOM.render(<SignUpForm />, document.getElementById('app'));
ReactDOM.render(<LoginForm />, document.getElementById('login'));
ReactDOM.render(<ChangePasswordForm />, document.getElementById('change-password'));

