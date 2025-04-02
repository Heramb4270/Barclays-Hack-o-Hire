const express = require("express");
const logger = require("./logger"); // Your enhanced logger
const app = express();
const PORT = process.env.PORT || 3000;


app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const responseTime = Date.now() - start;
    
    logger.logApiRequest(req, res, responseTime, {
    });
  });
  
  next();
});


app.get("/api/status", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.get("/api/error", (req, res) => {
  try {
    // Simulate  error
    throw new Error("This is a simulated error");
  } catch (err) {
    logger.error("Simulated error occurred", {
      error: err.message,
      stack: err.stack,
      endpoint: req.originalUrl,
      ip: req.ip
    });
    res.status(500).json({ error: "Simulated error" });
  }
});

// app.get("/api/admin", (req, res) => {
//   const user = { id: 123, role: "admin" }; // Normally from auth middleware
  
//   logger.info("Admin access", {
//     endpoint: req.originalUrl,
//     userId: user.id,
//     userRole: user.role,
//     authStatus: "success"
//   });
  
//   res.json({ secretData: "For admin eyes only" });
// });

// app.get("/api/users", async (req, res) => {
//   const start = Date.now();
  
//   // Simulate database query
//   await new Promise(resolve => setTimeout(resolve, 150));
//   const dbQueryTime = Date.now() - start;
  
//   const users = [{ id: 1, name: "John" }];
  
//   logger.info("Fetched users", {
//     endpoint: req.originalUrl,
//     dbQueryTime,
//     userCount: users.length
//   });
  
//   res.json(users);
// });

// Start of the server
app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`, {
    event: "server_start",
    port: PORT,
    environment: process.env.NODE_ENV || "development"
  });
  console.log(`Server running on http://localhost:${PORT}`);
});
