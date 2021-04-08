# Timesales – Strapi Headless CMS

## Build Setup

```bash
# install dependencies
$ yarn

# serve at localhost:1337/admin
$ yarn develop
```

For detailed explanation on how things work, check out [Strapi docs](https://strapi.io/documentation).

##### API-Endpoints

- Create order: `POST https://xyz.timesales.ltd/orders`

```json
{
    "email": "name@providerdotcom",
    "time": "2000",
    "name": "Kajetan di Napoli",
    "price": "12.22",
    "description": "Precious time for myself alone"
}
```
- Save progress (not implemented yet): `PUT https://xyz.timesales.ltd/orders/:key`

```json
{
    "progress": "[0.XX]"
}
```