import cv2
import numpy as np
import os
from PIL import Image, ImageChops, ImageEnhance
from typing import Dict, Any, List, Tuple

class ImageForensicAnalyzer:
    """
    Forensic & Statistical Feature Extractor for Deepfake & Image Manipulation Detection.
    Computes Error Level Analysis (ELA), Laplacian Sharpness, Noise Residuals,
    Frequency Domain (FFT) Power Spectrum, and Edge Gradient Disparities.
    """

    @staticmethod
    def compute_ela(image_path: str, quality: int = 90) -> Tuple[float, np.ndarray]:
        """
        Error Level Analysis (ELA):
        Saves the image at a known JPEG quality, calculates pixel difference with original.
        Digital splices / GAN overlays typically exhibit distinct error levels
        compared to the surrounding original photograph.
        """
        temp_path = image_path + ".ela_tmp.jpg"
        try:
            original = Image.open(image_path).convert('RGB')
            original.save(temp_path, 'JPEG', quality=quality)
            resaved = Image.open(temp_path)
            
            # Find difference
            diff = ImageChops.difference(original, resaved)
            extrema = diff.getextrema()
            max_diff = max([ex[1] for ex in extrema]) if extrema else 1
            if max_diff == 0:
                max_diff = 1
            scale = 255.0 / max_diff
            diff_enhanced = ImageEnhance.Brightness(diff).enhance(scale)
            
            diff_enhanced_np = np.array(diff_enhanced)
            # Mean error level from normalized enhanced gradient
            mean_error = float(np.mean(diff_enhanced_np))
            
            return mean_error, diff_enhanced_np
        except Exception as e:
            return 0.0, np.zeros((100, 100, 3), dtype=np.uint8)
        finally:
            if os.path.exists(temp_path):
                try:
                    os.remove(temp_path)
                except Exception:
                    pass

    @staticmethod
    def compute_laplacian_sharpness(image_bgr: np.ndarray) -> float:
        """
        Computes the variance of the Laplacian.
        Deepfake faces frequently suffer from artificial blurring, blending softness,
        or excessive digital smoothing at transition borders.
        """
        if image_bgr is None or image_bgr.size == 0:
            return 0.0
        gray = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY)
        laplacian = cv2.Laplacian(gray, cv2.CV_64F)
        variance = float(laplacian.var())
        return variance

    @staticmethod
    def compute_noise_residual(image_bgr: np.ndarray) -> float:
        """
        Estimates sensor noise consistency using a median filter subtraction.
        Authentic camera captures contain natural sensor noise (PRNU),
        while AI generated regions often exhibit either synthetic noise or unnatural smoothness.
        """
        if image_bgr is None or image_bgr.size == 0:
            return 0.0
        gray = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY)
        denoised = cv2.medianBlur(gray, 3)
        residual = cv2.absdiff(gray, denoised)
        return float(np.std(residual))

    @staticmethod
    def compute_fft_spectral_artifacts(image_bgr: np.ndarray) -> float:
        """
        2D Fast Fourier Transform (FFT) Power Spectrum Analysis.
        Upsampling layers in Generative Adversarial Networks (GANs) and Autoencoders
        leave periodic frequency spikes or grid artifacts in the high-frequency spectrum
        (Durall et al., 2020: 'Watch your Up-Convolution').
        """
        if image_bgr is None or image_bgr.size == 0:
            return 0.0
        gray = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY)
        # Resize to fixed standard square for consistent spectral analysis
        gray_resized = cv2.resize(gray, (256, 256))
        
        f = np.fft.fft2(gray_resized)
        fshift = np.fft.fftshift(f)
        magnitude_spectrum = 20 * np.log(np.abs(fshift) + 1e-7)
        
        # Calculate ratio of high-frequency energy to total energy
        rows, cols = gray_resized.shape
        crow, ccol = rows // 2, cols // 2
        # Mask out low frequencies center
        r_inner = 30
        y, x = np.ogrid[:rows, :cols]
        mask = ((x - ccol)**2 + (y - crow)**2) > (r_inner**2)
        
        high_freq_energy = np.sum(magnitude_spectrum[mask])
        total_energy = np.sum(magnitude_spectrum) + 1e-7
        ratio = float(high_freq_energy / total_energy)
        return ratio

    @staticmethod
    def compute_boundary_edge_disparity(image_bgr: np.ndarray, face_box: Tuple[int, int, int, int]) -> float:
        """
        Measures gradient disparity between the face perimeter and the immediate background.
        Poisson blending and affine warp artifacts cause unnatural edge discontinuities.
        """
        x, y, w, h = face_box
        img_h, img_w = image_bgr.shape[:2]
        
        # Face ROI
        face_roi = image_bgr[y:y+h, x:x+w]
        if face_roi.size == 0:
            return 0.0
            
        gray_face = cv2.cvtColor(face_roi, cv2.COLOR_BGR2GRAY)
        face_edges = cv2.Canny(gray_face, 100, 200)
        face_edge_density = float(np.mean(face_edges > 0))
        
        # Context region surrounding face
        pad_x = int(w * 0.25)
        pad_y = int(h * 0.25)
        cx1 = max(0, x - pad_x)
        cy1 = max(0, y - pad_y)
        cx2 = min(img_w, x + w + pad_x)
        cy2 = min(img_h, y + h + pad_y)
        
        context_roi = image_bgr[cy1:cy2, cx1:cx2]
        if context_roi.size == 0:
            return 0.0
            
        gray_context = cv2.cvtColor(context_roi, cv2.COLOR_BGR2GRAY)
        context_edges = cv2.Canny(gray_context, 100, 200)
        context_edge_density = float(np.mean(context_edges > 0))
        
        disparity = abs(face_edge_density - context_edge_density)
        return float(disparity)

    @classmethod
    def analyze_image_features(
        cls,
        image_path: str,
        image_bgr: np.ndarray,
        face_boxes: List[Tuple[int, int, int, int]]
    ) -> Dict[str, Any]:
        """
        Extract complete forensic feature suite from image and face regions.
        """
        h, w = image_bgr.shape[:2]
        
        # 1. Error Level Analysis
        ela_mean, ela_diff_img = cls.compute_ela(image_path)
        
        # 2. Overall Sharpness & Noise Residuals
        global_sharpness = cls.compute_laplacian_sharpness(image_bgr)
        global_noise_std = cls.compute_noise_residual(image_bgr)
        global_fft_ratio = cls.compute_fft_spectral_artifacts(image_bgr)
        
        # 3. Face Region Specific Analysis
        face_features = []
        suspicious_regions = []
        
        for i, box in enumerate(face_boxes):
            fx, fy, fw, fh = box
            face_roi = image_bgr[fy:fy+fh, fx:fx+fw]
            if face_roi.size == 0:
                continue
                
            face_sharpness = cls.compute_laplacian_sharpness(face_roi)
            face_noise_std = cls.compute_noise_residual(face_roi)
            face_fft_ratio = cls.compute_fft_spectral_artifacts(face_roi)
            edge_disparity = cls.compute_boundary_edge_disparity(image_bgr, box)
            
            # Sharpness ratio face vs global
            sharpness_ratio = (face_sharpness / (global_sharpness + 1e-5))
            noise_ratio = (face_noise_std / (global_noise_std + 1e-5))
            
            # Check if this face exhibits suspicious disparity
            is_suspicious = False
            reasons = []
            if sharpness_ratio < 0.35:
                reasons.append("Unnatural facial smoothing")
                is_suspicious = True
            elif sharpness_ratio > 3.0:
                reasons.append("Sharpening boundary artifact")
                is_suspicious = True
                
            if noise_ratio < 0.45 or noise_ratio > 2.2:
                reasons.append("Noise variance disparity")
                is_suspicious = True
                
            if edge_disparity > 0.12:
                reasons.append("Boundary blend discontinuity")
                is_suspicious = True
                
            if is_suspicious:
                suspicious_regions.append({
                    "box": box,
                    "type": ", ".join(reasons) if reasons else "TEXTURE_ANOMALY",
                    "severity": "medium" if len(reasons) == 1 else "high"
                })
                
            face_features.append({
                "face_index": i,
                "box": box,
                "face_sharpness": face_sharpness,
                "face_noise_std": face_noise_std,
                "face_fft_ratio": face_fft_ratio,
                "sharpness_ratio": sharpness_ratio,
                "noise_ratio": noise_ratio,
                "edge_disparity": edge_disparity,
                "is_suspicious": is_suspicious
            })
            
        return {
            "dimensions": {"width": w, "height": h},
            "ela_mean": ela_mean,
            "global_sharpness": global_sharpness,
            "global_noise_std": global_noise_std,
            "global_fft_ratio": global_fft_ratio,
            "face_features": face_features,
            "suspicious_regions": suspicious_regions
        }
