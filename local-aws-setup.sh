#!/bin/sh

# Setup AWS environment variables
echo "Setting AWS environment variables for LocalStack"

export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_SESSION_TOKEN=test
export AWS_DEFAULT_REGION=us-east-1
export AWS_DEFAULT_OUTPUT=json

echo "AWS_ACCESS_KEY_ID=test"
echo "AWS_SECRET_ACCESS_KEY=test"
echo "AWS_SESSION_TOKEN=test"
echo "AWS_DEFAULT_REGION=us-east-1"
echo "Setting AWS CLI output format to json"

# Wait for LocalStack to be ready by inspecting the response from healthcheck
HEALTH_CHECK_URL="http://localhost:4566/_localstack/health"

while true; do
    RESPONSE=$(curl --silent $HEALTH_CHECK_URL)
    echo "LocalStack health check response:"
    echo "$RESPONSE"

    # Extract the status using jq
    DYNAMODB_STATUS=$(echo "$RESPONSE" | jq -r '.services.dynamodb')
    S3_STATUS=$(echo "$RESPONSE" | jq -r '.services.s3')

    echo "DynamoDB Status: $DYNAMODB_STATUS"
    echo "S3 Status: $S3_STATUS"

    # Adjust the check to handle 'available' status as well
    if [ "$DYNAMODB_STATUS" = "running" ] || [ "$DYNAMODB_STATUS" = "available" ]; then
        if [ "$S3_STATUS" = "running" ] || [ "$S3_STATUS" = "available" ]; then
            echo 'LocalStack Ready'
            break
        fi
    fi

    echo "Waiting for LocalStack to be ready..."
    sleep 5
done

# Create our S3 bucket with LocalStack
echo "Creating LocalStack S3 bucket: fragments"
aws --endpoint-url=http://localhost:4566 s3api create-bucket --bucket fragments || echo "S3 bucket 'fragments' already exists"

# Check if the DynamoDB table already exists
TABLE_EXISTS=$(aws --endpoint-url=http://localhost:4566 dynamodb list-tables --output json | jq -r '.TableNames[]' | grep fragments)

if [ -z "$TABLE_EXISTS" ]; then
    # Create DynamoDB Table with LocalStack
    echo "Creating DynamoDB table: fragments"
    aws --endpoint-url=http://localhost:4566 \
    dynamodb create-table \
        --table-name fragments \
        --attribute-definitions \
            AttributeName=ownerId,AttributeType=S \
            AttributeName=id,AttributeType=S \
        --key-schema \
            AttributeName=ownerId,KeyType=HASH \
            AttributeName=id,KeyType=RANGE \
        --provisioned-throughput \
            ReadCapacityUnits=10,WriteCapacityUnits=5

    # Wait until the Fragments table exists in LocalStack, so we can use it
    aws --endpoint-url=http://localhost:4566 dynamodb wait table-exists --table-name fragments
else
    echo "DynamoDB table 'fragments' already exists"
fi

# Indicate completion and exit
echo "Setup complete. Exiting script."
exit 0
