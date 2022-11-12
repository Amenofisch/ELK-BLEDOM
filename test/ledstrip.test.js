const ledstrip = require('../modules/ledstrip.js');

test('Decimal to hexadecimal test', () => {
    expect(ledstrip.d2h('100')).toBe('64');
})

test('setColor function', () => {
    expect(ledstrip.setColor('#FFFFFF'));
})

test('setPower function', () => {
    expect(ledstrip.setPower(true));
})

test('setBrightness function', () => {
    expect(ledstrip.setBrightness(100));
})