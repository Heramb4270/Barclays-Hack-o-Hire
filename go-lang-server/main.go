package main

import (
	"encoding/json"
	"net/http"
	"os"
	"time"
	"runtime"
	"strconv"
	"github.com/sirupsen/logrus"
)

var logger *logrus.Logger

func initLogger() {
	logger = logrus.New()
	
	// Configure log file
	file, err := os.OpenFile("/app/logs/golang/golang-app.log", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		logger.Fatal(err)
	}
	logger.SetOutput(file)
	logger.SetFormatter(&logrus.JSONFormatter{})
}

// Middleware to log all requests
func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		lrw := newLoggingResponseWriter(w)
		
		defer func() {
			// Get memory stats
			var m runtime.MemStats
			runtime.ReadMemStats(&m)
			
			// Calculate response time
			responseTime := time.Since(start).Milliseconds()
			
			// Get response size
			responseSize, _ := strconv.Atoi(lrw.Header().Get("Content-Length"))
			
			logger.WithFields(logrus.Fields{
				// HTTP Request Metrics
				"ip":             r.RemoteAddr,
				"method":         r.Method,
				"endpoint":       r.URL.Path,
				"status":         lrw.statusCode,
				"response_time_ms": responseTime,
				"request_size_bytes": r.ContentLength,
				"response_size_bytes": responseSize,
				"user_agent":     r.UserAgent(),
				"server":        "golang-server",
				"service":       "golang-api",
				"timestamp":     time.Now().Format(time.RFC3339),
			}).Info("API request")
		}()

		next.ServeHTTP(lrw, r)
	})
}

// Helper to capture status code
type loggingResponseWriter struct {
	http.ResponseWriter
	statusCode int
}

func newLoggingResponseWriter(w http.ResponseWriter) *loggingResponseWriter {
	return &loggingResponseWriter{w, http.StatusOK}
}

func (lrw *loggingResponseWriter) WriteHeader(code int) {
	lrw.statusCode = code
	lrw.ResponseWriter.WriteHeader(code)
}

func statusHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"status":    "OK",
		"timestamp": time.Now().Format(time.RFC3339),
	})
}

func errorHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusInternalServerError)
	
	logger.WithFields(logrus.Fields{
		"ip":       r.RemoteAddr,
		"method":   r.Method,
		"endpoint": r.URL.Path,
		"error":    "Simulated error",
	}).Error("API error occurred")
	
	json.NewEncoder(w).Encode(map[string]string{
		"status":    "Error",
		"timestamp": time.Now().Format(time.RFC3339),
		"message":   "Something went wrong!",
	})
}

func main() {
	initLogger()
	
	mux := http.NewServeMux()
	mux.Handle("/api/success", loggingMiddleware(http.HandlerFunc(statusHandler)))
	mux.Handle("/api/error", loggingMiddleware(http.HandlerFunc(errorHandler)))

	server := &http.Server{
		Addr:    "0.0.0.0:8000",
		Handler: mux,
	}

	logger.Info("Server started", map[string]interface{}{
		"port":        "8000",
		"environment": os.Getenv("ENV"),
		"event":       "server_start",
	})
	
	logger.Fatal(server.ListenAndServe())
}