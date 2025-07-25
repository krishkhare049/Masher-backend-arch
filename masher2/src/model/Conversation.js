import { Model } from '@nozbe/watermelondb'
import { children, field, text } from '@nozbe/watermelondb/decorators'

export default class Conversation extends Model {
  static table = 'conversations'
  static associations = {
    conversation_other_participants: { type: 'has_many', foreignKey: 'conversation_id' },
  }

  @field('conversation_id') conversationId
  @field('is_group') isGroup
  @field('is_admins_approve_members') isAdminsApproveMembers
  @field('is_edit_permissions_members') isEditPermissionsMembers
  @field('group_name') groupName
  @field('group_description') groupDescription
  @field('group_icon') groupIcon
  @field('created_at') createdAt
  @field('last_message') lastMessage
  @field('updated_at') updatedAt
  @field('formatted_updated_date') formattedUpdatedDate
  @field('unread_messages_count') unreadMessagesCount

  @children('conversation_other_participants') conversationOtherParticipants
}