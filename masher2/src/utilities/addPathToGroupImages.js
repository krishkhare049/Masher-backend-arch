let EXPO_PUBLIC_S3_BUCKET_URL = process.env.EXPO_PUBLIC_S3_BUCKET_URL;
let API_URL = process.env.EXPO_PUBLIC_API_URL;
export default function addPathToGroupImages(filename) {
    let imageUrl = API_URL + '/static/group_icons/' + filename;
    // let imageUrl = EXPO_PUBLIC_S3_BUCKET_URL + filename;
    // console.log('imageUrl:', imageUrl);
    return imageUrl;
}