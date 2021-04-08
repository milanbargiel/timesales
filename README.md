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
