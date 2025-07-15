#!/bin/bash
cd /home/kavia/workspace/code-generation/intellichat-assistant-6a3989bb/chatbot_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

