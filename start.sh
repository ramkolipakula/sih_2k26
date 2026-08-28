#!/bin/bash
# start.sh - Run the R&D Proposal Evaluation System natively

echo "Starting Backend API..."
cd backend
source venv/bin/activate
# Start Celery Worker in background
celery -A worker.celery_app worker --pool=solo --loglevel=info -n evaluation-worker@%h &
CELERY_PID=$!

# Start FastAPI server in background
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
UVICORN_PID=$!

echo "Starting Frontend..."
cd ../frontend
npm run dev -- --host &
FRONTEND_PID=$!

echo "=========================================="
echo "System is now running natively!"
echo "- Frontend: http://localhost:3000"
echo "- Backend API: http://localhost:8000"
echo "Press Ctrl+C to stop all services."
echo "=========================================="

# Trap Ctrl+C and kill background processes
trap "kill $CELERY_PID $UVICORN_PID $FRONTEND_PID; exit" SIGINT SIGTERM

# Wait indefinitely
wait
