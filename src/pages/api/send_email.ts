import { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
import { Resend } from 'resend';

const sendEmail = async (email: string, message: string) => {
  const nonce = crypto.randomUUID();
  const resend = new Resend(process.env.RESEND_SECRET_KEY);
  try {
    await resend.emails.send({
      from: 'BrayanIBP <hello@brayanibp.dev>',
      to: ['brayanibp@brayanibp.dev'],
      subject: 'Hello Brayan!',
      reply_to: [email],
      text: message,
      // attachments: [
      //   {
      //     filename: 'invoice.pdf',
      //     content: invoiceBuffer,
      //   },
      // ],
      headers: {
        'X-Entity-Ref-ID': nonce,
      },
      // tags: [
      //   {
      //     name: 'category',
      //     value: 'confirm_email',
      //   },
      // ],
    });
  } catch (err) {
    console.log(err);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { body, method } = req;

  // Extract the email and captcha code from the request body

  const { email, captcha } = body as {
    email: {
      email: string,
      message: string
    },
    captcha: string
  };

  if (method === "POST") {
    // If email or captcha are missing return an error
    if (!email || !captcha) {
      return res.status(422).json({
        message: "Unproccesable request, please provide the required fields",
      });
    }

    try {
      // Ping the google recaptcha verify API to verify the captcha code you received
      const response = await fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captcha}`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
          },
          method: "POST",
        }
      );
      const captchaValidation = await response.json() as { success: boolean, challenge_ts: string, hostname: string, "error-codes": [] };

      /**
       * The structure of response from the veirfy API is
       * {
       *  "success": true|false,
       *  "challenge_ts": timestamp,  // timestamp of the challenge load (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
       *  "hostname": string,         // the hostname of the site where the reCAPTCHA was solved
       *  "error-codes": [...]        // optional
        }
       */
      if (captchaValidation.success) {
        // Replace this with the API that will save the data received
        // to your backend
        // await sleep();
        // Return 200 if everything is successful
        await sendEmail(email.email, email.message);
        return res.status(200).send("OK");
      }

      return res.status(422).json({
        message: "Unproccesable request, Invalid captcha code",
      });
    } catch (error) {
      console.log(error);
      return res.status(422).json({ message: "Something went wrong" });
    }
  }
  // Return 404 if someone pings the API with a method other than
  // POST
  return res.status(404).send("Not found");
}