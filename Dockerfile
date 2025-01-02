# Step 1: Use the official Node.js image
FROM node:18-alpine

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy only the package.json and package-lock.json
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application code
COPY . .

# Step 6: Build the Next.js application
RUN npm run build

# Step 7: Expose port 3000 for the Next.js app
EXPOSE 35436

# Step 8: Run the Next.js app in production mode
CMD ["npm", "run", "start", "--", "--port", "35436"]