FROM debian:bullseye-slim

# Prevent interactive prompts
ENV DEBIAN_FRONTEND=noninteractive

# Install LaTeX with FontAwesome5 and required extras
RUN apt-get update && apt-get install -y --no-install-recommends \
    texlive-latex-base \
    texlive-latex-recommended \
    texlive-fonts-recommended \
    texlive-latex-extra \
    texlive-fonts-extra \
    texlive-lang-english \
    nodejs \
    npm \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy backend files
COPY . .

# Install Node.js dependencies
RUN npm install

# Expose the backend port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
