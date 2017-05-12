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

# Rolling update by chaging the existing config

    # Change the image
    kubectl set image deployment nginx nginx=nginx:1.11.5 --record

    # edit the config file
    kubectl edit deployment <deployment> --record

    # Apply the next version, This will add the new nodes without removing the existing.  Make sure you update the version in the config.
    # This is also the way to do a canary rollout, then you can leave it up, scale it up and scale the others down.
    kubectl apply -f nginx.yaml --record

# Undo rolling update

    kubectl rollout undo deployment <deployment>


