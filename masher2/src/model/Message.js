import { Model } from "@nozbe/watermelondb";
import { text, field, relation } from "@nozbe/watermelondb/decorators";

export default class Message extends Model {
  static table = "messages";
  static associations = {
    otherusers: { type: 'belongs_to', key: 'user_id' },
  }

  @field("conversation_id") conversationId;
  @field("message_id") messageId;
  @field("sender_id") senderId;
  @field("content") content;
  @field("created_at") createdAt;
  @field("formatted_date") formattedDate;
  @field("is_sender") isSender;
  @field("is_edited") isEdited;

  @relation('otherusers', 'sender_id') sender;// 👈 belongsTo (child → parent)

}
