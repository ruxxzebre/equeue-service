import * as xl from 'excel4node';
import * as moment from 'moment';
import { defaultColumns } from './columns';

const columnWidths = {
    cases: new Map(),
    followups: new Map(),
};

const cellByType = (worksheet, inputCell, indices) => {
    const cell = worksheet.cell(...indices);

    const { value } = inputCell;
    if (inputCell?.opts) {
        const type = inputCell?.opts?.type;
        if (type === 'date') {
            const date = moment(value).format(inputCell?.opts?.format);
            if (!date || date === 'Invalid date') { return cell.string(''); }
            return cell.string(date.toString() || '');
        }
        if (type === 'link') {
            return cell.link(value);
        }
    }
    if (!value && value !== 0) {
        return cell.string('');
    }
    if (
        ((value === 0) || typeof value === 'number')
        || (value.match && value.match(/^\d+\.?\d+$/g)?.length)
    ) {
        return cell.number(parseInt(value, 10));
    }
    if (
        moment(value, moment.ISO_8601).isValid()
    ) {
        return cell.date(moment(value).toDate());
    }
    if (
        moment(value, 'DD-MM-YYYY', true).isValid()
    ) {
        return cell.date(moment(value, 'DD-MM-YYYY').toDate());
    }
    return cell.string(`${value ? value : ''}`);
};

const getColumnWidth = (cell, column, type) => {
    if (cell?.opts?.width) { return cell.opts.width; }
    let value;
    let label;
    label = cell.label;
    if (typeof cell.value === 'object') {
        value = JSON.stringify(cell.value);
    } else {
        value = cell.value;
    }
    if (!type) { throw new Error('Unknown sheet type.'); }
    const ADDITIONAL_WIDTH = 5;
    const width = (Math.max(
        value?.toString()?.length,
        label?.toString()?.length,
    ) + ADDITIONAL_WIDTH) || 10;
    if (!columnWidths[type].has(column)) {
        columnWidths[type].set(column, width);
    } else if (columnWidths[type].get(column) < width) {
        columnWidths[type].set(column, width);
    }

    return columnWidths[type].get(column);
};

// (row, column)
const createCaseSheet = (workbook, worksheetName, json, style= null) => {
    const worksheet = workbook.addWorksheet(worksheetName);
    defaultColumns().map((o) => o.label).forEach((label, columnIndex) => {
        worksheet.cell(1, columnIndex + 1)
            .string(label)
            .style(style || {});
    });
    json.forEach((currentCase, caseIndex) => {
        defaultColumns(currentCase).forEach((cell, columnIndex) => {
            worksheet.column(columnIndex + 1)
                .setWidth(getColumnWidth(cell, columnIndex + 1, 'cases'));
            cellByType(worksheet, cell, [
                caseIndex + 2, columnIndex + 1,
            ]);
        });
    });
};

export const createSheets = (type, workbook, content) => {
    createCaseSheet(workbook, 'Cases', content);
};

export const exportToExcel = async (response, content, type = 'defaultExport', filename = 'Report') => {
    const onlyLatest = false;
    const workbook = new xl.Workbook({
        dateFormat: 'm/d/yy hh:mm:ss',
    });

    try {
        createSheets(type, workbook, content);
        workbook.write(`${filename}.xlsx`, response);
    } catch (err) {
        if (Object.keys(err).length) {
        } else {
        }
        response.sendStatus(500);
    }
};

export default exportToExcel;
