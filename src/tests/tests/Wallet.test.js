import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import App from '../../App';
import mockData from '../helpers/mockData';
import { renderWithRouterAndRedux } from '../helpers/renderWith';

const VALID_EMAIL = 'email@email.com';
const VALID_PASSWORD = '123456';
const EMAIL_INPUT = 'email-input';
const PASSWORD_INPUT = 'password-input';
const EMAIL_FIELD = 'email-field';
const HEADER_CURRENCY_FIELD = 'header-currency-field';
const CURRENCY_INPUT = 'currency-input';
const VALUE_INPUT = 'value-input';
const METHOD_INPUT = 'method-input';
const TAG_INPUT = 'tag-input';
const DESCRIPTION_INPUT = 'description-input';
const TOTAL_FIELD = 'total-field';
const CARTÂO_CREDITO = 'Cartão de débito';

describe('Teste o componente Wallet', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(mockData),
    }));
    renderWithRouterAndRedux(<App />);
    userEvent.type(screen.getByTestId(EMAIL_INPUT), VALID_EMAIL);
    userEvent.type(screen.getByTestId(PASSWORD_INPUT), VALID_PASSWORD);
    userEvent.click(screen.getByRole('button', { name: /entrar/i }));
  });

  it('Possui um cabeçalho com o e-mail digitado no login, valor em dinheiro e a moeda brasileira', () => {
    expect(screen.getByTestId(EMAIL_FIELD)).toHaveTextContent(VALID_EMAIL);
    expect(screen.getByTestId(TOTAL_FIELD)).toBeInTheDocument();
    expect(screen.getByTestId(TOTAL_FIELD)).toHaveTextContent('0.00');
    expect(screen.getByTestId(HEADER_CURRENCY_FIELD)).toBeInTheDocument();
    expect(screen.getByTestId(HEADER_CURRENCY_FIELD)).toHaveTextContent('BRL');
  });

  it('Possui a entrada de valor, moeda, método, tag, descrição e botão adicionar', () => {
    expect(screen.getByTestId(VALUE_INPUT)).toBeInTheDocument();
    expect(screen.getByTestId(CURRENCY_INPUT)).toBeInTheDocument();
    expect(screen.getByTestId(METHOD_INPUT)).toBeInTheDocument();
    expect(screen.getByTestId(TAG_INPUT)).toBeInTheDocument();
    expect(screen.getByTestId(DESCRIPTION_INPUT)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /adicionar despesa/i })).toBeInTheDocument();
  });

  it('Entrada de moeda tem as siglas específicas', async () => {
    const currenciesValue = ['USD', 'CAD', 'GBP', 'ARS', 'BTC', 'LTC', 'EUR', 'JPY',
      'CHF', 'AUD', 'CNY', 'ILS', 'ETH', 'XRP', 'DOGE'];
    const currencyInput = await screen.findByTestId(CURRENCY_INPUT);
    currenciesValue.forEach((currency) => {
      userEvent.selectOptions(currencyInput, currency);
      expect(currencyInput).toHaveValue(currency);
    });
  });

  it('A entrada de moeda tem as siglas específicas', () => {
    const methodsValue = ['Dinheiro', 'Cartão de crédito', CARTÂO_CREDITO];
    methodsValue.forEach((method) => {
      userEvent.selectOptions(screen.getByTestId(METHOD_INPUT), method);
      expect(screen.getByTestId(METHOD_INPUT)).toHaveValue(method);
    });
  });

  it('A entrada de tag tem as siglas específicas', () => {
    const tagsValue = ['Alimentação', 'Transporte', 'Lazer', 'Saúde', 'Trabalho'];
    tagsValue.forEach((tag) => {
      userEvent.selectOptions(screen.getByTestId(TAG_INPUT), tag);
      expect(screen.getByTestId(TAG_INPUT)).toHaveValue(tag);
    });
  });

  it('Possui uma tabela que tem um cabeçalho com os campos específicos', () => {
    const tableHeaderList = [
      'Descrição', 'Tag', 'Método de pagamento',
      'Valor', 'Moeda', 'Câmbio utilizado',
      'Valor convertido', 'Moeda de conversão', 'Editar/Excluir',
    ];
    expect(screen.getAllByRole('columnheader')).toHaveLength(tableHeaderList.length);
    tableHeaderList.forEach((tableHeader) => {
      expect(screen.getByRole('columnheader', { name: tableHeader })).toBeInTheDocument();
    });
  });

  it('Ao clicar no botão "Excluir" a informação do respectivo elemento é removida da tabela', async () => {
    const expenseForTest = {
      value: '10.00',
      description: 'Dez dólares',
      currency: 'USD',
      method: CARTÂO_CREDITO,
      tag: 'Trabalho',
      ask: '4.75',
      currencyExtensive: 'Dólar Americano/Real Brasileiro',
      valueConverted: '47.53',
      currencyConverted: 'Real',
      total: (10 * 4.7531).toFixed(2),
    };

    const { value, description } = expenseForTest;

    userEvent.type(screen.getByTestId(VALUE_INPUT), value);
    userEvent.type(screen.getByTestId(DESCRIPTION_INPUT), description);
    userEvent.click(screen.getByRole('button', { name: /adicionar despesa/i }));

    expect(await screen.findByRole('cell', { name: value })).toBeInTheDocument();
    expect(await screen.findByRole('cell', { name: description })).toBeInTheDocument();

    userEvent.click(await screen.findByTestId('delete-btn'));

    expect(screen.queryByRole('cell', { name: value })).not.toBeInTheDocument();
    expect(screen.queryByRole('cell', { name: description })).not.toBeInTheDocument();
  });

  it('Ao clicar no botão "Editar" é possível alterar as informações da despesa escolhida', async () => {
    const expenseForTest = {
      value: '10.00',
      description: 'Dez dólares',
      currency: 'USD',
      method: 'Cartão de débito',
      tag: 'Trabalho',
      ask: '4.75',
      currencyExtensive: 'Dólar Americano/Real Brasileiro',
      valueConverted: '47.53',
      currencyConverted: 'Real',
      total: (10 * 4.7531).toFixed(2),
    };
    const expenseForTest02 = {
      value: '2.00',
      description: 'Dois Bitcoins',
      currency: 'BTC',
      method: 'Cartão de crédito',
      tag: 'Lazer',
      ask: '147.235',
      currencyExtensive: 'Bitcoin/Real Brasileiro',
      valueConverted: '294.470',
      currencyConverted: 'Real',
      total: (2 * 147.235).toFixed(2),
    };
    const { value, description } = expenseForTest;

    userEvent.type(screen.getByTestId(VALUE_INPUT), value);
    userEvent.type(screen.getByTestId(DESCRIPTION_INPUT), description);
    userEvent.click(screen.getByRole('button', { name: /adicionar despesa/i }));

    expect(await screen.findByRole('cell', { name: value })).toBeInTheDocument();
    expect(await screen.findByRole('cell', { name: description })).toBeInTheDocument();

    userEvent.click(screen.getByTestId('edit-btn'));

    userEvent.type(screen.getByTestId(VALUE_INPUT), expenseForTest02.value);
    userEvent.type(screen.getByTestId(DESCRIPTION_INPUT), expenseForTest02.description);
    userEvent.click(screen.getByRole('button', { name: /editar despesa/i }));

    expect(await screen.findByRole('cell', { name: expenseForTest02.value })).toBeInTheDocument();
    expect(await screen.findByRole('cell', { name: expenseForTest02.description })).toBeInTheDocument();
  });
});
