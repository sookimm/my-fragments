// src/server.js

// shutdown our server
const stoppable = require('stoppable');

// Get logger instance
const logger = require('./logger');

// Get express app instance
const app = require('./app');

// Get the desired port from the process' environment. Default to `8080`
const port = parseInt(process.env.PORT || '8080', 10);

// Start a server listening on this port
const server = stoppable(
  app.listen(port, () => {
    // Log a message that the server has started, and which port it's using.
    logger.info(`Server started on port ${port}`);

    if (process.env.LOG_LEVEL === 'debug') {
      console.log('Environment Variables:', process.env);
    }
  })
);

// Export our server instance so other parts of our code can access it if necessary.
module.exports = server;
