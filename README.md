![Image](https://github.com/user-attachments/assets/6c58b769-0003-4897-8625-409a09d958ce)

![Static Badge](https://img.shields.io/badge/Vue-3.5.13-green) 

![Static Badge](https://img.shields.io/badge/Typescript-5.6.3-navy)

![Static Badge](https://img.shields.io/badge/Composition%20API-orange)

# Audio Player - Vue - TS - Web Audio API

I've been researching the Web Audio API over the 'holidays', thus the birth of this little Audio Player. The player's spectrum bar reflects an array of sample rate data points.

## Demo

👉 Netlify: https://minimlaudio.netlify.app/ 


## Run Locally

Clone the project

```bash
  git clone https://github.com/thorstensson/audio-player-vue-ts.git
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```
## Suggested S3 config (if you're ok with a public S3 bucket)

For the moment I'm'using S3 for the mp3 files. But play well and don't reuse my S3, if you somehow navigated to here :sunglasses:  

To be able to play mp3 files from S3 without running into CORS restrictions, you need to configure the S3 bucket and its CORS policy. Login to your AWS, click on your bucket, then click on permissions and scroll down. Then add

### Bucket Policy
```json
{
    "Version": "2008-10-17",
    "Statement": [
        {
            "Sid": "AllowPublicRead",
            "Effect": "Allow",
            "Principal": {
                "AWS": "*"
            },
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::{YOUR BUCKET NAME HERE}/*"
        }
    ]
}
```

### Cross-origin resource sharing (CORS)
```json
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "POST",
            "GET",
            "PUT",
            "DELETE",
            "HEAD"
        ],
        "AllowedOrigins": [
            "*"
        ],
        "ExposeHeaders": []
    }
]
```
git 
#### The path to your tracks will then be: https://{YOUR BUCKET NAME}.amazonaws.com 🔥

Alternatively, research how to use a signed URL to protect access...

## Roadmap

- [X] Fix automatic playback.

- [X] Leave volume to users device control and add instead next and previous buttons to UI.

- [X] Move all Web Audio API stuff into the SpectrumVisualizer.

## Contributing

Contributions are always welcome!

## License

[MIT](https://choosealicense.com/licenses/mit/)

## More on the Web Audio API

 - [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API)
 - [Web Audio API - Book/Amazon](https://www.amazon.com/Web-Audio-API-Advanced-Interactive/dp/1449332684)


