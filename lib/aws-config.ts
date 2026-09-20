import { S3Client } from '@aws-sdk/client-s3'

export function getBucketConfig() {
  return {
    bucketName: process.env.AWS_BUCKET_NAME ?? '',
    folderPrefix: process.env.AWS_FOLDER_PREFIX ?? '',
  }
}

export function createS3Client() {
  // Support explicit credentials (Vercel/production) and profile-based auth (local AWS CLI)
  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    return new S3Client({
      region: process.env.AWS_REGION ?? 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    })
  }
  // Fall back to default credential chain (AWS_PROFILE, instance role, etc.)
  return new S3Client({ region: process.env.AWS_REGION })
}
