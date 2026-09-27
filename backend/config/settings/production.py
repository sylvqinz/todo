import os

import dj_database_url

from .base import *

# ==============================================================================
# SECURITE
# ==============================================================================

SECRET_KEY = os.environ.get('SECRET_KEY')
DEBUG = False
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '').split(',')
CORS_ALLOWED_ORIGINS = os.environ.get('CORS_ALLOWED_ORIGINS', '').split(',')

# ==============================================================================
# BASE DE DONNEES
# ==============================================================================

DATABASES = {
    'default': dj_database_url.config(
        conn_max_age=600,
        ssl_require=True,
    )
}

# ==============================================================================
# FICHIERS STATIQUES (WHITENOISE)
# ==============================================================================


# Tout à la fin du fichier production.py
import sentry_sdk 
from sentry_sdk.integrations.django import DjangoIntegration

SENTRY_DSN = os.environ.get('SENTRY_DSN')

if SENTRY_DSN:
    sentry_sdk.init(
        dsn=SENTRY_DSN,
        integrations=[DjangoIntegration()],
        traces_sample_rate=1.0, # Capture 100% des transactions pour le monitoring de perf.
        send_default_pii=True
        )