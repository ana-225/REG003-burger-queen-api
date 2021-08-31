const {
  pagination, isEmailOrID, isAValidEmail, isAValidPassword,
} = require('../../utils/utils');

const email = 'katherinne.g@hotmail.com';

describe('isEmailOrID ', () => {
  it('should return an object with the id or email', () => {
    expect(isEmailOrID(email)).toBe(true);
  });
});
describe('isAValidEmail', () => {
  it('should return an object is a email', () => {
    expect(isAValidEmail.isAValidEmail('katherinne.g@hotmail.com')).tobe(true);
  });
});

describe('isValidPassword', () => {
  it('shoul return password <5 length', () => {
    expect(isAValidPassword.length < 5).toBe(true);
  });
});
