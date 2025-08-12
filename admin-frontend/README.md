# BockNexus Admin Frontend

A React Admin frontend for managing products and categories in the BockNexus application.

## Features

- **Product Management**: Create, read, update, and delete products
- **Category Management**: Create, read, update, and delete categories
- **Purple Theme**: Consistent with the main React Native app design
- **Responsive Design**: Works on desktop and tablet devices

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure API URL**
   Update the `API_URL` in `src/dataProvider.ts` to match your backend server URL:
   ```typescript
   const API_URL = 'http://localhost:3000'; // Change this to your backend URL
   ```

3. **Start the Development Server**
   ```bash
   npm start
   ```

4. **Access the Admin Panel**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

The admin frontend is configured to work with these AdminJS endpoints:

### Products
- `GET /admin/products` - List all products (paginated)
- `GET /admin/products/:id` - Get single product
- `POST /admin/products` - Create new product
- `PUT /admin/products/:id` - Update product
- `DELETE /admin/products/:id` - Delete product
- `PUT /admin/products/:id/stock` - Update product stock

### Categories
- `GET /admin/categories` - List all categories (paginated)
- `GET /admin/categories/:id` - Get single category
- `POST /admin/categories` - Create new category
- `PUT /admin/categories/:id` - Update category
- `DELETE /admin/categories/:id` - Delete category

## Features

### Product Management
- View all products in a paginated table
- Create new products with validation
- Edit existing products
- Delete products
- View product images
- Sort and filter products

### Category Management
- View all categories in a paginated table
- Create new categories
- Edit existing categories
- Delete categories
- View category images

### Theme
- Purple color scheme matching the main app
- Responsive design
- Material-UI components

## File Structure

```
src/
├── App.tsx              # Main application component
├── dataProvider.ts      # API integration layer
├── theme.ts            # Custom purple theme
└── resources/
    ├── products.tsx     # Product management components
    └── categories.tsx   # Category management components
```

## Customization

### Adding New Fields
To add new fields to products or categories, update the corresponding resource file:

1. Add the field to the `Datagrid` in the List component
2. Add the field to the `SimpleForm` in Create and Edit components
3. Add validation if needed

### Styling
The theme is defined in `src/theme.ts`. You can customize colors, fonts, and component styles there.

## Troubleshooting

### CORS Issues
If you encounter CORS errors, ensure your backend server allows requests from the admin frontend domain.

### API Connection
Make sure your backend server is running and the API_URL in `dataProvider.ts` is correct.

### Build Issues
If you encounter build issues, try:
```bash
npm install --legacy-peer-deps
```

## Development

### Adding New Resources
To add a new resource (e.g., orders, users), create a new file in `src/resources/` and add it to the `App.tsx` file.

### Custom Components
You can create custom components for specific use cases by extending React Admin components.

## Deployment

1. **Build for Production**
   ```bash
   npm run build
   ```

2. **Deploy the `build` folder** to your web server or hosting service.

3. **Update API URL** in `dataProvider.ts` to point to your production backend. 