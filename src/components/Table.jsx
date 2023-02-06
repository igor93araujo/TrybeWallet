import React, { Component } from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import { FiEdit } from 'react-icons/fi';
import { AiOutlineDelete } from 'react-icons/ai';
import { deleteExpense, startEdit } from '../redux/actions';

class Table extends Component {
  removeExpense = (id) => {
    const { dispatch } = this.props;
    dispatch(deleteExpense(id));
  };

  handleStartEdit = (id) => {
    const { dispatch } = this.props;
    dispatch(startEdit(id));
  };

  render() {
    const { expenses } = this.props;
    return (
      <div>
        <table className="expensesTable">
          <thead>
            <tr>
              <th>
                Descrição
              </th>
              <th>
                Tag
              </th>
              <th>
                Método de pagamento
              </th>
              <th>
                Valor
              </th>
              <th>
                Moeda
              </th>
              <th>
                Câmbio utilizado
              </th>
              <th>
                Valor convertido
              </th>
              <th>
                Moeda de conversão
              </th>
              <th>
                Editar/Excluir
              </th>
            </tr>
          </thead>
          <tbody>
            {
              expenses.length === 0
                ? <p className="noExpensesMsg">Ainda não há despesas cadastradas </p>
                : expenses.map((
                  { id, description, tag, method, value, exchangeRates, currency },
                ) => (
                  <tr key={ id }>
                    <td>
                      {description}
                    </td>
                    <td>
                      {tag}
                    </td>
                    <td>
                      {method}
                    </td>
                    <td>
                      {Number(value).toFixed(2)}
                    </td>
                    <td>
                      {exchangeRates[currency].name}
                    </td>
                    <td>
                      {Number(exchangeRates[currency].ask).toFixed(2)}
                    </td>
                    <td>
                      {Number(exchangeRates[currency].ask
                    * value).toFixed(2)}
                    </td>
                    <td>
                      Real
                    </td>
                    <td>
                      <button
                        type="button"
                        data-testid="edit-btn"
                        onClick={ () => this.handleStartEdit(id) }
                        className="editBtn"
                      >
                        <FiEdit />

                      </button>
                      <button
                        type="button"
                        data-testid="delete-btn"
                        onClick={ () => this.removeExpense(id) }
                        className="deleteBtn"
                      >
                        <AiOutlineDelete />

                      </button>
                    </td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>
    );
  }
}

Table.propTypes = {
  expenses: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    currency: PropTypes.string,
    method: PropTypes.string,
    tag: PropTypes.string,
    description: PropTypes.string,
  })).isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  expenses: state.wallet.expenses,
});

export default connect(mapStateToProps)(Table);
