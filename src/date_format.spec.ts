import each from 'jest-each';
import { date_format, date_from_format } from './date_format';

describe('date_format', () => {
  each([
    ['2003-02-01T16:17:18', 'd.m.y H:i:s Y', '01.02.03 16:17:18 2003'],
    ['1945-02-01T16:17:18', 'd.m.y H:i:s', '01.02.45 16:17:18'],
    ['2003-02-01T16:17:18Z', 'U', '1044116238000'],
    ['2003-02-01T16:17:18Z', '@T', '1044116238'],
    ['2003-02-01T16:17:18Z', '\\Y-\\m-\\dT\\H:\\i:\\s', 'Y-m-dTH:i:s'],
  ]).it(`%s.format('%s') -> %s`, (from, format, expected) => {
    const actual = date_format(new Date(from), format);

    expect(actual).toBe(expected);
  });
  each([
    ['2003-02-01T16:17:18', 'Y-m-dTH:i:s', '2003-02-01 16:17:18', false],
    ['2003-02-01', 'Y-m-d', '2003-02-01 00:00:00', false],
    ['03', 'y', '2003-01-01 00:00:00', false],
    ['45', 'y', '1945-01-01 00:00:00', false],
    ['1044116238000', 'U', '2003-02-01 16:17:18', true],
    ['@ 1044116238', '@ @T', '2003-02-01 16:17:18', true],
  ]).it(`%s.format('%s') -> %s`, (from, format, expected, utc) => {
    const actual = date_from_format(from, format);

    expect(date_format(actual, 'Y-m-d H:i:s', utc)).toBe(expected);
  });
});
