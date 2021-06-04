start:
	xhost +local:root
	docker-compose up -d --build

stop:
	docker-compose down --remove-orphans

exec: start
	docker exec -it visperf-programming /bin/bash
