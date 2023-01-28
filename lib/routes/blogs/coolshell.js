const got = require('@/utils/got');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const response = await got({
        method: 'get',
        url: 'https://coolshell.cn/',
    });

    const data = response.data;

    const $ = cheerio.load(data);
    const list = $('article');

    ctx.state.data = {
        title: '酷壳-COOLSHELL',
        link: 'https://coolshell.cn/',
        item:
            list &&
            list
                .map((index, item) => {
                    item = $(item);
                    const meta_data = item.find('.entry-meta').first();
                    // let date_raw = meta_data.find('time').first().text();
                    // let date_groups = date_raw.match(/(?<year>\d{4}).*(?<month>\d{2}).*(?<day>\d{2})/);
                    // let date = date_groups.year + '-' + date_groups.month + '-' + date_groups.day;
                    const date_raw = meta_data.find('time').first().attr('datetime');
                    const date = /\d{4}-\d{2}-\d{2}/.exec(date_raw)[0];

                    return {
                        title: item.find('.entry-title a').first().text(),
                        description: `${item.find('.entry-content p').first().html()}<br>open the link to read more...`,
                        pubDate: date,
                        // item.find('entry-meta').find('time').first().text(),
                        link: item.find('.entry-title a').attr('href'),
                    };
                })
                .get(),
    };
};
