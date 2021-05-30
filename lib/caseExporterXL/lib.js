import * as _ from 'lodash';
import config from '../../config';

export const getID = (case_) => _.get(case_, 'generatedId', '') || _.get(case_, '_id', '');

export const getVersion = (case_) => _.get(case_, 'version', 0);

// export const getCaseUrl = (r) => {
//     return config.BASE_URL + '/case/detail/' + getID(r);
// };

export const getReportType = (r, isFollowup = false) => {
    if (isFollowup) {
        if (r.isAnswered) { return 'Answer'; }
        return 'Question';
    }
    if (r?.followups && r?.followups?.length) {
        let followups = r.followups;
        followups = followups.sort((a, b) => {
            const adate = (new Date(a.updatedAt || a.createdAt)).getTime();
            const bdate = (new Date(b.updatedAt || b.createdAt)).getTime();
            if (adate > bdate) { return 1; }
            if (adate === bdate) { return 0; }
            if (adate < bdate) { return -1; }
        });
        const latest = followups[followups.length - 1];
        if (latest.isAnswered) { return 'Follow up response'; }
        return 'Follow up request';
    }
    if (r.changed) { return 'Modified report'; }
    return 'Initial report';
};
