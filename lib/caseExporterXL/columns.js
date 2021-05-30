import * as _ from 'lodash';

export const defaultColumns = (r = {}) => [
    {
        value: _.get(r, 'date', ''),
        label: 'Book Date',
    },
    {
        value: _.get(r, 'phone', ''),
        label: 'Phone',
    },
    {
        value: _.get(r, 'name', ''),
        label: 'Name',
    },
    // { value: _.get(r, '', ''), label: 'When was the case reported?',
    //     opts: { type: 'date', format: 'DD-MM-YYYY' }},
    { value: _.get(r, 'createdAt', ''), label: 'Created at' },
].map((item) => {
    if (![null, undefined].includes(item.value)) { return item; } else { item.value = ''; }
    return item;
});
