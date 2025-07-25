import { Model } from '@nozbe/watermelondb'
import { field, text } from '@nozbe/watermelondb/decorators'

export default class SearchQuery extends Model {
  static table = 'searchqueries'

  @field('search_query_id') searchQueryId
  @field('searched_user') searched_user
  @field('searched_at') searched_at

}