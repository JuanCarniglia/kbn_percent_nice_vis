module.exports = function (kibana) {
  return new kibana.Plugin({
    name: 'kbn_percent_nice_vis',
    require: ['kibana'],
    uiExports: {
      visTypes: [
        'plugins/kbn_percent_nice_vis/kbn_percent_nice_vis'
      ]
    }
  });
};
