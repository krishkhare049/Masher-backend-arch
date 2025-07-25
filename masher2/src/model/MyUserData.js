import { Model } from '@nozbe/watermelondb'
import { field, text } from '@nozbe/watermelondb/decorators'

export default class MyUserData extends Model {
  static table = 'myuserdata'

  @field('user_id') userId
  @field('full_name') fullName
  @field('joined') joined
  @field('user_email') userEmail
  @field('username') username
  @field('user_description') userDescription
  @field('profile_img_filename') profileImgFilename

}