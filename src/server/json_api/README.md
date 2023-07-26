# POST `/api/token` - Create a new token

The JSON API uses JWT (https://jwt.io/) tokens to authenticate users and access protected resources. Currently only affiliate users can use the API.

To create a new token, send a POST request to `/api/token` with the following JSON request body:

```json
{
  "email": "affiliate@example.com",
  "password": "password"
}
```

Provide valid email and password of a registered affiliate user. As a result you'll receive a token, for example:

```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTY1OTQ3MzcxMywiZXhwIjoxNjYwNjgzMzEzfQ.GGmPEEfOm3HBuxagSOPRtXnmW2P1jjOsZaPf7biy6Fg"
}
```

To authenticate a request, provide the above token in the `Authorization` header in requests to protected endpoints:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTY1OTQ3MzcxMywiZXhwIjoxNjYwNjgzMzEzfQ.GGmPEEfOm3HBuxagSOPRtXnmW2P1jjOsZaPf7biy6Fg
```

# GET `/api/orders` - get list of orders

To get the list of affiliate's orders, send a GET request to `/api/orders` endpoint. Requires token authentication. Example response:

```json
{
    "orders": [
        {
            "id": 1,
            "createdAt": "2022-08-02T20:25:03.979Z",
            "realEstateId": {
                "city": "New York",
                "zip": "10118",
                "state": "NY",
                "country": "US",
                "street": "350 Fifth Avenue"
            },
            "updatedAt": "2022-08-02T20:25:03.979Z"
        },
    ]
}
```
