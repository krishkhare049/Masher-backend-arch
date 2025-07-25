const express = require('express');
const router = express.Router();
const s3uploadController = require('../controllers/s3uploadController');

// router.get('/getConversationAllMessages/:conversationId', conversationController.getConversationAllMessages);
// router.get('/getConversationAllMessagesByParticipants/:otherParticipantId', conversationController.getConversationAllMessagesByParticipants);
// router.get('/getGroupConversationData/:conversationId', conversationController.getGroupConversationData);
// router.get()
// router.get()
// router.get()
// router.get()
// router.get()
// router.post()
// router.delete('/deleteConversation/:conversationId', conversationController.deleteConversation)
router.post('/getProfileImagePresignedUploadUrl', s3uploadController.getProfileImagePresignedUploadUrl)
router.post('/getGroupIconPresignedUploadUrl', s3uploadController.getGroupIconPresignedUploadUrl)
// router.post('/deleteImageFromS3', s3uploadController.deleteImageFromS3)
router.post('/deleteProfileImageFromS3', s3uploadController.deleteProfileImageFromS3)
router.post('/deleteGroupIconFromS3', s3uploadController.deleteGroupIconFromS3)
router.post('/saveProfileImageKey', s3uploadController.saveProfileImageKey)
router.post('/saveGroupIconKey', s3uploadController.saveGroupIconKey)
// router.post('/createNewGroup', upload_group_img.single('groupIcon'),conversationController.createNewGroup)
// router.post('/addGroupIcon', upload_group_img.single('groupIcon'),conversationController.addGroupIcon)
// router.post('/removeGroupIcon', conversationController.removeGroupIcon)
// router.post('/editGroupDetails', conversationController.editGroupDetails)


module.exports = router;