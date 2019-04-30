
import axios from 'axios';
import Config from '../../config';

const CommandsProfileHttp = {};
const self = CommandsProfileHttp;
window.CommandsProfileHttp = CommandsProfileHttp;

const hostURL = Config.hostURLtest;
self.updateProfileData = (dict, callback) => {
  const URL = hostURL + '/api/1.0/updateuserinfo';
  const OPTIONS = {
    headers: {
      'X-LC-Session': window.profile.token,
    },
  };
  axios.post(URL, dict, OPTIONS).then((response) => {
    const responseData = response.data === undefined ? response : response.data;
    window.CommandsProfileHttp.getUserProfile(() => {
    });
    console.log('responseData', responseData);
    if (callback) {
      callback();
    }
  }, (response) => {
    console.log('error');
    this.message('network error:' + response);
  })
};

self.getUserProfile = (callback) => {
  if (window.profile.token !== '' || window.profile.token !== undefined || window.profile.token !== null) {
    const URL = hostURL + '/api/1.0/getuserinfo';
    const OPTIONS = {
      headers: {
        'X-LC-Session': window.profile.token,
      },
    };
    axios.get(URL, OPTIONS).then((response) => {
      const responseData = response.data === undefined ? response : response.data;
      if (responseData.code === 0) {
        window.GlobalUtil.model.localProfileMgr.profileData = responseData.info;
        console.log('update', window.GlobalUtil.model.localProfileMgr.profileData);
        if (callback) {
          callback();
        }
      }
    }, (response) => {
      console.log('error');
      this.message('network error:' + response);
    })
  }
  return '';
};

export default self;
