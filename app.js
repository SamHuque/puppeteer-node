const puppeteer = require('puppeteer');
// https://productforums.google.com/forum/#!topic/webmasters/8fPg1I2p34w

let fs = require("fs");
let csv = require("fast-csv");
let parse = require("csv-parse");

const runPuppeteer = (word, number) => {
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`https://www.google.com/search?q=${word}`);
  await page.setViewport({width: 1000, height: 2000});
  await page.screenshot({path: `${number}_serp.png`});

  await browser.close();
})();
};

const generate_results = (array) => {
  for (let i = 0; i < array.length; i++) {
    runPuppeteer(array[i], i);
  }
};

let csvData = [];
let words_to_get_serp_image = [];

fs.createReadStream("words.csv")
    .pipe(parse({delimiter: ','}))
    .on('data', function(csvrow) {
        //do something with csvrow
        csvData.push(csvrow);
    })
    .on('end',function() {
      //do something wiht csvData
      for (var i = 0 ; i < csvData.length; i++) {
      	words_to_get_serp_image.push(csvData[i][0]);
      }
      console.log(words_to_get_serp_image);
      generate_results(words_to_get_serp_image);
    });
