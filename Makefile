start:
	xhost +"local:docker@"
	docker-compose up -d --build

stop:
	docker-compose down --remove-orphans

exec: start
	docker exec -it viscpu-dev /bin/bash
