#!/bin/bash

# Test API endpoints for the RPG Auth system

BASE_URL="http://localhost:5000/api"

echo "=== RPG Auth API Test ==="
echo

# Test health endpoint
echo "1. Testing health endpoint..."
curl -s "${BASE_URL%/api}/health" | jq '.'
echo

# Test user registration
echo "2. Testing user registration..."
REGISTER_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPassword123!"
  }')

echo "$REGISTER_RESPONSE" | jq '.'

# Extract token from registration response
TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.data.token // empty')

if [ -z "$TOKEN" ]; then
  echo "Registration failed, no token received"
  exit 1
fi

echo

# Test user login
echo "3. Testing user login..."
LOGIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "TestPassword123!"
  }')

echo "$LOGIN_RESPONSE" | jq '.'
echo

# Test protected endpoint (get profile)
echo "4. Testing protected endpoint (get profile)..."
curl -s -X GET "${BASE_URL}/auth/profile" \
  -H "Authorization: Bearer ${TOKEN}" | jq '.'
echo

# Test invalid token
echo "5. Testing invalid token..."
curl -s -X GET "${BASE_URL}/auth/profile" \
  -H "Authorization: Bearer invalid-token" | jq '.'
echo

echo "=== Test completed ==="
