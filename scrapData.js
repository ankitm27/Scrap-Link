'use strict';
const rp = require('request-promise');
const cheerio = require('cheerio');
const _ = require('underscore');

let URLList = [];

//function to parse the HTML and gives all the links on that page
let parseHTML = (URL, html) => {
    return new Promise((resolve, reject) => {
        let $ = cheerio.load(html);
        let data = [];
        $($('a')).each(function (i, link) {
            const URI = $(link).attr('href');
            if (URI && URI != URL && (URI.startsWith('https://') || URI.startsWith('http://') || URI.startsWith('//'))) {
                data.push(URI);
            }
        });
        return resolve(_.uniq(data));
    })

};

//send HTTP request and and gives the HTML page
let scrapPage = (URL) => {
    return new Promise((resolve, reject) => {
        rp(URL)
            .then((result) => {
                return parseHTML(URL, result)
            }).then((result) => {
                return resolve(result);
            }).catch((err) => {
                return resolve(err);
            })
    })
};

//Scrap all URL depth wise
let scrapAllPage = (URL) => {
    let promiseCall = [];

    URL.forEach((url) => {
        promiseCall.push(scrapPage(url))
    });

    Promise.all(promiseCall)
        .then((result) => {
            let notPresent = [];

            result[0].forEach((resultURL) => {
                if (URLList.indexOf(resultURL) == -1) {
                    notPresent.push(resultURL);
                    URLList.push(resultURL);
                }
            });


            if (notPresent - 1 > 0) {
                scrapAllPage(notPresent);
            } else {
                console.log("Successfully completed");
                console.log("URL List",URLList);
                process.exit(0);
            }
        }).catch((err) => {
            console.log("There is same problem to fetching the links", err);
            process.exit(1);
        })
};


let websiteName = process.argv[2] || "https://ankitmalhotra.xyz";
URLList.push(websiteName);

scrapAllPage([websiteName]);
