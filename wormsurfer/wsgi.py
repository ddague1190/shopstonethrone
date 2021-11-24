"""
WSGI config for wormsurfer project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/howto/deployment/wsgi/
"""

import os
import logging
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'wormsurfer.settings')

application = get_wsgi_application()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(name)s %(levelname)-8s %(message)s",
)
