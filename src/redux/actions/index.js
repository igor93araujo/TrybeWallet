// Coloque aqui suas actions

export const SAVE_USER_EMAIL = 'SAVE_USER_EMAIL';
// export const REQUEST_API = 'REQUEST_API';
export const GET_CURRENCIES = 'GET_CURRENCIES';
export const GET_ERROR = 'GET_ERROR';
export const SAVE_FORM_DATA = 'SAVE_FORM_DATA';
export const DELETE_EXPENSE = 'DELETE_EXPENSE';
export const START_EDIT = 'START_EDIT';
export const EDIT_EXPENSE = 'EDIT_EXPENSE';

// ACTION CREATOR
export const SaveUserEmail = (payload) => ({
  type: SAVE_USER_EMAIL,
  payload,
});

export const getCurrencies = (payload) => ({
  type: GET_CURRENCIES,
  payload,
});

export const requestError = (error) => ({
  type: GET_ERROR,
  error,
});

export const saveFormData = (payload) => ({
  type: SAVE_FORM_DATA,
  payload,
});

export const deleteExpense = (id) => ({
  type: DELETE_EXPENSE,
  payload: id,
});

export const startEdit = (id) => ({
  type: START_EDIT,
  payload: id,
});

export const actionEditExpense = (payload) => ({
  type: EDIT_EXPENSE,
  payload,
});

export const requestAPI = async () => {
  const response = await fetch('https://economia.awesomeapi.com.br/json/all');
  const data = await response.json();
  return data;
};

export const fetchCurrencies = () => async (dispatch) => {
  try {
    const data = await requestAPI();
    dispatch(getCurrencies(data));
    return data;
  } catch (error) {
    dispatch(requestError(error));
  }
};
