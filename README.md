# Nodejs + Kafka

This project was created just to kafka with nodejs

## Installation

Use docker-compose, docker-compose has a kafka server container.

```bash
sudo docker-compose up -d --build
```
## Run application
```bash
npm install
npm start
```


## Application

This application uses 3 topics. First is calculate topic, when iseven route receive a request send to topic called "calculate", after calculate consumer get the value sent and check if number is even or odd, it's send to even or odd topic. After all if even/odd write into a queue file just to record (even.queue / odd.queue).


To execute, just send a GET action.
```bash
URL: http://localhost:3000/iseven?number=17
```

All messages will be displayed on prompt.


```
## License
[MIT](https://choosealicense.com/licenses/mit/)
```
