import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from "aws-cdk-lib/aws-lambda";

export class AppLaunchMonitoringStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lambda
    const handler = new lambda.Function(this, "AppLaunchLambda", {
      functionName: "MacrodroidAppLaunch",
      runtime: lambda.Runtime.PYTHON_3_12,
      code: lambda.Code.fromAsset("resources"),
      handler: "app_launch_monitoring.app_launch_handler"
    });
    // Policy
    const policy = new iam.PolicyStatement({
      actions: ['cloudwatch:PutMetricData'],
      resources: ["*"]
    });
    handler.addToRolePolicy(policy);

    // API Gateway
    const api = new apigateway.RestApi(this, "AppLaunchAPI", {
      restApiName: "Macrodroid App Launch Monitoring Service",
      description: "This service monitors app launch events from Macrodroid."
    });
    const appLaunchIntegration = new apigateway.LambdaIntegration(handler, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' }
    });
    api.root.addMethod("POST", appLaunchIntegration);

    // output - url
    new cdk.CfnOutput(this, 'App Launch API', {
      value: api.url,
    });
  }
}
