const localtunnel = require('localtunnel');

(async () => {
  const tunnel = await localtunnel({ port: 3000 }); // Adjust the port if necessary
  console.log(`LocalTunnel is running at: ${tunnel.url}`);

  tunnel.on('close', () => {
    console.log('Tunnel closed');
  });
})();
