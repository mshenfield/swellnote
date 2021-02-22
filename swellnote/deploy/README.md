# Deployment Configuration

This directory contains configuration and instructions to deploy this on a Digital Ocean droplet. It should
pretty much work on any machine, but haven't tried it yet.

## Requirements

Make sure git, nginx, and a recent version of python3 are installed:

```
apt-get update
apt-get install python3 nginx git
```

Clone the public repository to a non-root user ([instructions to make a non-root user here](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-20-04).

cd into the directory and make a virtualenv:

```
cd path/to/swellnote
python -v venv venv
. venv/bin/active # or the active for your shell of choice
```

Pip install the deployment version of the project

```
pip install .[deploy]
```

## Setup
Once you've completed the steps above, copy the files in this folder to the destinations described in their comments.  Then run

```
sudo systemctl reload swellnote
```

To start the gunicorn workers.  nginx should already be serving the site.
