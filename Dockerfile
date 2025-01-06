FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Set the port your Next.js app should expose
EXPOSE 3000

# Make sure the port here equals the previous port
CMD ["npm", "run", "start", "--", "--port", "3000"]
