# Server Deployment Guide

## On Your Server:

### 1. Clone your repo
```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

### 2. Update environment variables
```bash
# Edit .env file with your actual MongoDB URI
nano .env
```

### 3. Deploy
```bash
docker-compose up -d --build
```

That's it! Your app runs at `http://your-server-ip:8080`

## For Updates:

```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose up -d --build
```

## Useful Commands:

```bash
# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop
docker-compose down

# Restart
docker-compose restart
```