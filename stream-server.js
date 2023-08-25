const Stream = require('node-rtsp-stream');

const stream = new Stream({
  name: 'name',
  streamUrl: 'rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mp4',
  wsPort: 9999,
  ffmpegOptions: {
    '-stats': '',
    '-r': 30
  }
});
