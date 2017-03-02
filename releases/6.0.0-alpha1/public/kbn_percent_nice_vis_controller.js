define(function (require) {
  var module = require('ui/modules').get('kibana/kbn_percent_nice_vis', ['kibana']);

  var d3 = require('d3');
  var numeral = require('numeral');

  module.controller('KbnPercentNiceVisController',
  function ($scope, $element, $rootScope, Private) {

    var percentNiceAggResponse = Private(require('./lib/agg_response'));

    var svgRoot = $element[0];

    var _buildVis = function (results) {

      if (results.length === 2) {

        var val1 = results[0].value;
        var val2 = results[1].value;

        if (val1 === 0) {
          return null;
        }

        var value = val2 / val1;

        var svgResult = d3.select(svgRoot)
        .append('svg')
        .attr('role', 'values_container')
        .attr('class', 'svgNumberContainer')
        .append('g');

        svgResult
        .append('svg:text')
        .attr('class', 'svgNumberLabel')
        .attr('x', '0px')
        .attr('y', '2px')
        .attr('ng-style', '{\'font-size\': vis.params.fontSizeLabel+\'pt\'}')
        .style('font-size', $scope.vis.params.fontSizeLabel)
        .text(results[0].label);

        var valueFormatted = results[0].formatNumber ? numeral(value).format(results[0].formatNumber) : value;

        svgResult
        .append('svg:text')
        .attr('class', 'svgNumberValue')
        .attr('x', '0px')
        .attr('y', '30px')
        .attr('ng-style', '{\'font-size\': vis.params.fontSizeValue+\'pt\'}')
        .style('font-size', $scope.vis.params.fontSizeValue)
        .style('fill', results[0].valueColor)
        .text(valueFormatted);

        if ($scope.vis.params.showPictures) {
          if (results[0].image) {
            var _strImage = '_' + Math.round((value * 10)) * 10;

            svgResult
            .append('svg:image')
            .attr('xlink:href',
              '/bundles/src/ui/public/images/kbn_percent_nice_vis/' + results[0].image + '/' + results[0].image + _strImage + '.png')
            .attr('x', '100px')
            .attr('y', '5px')
            .attr('width', '30px')
            .attr('height', '100px');
          }
        }

        return 1;
      }

    };

    var _render = function _render(data) {
      // Cleanning
      d3.select(svgRoot).selectAll('[role="values_container"]').remove();

      var retVal = _buildVis(data);

      if (!retVal) {
        // Error
        var svgResult = d3.select(svgRoot)
        .append('svg')
        .attr('role', 'values_container')
        .attr('class', 'svgNumberContainer')
        .append('g');

        svgResult
        .append('svg:text')
        .attr('class', 'svgNumberLabel')
        .attr('x', '0px')
        .attr('y', '2px')
        .attr('ng-style', '{\'font-size\': vis.params.fontSizeLabel+\'pt\'}')
        .style('font-size', $scope.vis.params.fontSizeLabel)
        .text('Division by Zero!');

      }
    };

    $scope.$watch('esResponse', function (resp) {
      if (resp) {
        var chartData = percentNiceAggResponse($scope.vis, resp);
        _render(chartData);
      }
    });
  });
});
