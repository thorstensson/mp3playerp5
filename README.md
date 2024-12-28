![miniml](https://github.com/user-attachments/assets/6e5641d9-dfc4-4063-b765-7ebcfd2a60bf)

![Static Badge](https://img.shields.io/badge/Vue-3.5.13-green) 

![Static Badge](https://img.shields.io/badge/Typescript-5.6.3-navy)

![Static Badge](https://img.shields.io/badge/Composition%20API-orange)

# Audio Player - Vue - TS - Web Audio API

I've been researching the Web Audio API over the 'holidays', thus the birth of this little Audio Player. The player's spectrum bar reflects an array of sample rate data points; it fetches these points from the Audio API's frequency property and draws them onto the canvas. 

The playlist is virtual, and plays tracks stored in my S3 Amazon bucket (please don't re-use this bucket as it is set to public). See below for a suggested S3 configuration if you like to add your own tracks to S3.

Part of the roadmap (see below) is to create a freestanding component companion to the Audio Player to generate colourful patterns on a larger HTML canvas. 🎅🎅🎅

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
  npm run start
```
## Suggested S3 config (if you're ok with a public S3 bucket)

To be able to play mp3 files from S3 without running into cors restrictions, you need to configure the S3 bucket and its CORS policy. Login to your AWS, click on your bucket, then click on permissions and scroll down. Then add the below where it says

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

#### The path to your tracks will then be: https://{YOUR BUCKET NAME}.amazonaws.com

🔥🔥🔥

## Roadmap

- [X] Fix automatic playback of playlist

- [ ] Write a composable to check if user is on IOS, if so, show mute unmute icons instead of volume range slider, since iOS does not allow direct volume control of HTMLAudioElement (only device control).

- [ ] Move all Web Audio API stuff into the SpectrumVisualizer.

- [ ] Write a composable that handles the creation the Web Audio API.

- [ ] Consider how to best do the freestanding visualizer component which should be able to live anywhere in the DOM tree.

- [ ] Consider creating an even more minimal player with only stop, play and SpectrumVisualizer for footers.

## Contributing

Contributions are always welcome!

## License

[MIT](https://choosealicense.com/licenses/mit/)

## More on the Web Audio API

 - [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API)
 - [Web Audio API - Book/Amazon](https://www.amazon.com/Web-Audio-API-Advanced-Interactive/dp/1449332684)


