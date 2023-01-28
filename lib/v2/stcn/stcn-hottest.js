const got = require('@/utils/got');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const response = await got({
        method: 'get',
        url: 'http://www.stcn.com/xw/sd/',
    });

    const data = response.data;

    const $ = cheerio.load(data);
    const list = $('div.guancha ul.list li');

    ctx.state.data = {
        title: '证券时报网点击排行',
        link: 'http://www.stcn.com/xw/sd/',
        item:
            list &&
            list
                .map((index, item) => {
                    item = $(item);
                    const date_groups = /\/t(?<year>\d{4})(?<month>\d{2})(?<day>\d{2})/.exec(item.find('a').attr('href')).groups;
                    const date = date_groups.year + '-' + date_groups.month + '-' + date_groups.day;

                    return {
                        title: item.find('a').attr('title'),
                        link: item.find('a').attr('href'),
                        pubDate: date,
                    };
                })
                .get(),
    };
};
