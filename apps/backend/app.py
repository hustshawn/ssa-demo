import boto3
import os

from flask import Flask

app = Flask(__name__)

S3_BUCKET_NAME = os.getenv('S3_BUCKET_NAME', 'my-ssa-demo')
S3_POST_SIGNED_URL_EXPIRES_IN = 10
S3_GET_SIGNED_URL_EXPIRES_IN = os.getenv('IMAGE_DOWNLOAD_EXPIRES_IN', 120)

@app.route("/")
def hello_world():
    return "<p>SSA Demo, image to s3 handler backend</p>"

@app.route("/requestUpload/<img_name>")
def upload(img_name):
    s3_client = boto3.client('s3')
    return s3_client.generate_presigned_post(
        Bucket = S3_BUCKET_NAME,
        Key = get_s3_object_key(img_name),
        ExpiresIn = S3_POST_SIGNED_URL_EXPIRES_IN
    )

@app.route("/requestDownload/<img_name>")
def download(img_name):
    s3_client = boto3.client('s3')
    return s3_client.generate_presigned_url(
        ClientMethod='get_object', 
        Params={
            'Bucket': S3_BUCKET_NAME, 
            'Key': get_s3_object_key(img_name)
        },
        ExpiresIn=S3_GET_SIGNED_URL_EXPIRES_IN)


def get_s3_object_key(img_name):
    """
    This function is target to map a client side image name to an actual s3 object key.
    In real world scenario, the backend should conver the client side image name based on some classifiers, eg users and timestamp etc. Such information normally should be put into an external database like DynamoDB as the metadata of the image. So the ideal function should query the DB by the users information.
    An example format of the object key would look like 'userid/yymmdd/image_name'

    For demo purpose, it simply returns the original image name.
    """
    s3_object_key = img_name
    return s3_object_key