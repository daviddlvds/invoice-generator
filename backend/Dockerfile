FROM node:20-bullseye

# wkhtmltopdf dependencies
RUN apt-get update && apt-get install -y \
  wkhtmltopdf \
  fontconfig \
  libfreetype6 \
  libjpeg62-turbo \
  libpng16-16 \
  libx11-6 \
  libxcb1 \
  libxext6 \
  libxrender1 \
  xfonts-75dpi \
  xfonts-base \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3001
CMD ["npm", "run", "start"]
