define(function (require) {
  return function percentNiceProvider(Private, Notifier) {
    var _ = require('lodash');
    var arrayToLinkedList = require('ui/agg_response/hierarchical/_array_to_linked_list');

    var notify = new Notifier({
      location: 'Percentage Nice Response Converter'
    });

    var nodes = [];

    return function (vis, resp) {

            // some validations
      if (!vis.aggs.bySchemaGroup.metrics) return null;

      if (!vis.aggs.bySchemaGroup.buckets) return null;

      nodes = [];

      var pos = 0;

      var labels = null;

      try {
        labels = JSON.parse(vis.params.jsonLabels);
      } catch (e) {
        labels = '';
      }

      _.each(vis.aggs, function (d, i) {

        var type = d.__type.title;

        var value = 0;

        if (!d.__type.hasNoDsl) {
          value = resp.aggregations[d.id].buckets[d._opts.params.filters[0].input.query.query_string.query].doc_count;
        } else {
          value = resp.hits.total;
        }

        var image = 'waterTank'; // default

        if (labels.length > pos) {

          var valueColor = 'black'; // default

          if (labels[pos].ranges) {
            _.each(labels[pos].ranges, function (range, p) {
              if (value >= range.min && value < range.max) {
                // Found!
                valueColor = range.valueColor ? range.valueColor : valueColor;
                return;
              }
            });
          }

          image =  labels[pos].image;

          nodes.push(
            {
              type: type,
              value: value,
              label: labels[pos].text,
              formatNumber: labels[pos].numeralFormat ? labels[pos].numeralFormat : null,
              valueColor: valueColor,
              image: image
            });

        } else {
          nodes.push(
            {
              type: type,
              value: value,
              label: type,
              image: image
            });
        }

        pos++;
      });

      return nodes;
    };
  };
});
