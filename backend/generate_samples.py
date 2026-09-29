import os
import cv2
import numpy as np
from PIL import Image
import io

SAMPLES_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "samples")
os.makedirs(SAMPLES_DIR, exist_ok=True)

def draw_realistic_face(img, center_x, center_y, scale=1.4):
    """
    Draw a structured face that reliably triggers Haar Cascade detection.
    """
    # Head contour (Oval)
    axes = (int(75 * scale), int(105 * scale))
    face_color = (195, 215, 240) # Skin tone BGR
    cv2.ellipse(img, (center_x, center_y), axes, 0, 0, 360, face_color, -1)
    
    # Hair
    hair_color = (40, 45, 55)
    cv2.ellipse(img, (center_x, center_y - int(35 * scale)), (int(80 * scale), int(75 * scale)), 0, 180, 360, hair_color, -1)

    # Eyes
    eye_y = center_y - int(15 * scale)
    eye_dx = int(32 * scale)
    eye_radius = int(12 * scale)
    # Sclera
    cv2.circle(img, (center_x - eye_dx, eye_y), eye_radius, (245, 245, 245), -1)
    cv2.circle(img, (center_x + eye_dx, eye_y), eye_radius, (245, 245, 245), -1)
    # Iris
    iris_radius = int(6 * scale)
    cv2.circle(img, (center_x - eye_dx, eye_y), iris_radius, (90, 60, 40), -1)
    cv2.circle(img, (center_x + eye_dx, eye_y), iris_radius, (90, 60, 40), -1)
    # Pupil
    cv2.circle(img, (center_x - eye_dx, eye_y), int(3 * scale), (20, 20, 20), -1)
    cv2.circle(img, (center_x + eye_dx, eye_y), int(3 * scale), (20, 20, 20), -1)
    # Eyebrows
    brow_y = eye_y - int(14 * scale)
    cv2.line(img, (center_x - eye_dx - 18, brow_y), (center_x - eye_dx + 18, brow_y), (40, 40, 40), 3)
    cv2.line(img, (center_x + eye_dx - 18, brow_y), (center_x + eye_dx + 18, brow_y), (40, 40, 40), 3)

    # Nose
    nose_y = center_y + int(15 * scale)
    cv2.line(img, (center_x, eye_y + 10), (center_x - 6, nose_y), (160, 180, 210), 2)
    cv2.line(img, (center_x - 6, nose_y), (center_x + 6, nose_y), (160, 180, 210), 2)

    # Mouth
    mouth_y = center_y + int(48 * scale)
    mouth_axes = (int(28 * scale), int(12 * scale))
    cv2.ellipse(img, (center_x, mouth_y), mouth_axes, 0, 0, 180, (110, 110, 180), -1)
    cv2.line(img, (center_x - int(28 * scale), mouth_y), (center_x + int(28 * scale), mouth_y), (80, 80, 150), 2)

def generate_sample_authentic_image():
    path = os.path.join(SAMPLES_DIR, "sample_authentic_portrait.jpg")
    img = np.zeros((480, 480, 3), dtype=np.uint8)
    for y in range(480):
        img[y, :] = (int(50 + y * 0.15), int(45 + y * 0.1), int(40 + y * 0.08))
        
    draw_realistic_face(img, 240, 240, scale=1.4)
    
    # Add natural photographic sensor noise
    noise = np.random.normal(0, 5.0, img.shape).astype(np.int16)
    img_noisy = np.clip(img.astype(np.int16) + noise, 0, 255).astype(np.uint8)
    
    cv2.imwrite(path, img_noisy, [cv2.IMWRITE_JPEG_QUALITY, 95])
    return path

def generate_sample_manipulated_image():
    path = os.path.join(SAMPLES_DIR, "sample_manipulated_face.jpg")
    img = np.zeros((480, 480, 3), dtype=np.uint8)
    for y in range(480):
        img[y, :] = (int(60 + y * 0.1), int(55 + y * 0.1), int(65 + y * 0.08))
        
    draw_realistic_face(img, 240, 240, scale=1.4)

    # Add realistic photographic noise first
    noise = np.random.normal(0, 5.0, img.shape).astype(np.int16)
    img = np.clip(img.astype(np.int16) + noise, 0, 255).astype(np.uint8)

    # Now inject forensic deepfake indicators:
    # 1. Heavily smooth the cheek and jaw skin region (plastic face artifact)
    # Cheek area (leaving eyes and nose intact so Haar detects the face!)
    cx, cy = 240, 240
    cheek_y1 = cy + 20
    cheek_y2 = cy + 120
    cheek_x1 = cx - 80
    cheek_x2 = cx + 80
    
    # Save a low-quality compressed version of this patch (to cause severe localized ELA anomaly)
    patch = img[cheek_y1:cheek_y2, cheek_x1:cheek_x2].copy()
    patch_blurred = cv2.GaussianBlur(patch, (21, 21), 8)
    
    # Encode patch with low quality JPEG in memory to simulate spliced recompression
    _, patch_encoded = cv2.imencode('.jpg', patch_blurred, [cv2.IMWRITE_JPEG_QUALITY, 35])
    patch_decoded = cv2.imdecode(patch_encoded, cv2.IMREAD_COLOR)
    
    # Insert GAN periodic high frequency pattern
    y_idx, x_idx = np.indices(patch_decoded.shape[:2])
    grid = ((x_idx % 2 == 0) ^ (y_idx % 2 == 0)).astype(np.uint8) * 45
    for c in range(3):
        patch_decoded[:, :, c] = cv2.add(patch_decoded[:, :, c], grid)

    img[cheek_y1:cheek_y2, cheek_x1:cheek_x2] = patch_decoded
    
    # Add sharp seam boundary line
    cv2.rectangle(img, (cheek_x1, cheek_y1), (cheek_x2, cheek_y2), (210, 180, 160), 2)

    cv2.imwrite(path, img, [cv2.IMWRITE_JPEG_QUALITY, 85])
    return path

def generate_sample_video():
    path = os.path.join(SAMPLES_DIR, "sample_forensic_video.mp4")
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    fps = 15.0
    w, h = 400, 400
    out = cv2.VideoWriter(path, fourcc, fps, (w, h))

    total_frames = 45 # 3 seconds
    for frame_idx in range(total_frames):
        img = np.zeros((h, w, 3), dtype=np.uint8)
        img[:] = (30, 35, 45) # Dark studio backdrop
        
        # Head motion
        cx = int(200 + 15 * np.sin(frame_idx * 0.2))
        cy = int(200 + 8 * np.cos(frame_idx * 0.15))
        
        # Inject jitter and manipulation in the second half of the clip
        is_manip = frame_idx > 22
        if is_manip and frame_idx % 4 == 0:
            cx += 20 # Sudden temporal jitter
            
        draw_realistic_face(img, cx, cy, scale=1.1)
        
        if is_manip:
            # Add facial patch distortion
            cv2.rectangle(img, (cx - 40, cy + 10), (cx + 40, cy + 50), (140, 140, 200), 2)
            
        # Sensor noise
        noise = np.random.normal(0, 4.0, img.shape).astype(np.int16)
        frame_noisy = np.clip(img.astype(np.int16) + noise, 0, 255).astype(np.uint8)
        out.write(frame_noisy)

    out.release()
    return path

if __name__ == "__main__":
    generate_sample_authentic_image()
    generate_sample_manipulated_image()
    generate_sample_video()
    print("Regenerated samples with calibrated forensic artifacts.")
