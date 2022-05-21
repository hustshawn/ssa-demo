# Prepare cluster create role
# aws cloudformation create-stack \
#   --stack-name ClusterCreateRoleStack \
#   --template-body file://$(pwd)/ClusterCreateRoleStack.yaml \
#   --capabilities CAPABILITY_NAMED_IAM
# Prepare the policy for backend app
# aws iam create-policy --policy-name backend-app-s3-write --policy-document file://$(pwd)/backend-app-s3-policy.yaml


export ACCOUNT_ID=414879998402
export AWS_DEFAULT_REGION=ap-southeast-1
export AWS_PROFILE=ClusterCreate
# eksctl create cluster -f eks-cluster.yml
export CLUSTER_NAME=ssa-demo
eksctl create iamidentitymapping --cluster $CLUSTER_NAME --region=ap-southeast-1 --arn arn:aws:iam::414879998402:role/EksCodeBuildKubectlRole --group system:masters --username build
