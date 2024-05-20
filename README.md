# Hall Booking API

## About

This an Hall Booking API task. Built using NodeJS and Express.

## Run

Step 1:

```
npm install
```

Step 2:

```
npm run dev
```

Step 3: Use the below endpoints in your API Testing Tool. Base URL: `http://localhost:3000`.

```
/room/all (GET) - Show all created rooms
/room/create (POST) - Create room with eg. { "number_of_available_seats": 150, "amenities": ["WiFi", "Well-Maintained Restrooms", "Parking","Audio-Visual Equipment","Catering Services"], "price_per_hour": 190 }
/room/edit/:id (PUT) - Edit room
/room/delete/:id (DELETE) - Delete room
/room/booking (POST) - Book a room with eg. { "customer_name": "name", "start_time": "1 AM", "end_time": "7 PM", "roomId": 1 }
/room/allBookedRooms (GET) - List all Rooms with Booked Data
/room/bookedRooms (GET) - List all customers with Booked Data
room/bookedCount (GET) - List how many times a customer has booked the room
```
