# لوحة تحكم رواج — صورة التشغيل على الاستضافة (Render / Railway / Fly.io / أي VPS)
FROM python:3.12-slim

# Chromium لتوليد عقود الاشتراك PDF + خطوط عربية احتياطية
RUN apt-get update \
 && apt-get install -y --no-install-recommends chromium fonts-noto-core ca-certificates \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

ENV RAWAJ_HOSTED=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8788
EXPOSE 8788
CMD ["python", "panel_server.py"]
