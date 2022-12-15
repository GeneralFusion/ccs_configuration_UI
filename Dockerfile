# First make the front-end app. The AS keyword below will create the front-end as a build step. 
# Meaning all of its dependecies (node_modules, cache, ...) will be deleted after the React Build is completed.
# This makes the container more lightweight. 
FROM node:16.17.0-alpine AS reactBuild
WORKDIR /server/reactui
# This is needed for React to build
ENV PATH /app/reactui/node_modules/.bin:$PATH

COPY reactui/package.json ./
COPY reactui/package-lock.json ./
COPY reactui/src ./src
COPY reactui/public ./public
RUN npm install 
RUN npm run build

FROM python:3.10.7

WORKDIR /server

COPY requirements.txt ConfigFunctions.py GitFunctions.py server.py ./
COPY static ./static
COPY templates ./templates
COPY configRepo ./configRepo
#This creates the .ssh folder and links the ssh key given as a secret to the .ssh folder
RUN mkdir -p /root/.ssh && ln -s /run/secrets/id_rsa /root/.ssh/id_rsa
# This line could be needed if the key does not work. 
# RUN chmod 600 /root/.ssh/id_rsa
RUN echo "Host github.com\n\tStrictHostKeyChecking no\n" >> /root/.ssh/config

COPY --from=reactBuild ./server/reactui/build ./reactui/build

RUN pip install -r ./requirements.txt


#CMD ["python", "server.py"]
CMD ["gunicorn", "-b", "0.0.0.0:8075", "--threads", "2","server:app"]