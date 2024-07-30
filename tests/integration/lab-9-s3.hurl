# tests/integration/lab-9-s3.hurl
# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# We're sending a plain text fragment
Content-Type: text/plain
# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1
# Body of the request goes in ```...``` when it's a string
`Hello S3!`

HTTP/1.1 201
# Capture the Location URL into a variable named `url`
[Captures]
url: header "Location"

# Step 2: GET the fragment you just created using the captured URL
GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: text/plain
`Hello S3!`

# Step 3: DELETE the fragment using the captured URL
DELETE {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200

# Step 4: Try to GET the fragment again to confirm it's deleted
GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 404
