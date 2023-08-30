const Stream = require('node-rtsp-stream');

const stream = new Stream({
  name: 'name',
  streamUrl: 'rtsp://localhost:554/test',
  ffmpegOptions: {
    '-stats': '',
    '-r': 30
  }
});
