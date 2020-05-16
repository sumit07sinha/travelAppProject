
const checkInput = require('../client/js/inputCheck.js');
it('should be a string', function () {
  const urlRGEX = /^[a-zA-Z\s]{0,255}$/;
  const urlTest = 'Paris';
  expect(urlRGEX.test(urlTest)).toBe(true);
});