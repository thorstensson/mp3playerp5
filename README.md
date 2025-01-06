![audio](https://github.com/user-attachments/assets/b05f10d7-a9f0-48c2-919a-73f0e8a939e4)

![Static Badge](https://img.shields.io/badge/Vue-3.5.13-green) 

![Static Badge](https://img.shields.io/badge/Typescript-5.6.3-navy)

![Static Badge](https://img.shields.io/badge/Composition%20API-orange)

# Audio Player - Vue - TS - Web Audio API

I've been researching the Web Audio API over the 'holidays', thus the birth of this little Audio Player. The player's spectrum bar reflects an array of sample rate data points.

The playlist is virtual, and will probably stay so. I currently store the tracks in my S3 Amazon bucket (please don't re-use this bucket as it is set to public). But if you clone this, and you don't want to bother with S3, then just update the PATH variable in MinimlAudioPlayer to point to @/assets/audio, then drop some mp3's in there and play on localhost.

On the roadmap: to write a freestanding (can live anywhere in the DOM tree) spectrum visualiser which generates colourful patterns on a larger HTML canvas. 🎅

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

- [ ] Consider how to best do the freestanding visualizer component which should be able to live anywhere in the DOM tree. (When I tick this one off; watch for a new repo)

## Contributing

Contributions are always welcome!

## License

[MIT](https://choosealicense.com/licenses/mit/)

## More on the Web Audio API

 - [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API)
 - [Web Audio API - Book/Amazon](https://www.amazon.com/Web-Audio-API-Advanced-Interactive/dp/1449332684)


