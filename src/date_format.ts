export function date_format(date: Date, format: string, utc = false): string {
  let result = format;

  const [Y, m, d, h, i, s] = [
    // @formatter:off
    utc ? date.getUTCFullYear()    : date.getFullYear(),
    utc ? (date.getUTCMonth() + 1) : (date.getMonth() + 1),
    utc ? date.getUTCDate()        : date.getDate(),
    utc ? date.getUTCHours()       : date.getHours(),
    utc ? date.getUTCMinutes()     : date.getMinutes(),
    utc ? date.getUTCSeconds()     : date.getSeconds(),
    // @formatter:on
  ];

  result = result.replace(/(?<!\\)Y/g, Y.toString());
  result = result.replace(/(?<!\\)y/g, (Y % 100).toString().padStart(2, '0'));
  result = result.replace(/(?<!\\)m/g, m.toString().padStart(2, '0'));
  result = result.replace(/(?<!\\)d/g, d.toString().padStart(2, '0'));
  result = result.replace(/(?<!\\)j/g, d.toString());
  result = result.replace(/(?<!\\)H/g, h.toString().padStart(2, '0'));
  result = result.replace(/(?<!\\)h/g, h.toString());
  result = result.replace(/(?<!\\)i/g, i.toString().padStart(2, '0'));
  result = result.replace(/(?<!\\)s/g, s.toString().padStart(2, '0'));
  result = result.replace(/(?<!\\)U/g, date.getTime().toString().padStart(2, '0'));
  result = result.replace(/(?<!\\)@T/g, Math.floor(date.getTime() / 1000).toString().padStart(2, '0'));
  result = result.replace(/\\(.)/g, '$1');

  return result;
}

export function date_from_format(date: string, format: string): Date {
  //year, month, day, hours, minutes, seconds, milliseconds
  let year = 0, month = 0, day = 1, hours = 0, minutes = 0, seconds = 0, milliseconds = 0;
  // Parse
  for (let i = 0, pos = 0; i < format.length; i++) {
    let ch = format[i];
    switch (ch) {
      case 'Y':
        year = +date.substr(pos, 4);
        pos += 4;
        break;
      case 'y':
        let t = +date.substr(pos, 2);
        pos += 2;
        year  = t > 30 ? t + 1900 : t + 2000;
        break;
      case 'm':
        month = +date.substr(pos, 2) - 1;
        pos += 2;
        break;
      case 'd':
        day = +date.substr(pos, 2);
        pos += 2;
        break;

      case 'H':
        hours = +date.substr(pos, 2);
        pos += 2;
        break;
      case 'i':
        minutes = +date.substr(pos, 2);
        pos += 2;
        break;
      case 's':
        seconds = +date.substr(pos, 2);
        pos += 2;
        break;
      case 'U': {// JS timestamp (ms)
        let d = new Date();
        d.setTime(+date.substr(pos));
        return d;
      }
      case '@': {// @T - Unix timestamp
        if (format[i + 1] === 'T') {
          let d = new Date();
          d.setTime(+date.substr(pos) * 1000);
          return d;
        }
        pos += 1;
        break;
      }
      default:
        pos += 1;
    }
  }
  return new Date(year, month, day, hours, minutes, seconds, milliseconds);
}
