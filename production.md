Remove this setting from android and ios

# usesCleartextTraffic

from app.json for security


 "infoPlist": {
      "NSAppTransportSecurity": { 
        "NSAllowsArbitraryLoads": true 
      }
    }




# AWS-
Starting ec2 on N virginia Us


rsync -avz \
  -e "ssh -i 'D:/Masher mobile chat app/Masherkey.pem'" \
  --include="backend/***" \
  --include="chat/***" \
  --include="App.js" \
  --include="package.json" \
  --exclude="*" \
  ./MasherFrontend/ \
  ubuntu@ec2-54-87-4-36.compute-1.amazonaws.com:/home/ubuntu/MasherFrontend/


  rsync -avz -e "ssh -i 'D:/Masher mobile chat app/Masherkey.pem'" ./Masher mobile chat app/backend/ --exclude 'node_modules' ubuntu@ec2-54-87-4-36.compute-1.amazonaws.com:/home/ubuntu/MasherBackend/backend


  rsync -avz -e "ssh -i 'D:/Masher mobile chat app/Masherkey.pem'" "./Masher mobile chat app/backend/"  --exclude 'node_modules' ubuntu@ec2-54-87-4-36.compute-1.amazonaws.com:/home/ubuntu/MasherBackend/backend



<!-- Cleanups and memory releases- -->

Cleanups of useEffects and other memory releases

setting firebase token and keys for expo push notifications