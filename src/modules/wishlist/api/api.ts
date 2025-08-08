import { BASE_URL } from "@store/config";
import axios from "axios";

// Re-export the functions from the new wishlistApi service
export { 
  addToWishlist, 
  getUserWishlist, 
  updateWishlistItem, 
  removeFromWishlist, 
  clearWishlist 
} from './wishlistApi';
