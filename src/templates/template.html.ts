export const template = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body {
        margin: 1rem;
      }
      .parent {
        border: 1px solid black;
        text-align: center;
        padding: 1rem;
      }
      .title {
        font-size: 3rem;
        margin-bottom: 2rem;
      }
      .otp {
        font-size: 2rem;
        letter-spacing: 1rem;
        margin-bottom: 2rem;
      }
      .message {
        font-size: 1.25rem;
      }
    </style>
  </head>
  <body>
    <div class="parent">
      <div class="title">Verification Code</div>
      <div class="otp">{{OTP}}</div>
      <div class="message">OTP is valid for {{TIME}} minutes</div>
    </div>
  </body>
</html>
`;
