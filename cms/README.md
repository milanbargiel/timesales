# Timesales – Strapi Headless CMS

## Build Setup

```bash
# create a local postgresql database with the name timesales
$ createdb timesales

# download the remote database
$ yarn downloadDump

# install dependencies
$ yarn

# serve at localhost:1337/admin
$ yarn develop
```

For detailed explanation on how things work, check out [Strapi docs](https://strapi.io/documentation).

## Folder structure

```bash
├── extensions
│   └── email
│       └── services/Email.js # Extend email plugin with renderTemplate function
``
```
