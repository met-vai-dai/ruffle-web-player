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


const listProject = `https://67376144-e4c2-4c26-afd0-5706ae9607f3@api.glitch.com/git/classy-glow-parenthesis|https://67376144-e4c2-4c26-afd0-5706ae9607f3@api.glitch.com/git/colossal-ossified-surf|https://67376144-e4c2-4c26-afd0-5706ae9607f3@api.glitch.com/git/brass-daffodil-weeder|https://67376144-e4c2-4c26-afd0-5706ae9607f3@api.glitch.com/git/spiritual-fascinated-balance|https://67376144-e4c2-4c26-afd0-5706ae9607f3@api.glitch.com/git/root-curse-linseed|https://67376144-e4c2-4c26-afd0-5706ae9607f3@api.glitch.com/git/stone-bramble-culotte|https://67376144-e4c2-4c26-afd0-5706ae9607f3@api.glitch.com/git/acidic-zest-sneezeweed|https://67376144-e4c2-4c26-afd0-5706ae9607f3@api.glitch.com/git/delirious-phase-manta|https://67376144-e4c2-4c26-afd0-5706ae9607f3@api.glitch.com/git/lizard-accidental-narcissus|https://67376144-e4c2-4c26-afd0-5706ae9607f3@api.glitch.com/git/pretty-steady-cartoon|https://67376144-e4c2-4c26-afd0-5706ae9607f3@api.glitch.com/git/equatorial-blushing-child|https://67376144-e4c2-4c26-afd0-5706ae9607f3@api.glitch.com/git/fir-impartial-boa|https://67376144-e4c2-4c26-afd0-5706ae9607f3@api.glitch.com/git/topaz-kindhearted-delivery|https://67376144-e4c2-4c26-afd0-5706ae9607f3@api.glitch.com/git/smart-rounded-weeder`.trim().split('|');

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