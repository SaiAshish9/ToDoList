const express=require("express");
const app=express();
const bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
var items=[]
app.set('view engine','ejs')
app.get("/",(req,res)=>{
  var date=new Date();
  var today={
    weekday:"long",
    month:"long",
    day:"numeric",
    year:"numeric"
  }
  var day=date.toLocaleDateString("us-en",today)

  res.render("list",{kindofday:day,newlistitem:items})
})

app.post("/",(req,res)=>{
var item=req.body.newItem;
items.push(item)
res.redirect("/")
})

app.listen(3000,()=>{
  console.log("Server Started")
})
