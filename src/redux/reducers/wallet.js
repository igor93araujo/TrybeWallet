// Esse reducer será responsável por tratar o todas as informações relacionadas as despesas
import {
  DELETE_EXPENSE,
  EDIT_EXPENSE, GET_CURRENCIES, SAVE_FORM_DATA, START_EDIT } from '../actions';

const INITIAL_STATE = {
  currencies: [], // array de string
  expenses: [], // array de objetos, com cada objeto tendo as chaves id, value, currency, method, tag, description e exchangeRates
  editor: false, // valor booleano que indica de uma despesa está sendo editada
  idToEdit: 0, // valor numérico que armazena o id da despesa que esta sendo editada
};

const walletReducer = (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
  case GET_CURRENCIES:
    delete payload.USDT;
    return {
      ...state,
      currencies: Object.keys(payload),
    };
  case SAVE_FORM_DATA:
    return {
      ...state,
      expenses: [...state.expenses, payload],
    };
  case DELETE_EXPENSE:
    return {
      ...state,
      expenses: state.expenses.filter((e) => e.id !== payload),
    };
  case START_EDIT:
    return {
      ...state,
      editor: true,
      idToEdit: payload,
    };
  case EDIT_EXPENSE:
    return {
      ...state,
      expenses:
      state.expenses.map(
        (expense) => (expense.id === state.idToEdit
          ? { ...payload } : expense),
      ),
      idToEdit: 0,
      editor: false,
    };
  default:
    return state;
  }
};

export default walletReducer;
