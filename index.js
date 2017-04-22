const bleno = require('bleno');

bleno.on('stateChange', function (state) {
  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {
    bleno.startAdvertising('echo', ['ec00']);
  } else {
    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', function (error) {
  console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

  if (!error) {
    bleno.setServices([
      new (bleno.PrimaryService)({
        uuid: 'ec00',
        characteristics: [
          new (bleno.Characteristic)({
            uuid: '2A6E',
            properties: ['read'],
            descriptors: [
              new (bleno.Descriptor)({
                uuid: '2901',
                value: 'temp level'
              }),
              new (bleno.Descriptor)({
                uuid: '2904',
                value: new Buffer([0x04, 0x01, 0x27, 0xAD, 0x01, 0x00, 0x00]) // maybe 12 0xC unsigned 8 bit
              })
            ]
          })
        ],
        onReadRequest: (offset, callback) => {
          console.log('read request!!!');
          callback(0x00, new Buffer([0x10]));
        }
      })
    ]);
  }
});