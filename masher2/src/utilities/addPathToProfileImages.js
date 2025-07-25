let EXPO_PUBLIC_S3_BUCKET_URL = process.env.EXPO_PUBLIC_S3_BUCKET_URL;
let API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function addPathToProfileImages(filename) {
    let imageUrl = API_URL + '/static/profile_images/' + filename;
    // let imageUrl = 'https://masher-static-bucket.s3.us-east-1.amazonaws.com/' + filename;
    // console.log(filename)
    // console.log('ll' + EXPO_PUBLIC_S3_BUCKET_URL)
    // let imageUrl = EXPO_PUBLIC_S3_BUCKET_URL + filename;
    console.log('imageUrl:', imageUrl);
    return imageUrl;
}