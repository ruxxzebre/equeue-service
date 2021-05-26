import { db } from './db';

export const removeDateCollisions = (data) => {
  const datePool = [];
  return data.filter((thing) => {
    const includs = datePool.includes(thing.date);
    if (!includs) datePool.push(thing.date);
    return !includs;
  });
}

export const Booking = {
  async getRecords() {
    const result = await db('events').select('*');
    if (result) return removeDateCollisions(result);
    return result;
  },
  async makeRecord() {}
};
