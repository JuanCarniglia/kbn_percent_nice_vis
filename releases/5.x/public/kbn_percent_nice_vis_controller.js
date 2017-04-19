  import uiModules from 'ui/modules';
  const module = uiModules.get('kibana/kbn_percent_nice_vis', ['kibana']);

  import d3 from 'd3';
  import numeral from 'numeral';
  import AggResponseProvider from './lib/agg_response';

  module.controller('KbnPercentNiceVisController',
  function ($scope, $element, $rootScope, Private) {

    const percentNiceAggResponse = Private(AggResponseProvider);

    let svgRoot = $element[0];

    let _buildVis = function (results) {


      // Ugly Hack starts here

      // Get the PROXY part of the path...
      let startsAt = svgRoot.baseURI.indexOf('/', svgRoot.baseURI.indexOf(':',6)) + 1;
      let prefix = '';

      if (startsAt > 7) {
        let endsAt = svgRoot.baseURI.indexOf('/', startsAt);
        prefix = svgRoot.baseURI.substr(startsAt, endsAt - startsAt);
      }

      if (results.length === 2) {

        let val1 = results[0].value;
        let val2 = results[1].value;

        if (val1 === 0) {
          return null;
        }

        let value = val2 / val1;

        let svgResult = d3.select(svgRoot)
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

        let valueFormatted = results[0].formatNumber ? numeral(value)
          .format(results[0].formatNumber) : value;

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
            let _strImage = '_' + Math.round((value * 10)) * 10;

            if (prefix !== null) {
              svgResult
                .append('svg:image')
                .attr('xlink:href',
                  '/' + prefix + '/bundles/src/ui/public/images/kbn_percent_nice_vis/' +
                    results[0].image + '/' + results[0].image + _strImage + '.png'
                )
                .attr('x', '100px')
                .attr('y', '5px')
                .attr('width', '30px')
                .attr('height', '100px');
            }
          }
        }

        return 1;
      }

    };

    let _render = function _render(data) {
      // Cleanning
      d3.select(svgRoot).selectAll('[role="values_container"]').remove();

      let retVal = _buildVis(data);

      if (!retVal) {
        // Error
        let svgResult = d3.select(svgRoot)
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
        let chartData = percentNiceAggResponse($scope.vis, resp);
        _render(chartData);
      }
    });
  });
