const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {upload_profile_img} = require('../middlewares/profile_image_mw')


router.get('/getUserConversations', userController.getUserConversations)
// router.get('/searchUserByName/:text/:skip', userController.searchUserByName)

router.get('/searchUserByName/:text', userController.searchUserByName)
router.get('/searchUserByNameUniqueConvoId/:text/:conversationId', userController.searchUserByNameUniqueConvoId)

router.get('/getUserSearchHistory', userController.getUserSearchHistory)
router.post('/addUserSearchHistory', userController.addUserSearchHistory)
router.post('/deleteSearchElement', userController.deleteSearchElement)
router.post('/deleteFullSearchHistory', userController.deleteFullSearchHistory)

router.get('/getUserData', userController.getUserData)
router.get('/getOtherUserData/:otherUserId', userController.getOtherUserData)
router.post('/updateUserDetails', userController.updateUserDetails)
router.post('/updateUsername', userController.updateUsername)
router.post('/uploadProfileImage', upload_profile_img.single("fileData"), userController.uploadProfileImage)
router.post('/removeProfileImage', userController.removeProfileImage)


router.get('/getUserNotifications', userController.getUserNotifications)
router.post('/addUserNotifications', userController.addUserNotifications)
router.post('/deleteUserNotifications', userController.deleteUserNotifications)
router.post('/deleteAllNotifications', userController.deleteAllNotifications)
// router.get()
// router.get()

router.get('/getOnlineUsers', userController.getOnlineUsers)


module.exports = router;