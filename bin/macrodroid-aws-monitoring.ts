#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AppLaunchMonitoringStack } from '../lib/app-launch-monitoring-stack';

const app = new cdk.App();
new AppLaunchMonitoringStack(app, 'AppLaunchMonitoringStack', {});