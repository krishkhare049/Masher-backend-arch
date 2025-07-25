<!-- formik and error in create login and other inputs  - B done
resolve errors after login and signup - A done
application server and socket io server on different port - A+ done -->
<!-- notifications page and search page- C done partially -->

after deleting conversation, it is not coming when messaging next time - A+ done (fetch from getConversationUnDeliveredMessages for normal and just fetch from deletedAtMessageId for restoring)
profile image uploading and loading and user data loading and updating and password changing- A

show online users (online users are already stored in redis then query redis to check if required (users who are already in conversations) users are online) and typing (directly emit from client to server and then server to all client which have conversations with user using database query) - A

update username option in settings - B - check

proper data saving and not loading again and again when component unmounts - B
use realm to store data and setup fetching data from storage in chats - A+
voice chat and emoji keyboard

Scheduled messages - E
Threaded conversations - E
Whisper mode - E
Self destructing messages - done - check

customization (custom chat themes and fonts) - paid premium feature - C

in-app storage like whatsapp which will make application fast and also reduce load on servers

Complete app, make ads using ai and do marketing through social media accounts

max 15 searches to be stored - D

max 200 - to be allowed at a group

for edited messages, store array in user conversation and when user updates it in client send api to delete it from his conversations editedMessages array and whenever user will use get api to load editedMessages and after loading them and storing/updating them in client side storage successfully, client will post request and clear all editedMessages in his conversations

# use useEffect to prevent multiple renders when states changes like data etc (or visiting new page or etc)


save conversations and messages


use getConversations (allmessages and also of byparticipants) and find messages in which my user id is not included in delivered field
(don't worry it will increase much load on server because when user is connected, messages will be delivered by socket connection or notification, else we will use it to fetch conversations' messages)

and when messages are saved in user's device send request that message is delivered to userId


no need to create a realm instance, i am already following correct approach by using realm provider and i just have to use userealm wherever i need it.

Deadline - 14/03/2025

# Make sure to fix -  that when user deletes it if he is offline then it will be deleted but if new message has already come but not loaded, user will not be able to see it because conversation id is already pulled until the sender send another message.
or prevent deletion when offline

check again by running multiple instances of redis because may be multiple messages are coming because i was not using socket.off to remove event listeners when component unmounts, so maybe because of that multiple events are sending and receiving

send message with isSender field
migration strategy
threaded conversation
online functionality and global typing
update strategy - ota by expo updates for frequent updates, new update from play store for any native changes, permission etc
final error checking & testing



useMemo, React.memo, useCallback for optimization and flashlist

apply animated view, shared transition etc


<!-- ////////////////////// -->
After completing apps, visit each module documentation for proguard rules to reduce apk size

# Yes, dividing this code into multiple components will improve your app's performance and maintainability. Here’s why:

🚀 Benefits of Componentization
Better Performance

React re-renders only changed components instead of the entire screen.
If you extract parts like the header, message list, and input bar into separate components, React will only update them when needed.
Improved Readability & Maintainability

Your file becomes more structured, making it easier to debug and modify.
Code Reusability

Components like MessageInput and MessageList can be reused elsewhere in your app.

<!-- First complete this version fully optimized and low size then add features, nahi to phir beta kya dikhaoge ki app toh par abhi kaam chal rha hai -->

<!-- Todo- -->

