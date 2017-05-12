v1 & v2 uses spdy (http2)
v3 uses grpc



#  See what is running

printf "\n\ndeployments\n\n" && kubectl get deployments --namespace=threecommaapp && printf "\n\nreplica sets\n\n" && kubectl get rs  --namespace=threecommaapp && printf "\n\npods\n\n" && kubectl get pods --namespace=threecommaapp && printf "\n\nservices\n\n" && kubectl get services --namespace=threecommaapp && printf "\n\nconfigmaps\n\n" && kubectl get configmaps --namespace=threecommaapp

# Create a service, a linkerd configmap, and a deployment

kubectl create -f linkerd-service.yaml
kubectl create -f linkerd-config.yaml
kubectl create -f deployment-user-service.yaml

Or

Just run ./start_linkerd_prod


# Check to see if there is a current rollout

kubectl rollout status deployment/threecommaapp --namespace=threecommaapp

# Scale up and down a deployments replicas

kubectl scale deployment threecommaapp-v3 --replicas 1