import _ from 'lodash';
import arrayToLinkedList from 'ui/agg_response/hierarchical/_array_to_linked_list';

module.exports = function percentNiceProvider(Private, Notifier) {

  let notify = new Notifier({
    location: 'Percentage Nice Response Converter'
  });

  let nodes = [];

  return function (vis, resp) {

    // some validations
    if (!vis.aggs.bySchemaGroup.metrics) return null;

    if (!vis.aggs.bySchemaGroup.buckets) return null;

    let bucketId = vis.aggs.bySchemaGroup.buckets[0].id;

    nodes = [];

    let pos = 0;

    let labels = null;

    try {
      labels = JSON.parse(vis.params.jsonLabels);
    } catch (e) {
      labels = '';
    }

    _.each(vis.aggs, function (d, i) {

      let type = d.__type.title;

      let value = 0;

      if (!d.__type.hasNoDsl) {
        if (d._opts.params.filters !== undefined) {
          if (d._opts.params.filters[0] !== undefined) {
            value = resp.aggregations[bucketId].buckets[d._opts.params.filters[0].input.query.query_string.query].doc_count;
          }
        }
      } else {
        value = resp.hits.total;
      }

      let image = 'waterTank'; // default

      if (labels.length > pos) {

        let valueColor = 'black'; // default

        if (labels[pos].ranges) {
          _.each(labels[pos].ranges, function (range, p) {
            if (value >= range.min && value < range.max) {
              // Found!
              valueColor = range.valueColor ? range.valueColor : valueColor;
              return;
            }
          });
        }

        image = labels[pos].image;

        nodes.push({
          type: type,
          value: value,
          label: labels[pos].text,
          formatNumber: labels[pos].numeralFormat ? labels[pos].numeralFormat : null,
          valueColor: valueColor,
          image: image
        });

      } else {
        nodes.push({
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
