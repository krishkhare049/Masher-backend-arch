import { Model } from '@nozbe/watermelondb'
import { relation, text, field } from '@nozbe/watermelondb/decorators'

export default class ConversationOtherParticipant extends Model {
  static table = 'conversation_other_participants'
  static associations = {
    conversations: { type: 'belongs_to', key: 'conversation_id' },
  }

  @field('user_id') userId
  @field("conversation_id") conversationId;
  @field("is_admin") isAdmin;
  @field("added_at") addedAt;

  @relation('conversations', 'conversation_id') conversation

}