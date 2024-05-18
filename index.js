import express from "express";

// Setting PORT
const PORT = 3000;

// Initializiing Express Server

const app = express();
app.use(express.json());

let rooms = [];
let roomBooking = [];
let bookedRooms = [];
let customerWithBookedData = [];
function isEmpty(obj) {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }

  return true;
}

app.get("/", (req, res) => {
  res.send(`<h1 style="text-align:center;">Hall Booking API</h1>`);
});

// Room
app.get("/room/all", (req, res) => {
  if (!rooms.length) {
    return res.json({ message: "No rooms found. Create a room!" });
  }
  return res.send(rooms);
});

// Create Room
app.post("/room/create", (req, res) => {
  const reqBody = req.body;
  if (
    !reqBody.number_of_available_seats ||
    !reqBody.amenities ||
    !reqBody.price_per_hour
  ) {
    return res.json({
      message:
        "number_of_available_seats, amenities and price_per_hour are required",
    });
  }
  const newRoom = { _id: rooms.length + 1, ...req.body };
  rooms = [...rooms, newRoom];
  res.send(newRoom);
});

// Edit Room
app.put("/room/edit/:id", (req, res) => {
  const _id = req.params.id;
  const findRoom = rooms.find((room) => room._id == _id);
  if (isEmpty(findRoom)) {
    return res.json({ message: "No room found in this ID" });
  }
  const roomIndex = rooms.indexOf(findRoom);
  const editRoom = { _id: _id, ...req.body };
  rooms[roomIndex] = editRoom;
  res.send(editRoom);
});

// Delete Room
app.delete("/room/delete/:id", (req, res) => {
  const _id = req.params.id;
  const findRoom = rooms.find((room) => room._id == _id);
  if (isEmpty(findRoom)) {
    return res.json({ message: "No room found in this ID" });
  }
  let newRooms = rooms.filter((data) => data._id != _id);
  rooms = [...newRooms];
  res.send(findRoom);
});

// Booking a Room
function checkAlreadyBooked(
  req,
  res,
  start_time,
  end_time,
  roomId,
  currentDate
) {
  let flag;
  let filterRoomInRoomBooking = roomBooking.filter(
    (customerRoom) => customerRoom.roomId == roomId
  );
  if (filterRoomInRoomBooking.length != 0) {
    filterRoomInRoomBooking.forEach((room) => {
      if (
        (room.start_time == start_time || room.end_time == end_time) &&
        room.date == currentDate
      ) {
        res.json({
          message: "Room is already booked, select other date or time!",
        });
        flag = false;
        return false;
      } else flag = true;
    });
  } else {
    return true;
  }
  return flag;
}

// Booking a Room
app.post("/room/booking", (req, res) => {
  const reqBody = req.body;
  const currentDate = new Date().toJSON().slice(0, 10);
  let flag;
  if (
    !reqBody.customer_name ||
    !reqBody.start_time ||
    !reqBody.end_time ||
    !reqBody.roomId
  ) {
    return res.json({
      message: "customer_name, start_time, end_time and roomId are required",
    });
  }

  let findRoomInRooms = rooms.find((room) => room._id == reqBody.roomId);
  if (isEmpty(findRoomInRooms)) {
    return res.json({
      message: "The selected room ID does not have any availability.",
    });
  }

  flag = checkAlreadyBooked(
    req,
    res,
    reqBody.start_time,
    reqBody.end_time,
    reqBody.roomId,
    currentDate
  );

  if (flag) {
    const newBookedRoom = {
      _id: roomBooking.length + 1,
      ...req.body,
      date: currentDate,
      booked_status: true,
    };
    roomBooking = [...roomBooking, newBookedRoom];
    flag = false;
    return res.json({ newBookedRoom: newBookedRoom });
  }
});

// List all Rooms with Booked Data
app.get("/room/bookedRooms", (req, res) => {
  if (roomBooking.length == 0) {
    return res.json({ message: "No customers have booked the room." });
  }
  bookedRooms = [];
  let filteredCustomerByCustomerName = {};

  rooms.forEach((room) => {
    let filterCustomerByRoomId = roomBooking.filter(
      (customerRoom) => room._id == customerRoom.roomId
    );

    let filterDuplicateCustomerName = {};
    let removedDuplicateCustomerName = [];

    filterCustomerByRoomId.forEach((filRoom) => {
      if (!filterDuplicateCustomerName.hasOwnProperty(filRoom.customer_name)) {
        filterDuplicateCustomerName[filRoom.customer_name] = true;
        removedDuplicateCustomerName.push(filRoom.customer_name);
      }
    });
    removedDuplicateCustomerName.forEach((customerName) => {
      let filterCustomerByCustomerName = roomBooking.filter(
        (customerRoom) => customerRoom.customer_name == customerName
      );

      filteredCustomerByCustomerName[customerName] =
        filterCustomerByCustomerName;
    });
  });
  if (!isEmpty(filteredCustomerByCustomerName)) {
    bookedRooms.push(filteredCustomerByCustomerName);
  }
  return res.json({ customerWithBookedData: bookedRooms });
});

// List how many times a customer has booked the room
app.get("/room/bookedCount", (req, res) => {
  if (rooms.length == 0) {
    return res.send({ message: "No Rooms found. Create a Room!" });
  }
  if (customerWithBookedData.length > 0) {
    customerWithBookedData = [];
  }
  rooms.forEach((room) => {
    let filterRoom = roomBooking.filter(
      (customerRoom) => room._id == customerRoom.roomId
    );

    let tempBookedRooms = {
      room_name: "",
      booked_status: [],
      customer_name: [],
      date: [],
      start_time: [],
      end_time: [],
    };
    filterRoom.forEach((froom) => {
      tempBookedRooms.room_name = room._id;
      tempBookedRooms.booked_status.push(true);
      tempBookedRooms.customer_name.push(froom.customer_name);
      tempBookedRooms.date.push(froom.date);
      tempBookedRooms.start_time.push(froom.start_time);
      tempBookedRooms.end_time.push(froom.end_time);
    });
    if (tempBookedRooms.room_name != "") {
      customerWithBookedData.push(tempBookedRooms);
    } else {
      customerWithBookedData.push({
        room_name: room._id,
        booked_status: false,
        customer_name: "N/A",
        date: "N/A",
        start_time: "N/A",
        end_time: "N/A",
      });
    }
  });
  return res.json({ rooms_that_customer_booked: customerWithBookedData });
});

// Activating and listening server
app.listen(PORT, () => {
  console.log(`Server started in PORT : ${PORT}
    listening in http://localhost:${PORT}`);
});
