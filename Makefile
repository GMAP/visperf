start:
	xhost +local:root
	docker-compose up -d --build
	docker exec -it visperf-programming /bin/bash

stop:
	docker-compose down --remove-orphans
