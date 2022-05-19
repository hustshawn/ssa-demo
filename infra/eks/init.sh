aws cloudformation create-stack \
  --stack-name ClusterCreateRoleStack \
  --template-body file://$(pwd)/ClusterCreateRoleStack.yaml \
  --capabilities CAPABILITY_NAMED_IAM
export AWS_PROFILE=ClusterCreate
# eksctl create cluster -f eks-cluster.yml

aws iam create-policy --policy-name backend-app-s3-write --policy-document file://$(pwd)/backend-app-s3-policy.yaml

# eksctl utils associate-iam-oidc-provider --region=ap-southeast-1 --cluster=ssa-demo
# eksctl create iamserviceaccount --cluster=ssa-demo --name=backend-app --role-only --role-name=backend-app-irsa  --attach-policy-arn=arn:aws:iam::aws:policy/AmazonS3FullAccess
# kubectl annotate sa backend-app eks.amazonaws.com/role-arn=arn:aws:iam::414879998402:role/backend-app-irsa --overwrite
