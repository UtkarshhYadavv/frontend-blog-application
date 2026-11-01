const router=require("express").Router();
const {body,validationResult}=require("express-validator");
const {v4:uuid}=require("uuid");
const {read,write}=require("../lib/store");
const auth=require("../middleware/auth");
const categories=["Technology","Design","Lifestyle","Learning"];
const validate=(req,res,next)=>{const e=validationResult(req);if(!e.isEmpty())return res.status(400).json({message:e.array()[0].msg});next();};
const blogRules=[
 body("title").trim().isLength({min:3,max:90}).withMessage("Title must be 3 to 90 characters."),
 body("category").isIn(categories).withMessage("Choose a valid category."),
 body("readTime").isLength({min:1,max:30}).withMessage("Read time is required."),
 body("excerpt").trim().isLength({min:5,max:180}).withMessage("Description must be 5 to 180 characters."),
 body("content").trim().isLength({min:10,max:20000}).withMessage("Story must be at least 10 characters.")
];
router.get("/",(req,res)=>{const blogs=read("blogs").sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));res.json(blogs);});
router.post("/",auth,blogRules,validate,(req,res)=>{
 const blogs=read("blogs");const blog={_id:uuid(),...req.body,authorName:(read("users").find(u=>u.id===req.user.id)||{}).name||"InkSpace Member",author:req.user.email,owner:req.user.id,date:new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}),createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};
 blogs.unshift(blog);write("blogs",blogs);res.status(201).json(blog);
});
router.put("/:id",auth,blogRules,validate,(req,res)=>{
 const blogs=read("blogs");const i=blogs.findIndex(b=>b._id===req.params.id);
 if(i<0)return res.status(404).json({message:"Story not found."});
 if(blogs[i].owner!==req.user.id)return res.status(403).json({message:"You can only edit your own stories."});
 blogs[i]={...blogs[i],...req.body,updatedAt:new Date().toISOString()};write("blogs",blogs);res.json(blogs[i]);
});
router.delete("/:id",auth,(req,res)=>{
 const blogs=read("blogs");const blog=blogs.find(b=>b._id===req.params.id);
 if(!blog)return res.status(404).json({message:"Story not found."});
 if(blog.owner!==req.user.id)return res.status(403).json({message:"You can only delete your own stories."});
 write("blogs",blogs.filter(b=>b._id!==req.params.id));res.json({message:"Story deleted."});
});
module.exports=router;
