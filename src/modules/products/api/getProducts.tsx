import { BASE_URL } from "@store/config"
import axios from "axios"

// Mock products for Fashion category when API fails
const mockFashionProducts = [
  {
    id: 1,
    name: "Classic White T-Shirt",
    price: 599,
    image_uri: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    description: "Premium cotton classic white t-shirt",
    category_id: 1
  },
  {
    id: 2,
    name: "Denim Jacket",
    price: 1299,
    image_uri: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    description: "Vintage style denim jacket",
    category_id: 1
  },
  {
    id: 3,
    name: "Summer Dress",
    price: 899,
    image_uri: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    description: "Floral print summer dress",
    category_id: 1
  },
  {
    id: 4,
    name: "Leather Boots",
    price: 2499,
    image_uri: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    description: "Premium leather ankle boots",
    category_id: 1
  },
  {
    id: 5,
    name: "Sunglasses",
    price: 799,
    image_uri: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    description: "Stylish aviator sunglasses",
    category_id: 1
  },
  {
    id: 6,
    name: "Handbag",
    price: 1599,
    image_uri: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    description: "Elegant leather handbag",
    category_id: 1
  },
  {
    id: 7,
    name: "Wristwatch",
    price: 3499,
    image_uri: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    description: "Luxury analog wristwatch",
    category_id: 1
  },
  {
    id: 8,
    name: "Scarf",
    price: 399,
    image_uri: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    description: "Warm woolen scarf",
    category_id: 1
  },
  {
    id: 9,
    name: "Jeans",
    price: 999,
    image_uri: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    description: "Classic blue denim jeans",
    category_id: 1
  },
  {
    id: 10,
    name: "Blazer",
    price: 1899,
    image_uri: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    description: "Professional black blazer",
    category_id: 1
  },
  {
    id: 11,
    name: "Sneakers",
    price: 1299,
    image_uri: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    description: "Comfortable running sneakers",
    category_id: 1
  },
  {
    id: 12,
    name: "Earrings",
    price: 599,
    image_uri: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    description: "Elegant pearl earrings",
    category_id: 1
  }
];

// Mock products for other categories
const mockElectronicsProducts = [
  {
    id: 101,
    name: "Smartphone",
    price: 15999,
    image_uri: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    description: "Latest smartphone with advanced features",
    category_id: 2
  },
  {
    id: 102,
    name: "Laptop",
    price: 45999,
    image_uri: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    description: "High-performance laptop for work and gaming",
    category_id: 2
  }
];

export const getProductsByCategory = async (id: string) => {
    try {
        const res = await axios.get(`${BASE_URL}/product/${id}`)
        return res.data.products
    } catch (error) {
        console.log('API failed, using mock products for category:', id);
        
        // Return mock products based on category ID
        const categoryId = String(id);
        if (categoryId === '1') {
            return mockFashionProducts;
        } else if (categoryId === '2') {
            return mockElectronicsProducts;
        } else {
            // Return some default products for other categories
            return [
                {
                    id: 201,
                    name: "Sample Product",
                    price: 999,
                    image_uri: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                    description: "Sample product for this category",
                    category_id: id
                }
            ];
        }
    }
}