locals {
  region = "ap-southeast-1"
}

provider "aws" {
  region = local.region
}


resource "aws_s3_bucket" "demo_bucket" {
  bucket = "my-ssa-demo"

}

resource "aws_s3_bucket_cors_configuration" "bucket_cors_rules" {
  bucket = aws_s3_bucket.demo_bucket.bucket

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "HEAD", "PUT", "POST"]
    allowed_origins = ["*"]
    expose_headers  = []
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "bucket_encryption" {
  bucket = aws_s3_bucket.demo_bucket.bucket

  rule {
    bucket_key_enabled = false
    apply_server_side_encryption_by_default {
      sse_algorithm     = "AES256"
    }
  }
}

