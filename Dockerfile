FROM node:16.17.0-alpine AS reactBuild
WORKDIR /server/reactui

ENV PATH /app/reactui/node_modules/.bin:$PATH

COPY reactui/package.json ./
COPY reactui/package-lock.json ./
COPY reactui/src ./src
COPY reactui/public ./public
RUN npm install 
RUN npm run build

FROM python:3.10.7

WORKDIR /server

COPY requirements.txt ConfigFunctions.py DataFunctions.py GitFunctions.py wsgi.py server.py Voltage.py ./
COPY static ./static
COPY templates ./templates
COPY gitTestRepo ./gitTestRepo
RUN mkdir -p /root/.ssh && ln -s /run/secrets/id_rsa /root/.ssh/id_rsa
# RUN chmod 600 /root/.ssh/id_rsa
RUN echo "Host github.com\n\tStrictHostKeyChecking no\n" >> /root/.ssh/config

COPY --from=reactBuild ./server/reactui/build ./reactui/build

RUN pip install -r ./requirements.txt

EXPOSE 5000
CMD ["python", "server.py"]
# CMD ["gunicorn", "-b", "0.0.0:5000", "server:app"]