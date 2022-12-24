const route = require('../routes/duoc.js');

test('Test if hex is returned', () => {
    expect(route.returnHex('rot')).toBe('FF0000')
})
