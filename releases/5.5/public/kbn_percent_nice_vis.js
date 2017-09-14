import 'ui/agg_table';
import 'ui/agg_table/agg_table_group';

import 'plugins/kbn_percent_nice_vis/kbn_percent_nice_vis.less';
import 'plugins/kbn_percent_nice_vis/kbn_percent_nice_vis_controller';

import { TemplateVisTypeProvider } from 'ui/template_vis_type/template_vis_type';
import { VisSchemasProvider } from 'ui/vis/schemas';
import kbnPercentNiceVisTemplate from 'plugins/kbn_percent_nice_vis/kbn_percent_nice_vis.html';

import { VisTypesRegistryProvider } from 'ui/registry/vis_types';

VisTypesRegistryProvider.register(KbnPercentNiceVisProvider);

function KbnPercentNiceVisProvider(Private) {
  var TemplateVisType = Private(TemplateVisTypeProvider);
  var Schemas = Private(VisSchemasProvider);

  return new TemplateVisType({
    name: 'kbn_percent_nice',
    title: 'Percentage Display',
    icon: 'fa-table',
    description: 'Chart displaying percentages with Pictures',
    template: require('plugins/kbn_percent_nice_vis/kbn_percent_nice_vis.html'),
    params: {
      defaults: {
        showPictures: true,
        fontSizeLabel: 14,
        fontSizeValue: 14,
        jsonLabels: '[{ "text" : "CUENTA","numeralFormat" : "%00,0","ranges" ' +
          ':[{ "min" : 0,"max": 5000,"valueColor" : "blue"},' +
          '{ "min" : 5000,"max": 10000,"valueColor" : "red"}],"image" : "fuelContainer"}]'
      },
      editor: require('plugins/kbn_percent_nice_vis/kbn_percent_nice_vis_params.html')
    },
    hierarchicalData: function (vis) {
      return Boolean(vis.params.showPictures);
    },
    schemas: new Schemas([{
        group: 'metrics',
        name: 'metric',
        title: 'Count of',
        min: 1,
        max: 2,
        defaults: [{
          type: 'count',
          schema: 'metric'
        }]
      },
      {
        group: 'buckets',
        name: 'segment',
        title: 'Divided By',
        aggFilter: 'filters',
        min: 1,
        max: 1
      }
    ]),
    requiresSearch: true
  });
}


export default KbnPercentNiceVisProvider;