unreadMessagesCount (added in code but implement update when new msg arrive and socket io events)
description (added in user page, create update box in edit profile)
lastSeen (socket io events for online and lastSeen)
blocked
message forwarding - easy (don't show forwarded)

send message with isSender field (save in frontend first for quick visual)
migration strategy
threaded conversation
online functionality (added in app, setup socket io events for online and lastSeen) and global typing

update strategy - ota by expo updates for frequent updates, new update from play store for any native changes, permission etc
final error checking & testing


eas.json -
{
    "build": {
      "production": {
        "android": {
          "proguardRules": "proguard-rules.pro",
          "gradleCommand": ":app:assembleRelease",
          "env": {
            "EXPO_USE_HERMES": "1"
          }
        }
      }
    }
  }
  


optimized bare react native - 5 to 8mb or maybe 7mb starting
and also if expo apk is 90mb(universal) and aab 110mb then resulting apk size in play store will be about 30-50mb

don't store read recipients in mobile because we will not implement this feature because it will increase realm storage and load on our servers. Important point - Its against user's privacy so in documentation or presentation write it like this-

""" We don't let others know whether seen a message or not in group functionality, which provides you flexibility in conversations.

# That's how i should talk and write and express as an entrepreneur

But let users know if seen or not

store 50 searches in search server and mobile

lastSeen, isOnline - find it using messaging screen immediately, dont store it
Will store online or seen in redux state

i am using gradlew assemblerelease in expo

<!-- Deleting expo dev client for today to check apk size, will install it again after checking -->

So npx expo prebuild adds the configurations like name, icon, package name


Check and uncomment after installing realm, realm/react
// Will uncomment after installing realm


# New realm version don't have binaries in jnilabs (they only have binaries in prebuild)
So i am switching to watermelon db from realm but not removing any existing code


<!-- Heavy dependencies -->
<!-- Removed react native vector icons because already present and not required additionally in expo -->
redux toolkit - 7mb
axios - 2mb
react-native-gesture-handler - 4mb
react-native-paper - 3.85mb
react-native-reanimated - 3mb
react-native-screens - 1.72mb
react-native-svg - 4mb

Modifying Schema
Watermelon cannot automatically detect Schema changes. Therefore, whenever you change the Schema, you must increment its version number (version: field).

During early development, this is all you need to do - on app reload, this will cause the database to be cleared completely.

To seamlessly update the schema (without deleting user data), use Migrations.

⚠️ Always use Migrations if you already shipped your app.

Use migration docs


# syncing of database for markasdeleted()

<!-- fix upsertBulkConversations and use- --> fixed with chunks mechanism

fix date field to 0 issue

fix login, create

add group functionality - save group data, group in messaging screen


<!-- Fix messagingscreen states -->

test dates - just run app and server - done
setup and divide states efficiently - done


clear states like sticky header on return - done

group and messages count with unread count - done

more icon create group menu back ubtton and states handling - done

find messages by other participants for search - done


proper state handling for basechat list just like messaging screen to make sure that states render only required components - done

offline fallbacks for data for different screens

onclick toggle if mess menu is visible

check if react.memo degrade performance for message list and chat list because it matches prev and next props - done improves if a good shallow comparision

filter search in chats - done

check legend list

whenever user opens conversation, user will be scrolled to bottom that means he/she will have seen all messages.

npm i react-native-popup-menu - done



🔥 Advanced Strategies for Native Ads Optimization:
1. Optimize for Visibility
Use the onViewableItemsChanged listener in FlashList to track which items are visible to the user, ensuring your native ad is shown only when it's fully visible.

This prevents unseen impressions, and you’ll get credit only for ads that are in view for a significant time.

Example code:

javascript
Copy
Edit
<FlashList
  data={messages}
  renderItem={renderItem}
  onViewableItemsChanged={viewableItemsChangedHandler}
/>
2. Native Ad Pl


select only png and jpeg images

fix full group functionality
online functionality- fetch /onlineUsers depending on conversations of users, when a user connects to socket send its id / data to his friends
store all this online users somewhere in app - redux, db or something

<!-- For online user list - show latest 100 and in messaging screen show that user's status -->
Check sendOnlineUpdateToFriends of chat and also test online functionality and how every socket connection works

add a timer box in input to set destructing time for messages and also store this field in watermelon db and remove message offline whenever expired

alert functionality

Load participants data whenever user opens the group instead of fetching each time in chat page refresh/ Because even if user opens group nine times still we have to process 9 requests

# Whenever user updates the group, first check in backend if this user is included in admins or not

1. admin panel for group, image issue, upsert error on new message and message problem in grp and msgscreen, add remove participants, exit group
2. Fix common js issue on chat/

3. A query that if participant of group removed then will also be removed from admins if a admin

# Read the below to reduce db calls performance if need to acces fields and then update but if only update then findONeandUpdate is faster and efficient

Great question, Krish! Let's clarify how both findOne() and findOneAndUpdate() behave and what the best approach is for your removeGroupIcon() function.

✅ Your Goal:
Check if user is in admins array of the conversation.

If yes: Delete the group icon file (if not default).

Then update groupIcon field to the default one.

🧠 Difference Between findOne() and findOneAndUpdate():
findOne() fetches the full document — lets you inspect and modify it manually using .save().

findOneAndUpdate() directly applies the update in one atomic DB operation — but you won’t have access to intermediate logic unless you explicitly use the returned document.

🔍 In Your Case:
Your version uses findOne() to:

Check if the user is admin ✅

Get the current groupIcon ✅

Do a file deletion if it's not default ✅

Then uses findOneAndUpdate() to:

Set the groupIcon to default ✅

That’s perfect for what you need: check → access → update.

🔁 My Suggestion (Using .save()):
My version:

js
Copy
Edit
conversation.groupIcon = null;
await conversation.save();
✅ This does update the field in the DB — just like findOneAndUpdate.

However:

It assumes the current document (conversation) was already validated for access.

It avoids a second DB operation (which you used with findOneAndUpdate).

✅ Best Approach for You:
Your current code is totally valid and preferred if:

You need to delete the image file based on current groupIcon.filename before updating.

You want clear control flow (first check, then update).

But if you want to make it cleaner and still safe, you can combine both like this:

✅ Suggested Cleaner Version:
js
Copy
Edit
async function removeGroupIcon(req, res) {
  try {
    const user_id = req.user_id;
    const conversationId = req.body.conversationId;
    const userObjectId = new mongoose.Types.ObjectId(user_id);

    // Find conversation & check admin
    const conversation = await Conversation.findOne({
      _id: conversationId,
      admins: { $in: [userObjectId] },
    });

    if (!conversation) {
      return res.status(403).json({ message: "Admin rights required." });
    }

    const oldGroupIcon = conversation.groupIcon;

    // Delete image file if it's not default
    if (oldGroupIcon.filename !== "default_group_icon") {
      const iconPath = `/MasherStorage/group_icons/${oldGroupIcon.filename}`;
      access(iconPath, constants.F_OK, (err) => {
        if (!err) fs.rmSync(iconPath);
        else console.log("Group icon does not exist.");
      });
    }

    // Update groupIcon field directly and save
    conversation.groupIcon = {
      filename: "default_group_icon",
      updated_at: moment().toISOString(),
    };

    await conversation.save();

    res.send("deleted_profile_image_successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("error_occurred");
  }
}
✅ Summary:
✔ Your approach works.

✔ .save() also updates the field.

❌ Don’t forget to return after sending a response.

✅ Use .save() if you already have the document and are modifying it step-by-step.

Let me know if you want to also add file deletion logs or handle access() using await fs.promises.access() for cleaner async handling.











<!-- Functionalities need to create- -->
Home search,
Anonymous chat - not for now
Customization - done
Privacy - not for now
Payments - not for now
Change password - done
Blocked - not for now
Security - not for now
parent message - not for now
long click - X

<!-- today- -->
conversation model change - done
leave group and second admin - done
add and remove particpants - done
user profile description and update only if changed
group desc and rules page

<!-- yester -->
change password - done
realtime messaging, online users - done
network, error handling like leaving grp when user offline or failed
search mic
optimize

<!-- 24 -->
launch on aws, m0 - done
reddit post, linkedin etc
generate full production build and test

<!-- 25 -->
Ask parents for 2000 rs for google developer account
Launch app
Tell friends to test it
Continuosly work on features


java -jar bundletool.jar build-apks --bundle=app.aab --output=output.apks --ks=@krish_khare__Masher.jks --ks-key-alias=0acbd403271241fee54733ca65b4c7b0 --ks-pass=pass:0acbd403271241fee54733ca65b4c7b0  --key-pass=pass:7fcd7a05521b999a2610c68d0304e11d


Therefore from eas production aab after splitting actual masher size can be around 16 mb done locally using bundletool. may vary for play store


use timestamp cursor instead of skip- more efficient, consistent - changing all skip query in backend

play console address verification - pnb bank statement within recent 3 months - latest month to last month


group socket message to all members
redis - check

# post to linkedin & twitter & reddit

e2ee
ota
notifications

# publish on google play store
# shoot demo one for online awareness and one for clg friends and linkedIn to approach them for testing
# first tell them to send their email and i will send them link and then tell them to test it
# then as they use add more features they like and after the app is published, add admob and then keep ads minimal and give offers like customization, blue tick, stickers etc

# Ads - stories (btw video ads or something)

<!-- Dont show ads on testing version -->

<!-- Remember in India - I just need to earn 10 Rs per user and in US android only in starting i need to earn nearly 30-40 Rs. -->
<!-- Once i get more than 100k users and if i find out that tier1 countries are generating more revenue than india or tier3 countries i may temporarily shut from tier 3 countries -->