mv Dockerfile.prod Dockerfile
gcloud run deploy algorithms --source . --region=europe-west4 --allow-unauthenticated
mv Dockerfile Dockerfile.prod


#service name algorithms
#region 18 europe-west4
#allow unauthenticated invocation y
#gcloud builds submit --tag europe-west4-docker.pkg.dev/algorithms-image /media/szabi/53afd924-78aa-4960-a8d5-9902d4235432/secret/programming/web/developing/algorithms