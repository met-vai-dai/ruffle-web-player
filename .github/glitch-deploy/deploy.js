const upload_Md = require('./git-push.js');
const createNew_Md = require('./newCreate.js')
const shell = require('shelljs')
const queryString = require('query-string');
const axios = require("axios").default;
const axiosRetry = require('axios-retry');

setTimeout(() => {
  console.log('force exit');
  process.exit(0)
}, 30 * 60 * 1000);

axiosRetry(axios, {
  retries: 100,
  retryDelay: (retryCount) => {
    // console.log(`retry attempt: ${retryCount}`);
    return 3000 || retryCount * 1000;
  },
  retryCondition: (error) => {
    return error.response.status === 502;
  },
});


const listProject = `https://f7f4ab97-d213-4ed4-b8ea-1e647b24e034@api.glitch.com/git/glossy-band-basilisk|https://f7f4ab97-d213-4ed4-b8ea-1e647b24e034@api.glitch.com/git/zest-highfalutin-booklet|https://f7f4ab97-d213-4ed4-b8ea-1e647b24e034@api.glitch.com/git/generated-coal-silkworm|https://f7f4ab97-d213-4ed4-b8ea-1e647b24e034@api.glitch.com/git/clean-flying-sousaphone|https://f7f4ab97-d213-4ed4-b8ea-1e647b24e034@api.glitch.com/git/chief-spot-bunny|https://f7f4ab97-d213-4ed4-b8ea-1e647b24e034@api.glitch.com/git/alike-eminent-shade|https://f7f4ab97-d213-4ed4-b8ea-1e647b24e034@api.glitch.com/git/awesome-whip-broccoli|https://f7f4ab97-d213-4ed4-b8ea-1e647b24e034@api.glitch.com/git/curvy-courageous-metal|https://f7f4ab97-d213-4ed4-b8ea-1e647b24e034@api.glitch.com/git/first-aware-bread|https://f7f4ab97-d213-4ed4-b8ea-1e647b24e034@api.glitch.com/git/wistful-tremendous-potassium|https://f7f4ab97-d213-4ed4-b8ea-1e647b24e034@api.glitch.com/git/abiding-whispering-echinodon|https://f7f4ab97-d213-4ed4-b8ea-1e647b24e034@api.glitch.com/git/graceful-puzzling-pear|https://f7f4ab97-d213-4ed4-b8ea-1e647b24e034@api.glitch.com/git/lead-marsh-dresser|https://f7f4ab97-d213-4ed4-b8ea-1e647b24e034@api.glitch.com/git/highfalutin-longing-headstand`.trim().split('|');

const delay = t => {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(true);
    }, t);
  });
};

(async () => {
  try {
    let accountNumber = 0;

    for (let i = 0; i < listProject.length; i++) {
      accountNumber = i + 1;
      try {
        const nameProject = listProject[i].split('/')[4]
        console.log('deploy', nameProject);
        createNew_Md.run(nameProject)
        await upload_Md.upload2Git(listProject[i].trim(), 'code4Delpoy');
        console.log(`account ${accountNumber} upload success ^_^`);

        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' true'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });

        if (i + 1 < listProject.length) await delay(1.8 * 60 * 1000);
      } catch (error) {
        console.log(`account ${accountNumber} upload fail ^_^`);
        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' false'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });
      }

      if (process.cwd().includes('code4Delpoy')) shell.cd('../', { silent: true });

    }

    await delay(20000)
    console.log('Done! exit')
    process.exit(0)

  } catch (err) {
    console.log(`error: ${err}`);
  }
})();