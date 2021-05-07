<p>
    <img src="https://timesalesltd.netlify.app/favicon.ico"> <b>Timesales</b>
</p>

```bash
# app: frontend based on nuxtjs
# cms: cms app and backend api (headless-cms strapi)
```

- This is a git repository for the source code of Timesales Ltd.
- For ⏳ installation instructions go to the readmes of the component's subfolders
- Pushes to the `main` branch of this repository will:
    - automatically be deployed to the frontend test environment at CDN netlify https://timesalesltd.netlify.app
    - changes in the strapi-cms will automatically be deployed to the virtual linux server at strato https://xyz.timesales.ltd
- The order backend can be accessed at https://xyz.timesales.ltd/admin

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

##### Local development

- For local development install dev dependencies in `/app` and `/cms`
- Run the frontend Nuxt app with `npm run start`
- Run the Stripe backend with `yarn develop`
- Run the Stripe CLI tool to redirect orders to the local webhook with `stripe listen --forward-to localhost:1337/orders`


##### Stripe Payments Integration Guides
- [Accept a payment](https://stripe.com/docs/payments/accept-a-payment#web)
- [Fullfill orders](https://stripe.com/docs/payments/checkout/fulfill-orders)



