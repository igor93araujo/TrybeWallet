// Esse reducer será responsável por tratar as informações da pessoa usuária
import { SAVE_USER_EMAIL } from '../actions';

const INITIAL_STATE = {
  email: '', // string que armazena o email da pessoa usuária
};

const userReducer = (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
  case SAVE_USER_EMAIL:
    return {
      email: payload,
    };
  default:
    return state;
  }
};

export default userReducer;
