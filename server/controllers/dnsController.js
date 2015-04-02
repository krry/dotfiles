module.exports = function(app) {
  var dns            = require('dns'),
      Q              = require('q'),
      env            = process.env.NODE_ENV || 'development',
      conf           = require('../config/environments/' + env + '.json'),
      addresses      = [],
      PROTOCOL_REGEX = /http(s)*:\/\//;

  for (var prop in conf) {
    if (typeof conf[prop] === 'string' && conf[prop].indexOf('http') > -1) {
      addresses.push(conf[prop].replace(PROTOCOL_REGEX, ''));
    }
  }

  function dnsLookupAll(req, res) {
    return Q.all(addresses.map(dnsLookup)).then(function(results) {
      res.json(mapResults(results));
    }, function(err) {
      res.json({ addresses: addresses, error: err });
    });
  }

  function dnsLookup(address) {
    var dfd = Q.defer();

    dns.resolve4(address, function (err, addresses) {
      if (err) {
        return dfd.resolve({
          address: address,
          error: err,
          addresses: [],
          hostnames: []
        });
      }

      addresses.forEach(function (a) {
        dns.reverse(a, function (err, hostnames) {
          if (err) {
            return dfd.resolve({
              address: address,
              error: err,
              addresses: addresses,
              hostnames: []
            });
          }

          dfd.resolve({
            address: address,
            addresses: addresses,
            hostnames: hostnames
          })
        });
      });
    });

    return dfd.promise;
  }

  function mapResults(results) {
    var map = {};
    results.forEach(function(result) {
      map[result.address] = {
        addresses: result.addresses,
        hostnames: result.hostnames
      };

      if (result.error) {
        map[result.address].error = result.error;
      }
    });

    return map;
  }

  return {
    index: dnsLookupAll
  };
};