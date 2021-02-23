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

## Update

To update the site

* `git pull` the new version
* active the virtual env (`. venv/bin/activate`)
* install the updated package (`pip install .[deploy]`)

Then [reload gunicorn (`kill -HUP $MAINPID`)](https://docs.gunicorn.org/en/stable/faq.html#how-do-i-reload-my-application-in-gunicorn). You can find `$MAINPID` by running
`systemctl status swellnote-api`.

## Managing Gunicorn

Check out [the Gunicorn Signals documentation](https://docs.gunicorn.org/en/stable/signals.html) for info on how to reload configuration, change
worker count, etc., with signals.


## HTTPS

I followed [the Let's Encrypt instructions](https://certbot.eff.org/lets-encrypt/ubuntufocal-nginx) to set up a TLS certificate on my server.