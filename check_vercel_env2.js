const https = require('https');

https.get('https://evaluacion-lenguaje-jzdev.vercel.app', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const matches = data.split('assets/').filter(s => s.includes('.js'));
    if (matches.length > 0) {
      const jsFile = matches[0].split('"')[0];
      https.get('https://evaluacion-lenguaje-jzdev.vercel.app/assets/' + jsFile, (res2) => {
        let jsData = '';
        res2.on('data', (chunk) => { jsData += chunk; });
        res2.on('end', () => {
          const idx = jsData.indexOf('apiKey:"');
          if (idx !== -1) {
            console.log(jsData.substring(idx - 20, idx + 200));
          } else {
            console.log('firebaseConfig NOT FOUND IN JS DATA!');
          }
        });
      });
    }
  });
}).on('error', (err) => {
  console.log('Error: ', err.message);
});
