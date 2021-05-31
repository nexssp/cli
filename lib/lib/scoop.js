const ensureBucketAdded = (bucketName) => {
  const cp = require('child_process');
  const buckets = cp.execSync('scoop bucket list').toString().trim();
  if (!buckets.includes(`${bucketName}`)) {
    // Bucket not exists. Adding bucket
    try {
      cp.execSync(`scoop bucket add ${bucketName}`).toString().trim();
    } catch (error) {
      const errorDescription = error.output.toString();
      if (errorDescription.indexOf(`Unknown bucket '${bucketName}'`)) {
        console.error(`Scoop's bucket ${bucketName} does not exist.`);
        return false;
      }
    }
  } else {
    // console.log(`Scoop's bucket ${bucketName} already exists`);
  }
};

module.exports = { ensureBucketAdded };
