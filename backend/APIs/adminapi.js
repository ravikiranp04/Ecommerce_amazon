const exp = require('express')
const adminApp = exp.Router()
let productsSoldCollection
let cartCollection
adminApp.use((req, res, next) => {
    usersCollection = req.app.get('usersObj');
    productsCollection=req.app.get('productsObj')
    cartCollection = req.app.get('cartWishSave')
    productsSoldCollection = req.app.get('productsSold');
    next();
});
//body parser
adminApp.use(exp.json())


// Add a product
adminApp.post('/add-product',async(req,res)=>{
    const prodObj = req.body;
    const updated = await productsCollection.insertOne(prodObj)
    console.log(updated)
    if(updated){
        res.send({message:"Product added Successfully"});
    }
    else{
        res.send({message:"Cant add product"});
    }
})


//Soft delete a product
adminApp.put('/disable/:prdid',async(req,res)=>{
    const prodid= +req.params.prdid
    console.log(prodid)
    const obj2 = await productsCollection.findOne({productid:prodid})
    const obj = await productsCollection.findOneAndUpdate({productid:prodid},{$set:{display_status:false}},{returnOriginal:false})
    console.log(obj)
    if(obj){
        res.send({message:"Product disabled"})
    }
    else{
        res.send({message:"Try again"})
    }

})

//Enable a disabled product
adminApp.put('/enable/:prdid',async(req,res)=>{
    const prodid= +req.params.prdid
    const obj = await productsCollection.findOneAndUpdate({productid:prodid},{$set:{display_status:true}},{returnOriginal:false})
    console.log(obj)
    if(obj){
        res.send({message:"Product Enabled"})
    }
    else{
        res.send({message:"Try again"})
    }

})


//Change stock
adminApp.put('/change-stock/:prdid/:newstock',async(req,res)=>{
    const prodid= req.params.prdid
    const newstock=+req.params.newstock
    const obj = await productsCollection.findOneAndUpdate({productid:prodid},{$set:{stock:newstock}},{returnOriginal:false})
    console.log(obj)
    if(obj){
        res.send({message:"Stock Updated"})
    }
    else{
        res.send({message:"Try again"})
    }

})

//Display prodcts'
adminApp.get('/products',async(req,res)=>{
    const obj = await productsCollection.find().toArray();
    if(obj.length!=0){
        res.send({message:"Products are",payload:obj});
    }
    else{
        res.send({message:"No Products found"})
    }
})


//Change Discount
adminApp.put('/change-discount/:prdid/:discount',async(req,res)=>{
    const prodid= req.params.prdid
    const discount=+req.params.discount
    const obj = await productsCollection.findOne({productid:prodid})
    obj.discountPercentage = discount;
    obj.priceAfterDiscount = ((100-discount)/100)*obj.price;
    const updt = await productsCollection.findOneAndUpdate({productid:prodid},{$set:{...obj}},{returnOriginal:false})
    console.log(updt)
    if(updt){
        res.send({message:"Discount Updated"})
    }
    else{
        res.send({message:"Try again"})
    }

})


//Modify a product
adminApp.put('/modify-product',async(req,res)=>{
    const obj=req.body;
    const updated = await productsCollection.findOneAndUpdate({productid:obj.productid},{$set:obj},{returnOriginal:false})
    if(updated){
        res.send({message:"Product Modified"})
    }
    else{
        res.send({message:"Product Not modified"})
    }
})

//Get dipatch products
adminApp.get('/get-dispatch-products',async(req,res)=>{
    const obj = await productsSoldCollection.find({deliveryStatus:'ordered'}).toArray();
    if(obj && obj.length>0){
        res.send({message:"Dispatch products are",payload:obj})
    }
    else{
        res.send({message:"No Dispatch products"});
    }
})

//Dispatch Product
adminApp.put('/dispatch-product',async(req,res)=>{
    const prod=req.body
    const obj = await productsSoldCollection.replaceOne({username:prod.username,productid:prod.productid,orderid:prod.orderid},prod,{upsert:true})
    console.log(obj)
    if(obj){
        res.send({message:"Product Dispatched"});
    }
    else{
        res.send({message:"COuld not Dispatch product"})
    }
})
//Get dispatched products list
adminApp.get('/delivery-list',async(req,res)=>{
    const obj = await productsSoldCollection.find({deliveryStatus:"dispatched"}).toArray();
    console.log(obj)
    if(obj){
        res.send({message:"Dispatched products are",payload:obj})
    }
    else{
        res.send({message:"No products to deliver"})
    }
})

//Deliver a product

adminApp.put('/deliver-product/:prodid/:rfid/:orderid',async(req,res)=>{
    const id = +(req.params.prodid);
    const rftag = req.params.rfid;
    const order_id = req.params.orderid
    console.log(id+" "+rftag+" "+order_id)
    const upt = await productsSoldCollection.findOneAndUpdate({productid:id,rfidTag:rftag,orderid:order_id},{$set:{deliveryStatus:"delivered"}},{returnOriginal:'after'});
    if(upt){
        res.send({message:"Product Delivered"});
    }
    else{
        res.send({message:"Product Can't be delivered"});
    }
})

//Display return produts list
adminApp.get('/return-products-list',async(req,res)=>{
    
    const obj = await productsSoldCollection.find({deliveryStatus:"return requested"}).toArray()
    if(obj){
        res.send({message:"Return Products are",payload:obj})
    }
    else{
        res.send({message:"No Return Products"})
    }
})

//retrieve product using barcode
adminApp.get('/retrieve-product/:bcode',async(req,res)=>{
    const barcodeid= req.params.bcode;
    const updt = await productsSoldCollection.findone({barcode:barcodeid})
    console.log(updt)
    if(updt){
        res.send({message:"Product found",payload:updt})
    }
    else{
        res.send({message:"No product found"});
    }
})


//Reject Product
adminApp.put('/reject-product/:bcode/:reason',async(req,res)=>{
     const bcode = req.params.bcode
     const reason = req.params.reason
     console.log(reason)
     const upt = await productsSoldCollection.findOneAndUpdate({barcode:bcode},{$set:{rejectReason:reason,deliveryStatus:"Return Rejected"}},{returnDocument:'after'})
     if(upt){
        res.send({message:"Return Rejected"});
        
     }
     else{
        res.send({message:"Cant reject Product"})
     }
})

//Reject Product
adminApp.put('/accept-product/:bcode/:uname/:amnt', async (req, res) => {
    const uname = req.params.uname;
    const amnt = +(req.params.amnt); // Parse the amount to a number

    // Update the product status in the productsSoldCollection
    const upt = await productsSoldCollection.findOneAndUpdate(
        { barcode: req.params.bcode },
        { $set: { deliveryStatus: "Return Accepted and Refund Processed" } },
        { returnDocument: 'after' }
    );

    // Update the wallet in the cartCollection
    const upd2 = await cartCollection.findOneAndUpdate(
        { username: uname },
        { $inc: { Wallet: amnt } }, // Increment the wallet balance by the amount
        { returnDocument: 'after' }
    );

    if (upt && upd2) {
        res.send({ message: "Return Accepted" });
    } else {
        res.send({ message: "Can't reject Product" });
    }
});

module.exports=adminApp