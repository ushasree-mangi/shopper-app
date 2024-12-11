

const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const bcrypt=require('bcrypt')
const app = express();
const cors = require('cors');

const jwt=require("jsonwebtoken")
const {v4}=require("uuid")
const uuidv4=v4


/*const allowedOrigins = [
  'https://ushasree-mangi-shopper-ftqsv9u84-ushasree-mangis-projects.vercel.app',
  'https://ushasree-mangi-shopper-app.vercel.app',
  'https://ushasree-mangi-shopper-app-git-main-ushasree-mangis-projects.vercel.app'
  
]; */



const corsOptions = {
  
  origin: 'https://ushasree-mangi-shopper-app.vercel.app', // Temporarily allow all origins for debugging
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}; 


app.use(express.json())
app.use(cors(corsOptions));




const PORT =  process.env.PORT || 4000

const dbPath = path.join(__dirname, "shopperAppDatabase.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(PORT, () => {
      console.log("Server Running at http://localhost:4000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);

  }
};
initializeDBAndServer();

//middleware Api 

const authenticateToken = (request, response, next) => {
  let jwtToken;
  const authHeader = request.headers["authorization"];
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }
  if (jwtToken === undefined) {
    
    response.status(401).json({error_msg:"Invalid JWT Token"});
  } else {
    jwt.verify(jwtToken, "MY_SECRET_TOKEN", async (error, payload) => {
      if (error) {
        response.status(400).json({error_msg:"Invalid JWT Token"});
      } else {
       
        request.payload=payload
        next();

      }
    });
  }
};

//Register Api
app.post("/register/", async (request, response) => {
    
  const {username,password}=request.body
  const id=uuidv4()
 
  const hashedPassword = await bcrypt.hash(password, 10);
  const selectUserQuery = `SELECT * FROM users WHERE username = '${username}'`;
  const dbUser = await db.get(selectUserQuery);
  if (dbUser === undefined) {
    const createUserQuery = `
      INSERT INTO 
        users (id ,username, password) 
      VALUES 
        ('${id}',
          '${username}', 
          
          '${hashedPassword}'
          
        )`;
    const dbResponse = await db.run(createUserQuery);
    const newUserId = dbResponse.lastID;
   
    response.status(201).json({ message: `Created new user with ${newUserId}` });

   
  } else {
    response.status(400).json({ error_msg: "User already exists" });
  }
}); 

//Login Api
app.post("/login", async (request, response) => {
const { username, password } = request.body;
const selectUserQuery = `SELECT * FROM users WHERE username = '${username}'`;
const dbUser = await db.get(selectUserQuery);
if (dbUser === undefined) {
  response.status(400).json({ error_msg: "invalid user" });
} else {
  const {id}=dbUser 

  const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
  if (isPasswordMatched === true) {
    const payload = {
      username:username,
      userId:id,
     };
    
    const jwtToken = jwt.sign(payload, "MY_SECRET_TOKEN");
    response.status(201).json({ jwt_token:jwtToken });
  } else {
    
    response.status(400).json({error_msg:"Invalid Password"});
  }
}
});

//GET Products
app.get("/products/",authenticateToken, async (request, response) => {
  try{ 
  const getProductsQuery = `
    SELECT
      *
    FROM
      products ORDER BY RANDOM() 
      ;`;
  const productsArray = await db.all(getProductsQuery);
  response.status(201).json({products:productsArray});
  }catch(error){
    response.status(500).json({message:"An error occurred while adding the product to the cart"});
  }
});

//GET Particular Product
app.get("/products/:id/",authenticateToken, async (request, response) => {
  const {id} =request.params;
  try {
  const getProductsQuery = `
    SELECT
      *
    FROM
      products where id=${id} 
      ;`;
  const productDetails = await db.get(getProductsQuery);
  response.status(201).json({productDetails});
  } catch (error) {
    
    response.status(500).json({error_msg:"An error occurred while adding the product to the cart"});
  }
});


//CART API 
app.post("/cart/add",authenticateToken,async(request,response)=>{
  const {  productId, quantity } = request.body;
  const {userId}=request.payload
  
  try{ 
  let cartId;
  // Check if the user already has a cart
  const getCartQuery = `SELECT * FROM user_cart WHERE user_id = ?`;
  const userCartData = await db.get(getCartQuery, [userId]);

  

  if(userCartData===undefined){

    // Create a new cart for the user
    const createCartQuery = `INSERT INTO user_cart (user_id) VALUES (?)`;
    const dbResponse = await db.run(createCartQuery, [userId]);

    
    cartId = dbResponse.lastID; 
  
  }
  else{
    cartId=userCartData.cart_id 
   
  }
  
  

  // Step 3: Check if the product is already in the cart
  const checkProductQuery = `SELECT * FROM cart WHERE cart_id = ? AND product_id = ?`;
  const existingProduct = await db.get(checkProductQuery, [cartId, productId]);

  if (existingProduct===undefined) {
    
    // Step 4: Add the product to the cart if it does not exist
    const addProductQuery = `INSERT INTO cart (cart_id, product_id, quantity) VALUES (?, ?, ?)`;
    await db.run(addProductQuery, [cartId, productId, quantity]);
    response.status(201).json({ message: "Product added to cart successfully" });
  } else {
    // Product is already in the cart, do not add again
    return response.status(201).json({ message: "Product already in cart" });
  }
   
  }catch (error) {
   
    response.status(500).json({message:"An error occurred while adding the product to the cart"});
  }

});


// Endpoint to get cart products
app.get('/cart', authenticateToken, async (request, response) => {
  const {userId} = request.payload;
  
  try {
    // Fetch the user's cart
    const getCartQuery = `
      SELECT c.product_id, p.name, p.price, c.quantity,p.imageUrl
      FROM cart AS c
      JOIN products AS p ON c.product_id = p.id
      JOIN user_cart AS uc ON c.cart_id = uc.cart_id
      WHERE uc.user_id = ?
    `;
    
    const cartItems = await db.all(getCartQuery, [userId]);
    
    if (cartItems.length === 0) {
      return response.status(404).json({ message: 'No items in the cart' });
    }
    
    response.status(200).json({ cartItems });
  } catch (error) {
    
    response.status(500).json({ error: 'Failed to fetch cart items' });
  }
});

// Endpoint to DELETE cart product
app.delete('/cart', authenticateToken, async (request, response) => {
  const {productId} = request.body;
  const {userId} = request.payload;
  try {
    // delete the cart item
    const deleteCartItemQuery = `
      DELETE from cart 
      WHERE product_id = ?
    `;
    
     await db.run(deleteCartItemQuery , [productId]);

    // Fetch the user's cart
    const getCartQuery = `
      SELECT c.product_id, p.name, p.price, c.quantity,p.imageUrl
      FROM cart AS c
      JOIN products AS p ON c.product_id = p.id
      JOIN user_cart AS uc ON c.cart_id = uc.cart_id
      WHERE uc.user_id = ?
    `;
    
    const cartItems = await db.all(getCartQuery, [userId]);
    
    // Respond with the remaining cart items or success message
    

    if (cartItems.length === 0) {
      return response.status(404).json({ error: 'No items in the cart' });
    }
    
    response.status(200).json({ message: 'Product removed from cart', cartItems });

  } catch (error) {
    
    response.status(500).json({ error: 'Failed to delete cart item' });
  }
});
