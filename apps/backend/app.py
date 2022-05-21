import boto3
from botocore.client import Config
from flask import Flask
from flask_cors import CORS
import logging
import os

app = Flask(__name__)
CORS(app)


logger = logging.getLogger(__name__)

S3_BUCKET_NAME = os.getenv('S3_BUCKET_NAME', 'my-ssa-demo')
S3_POST_SIGNED_URL_EXPIRES_IN = 10
S3_GET_SIGNED_URL_EXPIRES_IN = os.getenv('IMAGE_DOWNLOAD_EXPIRES_IN', 120)

@app.route("/")
def hello_world():
    return "<p>SSA Demo, image to s3 handler backend. Hello world!</p>"

@app.route("/requestUpload/<img_name>")
def upload(img_name):
    object_key = get_s3_object_key(img_name)
    return generate_presigned_url(object_key, 'put')

@app.route("/requestDownload/<img_name>")
def download(img_name):
    object_key = get_s3_object_key(img_name)
    return generate_presigned_url(object_key)

def generate_presigned_url(object_key, action='get'):
    """
    Generate a presigned Amazon S3 URL that can be used to perform an action.

    :param object_key: The name of the S3 object key.
    :param action: The action to 'get' or 'put' oboject with the presigned url.
    :return: The presigned URL.
    """
    client_method = 'get_object' if action == 'get' else 'put_object'
    expires_in = S3_GET_SIGNED_URL_EXPIRES_IN if action == 'get' else S3_POST_SIGNED_URL_EXPIRES_IN
    method_parameters = {
        'Bucket': S3_BUCKET_NAME,
        'Key': object_key
    }

    try:
        s3_client = boto3.client(
            's3',
            config=Config(signature_version='s3v4')
            )
        url = s3_client.generate_presigned_url(
            ClientMethod=client_method,
            Params=method_parameters,
            ExpiresIn=expires_in
        )
        logger.info("Got presigned URL: %s", url)
    except ClientError:
        logger.exception(
            "Couldn't get a presigned URL for client method '%s'.", client_method)
        raise
    return url

def get_s3_object_key(img_name):
    """
    This function is target to map a client side image name to an actual s3 object key.
    In real world scenario, the backend should conver the client side image name based on some classifiers, eg users and timestamp etc. Such information normally should be put into an external database like DynamoDB as the metadata of the image. So the ideal function should query the DB by the users information.
    An example format of the object key would look like 'userid/yymmdd/image_name'

    For demo purpose, it simply returns the original image name.

    :param img_name: The image name to generate S3 object key.
    :return: An S3 object key
    """
    s3_object_key = img_name
    return s3_object_key