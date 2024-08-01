import express from 'express';
import { deleteUser, test, updateUser ,getUserListings,getUser} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router= express.Router(); // 

router.get('/test',test);  // not a best practice to use the all the routes in index.js tha's why used in separate folder     
router.post('/update/:id', verifyToken, updateUser); // extra search to verify the user
router.delete('/delete/:id',verifyToken,deleteUser );
router.get('/listings/:id',verifyToken,getUserListings); // to get listing of user
router.get('/:id',verifyToken,getUser)

export default router; 