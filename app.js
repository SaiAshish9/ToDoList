const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
  extended: true
}));
const _=require("lodash");
app.use(express.static("public"));
app.set('view engine', 'ejs')
const mongoose = require("mongoose")
mongoose.connect("mongodb+srv://Sai_99:shirdisai@cluster0-4bk2v.mongodb.net/todolistDB", {
  useNewUrlParser: true
});
const itemsSchema = {
  name: String
}

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to this todolist - developed by sai."
})
const item2 = new Item({
  name: "Hit the + button to add a new item."
})
const item3 = new Item({
  name: "<~~  Hit this to delete an item."
})

const defaultItems = [item1, item2, item3];
app.get("/", (req, res) => {

  Item.find({}, (err, foundItems) => {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, (err) => {
        if (err) {
          console.log("Error!");
        } else
          console.log("Successfully saved!");
      })
      res.redirect("/")
    } else
      res.render("list", {
        listitem: "Today",
        newlistitem: foundItems
      })
  })


})
const listsSchema = {
  name: String,
  items: [itemsSchema]
}




const List = mongoose.model("List", listsSchema);





app.get("/:custom", (req, res) => {
  const custom = _.capitalize(req.params.custom);

  List.findOne({
    name: custom
  }, (err, found) => {
    if (!err) {
      if (!found) {
        const list = new List({
          name: custom,
          items: defaultItems
        })
        list.save()
        res.redirect("/" + custom)
      } else {


        res.render("list", {
          listitem: found.name,
          newlistitem: found.items
        })
      }
    }
  })
})
app.post("/", (req, res) => {
  var itemName = req.body.newItem;
  const  listName=req.body.list;
  const item = new Item({
    name: itemName
  })
  if(listName==="Today"){
    item.save();
    res.redirect("/")
  }
else{
  List.findOne({name:listName},(err,found)=>{
    found.items.push(item);
    found.save();
res.redirect("/"+listName)

  })
}

})

app.post("/delete", (req, res) => {
  const id = req.body.checkbox;
  const listName=req.body.listName;
  if(listName==="Today"){
    Item.findByIdAndRemove(id, (err) => {
      if (!err) {
        console.log("Successfully deleted!");
      }

  res.redirect("/")
    })



  }

else {
  List.findOneAndUpdate({name:listName},{$pull:{items:{_id:id}}},(err,found)=>{
if(!err)
{
  res.redirect("/"+listName)
}

  })
}
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);
