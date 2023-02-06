import { screen } from '@testing-library/react';
import { legacy_createStore as createStore, applyMiddleware } from 'redux';
import userEvent from '@testing-library/user-event';
import thunk from 'redux-thunk';
import { renderWithRouterAndRedux } from '../helpers/renderWith';
import rootReducer from '../../redux/reducers';
import App from '../../App';

const INVALID_EMAIL = 'teste.com';
const INVALID_PASSWORD = '12';
const VALID_EMAIL = 'teste@teste.com';
const VALID_PASSWORD = '123456';
const EMAIL_INPUT = 'email-input';
const PASSWORD_INPUT = 'password-input';

describe('Cadastro Tela Inicial', () => {
  test('Testa os elementos da tela de login', () => {
    const initialEntries = ['/'];
    renderWithRouterAndRedux(<App />, { initialEntries });
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument();
    expect(screen.getByTestId(EMAIL_INPUT)).toBeInTheDocument();
    expect(screen.getByTestId(PASSWORD_INPUT)).toBeInTheDocument();
  });

  test('Testa os inputs', () => {
    const initialEntries = ['/'];
    renderWithRouterAndRedux(<App />, { initialEntries });
    const inputEmail = screen.getByTestId(EMAIL_INPUT);
    const inputPassword = screen.getByTestId(PASSWORD_INPUT);
    const button = screen.getByRole('button', { name: 'Entrar' });

    userEvent.type(inputEmail, INVALID_EMAIL);
    userEvent.type(inputPassword, INVALID_PASSWORD);
    userEvent.clear(inputEmail);
    userEvent.clear(inputPassword);

    expect(button).toBeDisabled();

    userEvent.type(inputEmail, VALID_EMAIL);
    userEvent.type(inputPassword, VALID_PASSWORD);

    expect(button).toBeEnabled();
  });

  test('Testa a mudança de tela', () => {
    const initialEntries = ['/'];
    const { history } = renderWithRouterAndRedux(<App />, { initialEntries });
    const inputEmail = screen.getByTestId(EMAIL_INPUT);
    const inputPassword = screen.getByTestId(PASSWORD_INPUT);
    const button = screen.getByRole('button', { name: 'Entrar' });

    // testando btn desabilitado e permanencia na pag com email e senha invalidos
    userEvent.type(inputEmail, INVALID_EMAIL);
    userEvent.type(inputPassword, INVALID_PASSWORD);
    expect(button).toBeDisabled();
    userEvent.click(button);
    expect(history.location.pathname).toBe('/');
    userEvent.clear(inputEmail);
    userEvent.clear(inputPassword);

    // testando btn desabilitado e permanencia na pag com email inv e senha valida
    userEvent.type(inputEmail, 'test@');
    userEvent.type(inputPassword, VALID_PASSWORD);
    expect(button).toBeDisabled();
    userEvent.click(button);
    expect(history.location.pathname).toBe('/');
    userEvent.clear(inputEmail);
    userEvent.clear(inputPassword);

    userEvent.type(inputEmail, 'test@test');
    userEvent.type(inputPassword, VALID_PASSWORD);
    expect(button).toBeDisabled();
    userEvent.click(button);
    expect(history.location.pathname).toBe('/');
    userEvent.type(inputEmail, '.com');
    expect(button).toBeEnabled();
    userEvent.clear(inputEmail);
    userEvent.clear(inputPassword);

    userEvent.type(inputEmail, VALID_EMAIL);
    userEvent.type(inputPassword, 'a1sd2');
    expect(button).toBeDisabled();
    userEvent.click(button);
    expect(history.location.pathname).toBe('/');
    userEvent.clear(inputEmail);
    userEvent.clear(inputPassword);

    userEvent.type(inputEmail, VALID_EMAIL);
    userEvent.type(inputPassword, VALID_PASSWORD);
    expect(button).toBeEnabled();

    userEvent.click(button);

    expect(history.location.pathname).toBe('/carteira');
  });

  test('Testa se está salvando o email na Store', () => {
    const initialEntries = ['/'];
    const initialState = {
      user: {
        email: '',
      },
      wallet: {
        currencies: [],
        expenses: [],
        editor: false,
        idToEdit: 0,
      },
    };
    const store = createStore(rootReducer, initialState, applyMiddleware(thunk));
    const { history } = renderWithRouterAndRedux(<App />, { initialEntries, store });

    const inputEmail = screen.getByTestId(EMAIL_INPUT);
    const inputPassword = screen.getByTestId(PASSWORD_INPUT);
    const button = screen.getByRole('button', { name: 'Entrar' });

    expect(button).toBeDisabled();

    userEvent.type(inputEmail, VALID_EMAIL);
    userEvent.type(inputPassword, VALID_PASSWORD);
    expect(button).toBeEnabled();

    userEvent.click(button);
    const currentState = store.getState();

    expect(currentState.user).toEqual({ email: VALID_EMAIL });
    expect(history.location.pathname).toBe('/carteira');
  });
});
