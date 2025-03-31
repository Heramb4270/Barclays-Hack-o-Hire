# Build stage
FROM golang:1.23.2-alpine AS builder

WORKDIR /app

# Copy Go modules and install dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy the source code
COPY main.go .

# Build the application
RUN go build -o server main.go

# Run stage (final image)
FROM alpine:latest

WORKDIR /app

# Copy the built binary from the builder stage
COPY --from=builder /app/server .

# Create the logs directory
RUN mkdir -p logs

# Expose the port
EXPOSE 8000

# Run the server
CMD ["./server"]
