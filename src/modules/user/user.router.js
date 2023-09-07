 import { Router } from "express"; 
 const router = Router()
 router.get('/home',(req,res,next)=>{
    return res.json({message : "Hello from user side "})
 })

 export default router