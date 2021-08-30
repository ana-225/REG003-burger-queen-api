const {
  pagination, isEmailOrID,
} = require('../../utils/utils');

const email = 'katherinne.g@hotmail.com';

describe('isEmailOrID ', () => {
  it('should return an object with the id or email', (done) => {
    expect(isEmailOrID(email)).toBe({ email: email });
  });
});
// describe('isEmailOrID ', () => {
//   it('should return an object with the id or email', (done) => {
//     done();
//   });
// });
