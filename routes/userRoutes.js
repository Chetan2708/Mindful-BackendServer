const express = require ('express')
const { registerUser , authUser ,allData, deleteUser ,editUser} = require('../controller/userController')
const { protect } = require('../middlewares/protect')

const router = express.Router()


router.route('/').post(registerUser).get(protect , allData)
router.route('/login').post(authUser)
router.route('/addUser').post(registerUser)
router.delete('/:userId', deleteUser);
router.route("/edit/:id").put(protect, editUser);

module.exports = router   