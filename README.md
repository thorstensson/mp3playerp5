<img width="600" height="600" alt="Image" src="https://github.com/user-attachments/assets/f5aec123-49bb-4072-9f9c-aebe12e26f6c" />

<br/>
<br/>

# MP3 Player

Another dive into the Web Audio API. This mp3 player has a (reactive) playlist and a sinus spectrum visualizer.

:penguin: T.
## Demo

👉 Netlify: https://mp3player.thomasthorstensson.com

## Tech Stack

- Vue 3
- Typescript
- Web Audio API
- S3
- P5.js

## Run Locally

Clone the project

```bash
  git clone https://github.com/thorstensson/mp3player.git
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

## Contributing

Contributions are always welcome!

## License

[MIT](https://choosealicense.com/licenses/mit/)

## More on the Web Audio API

 - [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API)
 - [Web Audio API - Book/Amazon](https://www.amazon.com/Web-Audio-API-Advanced-Interactive/dp/1449332684)


