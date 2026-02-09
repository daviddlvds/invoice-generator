import handlebars from 'handlebars';
import moment from 'moment-timezone';
const handlebarsIntl = require('handlebars-intl');

export function registerHelpers() {
  handlebarsIntl.registerWith(handlebars);

  handlebars.registerHelper(
    'ifCond',
    function (
      this: any,
      v1: any,
      operador: string,
      v2: any,
      options: Handlebars.HelperOptions
    ) {
      switch (operador) {
        case '===':
          return v1 === v2 ? options.fn(this) : options.inverse(this);
        case '!==':
          return v1 !== v2 ? options.fn(this) : options.inverse(this);
        default:
          return options.inverse(this);
      }
    }
  );


  handlebars.registerHelper('formatDate', (date: Date) =>
    moment(date).format('DD/MM/YYYY')
  );

  handlebars.registerHelper('formatCurrency', (value: number) =>
    value.toLocaleString('es-MX', { minimumFractionDigits: 2 })
  );

  handlebars.registerHelper(
    'inc',
    function (this: any, value: number) {
      return value + 1;
    }
  );

}
