const route = require('../routes/index.js');

test('Test if hex is returned', () => {
    expect(route.returnHex('rot')).toBe('FF0000')
})