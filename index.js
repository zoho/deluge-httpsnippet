const deluge = require('./deluge');

module.exports = {
  info: {
    key: 'deluge',
    title: 'Deluge',
    extname: '.dlg',
    default: 'deluge',
  },
  deluge,
};
