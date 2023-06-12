const websocket = require('ws');
const fs = require('fs');
const ws = new websocket('ws://localhost:2700');

ws.on('open', function open() {
  // Send the configuration command
  const configCommand = JSON.stringify({ config: { sample_rate: 16000.0 } });
  ws.send(configCommand);

  var readStream = fs.createReadStream('test.wav');
  readStream.on('data', function (chunk) {
    ws.send(chunk);
  });
  readStream.on('end', function () {
    ws.send('{"eof" : 1}');
  });
});

ws.on('message', function incoming(data) {
  console.log(data.toString('utf8'));
});

ws.on('close', function close() {
  process.exit();
});
