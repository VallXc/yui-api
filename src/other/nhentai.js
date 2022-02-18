const got = require('got');
const cheerio = require('cheerio');

function getDoujinObj(url) {
	return new Promise(async(resolve, reject) => {
		const req = await got(url)
		const $ = cheerio.load(req.body)
		let title = $('#info').find('h1').text();
		let nativeTitle = $('#info').find('h2').text();
		let details = {};
		$('.tag-container.field-name').find('count').each(function() {
			this.text(` (${el.text()}) `);
		})
		$('.tag-container.field-name').text().split('\n').map(string => string.trim()).filter(u => u).map((tag, i, tags) => {
			if (tag.endsWith(':') && !tags[i + 1].endsWith(':')) {
				details[tag.substring(0, tag.length - 1).toLowerCase()] = tags[i + 1].replace(/(\([0-9,]+\))([a-zA-Z])/g, '$1 $2').split(/(?<=\))\s(?=[a-zA-Z])/);
			}
		});
		const pages = Object.entries($('.gallerythumb').find('img')).map(image => {
			return image[1].attribs
			? image[1].attribs['data-src'].replace(/t(\.(jpg|png|gif))/, '$1').replace('t.nhentai', 'i.nhentai')
			: null;
		})
		resolve({ title,nativeTitle, details, pages })
	})
}


function getDoujinsByArtist(artist, page = 1) {
	return new Promise(async(resolve, reject) => {
		const req = await got(`https://nhentai.net/artist/${artist}/?page=${page}`)
		const $ = cheerio.load(req.body)
		const result = [];
		$('div[class="container index-container"] .gallery a').each((i, e) => {
			result.push({
				index: i + 1,
				name: $(e).text().split("/>")[1],
				link: `https://nhentai.net` + $(e).attr("href"),
				coverScr: $(e).children().attr("data-src"),
				code: $(e).attr("href").split("/")[2],
			});
		});
		resolve(result)
	})
}


function getDoujinsByTag(tag, page = 1) {
	return new Promise(async(resolve, reject) => {
		const req = await got(`https://nhentai.net/tag/${tag}/?page=${page}`)
		const $ = cheerio.load(req.body)
		const result = [];
		$('div[class="container index-container"] .gallery a').each((i, e) => {
			result.push({
				index: i + 1,
				name: $(e).text().split("/>")[1],
				link: `https://nhentai.net` + $(e).attr("href"),
				coverScr: $(e).children().attr("data-src"),
				code: $(e).attr("href").split("/")[2],
			});
		});
		resolve(result)
	})
}


function home(page = 1) {
	return new Promise(async(resolve, reject) => {
		const req = await got(`https://nhentai.net/?page=${page}`)
		const $ = cheerio.load(req.body)
		const result = [];
		$('div[class="container index-container"] .gallery a').each((i, e) => {
			result.push({
				index: i + 1,
				name: $(e).text().split("/>")[1],
				link: `https://nhentai.net` + $(e).attr("href"),
				coverScr: $(e).children().attr("data-src"),
				code: $(e).attr("href").split("/")[2],
			});
		});
		resolve(result)
	})
}


function search(query, page = 1) {
	return new Promise((resolve, reject) => {
		const req = await got(`https://nhentai.net/search/?q=${query}&page=${page}`)
		const $ = cheerio.load(req.body)
		const result = [];
		$('div[class="container index-container"] .gallery a').each((i, e) => {
			result.push({
				index: i + 1,
				name: $(e).text().split("/>")[1],
				link: `https://nhentai.net` + $(e).attr("href"),
				coverScr: $(e).children().attr("data-src"),
				code: $(e).attr("href").split("/")[2],
			});
		});
		resolve(result)
	})
}


module.exports = {
	getDoujinObj,
	getDoujinsByArtist,
	getDoujinsByTag,
	home,
	search
}