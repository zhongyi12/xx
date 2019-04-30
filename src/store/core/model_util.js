const UtilModel = {};
const self = UtilModel;

const xArmLang = window.location.search.includes('lang=cn') ? 'cn' : 'en';

self.checkStrIsLegal = (str, isFile, isCheckDot) => {
  const charLength = 30;
  let errStr = `Name contains "only letter, numbers, '_' and no more than ${charLength} characters in total.`;
  if (xArmLang === 'cn') {
    errStr = `名字只能包含字母、数字、下划线_，长度不能超过${charLength}个字符.`;
  }
  if (str === null || str === undefined || str.length === 0) {
    return false;
  }
  if (str.length > charLength) {
    return errStr;
  }
  for (let i = 0; i < str.length; i++) {
    if (isCheckDot) {
      if (str[i] === '.') {
        return errStr;
      }
    }
    if (isFile !== true) {
      // is not file
      if (!((str[i] >= 'a' && str[i] <= 'z') || (str[i] >= 'A' && str[i] <= 'Z') || str[i] === '_' || (str[i] >= '0' && str[i] <= '9'))) {
        return errStr;
      };
    }
    else {
      // is file
      if (!((str[i] >= 'a' && str[i] <= 'z') || (str[i] >= 'A' && str[i] <= 'Z') || str[i] === '_' || str[i] === '.' || (str[i] >= '0' && str[i] <= '9'))) {
        return errStr;
      };
    };
  };
  return true;
}

export default self;
