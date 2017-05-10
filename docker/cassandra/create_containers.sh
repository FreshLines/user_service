docker run --name mycassandra -d -p 127.0.0.1:9042:9042 -v /Library/WebServer/Documents/threecommaapp/docker/cassandra/mycassandra_data:/var/lib/cassandra/data cassandra:3.0.9
docker run --name mycassandra2 -d -p 127.0.0.1:9043:9042 -v /Library/WebServer/Documents/threecommaapp/docker/cassandra/mycassandra2_data:/var/lib/cassandra/data -e CASSANDRA_SEEDS="$(docker inspect --format='{{ .NetworkSettings.IPAddress }}' mycassandra)" cassandra:3.0.9


