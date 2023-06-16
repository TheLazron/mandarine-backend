docker-redis:
	docker run --name mandarine-redis -p 6379:6379 -d redis

start-redis:
	docker start mandarine-redis



