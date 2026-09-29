#!/usr/bin/env bash
echo "Starting VisionTrace AI..."
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Start backend in background
cd "$SCRIPT_DIR/backend"
python3 main.py &
BACKEND_PID=$!

# Start frontend
cd "$SCRIPT_DIR/frontend"
npm run dev &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
echo "VisionTrace AI is running at http://localhost:5173"
wait
