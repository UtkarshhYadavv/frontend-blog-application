const router=require("express").Router();
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const {body,validationResult}=require("express-validator");
const {v4:uuid}=require("uuid");
const {read,write}=require("../lib/store");
const validate=(req,res,next)=>{const errors=validationResult(req);if(!errors.isEmpty())return res.status(400).json({message:errors.array()[0].msg});next();};
const publicUser=u=>({id:u.id,name:u.name,email:u.email});
function makeToken(user){return jwt.sign({id:user.id,email:user.email},process.env.JWT_SECRET,{expiresIn:"7d"});}
router.post("/register",
 body("name").trim().isLength({min:2,max:60}).withMessage("Name must be 2 to 60 characters."),
 body("email").trim().isEmail().withMessage("Enter a valid email address."),
 body("password").isLength({min:6,max:100}).withMessage("Password must be at least 6 characters."),
 validate,async(req,res)=>{
 const users=read("users");const email=req.body.email.trim().toLowerCase();
 if(users.some(u=>u.email===email))return res.status(409).json({message:"An account with this email already exists."});
 const user={id:uuid(),name:req.body.name.trim(),email,passwordHash:await bcrypt.hash(req.body.password,12),createdAt:new Date().toISOString()};
 users.push(user);write("users",users);
 res.status(201).json({message:"Account created.",user:publicUser(user),token:makeToken(user)});
});
router.post("/login",
 body("email").isEmail().withMessage("Enter a valid email address."),
 body("password").notEmpty().withMessage("Password is required."),validate,
 async(req,res)=>{
 const email=req.body.email.trim().toLowerCase();const user=read("users").find(u=>u.email===email);
 if(!user||!(await bcrypt.compare(req.body.password,user.passwordHash)))return res.status(401).json({message:"Email or password is incorrect."});
 res.json({message:"Logged in.",user:publicUser(user),token:makeToken(user)});
});
const auth=require("../middleware/auth");
router.get("/me",auth,(req,res)=>{
 const user=read("users").find(u=>u.id===req.user.id);
 if(!user)return res.status(404).json({message:"User not found."});
 res.json({user:publicUser(user)});
});
module.exports=router;
