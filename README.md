
Project Setup Instructions

 Prerequisites
1. Node.js: Ensure you have Node.js installed. Recommended version: `16.x` or above.
2. MongoDB: Install and run MongoDB on your local machine or use a cloud MongoDB service (e.g., MongoDB Atlas).



 Step 1: Backend Configuration
1. Navigate to the backend folder.
2. Create a .env file with the following content:
  
   PORT = <ANY_PORT_NUMBER_OF_YOUR_CHOICE>
   DB_URL = <Your_MongoDb_Url>
   SECRET_KEY = abcde
  
   -> Replace <ANY_PORT_NUMBER_OF_YOUR_CHOICE> with a port number (e.g., `5000`).
   -> Replace <Your_MongoDb_Url> with your MongoDB connection string.



Step 2: Frontend Configuration
1. Open the file-> frontend/src/port.js.
2. Modify the following content:
   
   export const BASE_URL = "http://localhost:<YOUR_PORT_NUMBER>";
   export const admin_uname = "admin";
  
   -> Replace <YOUR_PORT_NUMBER> with the port number defined in the backend `.env` file.


 Step 3: Database Setup
1. Create a new database in MongoDB with the following details:
   - Database Name: ecommerce
   - Collections:
     1. addressCollection
     2. cartWishSave
     3. orderCollection
     4. products
     5. productsSold
     6. users

---

 Step 4: Run the Project

 Backend
1. Navigate to the backend folder.
2. Install dependencies:
  
   npm install
   
3. Start the server:
  
   npm start
  

 Frontend
1. Navigate to the frontend folder.

   npm install
 
3. Start the frontend server:
  
   npm run build
  



 Note:
-> Ensure that MongoDB is running and accessible.
-> Verify that the BASE_URL in the frontend matches the backend's running URL.
-> If any issues occur, check the console logs for debugging.
