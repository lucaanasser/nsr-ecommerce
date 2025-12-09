#!/bin/bash

# Script para testar pagamento com cartão de crédito
# Uso: ./test-payment.sh

API_URL="http://localhost:4000/api/v1"
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjdlNGQzZi0wM2UwLTQwNzAtYmQxZC01NDllMTljYzEzMDMiLCJlbWFpbCI6ImN1c3RvbWVyQG5zci5jb20iLCJyb2xlIjoiQ1VTVE9NRVIiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzY1MjU3MDE2LCJleHAiOjE3NjUyNTc5MTYsImF1ZCI6Im5zci1hcGkiLCJpc3MiOiJuc3ItZWNvbW1lcmNlIn0.bHCfQAB3uO7HEbva5wyj8YFjNyEE3_N8BnlBLgMVeTk"

echo "🚀 Testando pagamento com cartão de crédito..."
echo ""

curl -X POST "$API_URL/orders" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "addressId": "76539a9c-8302-48d9-bf2b-cb499b641935",
    "items": [
      {
        "productId": "550e8400-e29b-41d4-a716-446655440003",
        "quantity": 1
      }
    ],
    "shippingMethodId": "cd392b44-f342-491e-9fbe-b10d7ba93228",
    "paymentMethod": "credit_card",
    "creditCard": {
      "encrypted": "NwYcLPZJssWgZufJbG8+xTHiRrqDd01jBAeTX9NzCXHW2H28GZLObgh7UH+/s2RvynQUETXnO25zqsPRMxA2G0bPe4Ftmsk8dwrCQNcyOWICoMkfKsXDqUFl9HyVvEBOo/dBBP9iWfXhw2uHqGVlO8urOLUHp4ZHDrZZQ+GY4syGXis5tRvMRpcnA7n1lg0xePCy6NJKjeOQU4FbwHq1ImILDQ3f/w67eelRxX/PhjRDya1TPtKgoEwLw4bMtj1ZKGm/IlbMg/K9MySY7ZZ56etGzlt9hjTRKqw+7U0e6j0Ft9zvKcf6sVNrvi99PEvKWrGFCwvjQcTIJC8tzOV3bw==",
      "holderName": "JOSE DA SILVA",
      "holderCpf": "12173958658"
    },
    "notes": "Teste de pagamento via script"
  }' | jq '.'

echo ""
echo "✅ Teste finalizado!"
