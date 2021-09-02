const {
  isEmailOrID, isAValidEmail, isAValidPassword, verifyRoles, pagination,
} = require('../../utils/utils');
const email = 'katherinne.g@hotmail.com';
const password = '123456';
const bodyUser = {
  email,
  password,
};
const objectExample = {
  docs: [
    {
      roles: {
        admin: false,
      },
      _id: '6128682bf7d0ed0f88d3d898',
      email,
    },
  ],
  totalDocs: 1,
  limit: 1,
  totalPages: 1,
  page: 1,
  pagingCounter: 1,
  hasPrevPage: false,
  hasNextPage: false,
  prevPage: null,
  nextPage: null,
};
const url = 'http://localhost:8080/';
const firstPage = 'http://localhost:8080/?limit=10&page=1';

describe('pagination ', () => {
  it('should return an object', () => {
    expect(typeof pagination(objectExample, url, 1, 10, objectExample.totalPages)).toBe('object');
  });
  it('should return an object with links', () => {
    expect(pagination(objectExample, url, 1, 10, objectExample.totalPages).first).toBe(firstPage);
  });
});

describe('pagination ', () => {
  it('should return an object', () => {
    expect(typeof pagination(objectExample, url, 1, 10, objectExample.totalPages)).toBe('object');
  });
  it('should return an object with links', () => {
    expect(pagination(objectExample, url, 1, 10, objectExample.totalPages).first).toBe(firstPage);
  });
});
describe('isEmailOrID ', () => {
  it('should return an object with the id or email', () => {
    expect(typeof isEmailOrID(email)).toBe('object');
  });
  it('should return an object with the key id with its value', () => {
    expect(isEmailOrID('12ab34fE3')._id).toBe('12ab34fE3');
  });
});
describe('isAValidEmail', () => {
  it('should return true if we give a valid email', () => {
    expect(isAValidEmail(email)).toBe(true);
  });
  it('should return false if we give an invalid email', () => {
    expect(isAValidEmail('12345')).toBe(false);
  });
});
describe('isValidPassword', () => {
  it('should return true for a valid password', () => {
    expect(isAValidPassword(password)).toBe(true);
  });
  it('should return false for an invalid password', () => {
    expect(isAValidPassword('123')).toBe(false);
  });
  it('should return false for an invalid password', () => {
    expect(isAValidPassword('123')).toBe(false);
  });
});

describe('verifyRoles', () => {
  it('should return an object', () => {
    expect(typeof verifyRoles(bodyUser)).toBe('object');
  });
  it('should return true if roles exist', () => {
    expect(!!verifyRoles(bodyUser).roles).toBe(true);
  });
});
describe('verifyRoles', () => {
  it('should return an object', () => {
    console.log(verifyRoles(bodyUser))
    expect(typeof verifyRoles(bodyUser)).toBe('object');
  });
  it('should return true if roles exist', () => {
    expect(!!verifyRoles(bodyUser).roles).toBe(true);
  });
});