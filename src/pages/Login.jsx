import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { SaveUserEmail } from '../redux/actions';

import trybewalletlogo from '../images/logo.png';

class Login extends React.Component {
  state = {
    email: '',
    validEmail: false,
    password: '',
    validPassword: false,
  };

  verifyEmail = ({ target: { value } }) => {
    const validaEmail = (/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g).test(value);

    this.setState({
      validEmail: validaEmail,
      email: value,
    });
  };

  verifyPassword = ({ target: { value } }) => {
    const minLength = 6;
    const validaPassword = value.length >= minLength;
    this.setState({
      validPassword: validaPassword,
      password: value,
    });
  };

  handleClick = () => {
    const { email } = this.state;
    const { history, dispatch } = this.props;
    dispatch(SaveUserEmail(email));
    return history.push('/carteira');
  };

  render() {
    const {
      password,
      email,
      validPassword,
      validEmail,
    } = this.state;

    return (
      <div className="mainLogin">
        <div className="loginConteiner">
          <img src={ trybewalletlogo } alt="logotrybewallet" className="logoImg" />
          <form action="form">
            <input
              type="email"
              name="email"
              id="email"
              value={ email }
              data-testid="email-input"
              onChange={ this.verifyEmail }
              className="loginInput"
              placeholder="E-mail"
            />
            <input
              type="password"
              name="password"
              id="password"
              value={ password }
              data-testid="password-input"
              onChange={ this.verifyPassword }
              className="loginInput"
              placeholder="Senha"
            />
          </form>
          <button
            type="button"
            disabled={ (validEmail && validPassword) === false }
            onClick={ this.handleClick }
            className="loginBtn"
          >
            Entrar
          </button>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect()(Login);
