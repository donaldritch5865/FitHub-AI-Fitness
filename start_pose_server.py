#!/usr/bin/env python3

import os
import sys

# Set environment variables to prevent GUI issues
os.environ['DISPLAY'] = ':0'
os.environ['QT_QPA_PLATFORM'] = 'offscreen'

# Add current directory to Python path
sys.path.insert(0, '/home/runner/workspace')

# Start the pose estimation server
if __name__ == '__main__':
    try:
        import pose_estimation_server
    except Exception as e:
        print(f"Error starting pose estimation server: {e}")
        sys.exit(1)