import { schemaMigrations } from '@nozbe/watermelondb/Schema/migrations'

export default schemaMigrations({
  migrations: [
    // We'll add migration definitions here later
    {
      toVersion: 2,
      steps: [
        {
          type: "add_columns",
          table: "conversations",
          columns: [
            { name: "group_description", type: "string", isOptional: true },
          ],
        },
        {
          type: "add_columns",
          table: "users",
          columns: [
            { name: "user_description", type: "string", isOptional: true },
          ],
        },
        {
          type: "add_columns",
          table: "otherUsers",
          columns: [
            { name: "user_description", type: "string", isOptional: true },
          ],
        },
      ],
    },
  ],
})