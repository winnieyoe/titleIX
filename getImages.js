var Scraper = require('images-scraper');

const fs = require('fs');
const google = new Scraper({
  puppeteer: {
    headless: false,
  }
})

var uni = ["BROWN UNIVERSITY", "CORNELL UNIVERSITY"];
var admissions = " US admissions"

var all = []
async function getLinks(){
  let oneList;
  for (let i=0; i<uni.length; i++){
    oneList = await google.scrape(uni[i] + admissions, 5);
    all.push(oneList)
  }
  return all;
}

const init = async () => {
	try {
		const gotImages = await getLinks();
		fs.writeFileSync('assets/imageTest.json', JSON.stringify(gotImages));
		console.log('Done!');
	} catch (error) {
		console.log('Error', error);
	}
};

init();
