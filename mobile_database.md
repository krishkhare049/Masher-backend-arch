<!-- Using sqlite instead of react/realm because it supports expo.

delete old messages from offline storage(don't delete from backup) when exceeds 2gb

one  - for user storage like name, username, profile img, searches, notifications
second db - for user's data and conversation info and messageIds inside conversations
third db - messages -->

🔹 Why Enable Indexing?
✅ Speeds up queries (filtered(), objectForPrimaryKey())
✅ Best for frequently searched fields (e.g., id, email, username)
✅ Optimizes filtering performance

🔹 How to Apply Schema Changes?
After adding indexing, clear your existing Realm database to apply the schema change.

1️⃣ Uninstall the app (on emulator/device)
2️⃣ Increment the schema version (if using a migration strategy)

Example:

javascript
Copy
Edit
const realm = await Realm.open({
  schema: [PersonSchema],
  schemaVersion: 2, // Increase version to apply changes
});
Now, your indexed fields will improve query performance 🚀.

Let me know if you need more details! 🔥

# use react memo in realm to change only modified data on re-rendering






