import os
import uuid
import re
from typing import Tuple
from fastapi import UploadFile, HTTPException

ALLOWED_IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp"}
ALLOWED_VIDEO_EXTS = {".mp4", ".mov", ".avi"}
ALLOWED_EXTS = ALLOWED_IMAGE_EXTS | ALLOWED_VIDEO_EXTS
MAX_FILE_SIZE_BYTES = 60 * 1024 * 1024  # 60MB

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")
PROCESSED_DIR = os.path.join(UPLOAD_DIR, "processed")

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(PROCESSED_DIR, exist_ok=True)

class FileService:
    @staticmethod
    def validate_file(file: UploadFile) -> Tuple[str, str]:
        """
        Validate file extension, infer type ('image' or 'video'), and check filename.
        """
        if not file.filename:
            raise HTTPException(status_code=400, detail="Uploaded file has no filename.")

        ext = os.path.splitext(file.filename)[1].lower()
        if ext not in ALLOWED_EXTS:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file format '{ext}'. Allowed formats: JPG, JPEG, PNG, WEBP, MP4, MOV, AVI."
            )

        file_type = "video" if ext in ALLOWED_VIDEO_EXTS else "image"
        return ext, file_type

    @staticmethod
    async def save_uploaded_file(file: UploadFile) -> Tuple[str, str, int, str]:
        """
        Stream and save uploaded file securely, enforcing max size.
        Returns: (saved_abs_path, original_filename, file_size_bytes, file_type)
        """
        ext, file_type = FileService.validate_file(file)

        # Sanitize original name
        clean_name = re.sub(r"[^a-zA-Z0-9_.-]", "_", file.filename)
        unique_prefix = uuid.uuid4().hex[:10]
        saved_filename = f"{unique_prefix}_{clean_name}"
        saved_path = os.path.join(UPLOAD_DIR, saved_filename)

        size = 0
        with open(saved_path, "wb") as buffer:
            while chunk := await file.read(1024 * 1024):  # 1MB chunks
                size += len(chunk)
                if size > MAX_FILE_SIZE_BYTES:
                    buffer.close()
                    if os.path.exists(saved_path):
                        os.remove(saved_path)
                    raise HTTPException(
                        status_code=400,
                        detail=f"File exceeds maximum upload limit of {MAX_FILE_SIZE_BYTES // (1024 * 1024)}MB."
                    )
                buffer.write(chunk)

        if size == 0:
            if os.path.exists(saved_path):
                os.remove(saved_path)
            raise HTTPException(status_code=400, detail="Uploaded file is empty (0 bytes).")

        return saved_path, file.filename, size, file_type
