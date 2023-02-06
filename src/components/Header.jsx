import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CgProfile } from 'react-icons/cg';
import trybewalletlogo from '../images/logo.png';
import currancyLogo from '../images/vector.png';

class Header extends Component {
  render() {
    const { userEmail, expenses } = this.props;
    const total = expenses.reduce((sum, { value, currency, exchangeRates }) => {
      const { ask } = exchangeRates[currency];
      return sum + (Number(value) * Number(ask));
    }, 0).toFixed(2);

    return (
      <section className="headerConteiner">
        <img src={ trybewalletlogo } alt="logotrybewallet" className="logoImgHeader" />
        <div className="headerCurrLogo">
          <img src={ currancyLogo } alt="logoCurrancy" className="logoCurrancy" />
          <p>Total de despesas:</p>
          <p data-testid="total-field">
            {

              total

            }
          </p>
          <p data-testid="header-currency-field">BRL</p>
        </div>
        <div className="logo-email">
          <CgProfile className="profileLogo" />
          <p data-testid="email-field">
            { userEmail.email}
          </p>
        </div>
      </section>
    );
  }
}

const mapStateToProps = (state) => ({
  userEmail: state.user,
  expenses: state.wallet.expenses,
});

Header.propTypes = {
  email: PropTypes.string,
}.isRequired;

export default connect(mapStateToProps)(Header);
