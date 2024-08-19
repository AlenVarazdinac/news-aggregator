# Setup and Installation
1. Make sure you have npm installed on your system
2. Clone this repository
```
git clone git@github.com:AlenVarazdinac/news-aggregator.git
cd news-aggregator

```
3. Install the dependencies
```
npm install
```
4. Get the API keys from NewsAPI, The Guardian and NewYork Times.
NewsApi: https://newsapi.org/
The Guardian: https://open-platform.theguardian.com/access/
NewYork Times: https://developer.nytimes.com/

5. Create .env file and add the API keys
```
VITE_NY_TIMES_API_KEY=
VITE_NEWSAPI_KEY=
VITE_GUARDIAN_API_KEY=
```

# Running the app
To run the application run the following command:
```
npm run dev
```

# Docker
To build a Docker image run the following command:
```
docker build -t news-aggregator .
```

To run built Docker image run the following command:
```
docker run -p 3000:3000 news-aggregator
```
