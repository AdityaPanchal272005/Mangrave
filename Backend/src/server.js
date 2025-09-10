const http = require('http');
const app = require('./app');
const { port } = require('./config/env');

const server = http.createServer(app);

server.listen(port, () => {
	console.log(`Server listening on http://localhost:${port}`);
});


