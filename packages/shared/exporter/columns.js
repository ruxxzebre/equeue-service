const _ = require('lodash');

const defaultColumns = (r = {}) => [
  {
    value: _.get(r, 'date', ''),
    label: 'Дата',
  },
  {
    value: _.get(r, 'time', ''),
    label: 'Час',
  },
  {
    value: _.get(r, 'faculty', ''),
    label: 'Факультет',
  },
  {
    value: _.get(r, 'name', ''),
    label: 'ПІБ',
  },
  {
    value: _.get(r, 'phone', ''),
    label: 'Телефон',
  },
  // { value: _.get(r, '', ''), label: 'When was the case reported?',
  //     opts: { type: 'date', format: 'DD-MM-YYYY' }},
  { value: _.get(r, 'createdAt', ''), label: 'Created at' },
].map((item) => {
  if (![null, undefined].includes(item.value)) { return item; } else { item.value = ''; }
  return item;
});

module.exports.defaultColumns = defaultColumns;
