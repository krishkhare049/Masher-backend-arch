import { Model } from '@nozbe/watermelondb'
import { text, field, children } from '@nozbe/watermelondb/decorators'

export default class OtherUser extends Model {
  static table = 'otherusers'

  
   static associations = {
    conversation_other_participants: { type: 'has_many', foreignKey: 'message_id' },
  }

  @field('user_id') userId
  @field('full_name') fullName
  @field('joined') joined
  @field('username') username
  @field('user_description') userDescription
  @field('profile_img_filename') profileImgFilename

  @children("messages") messages; // 👈 hasMany (parent → children)

}