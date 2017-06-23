gatekeeper
==========
Challenge for Thinkful module 1.2.3 - Adventures in Middleware

This exercise is to write a middleware function to validate a user ID and password:
1. Check for a specific HTTP header in the format of "x-user-and-pass"
1. Parse the user and password from the header
1. Match the user to an existing object in an array, simulating a database lookup
1. If present, return the associated data about the user to the response handler
1. If not present, return a null indicating no match
1. Return a JSON-formatted response of 200 if user matched or 403 (forbidden) if no match

*BONUS POINTS*: add a logging function (morgan)

The screenshot directory contains the Postman screens showing the good and bad responses, and the log.

technology used
===============
+Node.js is the javascript server platform
+Express - framework for routing and middleware
+morgan - HTTP logging
