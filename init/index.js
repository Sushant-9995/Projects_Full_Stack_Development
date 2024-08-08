const mongoose=require("mongoose");
const initdata=require("./data.js");
const listing=require("../models/listing.js");
const mongoo_Url="mongodb://127.0.0.1:27017/wanderlust";

main()
.then( ()=> {
console.log("Connected to DB");
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(mongoo_Url);
}

const initdb=async()=>{
    await listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj ,owner:"669acafdb5e3d566be93b151"})
  );
    await listing.insertMany(initdata.data);
    console.log("Data was saved successfully");
};

initdb();