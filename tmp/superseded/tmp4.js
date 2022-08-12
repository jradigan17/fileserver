// const promise1 = Promise.resolve(3);
// const promise2 = 42;
// const promise3 = new Promise((resolve, reject) => {
//   setTimeout(resolve, 100, 'foo');
// });

// Promise.all([promise1, promise2, promise3]).then((values) => {
//   console.log(values);
// });
// // expected output: Array [3, 42, "foo"]




function testCase(urls) {
  return Promise.all(urls.map(function(url) {
      return $.get(url)
          .then(function(response) {
              if (response.meta && response.meta.next) {
                  return $.get(url + "&offset=" + response.meta.next)
                      .then(function(nextResponse) {
                          return [response, nextResponse];
                      });
              } else {
                  return [response];
              }
          });
  })).then(function(responses) {
      var flat = [];
      responses.forEach(function(responseArray) {
          flat.push.apply(flat, responseArray);
      });
      return flat;
  });
}

testCase(["url1", "url2", "etc."])
    .then(function(responses) {
        console.log("Look it worked")// Use `responses` here
    })