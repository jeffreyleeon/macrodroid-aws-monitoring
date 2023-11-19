import boto3
import json

def app_launch_handler(event, context):
    json_str = json.dumps(event)
    print(f"==Event body is: {json_str}")
    httpMethod = event['httpMethod']
    if httpMethod != 'POST':
        error = 'Only support POST requests.'
        print(error)
        return {
            'statusCode': 200,
            'body': json.dumps(error)
        }
    
    print('Start processing event')
    body = event['body'] # AppName
    app_name = body.split('_')[0]
    print(f'Recording app activity for app: {app_name}')

    cloudwatch = boto3.client('cloudwatch')
    response = cloudwatch.put_metric_data(
        Namespace='MacrodroidAppAcitivityMonitoring',
        MetricData=[
            {
                'MetricName': 'AppLaunch',
                'Dimensions': [
                    {
                        'Name': 'AppName',
                        'Value': app_name
                    },
                ],
                'Value': 1,
                'Unit': 'Count'
            },
        ]
    )
    print(f'Cloudwatch response: {response}')

    return {
        'statusCode': 200,
        'body': json.dumps(f'Recorded app activity for app: {app_name}')
    }

