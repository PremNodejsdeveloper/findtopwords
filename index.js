const request = require("request");
const APIkey =
  "dict.1.1.20170610T055246Z.0f11bdc42e7b693a.eefbde961e10106a4efa7d852287caa49ecc68cf";

getFileFromURL();
//get latest file content to var using request
function getFileFromURL() {
  request(
    "http://norvig.com/big.txt",
    (err, res, body) => {
      if (err) {
        console.log(err);
      }
      var fileContents = body;
      getTopWords(fileContents, 10).then(
        function (outputData) {
          console.log(outputData);
        },
        function (err) {
          console.error(err);
        }
      );
    },
    function (err) {
      console.error(err);
    }
  );
}

//yandex api service call
function getWordDetails(wordElement) {
  return new Promise(function (resolve, reject) {
    request(
      "https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=" +
        APIkey +
        "&lang=en-en&text=" +
        wordElement,
      (err, res, body) => {
        if (err) {
          reject(err);
        }
        resolve(body);
      }
    );
  });
}

function getTopWords(string, cutOff) {
  return new Promise(function (resolve, reject) {
    var cleanString = string.replace(/[.,-/#!$%^&*;:{}=\-_`~()]/g, ""),
      words = cleanString.split(" "),
      frequencies = {},
      word,
      i;

    //to filter all empty elements from the array
    words = words.filter((entry) => /\S/.test(entry));

    for (i = 0; i < words.length; i++) {
      word = words[i];
      frequencies[word] = frequencies[word] || 0;
      frequencies[word]++;
    }

    words = Object.keys(frequencies);

    var topWordArray = words
      .sort(function (a, b) {
        return frequencies[b] - frequencies[a];
      })
      .slice(0, cutOff);

    resolve(topWordArray);
  });
}
