FROM debian:bullseye

# Install Node.js and LaTeX
RUN apt-get update && \
    apt-get install -y texlive-latex-base texlive-latex-recommended texlive-fonts-recommended texlive-latex-extra nodejs npm && \
    apt-get clean

# Create app directory
WORKDIR /app

# Copy files
COPY . .

# Install Node dependencies
RUN npm install

# Expose backend port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]

