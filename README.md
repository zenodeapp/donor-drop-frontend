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
```
POSTGRES_USER='postgres'
POSTGRES_PASSWORD='admin1234'
POSTGRES_HOST='localhost'
POSTGRES_PORT=5434
POSTGRES_DB='postgres'

NEXT_PUBLIC_SITE_URL='site_where_this_gets_hosted' # this is for SEO (see pages/_document) and MetaMask deeplinking.
NEXT_PUBLIC_DONOR_ADDRESS='ethereum_address'
NEXT_PUBLIC_DONOR_ADDRESS_ENS='ethereum_address_ens'
NEXT_PUBLIC_DONOR_NETWORK='Ethereum Mainnet'
NEXT_PUBLIC_TARGET_ETH=27
NEXT_PUBLIC_MIN_ETH_PER_ADDRESS=0.03
NEXT_PUBLIC_MAX_ETH_PER_ADDRESS=0.3
NEXT_PUBLIC_REWARD_NAM=1000000
NEXT_PUBLIC_START_DATE="2025-01-01T15:00:00Z"
NEXT_PUBLIC_END_DATE="2025-01-09T15:00:00Z"
NEXT_PUBLIC_TEST_ENVIRONMENT=true # this will show a permanent notification on-screen that this deployment is a test
```

> Make sure that the POSTGRES_PORT matches the port in the backend's `./docker-compose.yml`

### 3. Run app (for development)

```
yarn dev
```

OR

```
npm run dev
```

### 4. Run app (for production)

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
