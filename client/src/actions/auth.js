import axios from 'axios';

export const AUTHENTICATE_USER = 'AUTHENTICATE_USER';
export const UNAUTHENTICATE_USER = 'UNAUTHENTICATE_USER';

const ROOT_URL = process.env.NODE_ENV === 'production' ? 'https://bangarangbingo.herokuapp.com' : 'http://localhost:8080';

export const authenticate = (user, token) => {
  console.log('called');
  return {
    type: AUTHENTICATE_USER,
    payload: {
      user,
      token,
    },
  };
};

const unauthenticate = () => ({
  type: UNAUTHENTICATE_USER,
});

export const registerUser = (username, password, confirmPassword, history, handleError) => (dispatch) => {
  if (password !== confirmPassword) {
    handleError('Passwords did not match!');
    return;
  }
  axios.post(`${ROOT_URL}/auth/register`, { username, password }).then(({ data }) => {
    const { user, token } = data;
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    dispatch(authenticate(user, token));
    history.push('/cards');
  }).catch(({ response }) => {
    const { error } = response.data;
    handleError(error);
  });
};

export const login = (username, password, history, handleError) => (dispatch) => {
  if (!username || !password) {
    handleError('Username & Password are required.');
  }
  axios
    .post(`${ROOT_URL}/auth/login`, { username, password })
    .then(({ data }) => {
      const { user, token } = data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      dispatch(authenticate(user, token));
      history.push('/cards');
    }).catch(({ response }) => {
      const { error } = response.data;
      handleError(error);
    });
};

export const logout = () => (dispatch) => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  dispatch(unauthenticate());
};