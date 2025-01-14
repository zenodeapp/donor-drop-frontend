# Donor Drop Frontend

Frontend implementation of the Donor Drop app.

This has been written by ZENODE and is licensed under the APACHE 2.0-license (see [LICENSE](./LICENSE)).

## Installation

### 0. Setup backend

See: https://github.com/zenodeapp/donor-drop-backend

### 1. Install dependencies
```
npm install
```

OR

```
yarn install
```

### 2. .env configuration
Create an .env file in the root. See [.env.example](.env.example) for an example.

### 3. Run app (for development)

```
yarn dev
```

OR

```
npm run dev
```

### 4. Run app (for production)

#### Docker (Recommended)

If you set up the backend with Docker (and used the docker-compose.yml file provided in that repo), you should have an instance of postgres running on a separate network named `your_shared_network`. This is needed in order for docker instances to communicate directly with one another. Other than this it's needed to configure the .env file and ports properly. Make sure to check out the files [docker-compose.yml](./docker-compose.yml) and [Dockerfile](Dockerfile) for more information on how to configure this properly.

Once you're ready you could run:
```
docker-compose build
docker-compose up -d
```

OR

```
sh clean-start.sh
```

#### Local

```
yarn build
yarn start
```

OR

```
npm run build
npm run start
```

</br>

<p align="right">— ZEN</p>
<p align="right">Copyright (c) 2025 ZENODE</p>
