import hashlib
import os
import jwt
from datetime import datetime, timedelta, timezone
from typing import Optional, Any
from .config import settings

def hash_password(password: str) -> str:
    salt = os.urandom(16)
    kdf = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
    return salt.hex() + ':' + kdf.hex()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        salt_hex, kdf_hex = hashed_password.split(':')
        salt = bytes.fromhex(salt_hex)
        expected_kdf = bytes.fromhex(kdf_hex)
        actual_kdf = hashlib.pbkdf2_hmac('sha256', plain_password.encode('utf-8'), salt, 100000)
        return hashlib.sha256(actual_kdf).digest() == hashlib.sha256(expected_kdf).digest()
    except Exception:
        return False

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except jwt.PyJWTError:
        return None
