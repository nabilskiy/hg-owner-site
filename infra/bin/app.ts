#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import { SiteStack } from '../lib/site-stack.js';

const app = new cdk.App();
const envName = readEnvName(app.node.tryGetContext('env'));
const domainName = optionalString(app.node.tryGetContext('domainName'));
const hostedZoneId = optionalString(app.node.tryGetContext('hostedZoneId'));
const githubRepo = optionalString(app.node.tryGetContext('githubRepo')) ?? 'OWNER/REPO';
const githubOidcProviderArn = optionalString(app.node.tryGetContext('githubOidcProviderArn'));
const basicAuth = optionalString(app.node.tryGetContext('basicAuth'));
const account = process.env.CDK_DEFAULT_ACCOUNT ?? '000000000000';
const region = process.env.CDK_DEFAULT_REGION ?? 'eu-central-1';

let certificate: acm.ICertificate | undefined;
if (domainName) {
  const certStack = new cdk.Stack(app, `HolidayGetCert-${envName}`, {
    env: { account, region: 'us-east-1' },
    crossRegionReferences: true,
  });
  certificate = new acm.Certificate(certStack, 'Certificate', {
    domainName,
    validation: acm.CertificateValidation.fromDns(),
  });
}

new SiteStack(app, `HolidayGetSite-${envName}`, {
  envName,
  domainName,
  hostedZoneId,
  githubRepo,
  githubOidcProviderArn,
  basicAuth,
  certificate,
  crossRegionReferences: Boolean(certificate),
  env: { account, region },
});

function readEnvName(value: unknown): 'staging' | 'production' {
  if (value === undefined) {
    return 'staging';
  }
  if (value === 'staging' || value === 'production') {
    return value;
  }
  throw new Error('CDK context "env" must be "staging" or "production"');
}

function optionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}
