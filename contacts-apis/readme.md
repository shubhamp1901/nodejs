
* `400 Bad Request`: Invalid request payload (e.g., missing fields).
* `401 Unauthorized`: Authentication required or token missing/invalid.
* `403 Forbidden`: Authenticated but not authorized to access.
* `404 Not Found`: Resource or route does not exist.



* `301 Moved Permanently`: Resource moved to a new URL.
* `302 Found`: Temporary redirection.
* `304 Not Modified`: Cached version of the resource is still valid.



* `200 OK`: Request successful (most common for GET or PUT).
* `201 Created`: Resource successfully created (used in POST).
* `202 Accepted`: Request accepted for processing, but not completed.
* `204 No Content`: Successful request but no data returned (e.g., DELETE).



* `500 Internal Server Error`: Generic server-side error.
* `502 Bad Gateway`: Server acting as a gateway received an invalid response.
* `503 Service Unavailable`: Server is temporarily overloaded or down for maintenance.
