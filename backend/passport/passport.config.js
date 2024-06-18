import passport from "passport";
import bcrypt from "bcryptjs";

import User from "../models/user.model.js";
import { GraphQLLocalStrategy } from "graphql-passport";


// This function configures the passport authentication middleware.
export const configurePassport = async () => {

    // Define how to serialize the user information into the session
    passport.serializeUser((user, done) => {
      console.log("Serializing user"); 
      done(null, user.id); // Store user ID in the session
    });
  
    // Define how to deserialize the user information from the session
    passport.deserializeUser(async (id, done) => {
      console.log("Deserializing user"); 
      try {
        const user = await User.findById(id); // Retrieve the user by ID from the database
        done(null, user); // Return the user object
      } catch (err) {
        done(err); // Handle any errors during deserialization
      }
    });
  
    // Use a local strategy for GraphQL-based authentication
    passport.use(
      new GraphQLLocalStrategy(async (username, password, done) => {
        try {
          const user = await User.findOne({ username }); // Find the user by username
          if (!user) {
            throw new Error("Invalid username or password"); // Handle case where user is not found
          }
          const validPassword = await bcrypt.compare(password, user.password); // Compare provided password with stored hash
  
          if (!validPassword) {
            throw new Error("Invalid username or password"); // Handle invalid password
          }
  
          return done(null, user); // Authentication successful, return the user
        } catch (err) {
          return done(err); // Handle any errors during authentication
        }
      })
    );
  };
  