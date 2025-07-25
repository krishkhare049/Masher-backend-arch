import { Model } from '@nozbe/watermelondb'
import { field, text } from '@nozbe/watermelondb/decorators'

export default class Notification extends Model {
  static table = 'notifications'

  @field('notification_id') notificationId
  @field('text') text
  @field('type') type
  @field('person') person
  @field('icon') icon
  @field('created_at') created_at
  @field('data') data

}