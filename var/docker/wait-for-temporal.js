const net = require('net');

const address = process.env.TEMPORAL_ADDRESS || 'localhost:7233';
const timeoutMs = Number(process.env.TEMPORAL_WAIT_MS || 180000);

const parsed = (() => {
  if (address.includes('://')) {
    const url = new URL(address);
    return { host: url.hostname, port: Number(url.port || 7233) };
  }
  const [host, port] = address.split(':');
  return { host: host || 'localhost', port: Number(port || 7233) };
})();

function tryConnect() {
  return new Promise((resolve) => {
    const socket = net.connect(
      { host: parsed.host, port: parsed.port },
      () => {
        socket.end();
        resolve(true);
      }
    );
    socket.on('error', () => resolve(false));
    socket.setTimeout(3000, () => {
      socket.destroy();
      resolve(false);
    });
  });
}

async function wait() {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    if (await tryConnect()) {
      console.log(
        `Temporal is reachable at ${parsed.host}:${parsed.port}`
      );
      return;
    }
    console.log(
      `Waiting for Temporal at ${parsed.host}:${parsed.port}...`
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  console.error(
    `Temporal did not become ready at ${parsed.host}:${parsed.port} within ${timeoutMs}ms. Scheduled posts cannot publish without it.`
  );
  process.exit(1);
}

wait();
