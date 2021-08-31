const {
  isEmailOrID, isAValidEmail, isAValidPassword,
} = require('../../utils/utils');

const email = 'katherinne.g@hotmail.com';

describe('isEmailOrID ', () => {
  it('should return an object with the id or email', () => {
    expect(typeof isEmailOrID(email)).toBe('object');
  });
});
describe('isAValidEmail', () => {
  it('should return an object is a email', () => {
    expect(isAValidEmail('katherinne.g@hotmail.com')).toBe(true);
  });
});

describe('isValidPassword', () => {
  it('shoul return password <5 length', () => {
    expect(isAValidPassword.length < 5).toBe(true);
  });
});
