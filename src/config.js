let config = '';

if (
  process.env.NODE_ENV === 'production' ||
  process.env.NODE_ENV === 'development'
) {
  config = {
    // SERVER_URL: window.location.protocol + "//" + window.location.hostname + ":8989"
    // SERVER_URL: "http://165.232.187.214:2323"
    //SERVER_URL: 'http://54.176.250.244:8989',
    NEW_SERVER_URL: 'http://54.215.21.69:8989'
    // NEW_SERVER_URL: 'http://54.176.250.244:8989'
    // NEW_SERVER_URL: 'http://localhost:8989'
  };
}

export default config;
