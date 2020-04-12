locals {
  secrethub_dir = "vdtn359/start/vdtn359-news"
}

provider "secrethub" {
  credential = file("~/.secrethub/credential")
}

data "secrethub_secret" "digitalocean_token" {
  path = "${local.secrethub_dir}/digitalocean-token"
}
