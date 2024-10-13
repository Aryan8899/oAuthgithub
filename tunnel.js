const localtunnel = require('localtunnel');

(async () => {
  const tunnel = await localtunnel({ port: 3000 });  // Make sure you're using the correct port
  console.log(`LocalTunnel is running at: ${tunnel.url}`);

  tunnel.on('close', () => {
    console.log('Tunnel closed');
  });
})();
