const { Entry } = require("../entries/entries.model");
const caseExporterXL = require("@bwi/shared/exporter");

module.exports = {
    async exportEntries(req, res) {
        const params = {};
        let records;
        const q = req.query;
        if (typeof q.id === 'string') {
            q.id = parseInt(q.id, 10);
        }
        const filterKeys = ["name", "date", "phone", "id"];
        filterKeys.forEach((key) => params[key] = q[key]);

        records = Object.keys(params).length
            ? await Entry.getRecords(params)
            : await Entry.getRecords();
        return await caseExporterXL(res, records);
    }
};
