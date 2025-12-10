#!/usr/bin/env python3

import os
import cv2
import mediapipe as mp
import numpy as np
import base64
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import time

# Set environment variables to prevent GUI issues
os.environ['DISPLAY'] = ':0'
os.environ['QT_QPA_PLATFORM'] = 'offscreen'

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Global variables for workout session
workout_state = {
    'active': False,
    'exercise': None,
    'counter': 0,
    'stage': 'down',
    'good_reps': 0,
    'feedback': [],
    'start_time': None
}

# Initialize MediaPipe
mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose

def calculate_angle(a, b, c):
    """Calculate angle between three points"""
    a = np.array(a)
    b = np.array(b) 
    c = np.array(c)
    
    radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
    angle = np.abs(radians * 180.0 / np.pi)
    
    if angle > 180.0:
        angle = 360 - angle
        
    return angle

def process_bicep_curl(landmarks):
    """Process bicep curl exercise"""
    global workout_state
    
    try:
        # Get coordinates
        shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x,
                   landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
        elbow = [landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x,
                landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y]
        wrist = [landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].x,
                landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].y]
        
        # Calculate angle
        elbow_angle = calculate_angle(shoulder, elbow, wrist)
        
        # Count reps
        if elbow_angle > 160:
            workout_state['stage'] = "down"
        if elbow_angle < 30 and workout_state['stage'] == 'down':
            workout_state['stage'] = "up"
            workout_state['counter'] += 1
            workout_state['good_reps'] += 1
        
        workout_state['feedback'] = ["Good form!"]
        
    except Exception as e:
        print(f"Error processing bicep curl: {e}")

def process_squats(landmarks):
    """Process squats exercise"""
    global workout_state
    
    try:
        # Get coordinates
        hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x,
              landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
        knee = [landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x,
               landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y]
        ankle = [landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].x,
                landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].y]
        
        # Calculate angles
        knee_angle = calculate_angle(hip, knee, ankle)
        
        # Count reps
        if knee_angle > 160:
            workout_state['stage'] = "up"
        if knee_angle < 100 and workout_state['stage'] == "up":
            workout_state['stage'] = "down"
            workout_state['counter'] += 1
            workout_state['good_reps'] += 1
        
        workout_state['feedback'] = ["Good form!"]
        
    except Exception as e:
        print(f"Error processing squats: {e}")

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'service': 'pose_estimation'})

@app.route('/start_workout', methods=['POST'])
def start_workout():
    """Start a workout session"""
    global workout_state
    
    try:
        data = request.get_json()
        exercise = data.get('exercise') if data else 'bicep_curl'
        
        # Reset workout state
        workout_state = {
            'active': True,
            'exercise': exercise,
            'counter': 0,
            'stage': 'down',
            'good_reps': 0,
            'feedback': [],
            'start_time': time.time()
        }
        
        print(f"Started workout: {exercise}")
        return jsonify({'status': 'started', 'exercise': exercise})
    except Exception as e:
        print(f"Error starting workout: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/end_workout', methods=['POST'])
def end_workout():
    """End workout session"""
    global workout_state
    
    duration = time.time() - (workout_state['start_time'] or time.time())
    
    summary = {
        'reps': workout_state['counter'],
        'good_reps': workout_state['good_reps'],
        'duration': duration,
        'exercise': workout_state['exercise']
    }
    
    workout_state['active'] = False
    print(f"Ended workout. Summary: {summary}")
    
    return jsonify({'status': 'ended', 'summary': summary})

@socketio.on('video_frame')
def handle_video_frame(data):
    """Process video frame and return pose analysis"""
    global workout_state
    
    if not workout_state['active']:
        return
    
    try:
        # Decode base64 image
        image_data = base64.b64decode(data['image'].split(',')[1])
        nparr = np.frombuffer(image_data, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Convert BGR to RGB
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        # Process with MediaPipe
        with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
            results = pose.process(rgb_frame)
            
            if results.pose_landmarks:
                landmarks = results.pose_landmarks.landmark
                
                # Process based on exercise type
                if workout_state['exercise'] == 'bicep_curl':
                    process_bicep_curl(landmarks)
                elif workout_state['exercise'] == 'squats':
                    process_squats(landmarks)
                
                # Draw pose landmarks
                annotated_frame = cv2.cvtColor(rgb_frame, cv2.COLOR_RGB2BGR)
                mp_drawing.draw_landmarks(
                    annotated_frame, 
                    results.pose_landmarks, 
                    mp_pose.POSE_CONNECTIONS
                )
                
                # Add feedback text
                y_offset = 30
                for feedback in workout_state['feedback']:
                    color = (0, 255, 0) if feedback == "Good form!" else (0, 0, 255)
                    cv2.putText(annotated_frame, feedback, (10, y_offset), 
                               cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2, cv2.LINE_AA)
                    y_offset += 30
                
                # Encode frame back to base64
                _, buffer = cv2.imencode('.jpg', annotated_frame)
                encoded_frame = base64.b64encode(buffer.tobytes()).decode('utf-8')
                
                # Send updated data back to client
                emit('pose_analysis', {
                    'processed_frame': f'data:image/jpeg;base64,{encoded_frame}',
                    'metrics': {
                        'reps': workout_state['counter'],
                        'stage': workout_state['stage'],
                        'good_reps': workout_state['good_reps'],
                        'feedback': workout_state['feedback']
                    }
                })
                
    except Exception as e:
        print(f"Error processing frame: {e}")
        emit('error', {'message': str(e)})

if __name__ == '__main__':
    print("🚀 Starting Pose Estimation Server on port 3001...")
    print("🏋️ Ready to process workouts!")
    socketio.run(app, host='0.0.0.0', port=3001, debug=False)