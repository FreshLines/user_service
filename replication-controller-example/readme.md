


NOTE:  We had to increate the memory in Minikube to 4GB to get this to work

# In this example we are spinning a 3 container pod

One with a node app
One with linkerd that talks to the node app through GRPC
One with a kubectl proxy that allows linkerd to talk to the k8s (kubernetes) namer

# There are Three Yaml files

    * One for linkerd's config (linkerd-config.yaml)
    * One for the replication controller (linker-replication-controller.yaml)
    * One for the server that exposes linkerd. (linkerd-service.yaml)

# You will need to build the node image(s) for the demo

    eval $(minikube docker-env) # Get docker in the context of minikube
    cd into the node app directory
    docker build -t user_service:v1 #note you may have to change the yaml files to the proper version

# We created a few scripts to start up the 3 containers

    ./start_linkerd_pod will run the following:

    kubectl create -f linkerd-service.yaml && kubectl create -f linkerd-config.yaml && kubectl create -f linkerd-replication-controller.yaml

    ./restart_linkerd_pod will run the following:

    kubectl delete ConfigMap "linkerd-config" && kubectl delete rc threecommaapp && kubectl delete service threecommaapp && kubectl create -f linkerd-service.yaml && kubectl create -f linkerd-config.yaml && kubectl create -f linkerd-replication-controller.yaml

# There are a few things you can use to monitor progress

    * kubectl get rc && kubectl get pods && kubectl get services
    * describe <pod or service or rc> will uncover memory errors.  Look at the events list at the bottom
    * minkube dashboard
    * http://192.168.99.101:30495/ where the ip is of minikube and the port is the port to linkerd

# After we launch the replication controller, Lets do a rolling update

kubectl rolling-update <rc name that you want to replace> --update-period=<time in seconds> -f <rc file that you want to replace it with>
kubectl rolling-update threecommaapp --update-period=86400s -f linkerd-replication-controller-v0.2.yaml

# We could do a rollback if we needed to

kubectl rolling-update threecommaapp-v02 threecommaapp-v03 --rollback




    








