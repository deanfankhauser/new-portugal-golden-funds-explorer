
# Nginx Configuration for Reverse Proxy

Add this configuration to your nginx server block for movingto.com:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name movingto.com www.movingto.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name movingto.com www.movingto.com;
    
    # SSL configuration (add your SSL certificate paths)
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    
    # Reverse proxy for /funds path
    location /funds/ {
        proxy_pass https://funds.movingto.io/;
        proxy_set_header Host funds.movingto.io;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        
        # Handle redirects properly
        proxy_redirect https://funds.movingto.io/ /funds/;
        
        # Buffer settings for better performance
        proxy_buffering on;
        proxy_buffer_size 128k;
        proxy_buffers 4 256k;
        proxy_busy_buffers_size 256k;
    }
    
    # Handle exact /funds redirect
    location = /funds {
        return 301 /funds/;
    }
    
    # Your existing site configuration for other paths
    location / {
        # Your main site configuration
        root /var/www/movingto.com;
        index index.html index.htm;
        try_files $uri $uri/ =404;
    }
}

# Redirect old subdomain to new path (301 redirects for SEO)
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name funds.movingto.io;
    
    # SSL configuration
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    
    # Redirect all traffic to new path
    return 301 https://movingto.com/funds$request_uri;
}
```

## Testing the Configuration

1. Test nginx configuration: `nginx -t`
2. Reload nginx: `systemctl reload nginx`
3. Test the reverse proxy: `curl -I https://movingto.com/funds/`
