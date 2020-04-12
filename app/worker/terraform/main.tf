provider "heroku" {
  version = "~> 2.0"
  api_key = data.secrethub_secret.heroku_token.value
}

resource "heroku_app" "worker_app" {
  name   = "vdtn359-news-worker"
  region = "us"
  stack = "container"
  config_vars = {
    FIREBASE_PRIVATE_KEY=data.secrethub_secret.firebase_private_key.value
    SENTRY_REPORTING_DSN=data.secrethub_secret.sentry_dsn.value
    ES_USERNAME=var.es_username
    ES_PASSWORD=data.secrethub_secret.es_password.value
    REDIS_PASSWORD=data.secrethub_secret.redis_password.value
    LOGZ_TOKEN=data.secrethub_secret.logz_token.value
  }
}
