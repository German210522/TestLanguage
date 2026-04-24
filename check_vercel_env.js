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
          console.log('Contains projectId?', jsData.includes('evaluacion-lenguaje'));
          console.log('Firebase init config text snippet:');
          const idx = jsData.indexOf('projectId');
          if (idx !== -1) {
            console.log(jsData.substring(idx, idx + 150));
          } else {
            console.log('projectId string not found in JS bundle!');
          }
        });
      });
    }
  });
}).on('error', (err) => {
  console.log('Error: ', err.message);
});
