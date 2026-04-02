#!/bin/bash

# Kill background processes on exit
trap "kill 0" EXIT

echo "🚀 KTDS AX Decision Fabric Demo를 시작합니다..."

# 1. Backend Start (FastAPI)
echo "📦 백엔드 실행 중... (http://localhost:8000)"
PYTHONPATH=. uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &

# 2. Give backend a moment to start
sleep 2

# 3. Frontend Start (Vite)
echo "🎨 프론트엔드 실행 중... (http://localhost:5173)"
cd frontend && npm run dev &

# Wait for all processes
wait
