import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  actionEditExpense, fetchCurrencies, requestAPI, saveFormData } from '../redux/actions';
import '../App.css';
import Table from './Table';

class WalletForm extends Component {
  state = {
    value: '',
    currency: 'USD',
    method: 'Dinheiro',
    tag: 'Alimentação',
    description: '',
    id: 0,
    exchangeRates: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchCurrencies());
  }

  handleChange = ({ target: { value, name } }) => {
    this.setState({
      [name]: value,
    });
  };

  addExpense = async () => {
    const { dispatch, expenses } = this.props;
    const elements = await requestAPI();

    this.setState({
      id: expenses.length,
      exchangeRates: elements,
    }, () => {
      dispatch(saveFormData(this.state));
      const inicialState = {
        value: '',
        currency: 'USD',
        method: 'Dinheiro',
        tag: 'Alimentação',
        description: '',
        id: 0,
      };

      this.setState({ ...inicialState });
    });
  };

  editExpense = async () => {
    const { dispatch, idToEdit } = this.props;
    const elements = await requestAPI();
    this.setState({
      id: idToEdit,
      exchangeRates: elements,
    }, () => dispatch(actionEditExpense(this.state)));
  };

  handleExpense = async () => {
    const { editor } = this.props;
    if (editor) {
      this.editExpense();
      return;
    }
    this.addExpense();
  };

  render() {
    const { value, currency, method, tag, description } = this.state;
    const { currencies, editor } = this.props;
    return (
      <>
        <div className="walletConteiner">
          <form className="walletConteinerForm">
            <div className="expenseDescription">
              <p>Descrição da Despesa</p>
              <input
                type="text"
                name="description"
                id="description"
                value={ description }
                onChange={ this.handleChange }
                data-testid="description-input"
                className="descriptionInput"
              />
            </div>
            <p>Categoria da despesa</p>
            <select
              name="tag"
              id="tag"
              onChange={ this.handleChange }
              value={ tag }
              data-testid="tag-input"
              className="categoryInput"
            >
              <option value="Alimentação">Alimentação</option>
              <option value="Lazer">Lazer</option>
              <option value="Trabalho">Trabalho</option>
              <option value="Transporte">Transporte</option>
              <option value="Saúde">Saúde</option>
            </select>
            <p className="valor">Valor</p>
            <input
              type="number"
              name="value"
              id="value"
              value={ value }
              onChange={ this.handleChange }
              data-testid="value-input"
            />
            <p>Moeda</p>
            <select
              name="currency"
              id="currency"
              value={ currency }
              onChange={ this.handleChange }
              data-testid="currency-input"
            >
              {currencies.map((currencyItem, index) => (
                <option
                  key={ index }
                >
                  {currencyItem}
                </option>
              ))}
            </select>
            <p>Método de pagamento</p>
            <select
              name="method"
              id="method"
              value={ method }
              onChange={ this.handleChange }
              data-testid="method-input"
            >
              <option value="Dinheiro">Dinheiro</option>
              <option value="Cartão de crédito">Cartão de crédito</option>
              <option value="Cartão de débito">Cartão de débito</option>
            </select>
          </form>
          <button
            type="button"
            onClick={ this.handleExpense }
            className="expenseBtn"
          >
            {editor ? 'Editar' : 'Adicionar'}
            {' '}
            despesa
          </button>
        </div>
        <section>
          <Table />
        </section>
      </>

    );
  }
}

WalletForm.propTypes = {
  currencies: PropTypes.shape({
    map: PropTypes.func,
  }),
  dispatch: PropTypes.func,
  editor: PropTypes.bool,
  expenses: PropTypes.shape({
    length: PropTypes.number,
  }),
  idToEdit: PropTypes.number,
}.isRequired;

const mapStateToProps = (state) => ({
  currencies: state.wallet.currencies,
  expenses: state.wallet.expenses,
  editor: state.wallet.editor,
  idToEdit: state.wallet.idToEdit,
});
export default connect(mapStateToProps)(WalletForm);
