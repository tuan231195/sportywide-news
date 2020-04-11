terraform {
  backend "s3" {
    encrypt = true
    bucket = "vdtn359-news-terraform"
    key = "worker/terraform.tfstate"
    region = "ap-southeast-2"
  }
}
