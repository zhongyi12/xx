const language = {};
const self = language;
window.language = language;
const xarmLang = window.location.search.includes('lang=cn') ? 'cn' : 'en';
self.currentLang = xarmLang;
export default self;
