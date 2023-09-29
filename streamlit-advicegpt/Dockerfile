FROM python:3.8

WORKDIR /app

COPY requirements.txt /app/

RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/

ENV LC_ALL=C.UTF-8
ENV LANG=C.UTF-8

EXPOSE 8502

CMD ["streamlit", "run", "financial_advisior.py","--server.port","8502"]
