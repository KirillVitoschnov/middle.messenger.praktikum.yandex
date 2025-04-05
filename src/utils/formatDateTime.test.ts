import { expect } from 'chai';
import { formatDateTime } from './formatDateTime';

describe('Функция formatDateTime', () => {
    it('должна возвращать "Сегодня в hh:mm", если переданная дата соответствует сегодняшней', () => {
        const now = new Date();
        const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 15, 0);
        const isoString = todayDate.toISOString();
        const result = formatDateTime(isoString);
        const expected = `Сегодня в ${("0" + todayDate.getHours()).slice(-2)}:${("0" + todayDate.getMinutes()).slice(-2)}`;
        expect(result).to.equal(expected);
    });

    it('должна возвращать "Вчера", если переданная дата соответствует вчерашней', () => {
        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        yesterday.setHours(20, 30, 0);
        const isoString = yesterday.toISOString();
        const result = formatDateTime(isoString);
        expect(result).to.equal('Вчера');
    });

    it('должна форматировать дату как "dd.mm.yyyy" для других дат', () => {
        const otherDate = new Date(2000, 0, 1, 12, 0, 0);
        const isoString = otherDate.toISOString();
        const result = formatDateTime(isoString);
        expect(result).to.equal('01.01.2000');
    });
});
