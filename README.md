# Swell Note

Message in a bottle simulator.  Enjoy a peaceful moment at the beach, reading messages from strangers and sending some into the ether.

## Architecture

This project uses:

* [HTML/CSS/JS](https://developer.mozilla.org/en-US/docs/Learn) - The frontend is fairly simple, and just uses the tools built into the Web Platform.

* [Flask](https://flask.palletsprojects.com/) - The API that serves random messages and stores new messages is a simple Flask application.  In production, Flask runs under [Gunicorn](https://gunicorn.org/).  In the future I may deploy an nginx frontend to Gunicorn to buffer connections.

* [SQLite](sqlite.org/) - Data is stored in a local SQLite database. Our database uses [the Write Ahead Log (WAL)](https://sqlite.org/wal.html) with [NORMAL synchronous behavior](https://sqlite.org/pragma.html#pragma_synchronous).  The upshot is that writes and reads don't block each other, allowing surprisingly good performance (~3k writes/second).  Writes are guaranteed to be consistent, but we may lose recently written records in the case of a hard reboot while the application is running.


## Roadmap
* We need a way to avoid or filter spam
  * Only allow sending a message every 10 minutes.  Add some UI and include it in the session data.
  * Allow users the choice of throwing away a message or sending it back out.  Delete or block the message from appearing if it is thrown away.
  * Store an identifier in the user's browser and require it to access the API. Store it so that we can quickly identify/delete messages from spammy users.
  * Limit messages to words from an English dictionary.

## Art
Art is by April Petry.
