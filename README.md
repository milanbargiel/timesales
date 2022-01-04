<p>
    <img src="https://www.timesales.ltd/favicon.png" width="200px"> <b>Timesales</b>
</p>

```bash
# app: frontend based on nuxtjs
# cms: cms app and backend api (headless-cms strapi)
```

- This is a git repository for the source code of Timesales Ltd.
- For ⏳ installation instructions go to the readmes of the component's subfolders
- Pushes to the `main` branch of this repository will:
  - automatically be deployed to the frontend at CDN netlify https://www.timesales.ltd/
  - changes in the strapi-cms will automatically be deployed to the virtual linux server at strato https://xyz.timesales.ltd
- The order backend can be accessed at https://xyz.timesales.ltd/admin

##### Local development

- Run the frontend Nuxt app in `/app` with `yarn dev`
- Run the Strapi backend in `/cms` with `yarn develop`
- Run the Stripe CLI tool to redirect orders to the local webhook with `stripe listen --forward-to localhost:1337/orders`

##### Installation for local development

- Install dev dependencies in `/app` and `/cms` with `yarn install`
- Install Stripe CLI and login with your account
- [Install the postgresql database software](https://wiki.postgresql.org/wiki/Homebrew) and start the psql service as described in the Homebrew formula
- Create a database "timesales" with the command `createdb timesales`
- Download a dump of the remote database by running `yarn downloadDump` within the `/cms` folder
- Get `cms/templates/invoice/signature.pug` and `.env` files and include them into the project. Make sure to enter the test key for the stripe payment environment.

##### API-Endpoints for cms

`GET https://xyz.timesales.ltd/orders/:key`

- Get time and progress data for sand simulation

`POST https://xyz.timesales.ltd/create-checkout-session`

- Enpoint to create a checkout session in Stripe
- Return the sessionID to create a link that redirects to Stripe
- Price and description is posted
- The checkout redirects to a custom success page, that displays the sand simulation

```json
{
    "name": "Kajetan di Napoli",
    "time": "2000", // seconds
    "price": "1222", // cents
    "successUrl": "[base-url]/order",
    "cancelUrl": "[base-url]/cancel",
    ""
}
```

`POST https://xyz.timesales.ltd/orders`

- Endpoint to create an order in the database
- Can only be accessed in a Webhook from Stripe via authentication
- Endpoint is triggered automatically when user buys time

```json
{
    "email": "name@providerdotcom",
    "name": "Kajetan di Napoli",
    "time": "2000",
    "price": "1222",
    "description": "Precious time for myself alone",
    "key": "_12msqid...", // Stripe CHECKOUT_SESSION_ID is used as the unique key
    ""
}
```

`PUT https://xyz.timesales.ltd/orders/:key`

- Enpoint to periodically save the progress of the simulation

```json
{
  "progress": 0.2
}
```

##### Stripe Payments Integration Guides

- [Accept a payment](https://stripe.com/docs/payments/accept-a-payment#web)
- [Fullfill orders](https://stripe.com/docs/payments/checkout/fulfill-orders)

##### Folder structure
```
├── app # The nuxtjs based frontend
|   ├── conversation # The complete bot conversation
|   └── store # Vuex Store files with actions that fetch and post data to the cms
```